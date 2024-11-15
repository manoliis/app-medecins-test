import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      'app.title': 'Lebanese Doctors Abroad',
      'app.subtitle': 'Find Lebanese Medical Expertise in Europe',
      'nav.login': 'Login',
      'nav.language': 'Language',
      'login.title': 'Sign in',
      'login.username': 'Username',
      'login.password': 'Password',
      'login.submit': 'Sign in',
      'login.error': 'Invalid credentials',
      'admin.dashboard': 'Admin Dashboard',
      'admin.doctors': 'Manage Doctors',
      'admin.analytics': 'Analytics',
      'admin.credentials': 'Doctor Credentials',
      'admin.createCredentials': 'Create Doctor Account',
      'admin.doctorEmail': 'Doctor Email',
      'admin.doctorPassword': 'Password',
      'admin.visibility': 'Visibility',
      'admin.enable': 'Enable',
      'admin.disable': 'Disable',
      'admin.stats': 'Doctor Statistics',
      'admin.views': 'Profile Views',
      'admin.calls': 'Phone Calls',
      'admin.emails': 'Email Clicks',
      'admin.export': 'Export Report',
      'doctor.dashboard': 'Doctor Dashboard',
      'doctor.profile': 'My Profile',
      'doctor.stats': 'My Statistics',
      'doctor.subscription': 'Subscription'
    }
  },
  fr: {
    translation: {
      'app.title': 'Médecins Libanais à l\'Étranger',
      'app.subtitle': 'Trouvez l\'Expertise Médicale Libanaise en Europe',
      'nav.login': 'Connexion',
      'nav.language': 'Langue',
      'login.title': 'Connexion',
      'login.username': 'Nom d\'utilisateur',
      'login.password': 'Mot de passe',
      'login.submit': 'Se connecter',
      'login.error': 'Identifiants invalides',
      'admin.dashboard': 'Tableau de bord Admin',
      'admin.doctors': 'Gérer les Médecins',
      'admin.analytics': 'Analytique',
      'admin.credentials': 'Identifiants Médecins',
      'admin.createCredentials': 'Créer un compte médecin',
      'admin.doctorEmail': 'Email du médecin',
      'admin.doctorPassword': 'Mot de passe',
      'admin.visibility': 'Visibilité',
      'admin.enable': 'Activer',
      'admin.disable': 'Désactiver',
      'admin.stats': 'Statistiques du médecin',
      'admin.views': 'Vues du profil',
      'admin.calls': 'Appels',
      'admin.emails': 'Clics email',
      'admin.export': 'Exporter le rapport',
      'doctor.dashboard': 'Tableau de bord Médecin',
      'doctor.profile': 'Mon Profil',
      'doctor.stats': 'Mes Statistiques',
      'doctor.subscription': 'Abonnement'
    }
  },
  ar: {
    translation: {
      'app.title': 'الأطباء اللبنانيون في الخارج',
      'app.subtitle': 'ابحث عن الخبرة الطبية اللبنانية في أوروبا',
      'nav.login': 'تسجيل الدخول',
      'nav.language': 'اللغة',
      'login.title': 'تسجيل الدخول',
      'login.username': 'اسم المستخدم',
      'login.password': 'كلمة المرور',
      'login.submit': 'تسجيل الدخول',
      'login.error': 'بيانات غير صحيحة',
      'admin.dashboard': 'لوحة تحكم المشرف',
      'admin.doctors': 'إدارة الأطباء',
      'admin.analytics': 'التحليلات',
      'admin.credentials': 'حسابات الأطباء',
      'admin.createCredentials': 'إنشاء حساب طبيب',
      'admin.doctorEmail': 'البريد الإلكتروني للطبيب',
      'admin.doctorPassword': 'كلمة المرور',
      'admin.visibility': 'الظهور',
      'admin.enable': 'تفعيل',
      'admin.disable': 'تعطيل',
      'admin.stats': 'إحصائيات الطبيب',
      'admin.views': 'مشاهدات الملف',
      'admin.calls': 'المكالمات',
      'admin.emails': 'نقرات البريد',
      'admin.export': 'تصدير التقرير',
      'doctor.dashboard': 'لوحة تحكم الطبيب',
      'doctor.profile': 'ملفي الشخصي',
      'doctor.stats': 'إحصائياتي',
      'doctor.subscription': 'الاشتراك'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;