import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Analyze from "./pages/Analyze"

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      <Navbar />

      {/* Centered Content Area */}
      <main className="grow flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-5xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<Analyze />} />
          </Routes>
        </div>
      </main>

      <Footer />

    </div>
  )
}

export default App
