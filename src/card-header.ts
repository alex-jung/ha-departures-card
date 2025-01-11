import { html, css, LitElement } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { cardStyles } from './styles';

@customElement('card-header')
export class CardHeader extends LitElement {
  static styles = cardStyles;

  @property({ type: String })
  title = 'Abfahrten';

  @property({ type: String })
  icon = 'mdi:bus';

  render() {
    return html`
      <div class="card-title">${this.title}</div>
      <div>
        <ha-icon icon="${this.icon}"></ha-icon>
      </div>`;
  }
}
