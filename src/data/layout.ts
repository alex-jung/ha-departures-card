import { LAYOUT_VERTICAL, LAYOUT_HORIZONTAL } from "../constants";
import { CardOrientation, LayoutCell } from "../types";

/**
 * Manages the grid layout configuration for a departure row.
 *
 * Parses and validates a layout string or array of strings / LayoutCell, providing access to individual layout cells
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
  _cardOrientation: CardOrientation;

  constructor(cells: Array<LayoutCell | string> | string | undefined, cardOrientation: CardOrientation) {
    this._layoutCells = this._parseCardLayout(cells, cardOrientation);
    this._cardOrientation = cardOrientation;
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
   * @param layout String containing current card layout. Possible values are "list" and "table"
   * @returns A string representing the current grid layout columns sizes.
   */
  public getColumns(): string {
    const layoutValues = this._cardOrientation == CardOrientation.VERTICAL ? LAYOUT_VERTICAL : LAYOUT_HORIZONTAL;

    return this._layoutCells
      .map((cell) => {
        return layoutValues.get(cell);
      })
      .join(" ");
  }

  /**
   * Parses the layout provided by the user
   * @param cells String/Array containing current layout configuration.
   * @param orientation Card orientation.
   * @returns An array of cells.
   */
  private _parseCardLayout(cells: Array<LayoutCell | string> | undefined | string, orientation: CardOrientation): Array<string> {
    const layoutValues = orientation == CardOrientation.VERTICAL ? LAYOUT_VERTICAL : LAYOUT_HORIZONTAL;

    let cardLayout: Array<string> = [];

    if (!cells || cells == undefined) {
      cardLayout = Array.from(layoutValues.keys());
    } else if (cells instanceof Array) {
      cardLayout = cells;
    } else {
      cardLayout = cells.toLowerCase().split(" ");
    }

    let gridCells = cardLayout.filter((value) => {
      return layoutValues.has(value);
    });

    return gridCells;
  }
}
