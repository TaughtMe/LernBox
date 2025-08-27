import { useState, useEffect } from 'react';

/**
 * A custom hook that tracks the state of a CSS media query.
 * @param {string} query The media query string to watch.
 * @returns {boolean} Returns true if the media query matches, otherwise false.
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => {
      setMatches(media.matches);
    };

    // Use the newer addEventListener method
    media.addEventListener('change', listener);

    // Cleanup function to remove the listener on component unmount
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};