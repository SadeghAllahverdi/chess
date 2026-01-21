import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

// function Home() {
//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold">Chess App</h1>
//       <p>Clean slate. Ready to build.</p>
//     </div>
//   )
// }


import { JSX, useState } from "react";
import { Chess, Square as ChessSquare } from "chess.js";

// ---------------- Types ----------------
type BoardName = "top" | "bottom";
type Highlight = { r: number; c: number };

type Selected = {
  square: ChessSquare;
  board: BoardName;
} | null;

// ---------------- Helpers ----------------
function indexToSquare(r: number, c: number): ChessSquare {
  return ("abcdefgh"[c] + (8 - r)) as ChessSquare;
}

function findNearestFreeSquare(
  chess: Chess,
  origin: ChessSquare
): ChessSquare | null {
  const { r, c } = squareToIndex(origin);

  // distance 0..7 (max possible)
  for (let d = 0; d < 8; d++) {
    for (let dr = -d; dr <= d; dr++) {
      for (let dc = -d; dc <= d; dc++) {
        if (Math.abs(dr) !== d && Math.abs(dc) !== d) continue;

        const nr = r + dr;
        const nc = c + dc;

        if (nr < 0 || nr > 7 || nc < 0 || nc > 7) continue;

        const sq = indexToSquare(nr, nc);
        if (!chess.get(sq)) {
          return sq;
        }
      }
    }
  }

  return null;
}


function squareToIndex(square: ChessSquare) {
  const file = square.charCodeAt(0) - 97;
  const rank = 8 - Number(square[1]);
  return { r: rank, c: file };
}

function chessToGrid(chess: Chess): (string | null)[][] {
  const grid = Array.from({ length: 8 }, () => Array(8).fill(null));
  chess.board().forEach((row, r) =>
    row.forEach((piece, c) => {
      if (piece) {
        grid[r][c] = piece.color === "w"
          ? piece.type.toUpperCase()
          : piece.type;
      }
    })
  );
  return grid;
}

// ---------------- Components ----------------
interface SquareProps {
  value: string | null;
  highlighted: boolean;
  onClick: () => void;
}

function Square({ value, highlighted, onClick }: SquareProps) {
  return (
    <div
      onClick={onClick}
      className={
        "w-12 h-12 flex items-center justify-center border cursor-pointer text-xl select-none " +
        (highlighted ? "bg-yellow-300" : "")
      }
    >
      {value}
    </div>
  );
}

interface BoardProps {
  board: (string | null)[][];
  highlights: Highlight[];
  onSquareClick: (r: number, c: number) => void;
}

function Board({ board, highlights, onSquareClick }: BoardProps) {
  return (
    <div className="grid grid-cols-8 border">
      {board.map((row, r) =>
        row.map((cell, c) => (
          <Square
            key={`${r}-${c}`}
            value={cell}
            highlighted={highlights.some(h => h.r === r && h.c === c)}
            onClick={() => onSquareClick(r, c)}
          />
        ))
      )}
    </div>
  );
}

// ---------------- Main Game ----------------
export default function Home(): JSX.Element {
  const [topChess] = useState(() => new Chess());
  const [bottomChess] = useState(() => new Chess());

  // bottom board starts empty
  bottomChess.clear();

  const [topGrid, setTopGrid] = useState(chessToGrid(topChess));
  const [bottomGrid, setBottomGrid] = useState(chessToGrid(bottomChess));

  const [selected, setSelected] = useState<Selected>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  function handleClick(boardName: BoardName, r: number, c: number) {
    const chess = boardName === "top" ? topChess : bottomChess;
    const setGrid = boardName === "top" ? setTopGrid : setBottomGrid;

    const square = indexToSquare(r, c);

    if (selected) {
      if (selected.board !== boardName) return;

      const move = chess.move({ from: selected.square, to: square, promotion: "q" });
      if (!move) return;

      setGrid(chessToGrid(chess));
      setSelected(null);
      setHighlights([]);

      // handle capture transfer
      if (move.captured) {
        const targetChess = boardName === "top" ? bottomChess : topChess;
        targetChess.put(
          {
            type: move.captured,
            color: boardName === "top" ? "b" : "w",
          },
          "a1"
        );

        boardName === "top"
          ? setBottomGrid(chessToGrid(bottomChess))
          : setTopGrid(chessToGrid(topChess));
      }
    } else {
      const piece = chess.get(square);
      if (!piece) return;

      setSelected({ square, board: boardName });

      const moves = chess.moves({ square, verbose: true });
      setHighlights(
        moves.map(m => {
          const { r, c } = squareToIndex(m.to);
          return { r, c };
        })
      );
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div>
        <h2 className="text-lg mb-2">Top Board</h2>
        <Board
          board={topGrid}
          highlights={highlights}
          onSquareClick={(r, c) => handleClick("top", r, c)}
        />
      </div>
      <div>
        <h2 className="text-lg mb-2">Bottom Board</h2>
        <Board
          board={bottomGrid}
          highlights={highlights}
          onSquareClick={(r, c) => handleClick("bottom", r, c)}
        />
      </div>
    </div>
  );
}
