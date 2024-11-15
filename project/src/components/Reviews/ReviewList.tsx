import React from 'react';
import { Star, Edit2, Trash2, MessageCircle } from 'lucide-react';
import { Review } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface ReviewListProps {
  reviews: Review[];
  doctorId: number;
  onEdit: (review: Review) => void;
  onDelete: (reviewId: string) => void;
  onRespond: (reviewId: string) => void;
}

export default function ReviewList({ reviews, doctorId, onEdit, onDelete, onRespond }: ReviewListProps) {
  const { user } = useAuth();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{review.userName}</span>
                {review.isGuest && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    Invité
                  </span>
                )}
              </div>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-2">
                  {formatDate(review.createdAt)}
                </span>
              </div>
            </div>

            {(user?.id === review.userId || user?.role === 'admin') && (
              <div className="flex gap-2">
                {user?.id === review.userId && (
                  <button
                    onClick={() => onEdit(review)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => onDelete(review.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <p className="mt-3 text-gray-600">{review.comment}</p>

          {/* Réponse du médecin */}
          {review.response && (
            <div className="mt-4 pl-4 border-l-2 border-emerald-200">
              <div className="flex items-center gap-2">
                <span className="font-medium">Réponse du Dr. {review.doctorName}</span>
                <span className="text-sm text-gray-500">
                  {formatDate(review.response.createdAt)}
                </span>
              </div>
              <p className="mt-2 text-gray-600">{review.response.text}</p>
            </div>
          )}

          {/* Bouton pour répondre (visible uniquement pour le médecin concerné) */}
          {user?.role === 'doctor' && user.doctorId === doctorId && !review.response && (
            <button
              onClick={() => onRespond(review.id)}
              className="mt-4 flex items-center text-sm text-emerald-600 hover:text-emerald-700"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Répondre
            </button>
          )}
        </div>
      ))}
    </div>
  );
}