import { directive, Directive } from "lit/directive.js";

type ActionHandlerConfig = {
  hasHold?: boolean;
  hasDoubleClick?: boolean;
};

const HOLD_TIME = 500; // ms
const HOLD_MOVE_TOLERANCE = 10; // px

class ActionHandler extends Directive {
  private holdTimer?: number;
  private dblClickTimer?: number;
  private lastClick = 0;
  private holdStart?: { x: number; y: number };

  render(_config: ActionHandlerConfig) {}

  update(part: any, [config]: [ActionHandlerConfig]) {
    const element = part.element as HTMLElement;

    element.onclick = (ev) => this._handleClick(ev, element, config);
    element.onpointerdown = (ev) => this._startHold(ev, element, config);
    element.onpointermove = (ev) => this._checkHoldMove(ev);
    element.onpointerup = () => this._cancelHold();
    element.onpointerleave = () => this._cancelHold();
    element.onpointercancel = () => this._stopHoldTimer();

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

  private _startHold(ev: PointerEvent, element: HTMLElement, config: ActionHandlerConfig) {
    if (!config.hasHold) return;

    this.holdStart = { x: ev.clientX, y: ev.clientY };
    this.holdTimer = window.setTimeout(() => {
      this.holdStart = undefined;
      this._fire(element, "hold");
    }, HOLD_TIME);
  }

  // Abort the hold as soon as the pointer moves noticeably (e.g. the user is scrolling the list)
  private _checkHoldMove(ev: PointerEvent) {
    if (!this.holdStart) return;

    const dx = ev.clientX - this.holdStart.x;
    const dy = ev.clientY - this.holdStart.y;
    if (dx * dx + dy * dy > HOLD_MOVE_TOLERANCE * HOLD_MOVE_TOLERANCE) {
      this._stopHoldTimer();
    }
  }

  private _stopHoldTimer() {
    clearTimeout(this.holdTimer);
    this.holdStart = undefined;
  }

  private _cancelHold() {
    this._stopHoldTimer();
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
