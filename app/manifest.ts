import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Review Tracker',
    short_name: 'ReviewTracker',
    description: 'Track intern reviews and sessions',
    start_url: '/',
    display: 'standalone',
    background_color: '#07090f',
    theme_color: '#00d4a4',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}