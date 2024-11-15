import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Upload, Image } from 'lucide-react';
import { Doctor } from '../../../types';

interface DoctorProfileProps {
  doctor: Doctor;
}

export default function DoctorProfile({ doctor }: DoctorProfileProps) {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(doctor.image);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: doctor.name,
    specialty: doctor.specialty,
    location: doctor.location,
    languages: doctor.languages,
    phone: doctor.phone,
    email: doctor.email,
    website: doctor.website || '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier le type et la taille du fichier
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        alert('L\'image ne doit pas dépasser 5MB');
        return;
      }

      // Créer une URL pour la prévisualisation
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Get all doctors
      const doctors = JSON.parse(localStorage.getItem('doctors') || '[]');
      
      // Find and update the current doctor
      const updatedDoctors = doctors.map((d: Doctor) => 
        d.id === doctor.id ? { ...d, ...formData, image: previewUrl } : d
      );
      
      // Save back to localStorage
      localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
      
      // Show success message
      alert('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Update error:', error);
      alert('Erreur lors de la mise à jour du profil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Informations personnelles</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo de profil */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Photo de profil
          </label>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32">
              <img
                src={previewUrl}
                alt={doctor.name}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 bg-white rounded-full"
                >
                  <Upload className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Image className="w-5 h-5 mr-2 text-gray-400" />
                Changer la photo
              </button>
              <p className="mt-2 text-sm text-gray-500">
                JPG, PNG ou GIF. 5MB maximum.
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom complet
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Spécialité
            </label>
            <input
              type="text"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Adresse du cabinet
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Langues parlées
            </label>
            <select
              multiple
              value={formData.languages}
              onChange={(e) => setFormData({
                ...formData,
                languages: Array.from(e.target.selectedOptions, option => option.value)
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            >
              <option value="Arabic">Arabe</option>
              <option value="French">Français</option>
              <option value="English">Anglais</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Numéro de téléphone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email professionnel
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Site web (optionnel)
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
}