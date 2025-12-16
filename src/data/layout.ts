import { DEFAULT_LAYOUT } from "../constants";

/**
 * Manages the layout configuration for a departure row.
 *
 * Parses and validates a layout string, providing access to individual layout cells
 * and their corresponding CSS grid column definitions.
 *
 * @example
 * ```typescript
 * const layout = new Layout("name time destination");
 * const cells = layout.getCells(); // ["name", "time", "destination"]
 * const columns = layout.getColumns(); // "1fr 2fr 3fr" (example values)
 * ```
 */
export class Layout {
  _layoutCells: Array<string>;

  constructor(layout: string) {
    this._layoutCells = this._parseCardLayout(layout);
  }

  /**
   * Gets the layout cells.
   * @returns An array of cell identifiers representing the current layout configuration.
   */
  public getCells(): Array<string> {
    return this._layoutCells;
  }

  public getColumns(): string {
    return this._layoutCells
      .map((cell) => {
        return DEFAULT_LAYOUT.get(cell);
      })
      .join(" ");
  }

  private _parseCardLayout(layout: string): Array<string> {
    let cardLayout;

    if (!layout || layout == undefined) {
      cardLayout = Array.from(DEFAULT_LAYOUT.keys());
    } else {
      cardLayout = layout.split(" ");
    }

    let cells = cardLayout.filter((value) => {
      return DEFAULT_LAYOUT.has(value);
    });

    return cells;
  }
}
