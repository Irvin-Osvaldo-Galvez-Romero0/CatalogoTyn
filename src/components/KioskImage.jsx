// src/components/KioskImage.jsx
import React, { useState } from 'react';

const CDN_BASE = 'https://media.tynorcatalog.com/images';
const PLACEHOLDER_SVG = '/assets/placeholder-product.svg';

/**
 * Resilient Image Component for Kiosk Touchscreens
 * Incorporates Challenger Operational Mitigations:
 * - [FLAW-02]: Universal vector SVG fallback (placeholder-product.svg) preventing 404s in thin builds.
 * - URL Versioning: Appends ?v=version for instant cache invalidation under immutable headers.
 * 
 * @param {string} code - Product SKU (e.g. "101", "D02", "A01")
 * @param {'thumb'|'detail'} variant - 'thumb' (400x400 ~30KB) or 'detail' (1200x1200 ~110KB)
 * @param {string} alt - Accessibility description
 * @param {string} version - Optional timestamp or hash for cache invalidation (e.g. "20261102")
 * @param {boolean} priority - Set true for first visible cards to preload
 * @param {string} className - Optional container styling
 */
export default function KioskImage({
  code,
  variant = 'thumb',
  alt = '',
  version = null,
  className = '',
  priority = false
}) {
  const [loadState, setLoadState] = useState('loading'); // 'loading' | 'loaded' | 'error'

  const versionSuffix = version ? `?v=${encodeURIComponent(version)}` : '';
  const primaryUrl = `${CDN_BASE}/${variant}/${code}.webp${versionSuffix}`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Skeleton loading shimmer */}
      {loadState === 'loading' && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse rounded" />
      )}

      <img
        src={loadState === 'error' ? PLACEHOLDER_SVG : primaryUrl}
        alt={alt || `Tynor ${code}`}
        className={`w-full h-full object-contain transition-opacity duration-200 ${
          loadState === 'loading' ? 'opacity-0' : 'opacity-100'
        }`}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchpriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoadState('loaded')}
        onError={() => {
          if (loadState !== 'error') {
            setLoadState('error'); // Fallback to universal bundled SVG placeholder
          }
        }}
      />
    </div>
  );
}
