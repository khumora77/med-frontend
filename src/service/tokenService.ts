export const tokenService = {
  getToken: () => {
    const token = 
      localStorage.getItem('token') ||
      sessionStorage.getItem('token') ||
      localStorage.getItem('authToken') ||
      sessionStorage.getItem('authToken') ||
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('access_token') ||
      localStorage.getItem('userToken') ||
      sessionStorage.getItem('userToken');
    
    console.log('Token search - found:', !!token);
    return token;
  },
  
  setToken: (token: string, remember: boolean = true) => {
    console.log('Saving token to storage');
    if (remember) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
  },
  
  removeToken: () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    localStorage.removeItem('userToken');
    sessionStorage.removeItem('userToken');
  },
  
  isTokenValid: () => {
    const token = tokenService.getToken();
    return !!token;
  },

  // Token borligini tekshirish va debug qilish
  debugToken: () => {
    const token = tokenService.getToken();
    console.log('Token debug:', {
      hasToken: !!token,
      token: token ? token.substring(0, 20) + '...' : 'No token',
      localStorage: localStorage.getItem('token') ? 'Has token' : 'No token',
      sessionStorage: sessionStorage.getItem('token') ? 'Has token' : 'No token'
    });
    return token;
  }
};