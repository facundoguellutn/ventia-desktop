import { LoginForm } from './components/login/LoginForm'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import FloatingModal from './components/modal/FloatingModal'

function App(): JSX.Element {
  return (
    <Router>
      <div className="w-full h-screen">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/floating-modal" element={<FloatingModal />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
