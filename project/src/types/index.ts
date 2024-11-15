// Ajouter ces types au fichier existant

export interface Review {
  id: string;
  doctorId: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
  response?: {
    text: string;
    createdAt: string;
  };
  isGuest?: boolean;
}

export interface ReviewResponse {
  text: string;
  createdAt: string;
}