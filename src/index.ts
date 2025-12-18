import { DeparturesCard } from "./components/ha-departures-card";

declare global {
  interface Window {
    customCards: Array<Object>;
  }
}

customElements.define("ha-departures-card", DeparturesCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "ha-departures-card",
  name: "Deaptures card",
  description: "Show public transport departures",
});
