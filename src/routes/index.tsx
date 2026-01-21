import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Chess App</h1>
      <p>Clean slate. Ready to build.</p>
    </div>
  )
}
