import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        <h1 className="text-xl font-bold text-slate-800">
          Content Analyzer
        </h1>

        <div className="space-x-6">
          <Link
            to="/"
            className="text-slate-600 hover:text-blue-600 transition"
          >
            Home
          </Link>

          <Link
            to="/analyze"
            className="text-slate-600 hover:text-blue-600 transition"
          >
            Analyze
          </Link>
        </div>

      </div>
    </nav>
  )
}

export default Navbar
