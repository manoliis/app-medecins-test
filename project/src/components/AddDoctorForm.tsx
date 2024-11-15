import React, { useState, useRef } from 'react';
import { Doctor } from '../types';
import { ImagePlus, Upload } from 'lucide-react';

interface AddDoctorFormProps {
  onSubmit: (doctor: Partial<Doctor>) => void;
  isEnglish: boolean;
}

export default function AddDoctorForm({ onSubmit, isEnglish }: AddDoctorFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    location: '',
    languages: [] as string[],
    phone: '',
    email: '',
    website: '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier le type et la taille du fichier
      if (!file.type.startsWith('image/')) {
        alert(isEnglish ? 'Please select an image file' : 'Veuillez sélectionner une image');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        alert(isEnglish ? 'Image must not exceed 5MB' : 'L\'image ne doit pas dépasser 5MB');
        return;
      }

      // Créer une URL pour la prévisualisation
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Utiliser l'image uploadée ou l'image par défaut
    const imageToUse = previewUrl || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80";
    
    onSubmit({
      ...formData,
      image: imageToUse,
      submittedAt: new Date().toISOString(),
      approved: false,
      clicks: { phone: 0, email: 0, website: 0, profile: 0 },
    });
    
    // Réinitialiser le formulaire
    setFormData({
      name: '',
      specialty: '',
      location: '',
      languages: [],
      phone: '',
      email: '',
      website: '',
    });
    setPreviewUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold">
        {isEnglish ? "Suggest a Doctor" : "Suggérer un Médecin"}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Photo upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isEnglish ? "Doctor's Photo" : "Photo du Médecin"}
          </label>
          <div className="flex items-center gap-6">
            {previewUrl && (
              <div className="relative w-32 h-32">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Upload className="w-5 h-5 mr-2 text-gray-400" />
                {isEnglish ? "Upload Photo" : "Télécharger une photo"}
              </button>
              <p className="mt-2 text-sm text-gray-500">
                {isEnglish ? "JPG, PNG or GIF. 5MB max." : "JPG, PNG ou GIF. 5MB maximum."}
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

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {isEnglish ? "Doctor's Name" : "Nom du Médecin"}
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {isEnglish ? "Specialty" : "Spécialité"}
          </label>
          <input
            type="text"
            required
            value={formData.specialty}
            onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {isEnglish ? "Location" : "Localisation"}
          </label>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {isEnglish ? "Languages" : "Langues"}
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
            <option value="Arabic">{isEnglish ? "Arabic" : "Arabe"}</option>
            <option value="French">{isEnglish ? "French" : "Français"}</option>
            <option value="English">{isEnglish ? "English" : "Anglais"}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {isEnglish ? "Phone" : "Téléphone"}
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {isEnglish ? "Email" : "Email"}
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {isEnglish ? "Website (optional)" : "Site web (optionnel)"}
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
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
        >
          {isEnglish ? "Submit" : "Soumettre"}
        </button>
      </div>
    </form>
  );
}