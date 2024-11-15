import React, { useState, useEffect } from 'react';
import { Review } from '../../../types';
import { Star, MessageCircle, Mail } from 'lucide-react';

interface Message {
  id: string;
  from: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface PatientReviewsProps {
  doctor: {
    id: number;
    name: string;
    email: string;
  };
}

export default function PatientReviews({ doctor }: PatientReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'reviews' | 'messages'>('reviews');

  useEffect(() => {
    // Charger les avis
    const savedReviews = localStorage.getItem(`reviews_${doctor.id}`);
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }

    // Charger les messages
    const savedMessages = localStorage.getItem(`messages_${doctor.id}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, [doctor.id]);

  const handleRespond = async (reviewId: string, response: string) => {
    const updatedReviews = reviews.map(review =>
      review.id === reviewId
        ? {
            ...review,
            response: {
              text: response,
              createdAt: new Date().toISOString()
            }
          }
        : review
    );

    localStorage.setItem(`reviews_${doctor.id}`, JSON.stringify(updatedReviews));
    setReviews(updatedReviews);
    setRespondingTo(null);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Note moyenne</p>
              <div className="flex items-center mt-1">
                <span className="text-2xl font-semibold">{averageRating}</span>
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 ml-1" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avis reçus</p>
              <p className="text-2xl font-semibold">{reviews.length}</p>
            </div>
            <MessageCircle className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Messages non lus</p>
              <p className="text-2xl font-semibold">
                {messages.filter(m => !m.isRead).length}
              </p>
            </div>
            <Mail className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-4 px-1 relative ${
              activeTab === 'reviews'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Avis des patients
            {reviews.length > 0 && (
              <span className="ml-2 bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full text-xs">
                {reviews.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`py-4 px-1 relative ${
              activeTab === 'messages'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Messages reçus
            {messages.filter(m => !m.isRead).length > 0 && (
              <span className="ml-2 bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full text-xs">
                {messages.filter(m => !m.isRead).length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'reviews' ? (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Vous n'avez pas encore reçu d'avis.</p>
            </div>
          ) : (
            reviews.map(review => (
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
                </div>

                <p className="mt-3 text-gray-600">{review.comment}</p>

                {review.response ? (
                  <div className="mt-4 pl-4 border-l-2 border-emerald-200">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Votre réponse</span>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.response.createdAt)}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-600">{review.response.text}</p>
                  </div>
                ) : (
                  respondingTo === review.id ? (
                    <div className="mt-4">
                      <textarea
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        rows={4}
                        placeholder="Votre réponse..."
                        onChange={(e) => {
                          if (e.target.value.trim()) {
                            handleRespond(review.id, e.target.value);
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => setRespondingTo(review.id)}
                      className="mt-4 flex items-center text-sm text-emerald-600 hover:text-emerald-700"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Répondre
                    </button>
                  )
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Vous n'avez pas encore reçu de messages.</p>
            </div>
          ) : (
            messages.map(message => (
              <div
                key={message.id}
                className={`bg-white p-6 rounded-lg shadow ${
                  !message.isRead ? 'border-l-4 border-emerald-500' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{message.from}</span>
                      {!message.isRead && (
                        <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full">
                          Nouveau
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-gray-600">{message.content}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}