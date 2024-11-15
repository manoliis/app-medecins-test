import React, { useState } from 'react';
import { MapPin, Phone, Mail, Globe, Languages, Star, Share2, MessageCircle } from 'lucide-react';
import { Doctor, Review } from '../types';
import { trackEvent } from '../utils/analytics';
import SocialShare from './SocialShare';
import ReviewManager from './Reviews/ReviewManager';

interface DoctorCardProps extends Doctor {
  isPreview?: boolean;
}

export default function DoctorCard({
  id,
  name,
  specialty,
  location,
  languages,
  phone,
  email,
  website,
  rating,
  image,
  isPreview = false,
}: DoctorCardProps) {
  const [showReviews, setShowReviews] = useState(false);
  const [currentRating, setCurrentRating] = useState(rating);

  const handleClick = (type: 'phone' | 'email' | 'website' | 'profile') => {
    if (!isPreview) {
      trackEvent(id, type);
    }
  };

  const handleRatingUpdate = (newRating: number) => {
    setCurrentRating(newRating);
    // Mettre à jour le rating dans le localStorage
    const doctors = JSON.parse(localStorage.getItem('doctors') || '[]');
    const updatedDoctors = doctors.map((doc: Doctor) =>
      doc.id === id ? { ...doc, rating: newRating } : doc
    );
    localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="relative h-48">
        <img src={image} alt={name} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-medium">{currentRating}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
            <p className="text-emerald-600 font-medium mt-1">{specialty}</p>
          </div>
          <SocialShare doctor={{ id, name, specialty, location }} />
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Languages className="w-4 h-4" />
            <div className="flex gap-1 flex-wrap">
              {languages.map((lang) => (
                <span key={lang} className="text-sm px-2 py-1 bg-gray-100 rounded-full">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <a 
            href={`tel:${phone}`} 
            className="flex items-center gap-2 text-gray-600 hover:text-emerald-600"
            onClick={(e) => {
              e.stopPropagation();
              handleClick('phone');
            }}
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm">{phone}</span>
          </a>
          
          <a 
            href={`mailto:${email}`} 
            className="flex items-center gap-2 text-gray-600 hover:text-emerald-600"
            onClick={(e) => {
              e.stopPropagation();
              handleClick('email');
            }}
          >
            <Mail className="w-4 h-4" />
            <span className="text-sm">{email}</span>
          </a>
          
          {website && (
            <a 
              href={website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600"
              onClick={(e) => {
                e.stopPropagation();
                handleClick('website');
              }}
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm">Site web</span>
            </a>
          )}
        </div>
      </div>

      {/* Section Avis */}
      <div className="border-t border-gray-200">
        <button
          onClick={() => setShowReviews(!showReviews)}
          className="w-full px-6 py-3 text-left hover:bg-gray-50 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <span className="font-medium">Avis des patients</span>
          </div>
          <span className="text-sm text-gray-500">
            {showReviews ? 'Masquer' : 'Voir les avis'}
          </span>
        </button>

        {showReviews && (
          <div className="px-6 py-4 border-t border-gray-100">
            <ReviewManager 
              doctorId={id} 
              doctorName={name}
              doctorEmail={email}
              onRatingUpdate={handleRatingUpdate}
            />
          </div>
        )}
      </div>
    </div>
  );
}