import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import FooterBar from './components/page-footer'
import Header from './components/page-header'
import HomePage from './pages/home-page'
import LicensePage from './pages/license-page'
import PrivacyPage from './pages/privacy-page'
import TermsAndConditionsPage from './pages/terms-and-conditions'

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow dark:bg-body dark:text-white">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/license" element={<LicensePage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
          </Routes>
        </main>
        <FooterBar />
      </div>
    </Router>
  )
}

export default App
