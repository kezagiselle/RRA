import './App.css'
import ApplicantPage from './pages/ApplicantPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SuccessfulPage from './pages/SuccessfulPage'

function App() {
 

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ApplicantPage />} />
        <Route path="/success" element={<SuccessfulPage />} />
      </Routes>
    </Router>
 
    
  )
}

export default App
