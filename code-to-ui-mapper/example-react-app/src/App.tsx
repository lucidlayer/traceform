import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';

function App() {
  // Simple state-based navigation for this example instead of full routing
  // to avoid installing react-router-dom if not strictly needed yet.
  // We can switch to react-router-dom later if complexity increases.
  // const [currentPage, setCurrentPage] = useState<'home' | 'profile'>('home');
  // const navigate = (page: 'home' | 'profile') => setCurrentPage(page);

  // Using react-router-dom as planned
   const navigate = useNavigate();
   const handleNavigate = (page: 'home' | 'profile') => {
     navigate(page === 'home' ? '/' : '/profile');
   };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header onNavigate={handleNavigate} />
      <main className="flex-grow container mx-auto px-4 py-8">
         <Routes>
           <Route path="/" element={<HomePage />} />
           <Route path="/profile" element={<ProfilePage />} />
           <Route path="*" element={<Navigate to="/" replace />} /> {/* Redirect unknown paths to home */}
         </Routes>
        {/* {currentPage === 'home' && <HomePage />}
        {currentPage === 'profile' && <ProfilePage />} */}
      </main>
      <Footer />
    </div>
  );
}

export default App;
