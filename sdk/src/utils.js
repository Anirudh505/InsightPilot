import { v4 as uuidv4 } from 'uuid';

export const generateAnonymousId = () => {
  return uuidv4();
};

export const getStorage = (key) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem(key);
  }
  return null;
};

export const setStorage = (key, value) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(key, value);
  }
};

export const getSessionId = () => {
  let sessionId = getStorage('ip_session_id');
  const sessionExp = getStorage('ip_session_exp');
  
  const now = Date.now();
  // 30 min expiration
  if (!sessionId || !sessionExp || now > parseInt(sessionExp)) {
    sessionId = uuidv4();
    setStorage('ip_session_id', sessionId);
  }
  
  // Extend session
  setStorage('ip_session_exp', (now + 30 * 60 * 1000).toString());
  return sessionId;
};

export const getPageContext = () => {
  if (typeof window === 'undefined') return {};
  
  return {
    url: window.location.href,
    path: window.location.pathname,
    referrer: document.referrer,
    search: window.location.search,
    title: document.title
  };
};

export const getScreenContext = () => {
  if (typeof window === 'undefined') return {};
  
  return {
    width: window.screen.width,
    height: window.screen.height,
    density: window.devicePixelRatio
  };
};
