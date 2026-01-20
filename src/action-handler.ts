import { directive, Directive } from "lit/directive.js";

type ActionHandlerConfig = {
  hasHold?: boolean;
  hasDoubleClick?: boolean;
};

class ActionHandler extends Directive {
  private holdTimer?: number;
  private dblClickTimer?: number;
  private lastClick = 0;

  render(_config: ActionHandlerConfig) {}

  update(part: any, [config]: [ActionHandlerConfig]) {
    const element = part.element as HTMLElement;

    element.onclick = (ev) => this._handleClick(ev, element, config);
    element.onpointerdown = () => this._startHold(element, config);
    element.onpointerup = () => this._cancelHold();
    element.onpointerleave = () => this._cancelHold();

    return this.render(config);
  }

  private _handleClick(ev: MouseEvent, element: HTMLElement, config: ActionHandlerConfig) {
    ev.stopPropagation();

    const now = Date.now();
    if (config.hasDoubleClick) {
      if (now - this.lastClick < 250) {
        this.lastClick = 0;
        this._fire(element, "double_tap");
        return;
      }
      this.lastClick = now;
    }

    if (!config.hasHold) {
      this._fire(element, "tap");
    } else {
      this.dblClickTimer = window.setTimeout(() => this._fire(element, "tap"), 250);
    }
  }

  private _startHold(element: HTMLElement, config: ActionHandlerConfig) {
    if (!config.hasHold) return;

    this.holdTimer = window.setTimeout(() => this._fire(element, "hold"), 500);
  }

  private _cancelHold() {
    clearTimeout(this.holdTimer);
    clearTimeout(this.dblClickTimer);
  }

  private _fire(element: HTMLElement, action: string) {
    element.dispatchEvent(
      new CustomEvent("action", {
        detail: { action },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

export const actionHandler = directive(ActionHandler);
