import React, { useState } from 'react';
import { Share2, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { Doctor } from '../types';

interface SocialShareProps {
  doctor: Pick<Doctor, 'id' | 'name' | 'specialty' | 'location'>;
}

export default function SocialShare({ doctor }: SocialShareProps) {
  const [showMenu, setShowMenu] = useState(false);

  const shareUrl = `${window.location.origin}/doctor/${doctor.id}`;
  const shareText = `Check out ${doctor.name}, ${doctor.specialty} in ${doctor.location}`;

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const shareToWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      '_blank'
    );
  };

  const shareToInstagram = () => {
    // Instagram doesn't support direct sharing via URL
    // We'll copy the text to clipboard instead
    navigator.clipboard.writeText(shareText + ' ' + shareUrl);
    alert('Link copied! You can now share it on Instagram.');
  };

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <Share2 className="w-5 h-5 text-gray-600" />
      </button>

      {showMenu && (
        <div 
          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-2"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={shareToFacebook}
            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100"
          >
            <Facebook className="w-5 h-5 text-blue-600" />
            <span>Facebook</span>
          </button>
          
          <button
            onClick={shareToWhatsApp}
            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100"
          >
            <MessageCircle className="w-5 h-5 text-green-600" />
            <span>WhatsApp</span>
          </button>
          
          <button
            onClick={shareToInstagram}
            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100"
          >
            <Instagram className="w-5 h-5 text-pink-600" />
            <span>Instagram</span>
          </button>
        </div>
      )}
    </div>
  );
}