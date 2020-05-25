import { useState, useEffect } from 'react';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(()=> {
    const mobileMatch = /iPhone|Android|iPad/;
    if(window.navigator.userAgent.match(mobileMatch)) setIsMobile(true);
    else setIsMobile(false);
  }, []);
  return isMobile;
};
