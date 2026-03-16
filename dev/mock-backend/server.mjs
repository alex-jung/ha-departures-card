/**
 * Mock backend for Transitous API
 * Simulates /api/v5/trip and /api/v5/stoptimes endpoints
 *
 * Usage: node dev/mock-backend/server.mjs
 */

import http from "http";
import { URL } from "url";

const PORT = 8765;

// ---------------------------------------------------------------------------
// Mock data helpers
// ---------------------------------------------------------------------------

/**
 * Simple polyline encoder (Google Encoded Polyline Algorithm, precision 6)
 */
function encodePolyline(coords) {
  let output = "";
  let prevLat = 0;
  let prevLng = 0;

  for (const [lat, lng] of coords) {
    const dLat = Math.round((lat - prevLat) * 1e6);
    const dLng = Math.round((lng - prevLng) * 1e6);
    prevLat = lat;
    prevLng = lng;

    for (const val of [dLat, dLng]) {
      let v = val < 0 ? ~(val << 1) : val << 1;
      while (v >= 0x20) {
        output += String.fromCharCode((0x20 | (v & 0x1f)) + 63);
        v >>= 5;
      }
      output += String.fromCharCode(v + 63);
    }
  }
  return output;
}

// Tram 6 route: Aufseßplatz → Doku-Zentrum (rough Nuremberg coordinates)
const TRAM6_COORDS = [
  [49.44078, 11.08171],
  [49.4412, 11.0835],
  [49.4419, 11.0858],
  [49.4429, 11.0885],
  [49.4438, 11.091],
  [49.4445, 11.0935],
  [49.4452, 11.096],
  [49.4458, 11.0985],
  [49.4464, 11.1005],
  [49.447, 11.1025],
  [49.4476, 11.1045],
];

// Bus 67 route: Hügelstraße → Fürth Hauptbahnhof (rough coordinates)
const BUS67_COORDS = [
  [49.42441, 11.00956],
  [49.425, 11.012],
  [49.4258, 11.015],
  [49.4268, 11.019],
  [49.428, 11.0235],
  [49.4295, 11.028],
  [49.431, 11.032],
  [49.4325, 11.036],
  [49.434, 11.0395],
  [49.462, 10.99],
];

// U6 route: rough Munich coordinates
const U6_COORDS = [
  [48.137, 11.575],
  [48.14, 11.578],
  [48.145, 11.582],
  [48.15, 11.586],
  [48.155, 11.589],
  [48.16, 11.591],
];

function now() {
  return new Date();
}

function addMinutes(date, min) {
  return new Date(date.getTime() + min * 60000);
}

function isoTime(date) {
  return date.toISOString();
}

// ---------------------------------------------------------------------------
// Trip response builder
// ---------------------------------------------------------------------------

function buildTripResponse(tripId) {
  const base = now();

  // Determine route from tripId
  const isTram6 = tripId.includes("3118795") || tripId.includes("3118796");
  const isBus67 = tripId.includes("3118788");

  const coords = isTram6 ? TRAM6_COORDS : isBus67 ? BUS67_COORDS : U6_COORDS;
  const routeName = isTram6 ? "6" : isBus67 ? "67" : "U6";
  const headsign = isTram6 ? "Doku-Zentrum" : isBus67 ? "Fürth Hauptbahnhof" : "Garching Forschungszentrum";

  const stops = coords.map((coord, i) => ({
    name: `Stop ${i + 1}`,
    lat: coord[0],
    lon: coord[1],
    arrival: isoTime(addMinutes(base, i * 2 + (i > 2 ? 1 : 0))),
    scheduledArrival: isoTime(addMinutes(base, i * 2 + (i > 8 ? 5 : 0))), // last stop with delay!
    track: "2",
  }));

  const alerts = isTram6
    ? [
        {
          headerText: "Construction: Track works from Aufseßplatz",
          descriptionText: "Due to track construction works, delays are expected across the entire network.",
          severityLevel: "WARNING",
          cause: "CONSTRUCTION",
          effect: "SIGNIFICANT_DELAYS",
        },
      ]
    : [];

  return {
    tripId,
    routeShortName: routeName,
    headsign,
    alerts,
    legs: [
      {
        mode: isTram6 || isBus67 ? "TRAM" : "SUBWAY",
        routeShortName: routeName,
        headsign,
        startTime: isoTime(base),
        endTime: isoTime(addMinutes(base, (coords.length - 1) * 2)),
        from: {
          name: stops[0].name,
          lat: coords[0][0],
          lon: coords[0][1],
          scheduledDeparture: stops[0].scheduledArrival,
          departure: stops[0].arrival,
        },
        to: {
          name: stops[stops.length - 1].name,
          lat: coords[coords.length - 1][0],
          lon: coords[coords.length - 1][1],
          scheduledArrival: stops[stops.length - 1].scheduledArrival,
          arrival: stops[stops.length - 1].arrival,
        },
        legGeometry: {
          points: encodePolyline(coords),
        },
        intermediateStops: stops.slice(1, -1).map((s, i) => ({
          name: s.name,
          lat: s.lat,
          lon: s.lon,
          scheduledArrival: s.scheduledArrival,
          arrival: s.arrival,
          scheduledDeparture: s.scheduledArrival,
          departure: s.arrival,
          track: s.track,
        })),
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// HTTP server
// ---------------------------------------------------------------------------

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  console.log(`[mock] ${req.method} ${url.pathname}${url.search}`);

  if (url.pathname === "/api/v5/trip") {
    const tripId = url.searchParams.get("tripId") ?? "UNKNOWN";
    const data = buildTripResponse(tripId);
    res.writeHead(200);
    res.end(JSON.stringify(data));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  console.log(`Mock Transitous API running at http://localhost:${PORT}`);
  console.log(`  GET http://localhost:${PORT}/api/v5/trip?tripId=<id>`);
});
