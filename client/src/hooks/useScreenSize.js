import { useEffect, useState } from 'react'

const useScreenSize = () => {
   const [windowSize, setWindowSize] = useState([
      window.innerWidth,
      window.innerHeight,
   ]);

   useEffect(() => {
      const handleWindowResize = () => {
         setWindowSize([window.innerWidth, window.innerHeight]);
      };
      window.addEventListener('resize', handleWindowResize);
      return () => {
         window.removeEventListener('resize', handleWindowResize);
      };
   }, []);

   return windowSize; //[width,height]
}

export default useScreenSize;