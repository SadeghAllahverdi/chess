import { createFileRoute } from '@tanstack/react-router'
import IsoChessBoard from 'src/components/IsoChessBoard'

export const Route = createFileRoute('/play')({
  component: PlayPage,
})

function PlayPage() {
  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">Chess Match</h1>
      <IsoChessBoard light="#f0d9b5" dark="#b58863" />
    </div>
  )
}
