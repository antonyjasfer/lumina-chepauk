import React from 'react';

/**
 * GoogleMapsEmbed — Embedded Google Maps component showing M.A. Chidambaram Stadium.
 * Demonstrates integration with Google Maps Embed API (no API key required for basic embed).
 * 
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
        M.A. Chidambaram Stadium, Victoria Hostel Road, Chepauk, Chennai — 600005, Tamil Nadu
      </p>
      <div style={{
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--glass-border)',
        position: 'relative',
        aspectRatio: '16/9',
      }}>
        <iframe
          title="M.A. Chidambaram Stadium (Chepauk) on Google Maps"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.747!2d80.2789!3d13.0627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ea4f7d3361%3A0x6e61a70b6863d433!2sM.A.Chidambaram%20Stadium!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          aria-label="Interactive Google Map showing the location of M.A. Chidambaram Stadium in Chennai"
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
          href="https://maps.google.com/?q=MA+Chidambaram+Stadium+Chennai"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--chepauk-yellow)', textDecoration: 'none' }}
          aria-label="Open M.A. Chidambaram Stadium in Google Maps (opens in new tab)"
        >
          Open in Google Maps →
        </a>
      </div>
    </section>
  );
});

GoogleMapsEmbed.displayName = 'GoogleMapsEmbed';

export default GoogleMapsEmbed;
