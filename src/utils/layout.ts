export const HEADER_HEIGHT = 75
export const GRID_COLS = 12
export const GRID_ROW_HEIGHT = 50
export const HEADER_MARGIN = 5

export interface WidgetInfo {
  position: { x: number; y: number }
  size: { width: number; height: number }
}

export const findNextPosition = (
  widgets: WidgetInfo[],
  showHeaderImage: boolean,
  width: number,
  height: number
) => {
  const headerGridUnits = showHeaderImage
    ? Math.ceil((HEADER_HEIGHT + HEADER_MARGIN) / GRID_ROW_HEIGHT)
    : 0

  if (widgets.length === 0) {
    return { x: 0, y: headerGridUnits }
  }

  const currentRowY = Math.max(...widgets.map((item) => item.position.y))
  const itemsInCurrentRow = widgets.filter((item) => item.position.y === currentRowY)
  const lastItemInRow = itemsInCurrentRow[itemsInCurrentRow.length - 1]

  if (
    lastItemInRow &&
    lastItemInRow.position.x + lastItemInRow.size.width + width <= GRID_COLS
  ) {
    return { x: lastItemInRow.position.x + lastItemInRow.size.width, y: currentRowY }
  }

  const maxY = Math.max(
    ...widgets.map((item) => item.position.y + item.size.height)
  )
  return { x: 0, y: Math.max(maxY, headerGridUnits) }
}
