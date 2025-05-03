
import React from 'react';
import { OfflineBanner } from '../offline/OfflineBanner';
import { useLocation } from 'react-router-dom';

export const GlobalComponents = () => {
  // We'll try to use location but have a fallback in case it's not available
  let location;
  try {
    location = useLocation();
  } catch (e) {
    console.log('GlobalComponents: useLocation not available, likely not within Router');
  }

  return (
    <>
      <OfflineBanner />
    </>
  );
};
