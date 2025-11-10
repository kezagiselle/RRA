import './App.css'
import ApplicantPage from './pages/ApplicantPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SuccessfulPage from './pages/SuccessfulPage'
import ApplicantDashboard from './pages/ApplicantDashboard'



function App() {
 

  return (
    <>
    <ApplicantDashboard />
    </>
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<ApplicantPage />} />
    //     <Route path="/success" element={<ApplicantDashboard />} />
    //   </Routes>
    // </Router>
 
    
  )
}

export default App
