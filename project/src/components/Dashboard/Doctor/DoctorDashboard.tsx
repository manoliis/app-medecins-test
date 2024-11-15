import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import DoctorAnalytics from './DoctorAnalytics';
import DoctorProfile from './DoctorProfile';
import SubscriptionManagement from './SubscriptionManagement';
import SecuritySettings from './SecuritySettings';
import PatientReviews from './PatientReviews';
import { Home, User, BarChart2, CreditCard, Lock, MessageCircle } from 'lucide-react';
import { Doctor } from '../../types';

export default function DoctorDashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    if (!user?.doctorId) {
      navigate('/');
      return;
    }

    const doctors = JSON.parse(localStorage.getItem('doctors') || '[]');
    const currentDoctor = doctors.find((d: Doctor) => d.id === user.doctorId);
    
    if (!currentDoctor) {
      console.error('Doctor not found:', user.doctorId);
      navigate('/');
      return;
    }

    setDoctor(currentDoctor);
  }, [user, navigate]);

  const handleHomeClick = async () => {
    await logout();
    navigate('/');
  };

  if (!doctor) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Bienvenue, Dr. {doctor.name}
        </h1>
        <button 
          onClick={handleHomeClick}
          className="flex items-center px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100"
        >
          <Home className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </button>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" />
            Mon Profil
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart2 className="w-4 h-4 mr-2" />
            Statistiques
          </TabsTrigger>
          <TabsTrigger value="reviews">
            <MessageCircle className="w-4 h-4 mr-2" />
            Avis Patients
          </TabsTrigger>
          <TabsTrigger value="subscription">
            <CreditCard className="w-4 h-4 mr-2" />
            Abonnement
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="w-4 h-4 mr-2" />
            Sécurité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <DoctorProfile doctor={doctor} />
        </TabsContent>

        <TabsContent value="analytics">
          <DoctorAnalytics doctor={doctor} />
        </TabsContent>

        <TabsContent value="reviews">
          <PatientReviews doctor={doctor} />
        </TabsContent>

        <TabsContent value="subscription">
          <SubscriptionManagement doctor={doctor} />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}