import { useState, useEffect } from 'react';

export const useWindowSize = () => {
  // 第一步：声明能够体现视口大小变化的状态
  const [windowSize, setWindowSize] = useState({
    isMobile: window.innerWidth > 767 ? false : true,
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // 第二步：通过生命周期 Hook 声明回调的绑定和解绑逻辑
  useEffect(() => {
    const updateSize = () => setWindowSize({
      isMobile:  window.innerWidth > 767 ? false : true,
      width: window.innerWidth,
      height: window.innerHeight,
    });
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return windowSize;
}