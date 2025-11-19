import "./App.css";
import ApplicantPage from "./pages/ApplicantPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SuccessfulPage from "./pages/SuccessfulPage";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DocumentPage from "./pages/DocumentPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route path="/applicant" element={<ApplicantPage />} />
        <Route path="/success" element={<SuccessfulPage />} />
        <Route path="/dashboard" element={<ApplicantDashboard />} />
        <Route path="/documents" element={<DocumentPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
