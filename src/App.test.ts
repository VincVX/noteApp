import { findNextPosition, HEADER_HEIGHT, HEADER_MARGIN, GRID_ROW_HEIGHT } from './utils/layout'

describe('findNextPosition', () => {
  const headerGridUnits = Math.ceil((HEADER_HEIGHT + HEADER_MARGIN) / GRID_ROW_HEIGHT)

  it('returns start position when widget list is empty', () => {
    const pos = findNextPosition([], true, 4, 4)
    expect(pos).toEqual({ x: 0, y: headerGridUnits })
  })

  it('places widget in same row if space is available', () => {
    const widgets = [
      { position: { x: 0, y: 0 }, size: { width: 4, height: 4 } }
    ]
    const pos = findNextPosition(widgets, false, 4, 4)
    expect(pos).toEqual({ x: 4, y: 0 })
  })

  it('starts a new row when current row is full', () => {
    const widgets = [
      { position: { x: 0, y: 0 }, size: { width: 6, height: 4 } },
      { position: { x: 6, y: 0 }, size: { width: 6, height: 4 } }
    ]
    const pos = findNextPosition(widgets, false, 4, 4)
    expect(pos).toEqual({ x: 0, y: 4 })
  })
})
