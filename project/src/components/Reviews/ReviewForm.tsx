import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface ReviewFormProps {
  doctorId: number;
  initialReview?: {
    rating: number;
    comment: string;
  };
  onSubmit: (data: { rating: number; comment: string }) => Promise<void>;
  onCancel?: () => void;
}

export default function ReviewForm({ doctorId, initialReview, onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(initialReview?.rating || 0);
  const [comment, setComment] = useState(initialReview?.comment || '');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Empêcher les médecins de donner des avis
  if (user?.role === 'doctor') {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md">
        En tant que médecin, vous ne pouvez pas donner d'avis. Vous pouvez uniquement répondre aux avis de vos patients.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      alert('Veuillez attribuer une note');
      return;
    }
    
    setLoading(true);
    try {
      await onSubmit({ rating, comment });
      if (!initialReview) {
        setRating(0);
        setComment('');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Une erreur est survenue lors de l\'envoi de votre avis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Note
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(value)}
              className="focus:outline-none"
            >
              <Star
                className={`w-6 h-6 ${
                  value <= (hoveredRating || rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Votre avis
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          placeholder="Partagez votre expérience..."
          required
        />
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !rating}
          className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? 'Envoi...' : initialReview ? 'Modifier' : 'Envoyer'}
        </button>
      </div>
    </form>
  );
}