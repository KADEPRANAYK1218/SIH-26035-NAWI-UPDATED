import React from 'react';
import emblemLogo from '../assets/images/india_emblem_logo.jpg';

/**
 * State Emblem of India (Ashoka Lion Capital of Sarnath)
 * Uses the official national emblem image asset with Satyameva Jayate
 */
export default function IndiaEmblem({ className = 'w-16 h-20', light = false, alt = 'State Emblem of India' }) {
  return (
    <img
      src={emblemLogo}
      alt={alt}
      className={`${className} object-contain select-none`}
      loading="eager"
    />
  );
}
