import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Key, Mail, Lock, User } from 'lucide-react';
import { Doctor } from '../../../types';

interface DoctorCredentialsProps {
  doctorId: number;
  doctorName: string;
  onSuccess?: () => void;
}

export default function DoctorCredentials({ doctorId, doctorName, onSuccess }: DoctorCredentialsProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get existing credentials
      const existingCredentials = JSON.parse(localStorage.getItem('doctorCredentials') || '[]');
      
      // Check if email already exists
      if (existingCredentials.some((cred: any) => cred.email === email)) {
        throw new Error('Cet email est déjà utilisé');
      }

      // Create new credentials
      const newCredentials = {
        doctorId,
        email,
        password,
        createdAt: new Date().toISOString()
      };

      // Save credentials
      existingCredentials.push(newCredentials);
      localStorage.setItem('doctorCredentials', JSON.stringify(existingCredentials));

      // Save/update doctors list
      const doctors = JSON.parse(localStorage.getItem('doctors') || '[]');
      if (!doctors.some((doc: Doctor) => doc.id === doctorId)) {
        doctors.push({
          id: doctorId,
          name: doctorName,
          credentials: {
            email,
            createdAt: new Date().toISOString()
          }
        });
        localStorage.setItem('doctors', JSON.stringify(doctors));
      }

      setSuccess(true);
      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      }
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="p-4 bg-green-50 text-green-700 rounded-md">
          Identifiants créés avec succès ! Le médecin peut maintenant se connecter.
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Médecin
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={doctorName}
            disabled
            className="pl-10 w-full rounded-md border-gray-300 bg-gray-50"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mot de passe
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            required
            minLength={6}
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Minimum 6 caractères
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
      >
        {loading ? 'Création...' : 'Créer les identifiants'}
      </button>

      {success && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Informations de connexion :</h4>
          <p className="text-sm text-gray-600">Email : {email}</p>
          <p className="text-sm text-gray-600">Mot de passe : {password}</p>
        </div>
      )}
    </form>
  );
}