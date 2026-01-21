import { useMemo } from 'react'

export type Square =
  `${'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'}${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`

export type IsoChessBoardProps = Readonly<{
  size?: number
  perspective?: number
  tilt?: number
  spin?: number
  light?: string
  dark?: string
  onSquareClick?: (sq: Square) => void
  highlightSquares?: ReadonlyArray<Square>
}>

function toSquare(file: number, rank: number): Square {
  const files = 'abcdefgh'
  return `${files[file]}${rank + 1}` as Square
}

export function IsoChessBoard({
  size = 520,
  perspective = 900,
  tilt = 62,
  spin = 45,
  light = '#f2f2f2',
  dark = '#b9b9b9',
  onSquareClick,
  highlightSquares = [], // default: none highlighted
}: IsoChessBoardProps) {
  const highlights = useMemo(
    () => new Set(highlightSquares),
    [highlightSquares],
  )
  const tile = size / 8

  return (
    <div
      className="grid place-items-center"
      style={{ width: size, height: size, perspective }}
    >
      <div
        className="relative overflow-hidden rounded-[18px] shadow-[0_30px_60px_rgba(0,0,0,0.25)] [transform-style:preserve-3d]"
        style={{
          width: size,
          height: size,
          transform: `rotateX(${tilt}deg) rotateZ(${spin}deg)`,
        }}
      >
        {/* board base / side shading */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(0,0,0,0.10), rgba(0,0,0,0))',
          }}
        />

        {/* tiles */}
        {Array.from({ length: 8 }).map((_, rank) =>
          Array.from({ length: 8 }).map((__, file) => {
            const isDark = (file + rank) % 2 === 1
            const sq = toSquare(file, rank)
            const isHi = highlights.has(sq)

            return (
              <button
                key={`${file}-${rank}`}
                type="button"
                title={sq}
                onClick={() => onSquareClick?.(sq)}
                className="absolute cursor-pointer border-0 p-0 outline-none"
                style={{
                  left: file * tile,
                  top: (7 - rank) * tile,
                  width: tile,
                  height: tile,
                  background: isDark ? dark : light,
                  boxShadow: isHi
                    ? 'inset 0 0 0 4px rgba(0,160,255,0.9)'
                    : 'none',
                }}
              />
            )
          }),
        )}

        {/* subtle grid lines */}
        <div
          className="pointer-events-none absolute inset-0 mix-blend-multiply"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.07) 1px, transparent 1px)',
            backgroundSize: `${tile}px ${tile}px`,
          }}
        />
      </div>
    </div>
  )
}

export default IsoChessBoard
