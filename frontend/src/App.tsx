import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAccount } from 'wagmi'
import Home from './pages/Home'
import World from './pages/World'
import Marketplace from './pages/Marketplace'
import MyLands from './pages/MyLands'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  const { isConnected } = useAccount()

  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/world" element={<World />} />
          <Route path="/marketplace" element={<Marketplace />} />
          {isConnected && <Route path="/my-lands" element={<MyLands />} />}
        </Routes>
      </div>
    </Router>
  )
}

export default App
