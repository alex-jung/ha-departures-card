import { DEFAULT_LAYOUT } from "../constants";

/**
 * Manages the grid layout configuration for a departure row.
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

  constructor(layout: string | undefined) {
    this._layoutCells = this._parseCardLayout(layout);
  }

  /**
   * Gets the layout cells.
   * @returns An array of cell identifiers representing the current layout configuration.
   */
  public getCells(): Array<string> {
    return this._layoutCells;
  }

  /**
   * Gets the layout columns.
   * @returns A string representing the current grid layout columns sizes.
   */
  public getColumns(): string {
    return this._layoutCells
      .map((cell) => {
        return DEFAULT_LAYOUT.get(cell);
      })
      .join(" ");
  }

  /**
   * Parses the layout provided by the user
   * @param layout String containing current layout configuration.
   * @returns An array of cells (provided by user or default layout).
   */
  private _parseCardLayout(layout: string | undefined): Array<string> {
    let cardLayout;

    if (!layout || layout == undefined) {
      cardLayout = Array.from(DEFAULT_LAYOUT.keys());
    } else {
      cardLayout = layout.toLowerCase().split(" ");
    }

    let cells = cardLayout.filter((value) => {
      return DEFAULT_LAYOUT.has(value);
    });

    return cells;
  }
}
