import Dashboard from './components/dashboard/Dashboard'
import { LoginForm } from './components/login/LoginForm'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App(): JSX.Element {
  return (
    <Router>
      <div className="w-full h-screen">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
