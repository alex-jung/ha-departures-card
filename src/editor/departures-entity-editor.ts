import { css, html, LitElement, nothing } from "lit";
import { property, customElement } from 'lit/decorators.js';
import { HomeAssistant } from "custom-card-helpers";
import { localize } from "../localize";
import { mdiDelete } from "@mdi/js";
import { cardStyles } from "../styles";
import { EntityTab } from "../data-classes";



@customElement('departures-entity-editor')
export class DeparturesCardEntityEditor extends LitElement {
    static styles = [
        cardStyles,
        css`
        :host {
        }
        .entity-editor-content{
            border: 1px solid var(--divider-color);
            padding: 10px;
        }
        #card-options{
            display: flex;
            justify-content: flex-end;
            width: 100%;
        }
    `];
    @property({ attribute: false }) 
    public hass!: HomeAssistant;

    @property({ attribute: false })
    public data!: EntityTab;

    private _schema = [
        {
            name: "entity",
            selector: { entity: {} , domain: "sensor" }
        },
        {
            name: "destinationName",
            selector: { text: {} }
        },
        {
            name: "",
            type: "grid",
            schema: [
                {
                    name: "lineName",
                    selector: { text: {} }, 
                },
                {
                    name: "lineColor",
                    selector: { text: {} }, 
                }
            ]
        },
        {
            name: "nowIcon",
            selector: { icon: {} }
        },
        {
            name: "timeStyle",
            type: "select",
            default: "dynamic",
            options: [
                ["dynamic", "Dynamic"],
                ["timestamp", "Timestamp"],
            ]
        },

    ] as const;

    protected render() { 
        if (!this.hass) {
            return nothing;
        }

        return html`
            <div class="entity-editor-content">
                <div id="card-options">
                    <ha-icon-button 
                        .label=${localize("card.editor.entity.remove", this.hass.locale?.language)}
                        .path=${mdiDelete}
                        @click=${this.handleDelete}>
                    </ha-icon-button>
                </div>
                <ha-form
                    .schema="${this._schema}"
                    .hass="${this.hass}"
                    .data="${this.data?.config}"
                    @value-changed=${this._configChanged}
                    .computeLabel=${this._computeLabelCallback}
                >
                </ha-form>
            </div>
      `
    }

    private _configChanged(event: CustomEvent) {
        this.dispatchEvent(new CustomEvent('onChange', {detail: event.detail.value}));
    }   

    private handleDelete() {
        this.dispatchEvent(new CustomEvent('onDelete', {detail: this.data?.index }));
    }

    protected _computeLabelCallback = (schema: any) => 
        localize(`card.editor.entity.${schema.name}`, this.hass.locale?.language)
}