import en from "./locales/en.json";
import de from "./locales/de.json";

export type Translations = typeof en;
export type SupportedLanguages = "en" | "de";

const translations: Record<SupportedLanguages, Translations> = {
  en,
  de,
};

// Holt verschachtelten Wert (z. B. "user.greeting") aus Objekt
function getNestedValue(obj: any, keyPath: string): string | undefined {
  return keyPath.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function localize(
  key: string,
  lang: SupportedLanguages | string = "en",
  vars?: Record<string, string>
): string {
  const langKey = (Object.keys(translations) as SupportedLanguages[]).includes(lang as SupportedLanguages)
    ? (lang as SupportedLanguages)
    : "en";
  const langData = translations[langKey];
  const fallbackData = translations["en"];

  let template = getNestedValue(langData, key) ?? getNestedValue(fallbackData, key);
  if (typeof template !== "string") return key;

  if (vars) {
    for (const [varName, value] of Object.entries(vars)) {
      template = template.replace(new RegExp(`{${varName}}`, "g"), value);
    }
  }

  return template;
}
