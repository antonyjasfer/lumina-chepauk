import React from 'react';
import PropTypes from 'prop-types';
import { GOOGLE_MAPS_CONFIG } from '../constants/index.js';

/**
 * GoogleMapsEmbed — Embedded Google Maps component showing M.A. Chidambaram Stadium.
 * Demonstrates integration with Google Maps Embed API (no API key required for basic embed).
 * 
 * @component
 * @accessibility Includes descriptive title on iframe for screen readers.
 * @see https://developers.google.com/maps/documentation/embed/get-started
 */
const GoogleMapsEmbed = React.memo(() => {
  return (
    <section className="maps-container glass-panel" aria-label="Stadium Location" id="stadium-location">
      <h2 className="glow-text" style={{ fontSize: '1.1rem', marginBottom: '8px' }}>
        📍 Stadium Location — Google Maps
      </h2>
      <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
        {GOOGLE_MAPS_CONFIG.STADIUM_NAME}, {GOOGLE_MAPS_CONFIG.ADDRESS}
      </p>
      <div style={{
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--glass-border)',
        position: 'relative',
        aspectRatio: '16/9',
      }}>
        <iframe
          title={`${GOOGLE_MAPS_CONFIG.STADIUM_NAME} (Chepauk) on Google Maps`}
          src={GOOGLE_MAPS_CONFIG.EMBED_URL}
          width="100%"
          height="100%"
          style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          aria-label={`Interactive Google Map showing the location of ${GOOGLE_MAPS_CONFIG.STADIUM_NAME} in Chennai`}
        />
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '8px',
        fontSize: '0.65rem',
        color: 'var(--text-secondary)',
        opacity: 0.7,
      }}>
        <span>Powered by Google Maps Embed API</span>
        <a
          href={GOOGLE_MAPS_CONFIG.DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--chepauk-yellow)', textDecoration: 'none' }}
          aria-label={`Open ${GOOGLE_MAPS_CONFIG.STADIUM_NAME} in Google Maps (opens in new tab)`}
        >
          Open in Google Maps →
        </a>
      </div>
    </section>
  );
});

GoogleMapsEmbed.displayName = 'GoogleMapsEmbed';

GoogleMapsEmbed.propTypes = {};

export default GoogleMapsEmbed;
