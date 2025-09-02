# Departures Card
![GitHub Release](https://img.shields.io/github/v/release/alex-jung/ha-departures-card)
![GitHub License](https://img.shields.io/github/license/alex-jung/ha-departures-card)
![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/alex-jung/ha-departures-card/total)
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/alex-jung/ha-departures-card)


A card to display departure times provided by [Departures](https://github.com/alex-jung/ha-departures) custom integration.


<p align="center">
  <img width="600" src="assets/image_top.png"/>
</p>

## Installation

#### Manual 
1. Download from last release `dist/ha-departures-car.js` file. 
2. Activate Home Assistant `advanced mode` (Profile -> Advanced mode)
3. Open `settings -> Dashboards` and click on tree dots in right upper corner
4. Click on `Ressourcen` and then on `Add Ressource` button
5. Add `local/ha-departures-card.js` as JS module
6. Refresh the page

#### HACS (recommended)
1. Add this repository as a custom repository (HACS -> Custom repositories, type "Dashboard")
2. Search for `Departures Card` and install it.
3. Add new card to dashboard

## Card Properties
| yaml attribute                              |Type    |Required |Default value|
|---------------------------------------------|--------|---------|---|
| type                                        |string  |yes  |`custom:departures-card`|
| [title](#title)                             |string  |no   |Departures|
| [debug](#debug)                             |boolean |no   |false|
| [icon](#icon)                               |string  |no   |mdi:bus|
| [showAnimation](#showanimation)             |boolean |no   |true|
| [showTransportIcon](#showtransporticon)     |boolean |no   |false|
| [hideEmptyDepartures](#hideemptydepartures) |boolean |no   |false|
| [departuresToShow](#departurestoshow)       |number (max. 5) |no   |1|
| entities                                    |entity[]|yes  |-|

### "title"
**Default**: Departures

Sets the card's title, e.g., "Plärrer.".
If no title provided, the default value is used (based on user language setting)

``` yaml
type: custom:departures-card
title: Frankenstr.
```

|empty|title: "Frankenstr."|
|------------|---------------------|
|![card](assets/image_default_title.png) | ![card](assets/image_title.png)|

### "debug"
**Default**: false

Provides an option to debug data returned by the API.

``` yaml
type: custom:departures-card
debug: true
```

### "icon"
**Default**: mdi:bus

Defines the icon displayed on the card.

``` yaml
type: custom:departures-card
icon: mdi:bus-multiple
```

|empty|icon: mdi:bus-multiple|
|------------|---------------------|
|![card](assets/image_default_icon.png) | ![card](assets/image_icon_defined.png)|

### "departuresToShow"
**Default**: 1

This options specifies the number of departure entries to display on the card. By default, it is set to 1, meaning only the next departure will be shown. 
Users can increase this value up to 5 to show multiple upcoming departures, depending on their preferences or the available space on the dashboard.

``` yaml
type: custom:departures-card
departuresToShow: 3
```

|empty|departuresToShow: 3|
|------------|---------------------|
|![card](assets/image_departures_to_show_1.png) | ![card](assets/image_departures_to_show_3.png)|

### "showAnimation"
**Default**: true

The showAnimation option enables a visual animation to highlight upcoming departures. When the remaining time until the arrival of a vehicle falls below 5 minutes, the corresponding display element will begin to pulse. This serves as a visual alert to draw the user's attention to the imminent departure.

``` yaml
type: custom:departures-card
showAnimation: true
```

|showAnimation: true |
|------------|
|![card](assets/show_animation.gif)|


### "showTransportIcon"
**Default**: false

The showTransportIcon option controls whether an icon representing the type of vehicle (e.g., bus, subway, tram) is displayed.

``` yaml
type: custom:departures-card
showTransportIcon: true
```

|showTransportIcon: false |showTransportIcon: true|
|------------|---------------------|
|![card](assets/image_show_transport_icon_false.png) | ![card](assets/image_show_transport_icon_true.png)|

### "hideEmptyDepartures"
**Default**: false

The hideEmptyDepartures option controls whether lines without any departure times are displayed.

``` yaml
type: custom:departures-card
hideEmptyDepartures: true
```

|hideEmptyDepartures: false | hideEmptyDepartures: true                    |
|------------|----------------------------------------------|
|![card](assets/image_hide_empty_lines_0.png) | ![card](assets/image_hide_empty_lines_1.png) |

## Entity Properties
|yaml attribute                      |Type    |Required |Default value|
|------------------------------------|--------|-------- |-------------|
|[linecolor](#linecolor)            |string  |no       |empty        |
|[linename](#linename)               |string  |no       |empty        |
|[timestyle](#timestyle)            |string  |no       |dynamic      |
|[destinationname](#destinationname) |string  |no       |empty        |
|[nowIcon](#nowicon)                 |string  |no       |empty        |

### "lineColor"
**Default**: empty (no background color)

The "lineColor" option specifies the background color used to represent a vehicle line on the card. This allows users to visually distinguish different lines by assigning them unique colors. The color can be defined using standard formats like a hex code (e.g., "#FF5733") or a predefined color name.

``` yaml
type: custom:departures-card
entities:
  - entity: sensor.nurnberg_frankenstr_bus_45_ziegelstein_u_mogeldorf
    lineColor: "#EB5A3C"
```

|empty |lineColor: "#EB5A3C"|
|------------|---------------------|
|![card](assets/image_no_linecolor.png) | ![card](assets/image_linecolor_defined.png)|

### "lineName"
**Default**: Name provided by the server.

The "lineName" option specifies the name or identifier of the vehicle line (e.g., bus number, train line, or tram route) displayed on the card.

``` yaml
type: custom:departures-card
entities:
  - entity: sensor.nurnberg_frankenstr_bus_45_ziegelstein_u_mogeldorf
    lineName: 45
```

|empty |lineName: 45|
|------------|---------------------|
|![card](assets/image_no_linename.png) | ![card](assets/image_linename_defined.png)|

### "timeStyle"
**Default**: dynamic

- "dynamic"
  If the time to the next departure is less than 60 minutes, it is displayed as a relative time (e.g., "in 15 min").
  If the time is 60 minutes or more, it is displayed as an absolute timestamp (e.g., "14:30").

- "timestamp"
  The departure time is always displayed as an absolute timestamp (e.g., "14:30"), regardless of how far in the future it is.

``` yaml
type: custom:departures-card
entities:
  - entity: sensor.nurnberg_frankenstr_bus_45_ziegelstein_u_mogeldorf
    timeStyle: timestamp
```

|empty |timeStyle: timestamp|
|------------|---------------------|
|![card](assets/image_time_style_dynamic.png) | ![card](assets/time_style_timestamp.png)|

### "destinationName"
**Default**: Destination name provided by the server.

Option to overwrite default destination name provided by API.

``` yaml
type: custom:departures-card
entities:
  - entity: sensor.nurnberg_frankenstr_bus_45_ziegelstein_u_mogeldorf
    destinationName: Ziegelstein
```

|empty |destinationName: Ziegelstein|
|------------|---------------------|
|![card](assets/image_no_destination_name.png) | ![card](assets/destination_named_defined.png)|

### "nowIcon"
**Default**: empty

With `nowIcon` the user can overwrite default icon shown for now arriving transports. 
If no custom icon is defined, the transport type icon provided by `ha-departures` is used.

``` yaml
type: custom:departures-card
entities:
  - entity: sensor.frankenstr_u_bahn_u1_langwasser_sud
    nowIcon: mdi:rv-truck
```

|empty |nowIcon: mdi:rv-truck|
|------------|---------------------|
|![card](assets/image_nowicon_default.png) | ![card](assets/image_nowicon_custom.png)|