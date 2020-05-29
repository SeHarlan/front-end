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

function getScreenDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
}

export const useScreenDimensions = () => {
  const [screenDimensions, setScreenDimensions] = useState(getScreenDimensions());

  useEffect(() => {
    const handleResize = () => setScreenDimensions(getScreenDimensions());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenDimensions;
};
