import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import CreateListing from './pages/CreateListing'
import EditListing from './pages/EditListing'
import ListingDetails from './pages/ListingDetails'
import Messages from './pages/Messages'
import Conversation from './pages/Conversation'

function App() {
  return (
    <Router basename="/HostConnect">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/edit-listing/:id" element={<EditListing />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/conversation/:userId" element={<Conversation />} />
      </Routes>
    </Router>
  )
}

export default App
