export function text(key: string, language: string | undefined): string {
    const texts: Record<string, Record<string, string>> = {
        de: {
            "departures": "Abfahrten",
            "line": "Linie",
            "destination": "Ziel",
        },
        en: {
            "departures": "Departures",
            "line": "Line",
            "destination": "Destination",
        }
    };

    if (!language || language === "undefined" || !Object.keys(texts).includes(language)) {
        language = "en";
    }

    return texts[language][key] || texts["en"][key];
}