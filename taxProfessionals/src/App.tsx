import './App.css'
import ApplicantPage from './pages/ApplicantPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SuccessfulPage from './pages/SuccessfulPage'
import ApplicantDashboard from './pages/ApplicantDashboard'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import DocumentPage from './pages/DocumentPage'
import CompanyPage from './pages/CompanyPage'



function App() {
 

  return (
   
     <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/applicant" element={<ApplicantPage />} />
        <Route path="/success" element={<SuccessfulPage />} />
        <Route path="/dashboard" element={<ApplicantDashboard/>} />
        <Route path="/documents" element={<DocumentPage/>} />
        <Route path="/company" element={<CompanyPage/>} />
      </Routes>
    </Router>
  
 
    
  )
}

export default App
