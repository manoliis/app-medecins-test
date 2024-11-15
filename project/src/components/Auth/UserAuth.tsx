import React, { useState, useEffect } from 'react';
import { auth } from '../../config/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { UserCircle } from 'lucide-react';

export default function UserAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      // Create a new provider instance each time
      const provider = new GoogleAuthProvider();
      // Add custom OAuth parameters
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      // Request additional scopes
      provider.addScope('profile');
      provider.addScope('email');
      
      // Sign in with redirect instead of popup to avoid blocking
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google sign in error:', error);
      // Show user-friendly error message
      alert('Unable to sign in with Google. Please try again or use another sign in method.');
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Facebook sign in error:', error);
      alert('Unable to sign in with Facebook. Please try again or use another sign in method.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (user) {
    return (
      <div className="relative group">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'User'} 
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <UserCircle className="w-8 h-8" />
          )}
          <span className="text-sm font-medium">{user.displayName}</span>
        </button>
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleGoogleSignIn}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        Sign in with Google
      </button>
      <button
        onClick={handleFacebookSignIn}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        Sign in with Facebook
      </button>
    </div>
  );
}