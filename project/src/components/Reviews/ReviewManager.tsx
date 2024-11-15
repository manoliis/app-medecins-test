import React, { useState, useEffect } from 'react';
import { Review } from '../../types';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import MessageForm from './MessageForm';
import { useAuth } from '../../hooks/useAuth';

interface ReviewManagerProps {
  doctorId: number;
  doctorName: string;
  doctorEmail: string;
  onRatingUpdate: (newRating: number) => void;
}

export default function ReviewManager({ doctorId, doctorName, doctorEmail, onRatingUpdate }: ReviewManagerProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const savedReviews = localStorage.getItem(`reviews_${doctorId}`);
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, [doctorId]);

  // Calculer la moyenne des notes
  const calculateAverageRating = (reviewsList: Review[]) => {
    if (reviewsList.length === 0) return 0;
    const sum = reviewsList.reduce((acc, review) => acc + review.rating, 0);
    return Number((sum / reviewsList.length).toFixed(1));
  };

  // Vérifier si l'utilisateur a déjà donné un avis
  const hasUserReviewed = () => {
    return reviews.some(review => review.userId === user?.id);
  };

  const saveReviews = (newReviews: Review[]) => {
    localStorage.setItem(`reviews_${doctorId}`, JSON.stringify(newReviews));
    setReviews(newReviews);
    // Mettre à jour la note moyenne du médecin
    const newAverageRating = calculateAverageRating(newReviews);
    onRatingUpdate(newAverageRating);
  };

  const handleSubmitReview = async (data: { rating: number; comment: string }) => {
    if (hasUserReviewed()) {
      alert('Vous avez déjà donné votre avis pour ce médecin');
      return;
    }

    const newReview: Review = {
      id: Date.now().toString(),
      doctorId,
      userId: user?.id || 'guest',
      userName: user?.name || 'Invité',
      rating: data.rating,
      comment: data.comment,
      createdAt: new Date().toISOString(),
      isGuest: user?.role === 'guest'
    };

    const updatedReviews = [...reviews, newReview];
    saveReviews(updatedReviews);
    setShowForm(false);

    // Simuler l'envoi d'un email au médecin
    console.log(`
      À: ${doctorEmail}
      Sujet: Nouvel avis sur votre profil
      
      Le patient ${newReview.userName} a laissé un avis:
      Note: ${newReview.rating}/5
      Commentaire: ${newReview.comment}
    `);
  };

  const handleSubmitMessage = async (message: string) => {
    // Simuler l'envoi d'un message privé au médecin
    console.log(`
      À: ${doctorEmail}
      Sujet: Nouveau message d'un patient
      
      De: ${user?.name || 'Invité'}
      Message: ${message}
    `);
    
    alert('Votre message a été envoyé au médecin');
    setShowMessageForm(false);
  };

  const handleEditReview = async (data: { rating: number; comment: string }) => {
    if (!editingReview) return;

    const updatedReviews = reviews.map(review =>
      review.id === editingReview.id
        ? {
            ...review,
            rating: data.rating,
            comment: data.comment,
            updatedAt: new Date().toISOString()
          }
        : review
    );

    saveReviews(updatedReviews);
    setEditingReview(null);
  };

  const handleDeleteReview = (reviewId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) return;
    
    const updatedReviews = reviews.filter(review => review.id !== reviewId);
    saveReviews(updatedReviews);
  };

  const handleDoctorResponse = async (reviewId: string, text: string) => {
    const updatedReviews = reviews.map(review =>
      review.id === reviewId
        ? {
            ...review,
            response: {
              text,
              createdAt: new Date().toISOString()
            }
          }
        : review
    );

    saveReviews(updatedReviews);
    setRespondingTo(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Avis des patients</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowMessageForm(true)}
            className="px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-md hover:bg-emerald-100"
          >
            Envoyer un message
          </button>
          {!showForm && !editingReview && !hasUserReviewed() && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
            >
              Donner mon avis
            </button>
          )}
        </div>
      </div>

      {showMessageForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <MessageForm
            onSubmit={handleSubmitMessage}
            onCancel={() => setShowMessageForm(false)}
          />
        </div>
      )}

      {(showForm || editingReview) && (
        <div className="bg-white p-6 rounded-lg shadow">
          <ReviewForm
            doctorId={doctorId}
            initialReview={editingReview || undefined}
            onSubmit={editingReview ? handleEditReview : handleSubmitReview}
            onCancel={() => {
              setShowForm(false);
              setEditingReview(null);
            }}
          />
        </div>
      )}

      {respondingTo && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="font-medium mb-4">Répondre à l'avis</h4>
          <textarea
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            rows={4}
            placeholder="Votre réponse..."
            onChange={(e) => {
              if (e.target.value.trim()) {
                handleDoctorResponse(respondingTo, e.target.value);
              }
            }}
          />
        </div>
      )}

      <ReviewList
        reviews={reviews}
        doctorId={doctorId}
        onEdit={setEditingReview}
        onDelete={handleDeleteReview}
        onRespond={setRespondingTo}
      />
    </div>
  );
}