import React from 'react';
import { Search, MapPin } from 'lucide-react';

interface SearchFiltersProps {
  city: string;
  setCity: (city: string) => void;
  specialty: string;
  setSpecialty: (specialty: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  isEnglish: boolean;
}

export default function SearchFilters({
  city,
  setCity,
  specialty,
  setSpecialty,
  language,
  setLanguage,
  isEnglish,
}: SearchFiltersProps) {
  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">{isEnglish ? "Select City" : "Sélectionner une ville"}</option>
            <option value="paris">Paris</option>
            <option value="brussels">Brussels</option>
          </select>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">{isEnglish ? "All Specialties" : "Toutes les spécialités"}</option>
            <option value="cardiology">{isEnglish ? "Cardiology" : "Cardiologie"}</option>
            <option value="dermatology">{isEnglish ? "Dermatology" : "Dermatologie"}</option>
            <option value="pediatrics">{isEnglish ? "Pediatrics" : "Pédiatrie"}</option>
            <option value="orthopedics">{isEnglish ? "Orthopedics" : "Orthopédie"}</option>
            <option value="gynecology">{isEnglish ? "Gynecology" : "Gynécologie"}</option>
          </select>
        </div>

        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">{isEnglish ? "All Languages" : "Toutes les langues"}</option>
            <option value="Arabic">{isEnglish ? "Arabic" : "Arabe"}</option>
            <option value="French">{isEnglish ? "French" : "Français"}</option>
            <option value="English">{isEnglish ? "English" : "Anglais"}</option>
          </select>
        </div>
      </div>
    </div>
  );
}