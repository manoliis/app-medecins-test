import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface MessageFormProps {
  onSubmit: (message: string) => Promise<void>;
  onCancel: () => void;
}

export default function MessageForm({ onSubmit, onCancel }: MessageFormProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      await onSubmit(message);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Une erreur est survenue lors de l\'envoi du message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message privé au médecin
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          placeholder="Votre message..."
          required
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:opacity-50"
        >
          <Send className="w-4 h-4 mr-2" />
          {loading ? 'Envoi...' : 'Envoyer'}
        </button>
      </div>
    </form>
  );
}