export const trackEvent = async (doctorId: number, type: 'phone' | 'email' | 'website' | 'profile') => {
  const event = {
    doctorId,
    type,
    timestamp: new Date().toISOString()
  };

  // In a real app, this would be an API call to your backend
  console.log('Tracking event:', event);
  
  // For demo purposes, we'll store in localStorage
  const events = JSON.parse(localStorage.getItem('analyticsEvents') || '[]');
  events.push(event);
  localStorage.setItem('analyticsEvents', JSON.stringify(events));
};