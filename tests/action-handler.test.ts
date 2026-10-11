// lit is shipped as ESM only and can't be loaded by jest -> replace the directive base with a minimal stub
jest.mock(
  "lit/directive.js",
  () => ({
    Directive: class {},
    directive: (cls: any) => cls,
  }),
  { virtual: true },
);

import { actionHandler } from "../src/action-handler";

type HandlerConfig = { hasHold?: boolean; hasDoubleClick?: boolean };

function setup(config: HandlerConfig) {
  const element = document.createElement("div");
  const actions: string[] = [];
  element.addEventListener("action", (ev) => actions.push((ev as CustomEvent).detail.action));

  const HandlerClass = actionHandler as any;
  new HandlerClass({}).update({ element }, [config]);

  return { element, actions };
}

// jsdom implements neither PointerEvent nor the onpointer* handler properties, so the handlers
// assigned by the directive are called directly (a MouseEvent provides the needed clientX/clientY)
function pointer(element: HTMLElement, type: string, x = 0, y = 0) {
  const handler = (element as any)[`on${type}`];
  if (typeof handler !== "function") {
    throw new Error(`No handler registered for ${type}`);
  }
  handler.call(element, new MouseEvent(type, { clientX: x, clientY: y }));
}

describe("actionHandler", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("fires hold after holding the pointer for 500ms", () => {
    const { element, actions } = setup({ hasHold: true });

    pointer(element, "pointerdown", 100, 100);
    jest.advanceTimersByTime(499);
    expect(actions).toEqual([]);

    jest.advanceTimersByTime(1);
    expect(actions).toEqual(["hold"]);
  });

  it("fires hold when the pointer moves only slightly", () => {
    const { element, actions } = setup({ hasHold: true });

    pointer(element, "pointerdown", 100, 100);
    pointer(element, "pointermove", 105, 106);
    jest.advanceTimersByTime(500);

    expect(actions).toEqual(["hold"]);
  });

  it("does not fire hold when the pointer moves (e.g. scrolling)", () => {
    const { element, actions } = setup({ hasHold: true });

    pointer(element, "pointerdown", 100, 100);
    pointer(element, "pointermove", 100, 120);
    jest.advanceTimersByTime(1000);

    expect(actions).toEqual([]);
  });

  it("does not fire hold when the browser cancels the pointer", () => {
    const { element, actions } = setup({ hasHold: true });

    pointer(element, "pointerdown", 100, 100);
    pointer(element, "pointercancel");
    jest.advanceTimersByTime(1000);

    expect(actions).toEqual([]);
  });

  it("does not fire hold when the pointer is released early", () => {
    const { element, actions } = setup({ hasHold: true });

    pointer(element, "pointerdown", 100, 100);
    jest.advanceTimersByTime(300);
    pointer(element, "pointerup", 100, 100);
    jest.advanceTimersByTime(1000);

    expect(actions).toEqual([]);
  });

  it("does not fire hold when hold is disabled", () => {
    const { element, actions } = setup({ hasHold: false });

    pointer(element, "pointerdown", 100, 100);
    jest.advanceTimersByTime(1000);

    expect(actions).toEqual([]);
  });

  it("fires tap immediately when hold is disabled", () => {
    const { element, actions } = setup({ hasHold: false });

    element.click();

    expect(actions).toEqual(["tap"]);
  });

  it("fires tap delayed when hold is enabled", () => {
    const { element, actions } = setup({ hasHold: true });

    element.click();
    expect(actions).toEqual([]);

    jest.advanceTimersByTime(250);
    expect(actions).toEqual(["tap"]);
  });

  it("does not cancel a pending tap when the mouse moves after the click", () => {
    const { element, actions } = setup({ hasHold: true });

    element.click();
    pointer(element, "pointermove", 300, 300);
    jest.advanceTimersByTime(250);

    expect(actions).toEqual(["tap"]);
  });
});
