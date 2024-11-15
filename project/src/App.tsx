import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from './hooks/useAuth';
import DoctorCard from './components/DoctorCard';
import SearchFilters from './components/SearchFilters';
import AddDoctorForm from './components/AddDoctorForm';
import { initialDoctors } from './data/mockDoctors';
import { Doctor } from './types';
import LoginModal from './components/Auth/LoginModal';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import DoctorDashboard from './components/Dashboard/DoctorDashboard';
import GuestDashboard from './components/Dashboard/GuestDashboard';
import AffiliateDashboard from './components/Dashboard/AffiliateDashboard';
import CookieBanner from './components/CookieBanner';
import Header from './components/Header';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const savedDoctors = localStorage.getItem('doctors');
    if (!savedDoctors) {
      localStorage.setItem('doctors', JSON.stringify(initialDoctors));
      return initialDoctors;
    }
    return JSON.parse(savedDoctors);
  });

  const [city, setCity] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [language, setLanguage] = useState('');

  const filteredDoctors = doctors.filter(doctor => {
    if (!doctor.approved) return false;
    if (city && !doctor.location.toLowerCase().includes(city.toLowerCase())) return false;
    if (specialty && !doctor.specialty.toLowerCase().includes(specialty.toLowerCase())) return false;
    if (language && !doctor.languages.some(lang => lang.toLowerCase() === language.toLowerCase())) return false;
    return true;
  });

  const handleAddDoctor = (newDoctor: Partial<Doctor>) => {
    const doctorToAdd = {
      ...newDoctor,
      id: Date.now(),
      approved: false,
      clicks: { phone: 0, email: 0, website: 0, profile: 0 },
      rating: 0,
      submittedAt: new Date().toISOString(),
      submittedBy: 'public'
    } as Doctor;

    const updatedDoctors = [...doctors, doctorToAdd];
    setDoctors(updatedDoctors);
    localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLoginClick={() => setShowLoginModal(true)} />

      <Routes>
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard doctors={doctors} setDoctors={setDoctors} />
          </ProtectedRoute>
        } />
        
        <Route path="/doctor" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorDashboard />
          </ProtectedRoute>
        } />

        <Route path="/guest" element={
          <ProtectedRoute allowedRoles={['guest']}>
            <GuestDashboard />
          </ProtectedRoute>
        } />

        <Route path="/affiliate" element={
          <ProtectedRoute allowedRoles={['affiliate']}>
            <AffiliateDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/" element={
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {t('app.subtitle')}
                </h2>
              </div>

              <SearchFilters
                city={city}
                setCity={setCity}
                specialty={specialty}
                setSpecialty={setSpecialty}
                language={language}
                setLanguage={setLanguage}
                isEnglish={true}
              />

              {filteredDoctors.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Aucun médecin ne correspond à vos critères de recherche.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDoctors.map((doctor) => (
                    <DoctorCard key={doctor.id} {...doctor} />
                  ))}
                </div>
              )}

              <AddDoctorForm
                onSubmit={handleAddDoctor}
                isEnglish={true}
              />
            </div>
          </main>
        } />
      </Routes>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      <CookieBanner />
    </div>
  );
}

export default App;