import React from 'react';
import bannerlogo from '../src/assets/banner-logo.png';

export default function BannerLogo() {
  return (
    <div
      style={{
        width: '100%',
        background: '#2d3559', // dark blue
        padding: '1.25rem 1.5rem',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        minHeight: 80,
        borderRadius: 0, // Remove rounded corners for a full rectangle
        justifyContent: 'flex-start' // Align content to the left
      }}
    >
      <img
        src={bannerlogo}
        alt="Logo"
        style={{
          height: 56, // Larger logo
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  );
}