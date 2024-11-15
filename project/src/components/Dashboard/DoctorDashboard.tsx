import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import DoctorAnalytics from './Doctor/DoctorAnalytics';
import DoctorProfile from './Doctor/DoctorProfile';
import SubscriptionManagement from './Doctor/SubscriptionManagement';
import SecuritySettings from './Doctor/SecuritySettings';
import PatientReviews from './Doctor/PatientReviews';
import { Home, User, BarChart2, CreditCard, Lock, MessageCircle, Calendar, Star } from 'lucide-react';
import { Doctor, Review } from '../../types';

interface Message {
  id: string;
  patientId: string;
  patientName: string;
  content: string;
  date: string;
  isRead: boolean;
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export default function DoctorDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (!user?.doctorId) {
      navigate('/');
      return;
    }

    // Charger les informations du médecin
    const doctors = JSON.parse(localStorage.getItem('doctors') || '[]');
    const currentDoctor = doctors.find((d: Doctor) => d.id === user.doctorId);
    
    if (!currentDoctor) {
      console.error('Doctor not found:', user.doctorId);
      navigate('/');
      return;
    }

    setDoctor(currentDoctor);

    // Charger les avis
    const savedReviews = localStorage.getItem(`reviews_${user.doctorId}`);
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }

    // Charger les messages
    const savedMessages = localStorage.getItem(`messages_${user.doctorId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    // Charger les rendez-vous
    const savedAppointments = localStorage.getItem(`appointments_${user.doctorId}`);
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, [user, navigate]);

  const handleHomeClick = () => {
    navigate('/');
  };

  if (!doctor) {
    return null;
  }

  const unreadMessages = messages.filter(m => !m.isRead).length;
  const upcomingAppointments = appointments.filter(a => a.status === 'upcoming').length;
  const totalReviews = reviews.length;
  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Bienvenue, Dr. {doctor.name}
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez votre profil et vos interactions avec les patients
          </p>
        </div>
        <button 
          onClick={handleHomeClick}
          className="flex items-center px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100"
        >
          <Home className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Messages non lus</p>
              <p className="text-2xl font-bold">{unreadMessages}</p>
            </div>
            <MessageCircle className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rendez-vous à venir</p>
              <p className="text-2xl font-bold">{upcomingAppointments}</p>
            </div>
            <Calendar className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avis reçus</p>
              <p className="text-2xl font-bold">{totalReviews}</p>
            </div>
            <Star className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Note moyenne</p>
              <p className="text-2xl font-bold">{averageRating.toFixed(1)}/5</p>
            </div>
            <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
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