import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'DGT Portfolio - Build Your Personal Portfolio Online',
        short_name: 'DGT Portfolio',
        description: 'No code, no hassle. Build a clean, modern portfolio in minutes. Showcase your career, skills, projects, and work links like never before—leave a lasting impression and unlock new opportunities.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0f172a', // Slate-900 like
        theme_color: '#7c3aed', // Purple-600 like
        icons: [
            {
                src: '/logo.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/logo.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/LogoinQrcode.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            }
        ],
    }
}
