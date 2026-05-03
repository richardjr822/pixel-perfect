interface PixelArtProps {
  pattern: string
  palette: Record<string, string>
  scale?: number
}

export function PixelArt({ pattern, palette, scale = 4 }: PixelArtProps) {
  const rows = pattern.trim().split('\n').map(r => r.trim())
  const h = rows.length
  const w = rows[0]?.length ?? 0
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${w}, ${scale}px)`,
        gridTemplateRows: `repeat(${h}, ${scale}px)`,
      }}
    >
      {rows.flatMap((row, y) =>
        [...row].map((c, x) => (
          <div
            key={`${x}-${y}`}
            style={{ width: scale, height: scale, background: palette[c] ?? 'transparent' }}
          />
        ))
      )}
    </div>
  )
}
