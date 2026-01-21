import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="p-4 flex gap-4 bg-gray-800 text-white shadow-md">
      <Link
        to="/"
        className="font-bold border-b-2 border-transparent"
        activeProps={{ className: 'border-cyan-400' }}
      >
        Home
      </Link>

      {/* We will add more links here later */}
    </header>
  )
}
