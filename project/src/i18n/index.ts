import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      title: 'Lebanese Doctors Abroad',
      'admin.button': 'Admin',
      'hero.title': 'Find Lebanese Medical Expertise in Europe',
      'hero.description': 'Connect with qualified Lebanese doctors in Paris and Brussels. Quality healthcare with a cultural touch.',
      'search.noResults': 'No doctors found matching your criteria. Try adjusting your filters.',
      'footer.copyright': '© 2024 Lebanese Doctors Abroad. All rights reserved.',
      'footer.privacy': 'Privacy Policy',
      'footer.terms': 'Terms of Service',
      cookies: {
        message: 'We use cookies to enhance your browsing experience and analyze our traffic.',
        shortMessage: 'We use cookies to improve your experience.',
        learnMore: 'Learn More',
        accept: 'Accept'
      },
      login: {
        title: 'Sign in to your account',
        email: 'Email address',
        password: 'Password',
        signIn: 'Sign in',
        error: 'Invalid email or password'
      }
    }
  },
  ar: {
    translation: {
      title: 'الأطباء اللبنانيون في الخارج',
      'admin.button': 'المشرف',
      'hero.title': 'ابحث عن الخبرة الطبية اللبنانية في أوروبا',
      'hero.description': 'تواصل مع أطباء لبنانيين مؤهلين في باريس وبروكسل. رعاية صحية عالية الجودة بلمسة ثقافية.',
      'search.noResults': 'لم يتم العثور على أطباء تطابق معاييرك. حاول تعديل عوامل التصفية.',
      'footer.copyright': '© 2024 الأطباء اللبنانيون في الخارج. جميع الحقوق محفوظة.',
      'footer.privacy': 'سياسة الخصوصية',
      'footer.terms': 'شروط الخدمة',
      cookies: {
        message: 'نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح وتحليل حركة المرور.',
        shortMessage: 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك.',
        learnMore: 'اعرف المزيد',
        accept: 'موافق'
      },
      login: {
        title: 'تسجيل الدخول إلى حسابك',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        signIn: 'تسجيل الدخول',
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;