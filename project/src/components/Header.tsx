import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Globe2, LogOut, User, LayoutDashboard } from 'lucide-react';

interface HeaderProps {
  onLoginClick: () => void;
}

export default function Header({ onLoginClick }: HeaderProps) {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const handleDashboardClick = () => {
    if (user?.role) {
      navigate(`/${user.role}`);
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const isDashboardPage = location.pathname.includes('/admin') || 
                         location.pathname.includes('/doctor') || 
                         location.pathname.includes('/guest') || 
                         location.pathname.includes('/affiliate');

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <button 
            onClick={handleHomeClick}
            className="text-2xl font-bold text-emerald-600"
          >
            {t('app.title')}
          </button>

          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-2 py-1 rounded ${i18n.language === 'en' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100'}`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange('fr')}
                className={`px-2 py-1 rounded ${i18n.language === 'fr' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100'}`}
              >
                FR
              </button>
              <button
                onClick={() => handleLanguageChange('ar')}
                className={`px-2 py-1 rounded ${i18n.language === 'ar' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100'}`}
              >
                عربي
              </button>
            </div>

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100">
                  <User className="w-5 h-5" />
                  <span>{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {!isDashboardPage && (
                    <button
                      onClick={handleDashboardClick}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </button>
                  )}
                  <button
                    onClick={logout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Se déconnecter
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <User className="w-5 h-5" />
                {t('nav.login')}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}