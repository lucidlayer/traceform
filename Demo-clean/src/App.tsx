import './App.css'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { StockList } from './components/StockList'
import { ActivityLog } from './components/ActivityLog'
import { useState } from 'react'
import { BuySellModal } from './components/BuySellModal'

function App() {
  const [selectedStock, setSelectedStock] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [activity, setActivity] = useState<string[]>([])

  const handleBuySell = (stock: string, action: 'buy' | 'sell') => {
    setActivity((prev) => [
      `${action === 'buy' ? 'Bought' : 'Sold'} ${stock} @ ${new Date().toLocaleTimeString()}`,
      ...prev,
    ])
    setModalOpen(false)
  }

  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <Sidebar />
        <StockList onSelectStock={(stock) => { setSelectedStock(stock); setModalOpen(true); }} />
        <ActivityLog activity={activity} />
      </div>
      <BuySellModal
        open={modalOpen}
        stock={selectedStock}
        onClose={() => setModalOpen(false)}
        onBuySell={handleBuySell}
      />
    </div>
  )
}

export default App
