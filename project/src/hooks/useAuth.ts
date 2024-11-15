import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();

  const login = async (identifier: string, password: string): Promise<boolean> => {
    try {
      // Admin login
      if (identifier === 'admin' && password === 'admin') {
        const adminUser = {
          id: 'admin',
          email: 'admin@example.com',
          name: 'Admin',
          role: 'admin' as UserRole
        };
        localStorage.setItem('user', JSON.stringify(adminUser));
        setUser(adminUser);
        navigate('/admin', { replace: true });
        return true;
      }

      // Guest/Patient login
      if (identifier === 'guest' && password === 'guest') {
        const guestUser = {
          id: 'guest',
          email: 'guest@example.com',
          name: 'Patient',
          role: 'guest' as UserRole
        };
        localStorage.setItem('user', JSON.stringify(guestUser));
        setUser(guestUser);
        navigate('/guest', { replace: true });
        return true;
      }

      // Affiliate login
      if (identifier === 'affiliate' && password === 'affiliate') {
        const affiliateUser = {
          id: 'affiliate1',
          email: 'affiliate@example.com',
          name: 'Affilié',
          role: 'affiliate' as UserRole,
          affiliateId: 'aff1'
        };
        localStorage.setItem('user', JSON.stringify(affiliateUser));
        setUser(affiliateUser);
        navigate('/affiliate', { replace: true });
        return true;
      }

      // Doctor login
      const doctorCredentials = JSON.parse(localStorage.getItem('doctorCredentials') || '[]');
      const doctorCred = doctorCredentials.find((cred: any) => 
        (cred.email === identifier || cred.username === identifier) && cred.password === password
      );

      if (doctorCred) {
        const doctors = JSON.parse(localStorage.getItem('doctors') || '[]');
        const doctor = doctors.find((d: any) => d.id === doctorCred.doctorId);
        
        if (doctor) {
          const doctorUser = {
            id: String(doctor.id),
            email: doctorCred.email,
            name: doctor.name,
            role: 'doctor' as UserRole,
            doctorId: doctor.id
          };
          localStorage.setItem('user', JSON.stringify(doctorUser));
          setUser(doctorUser);
          navigate('/doctor', { replace: true });
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/', { replace: true });
  };

  const changePassword = async (email: string, currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const doctorCredentials = JSON.parse(localStorage.getItem('doctorCredentials') || '[]');
      const doctorIndex = doctorCredentials.findIndex((cred: any) => 
        cred.email === email && cred.password === currentPassword
      );

      if (doctorIndex === -1) return false;

      doctorCredentials[doctorIndex].password = newPassword;
      localStorage.setItem('doctorCredentials', JSON.stringify(doctorCredentials));
      
      logout();
      return true;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  };

  return { user, login, logout, changePassword };
}