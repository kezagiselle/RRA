import './App.css'
import ApplicantPage from './pages/ApplicantPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SuccessfulPage from './pages/SuccessfulPage'
import ApplicantDashboard from './pages/ApplicantDashboard'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'



function App() {
 

  return (
   
     <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/applicant" element={<ApplicantPage />} />
        <Route path="/success" element={<SuccessfulPage />} />
         <Route path="/dashboard" element={<ApplicantDashboard/>} />
      </Routes>
    </Router>
  
 
    
  )
}

export default App
