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
                src: '/favicon.ico',
                sizes: '333x273',
                type: 'image/x-icon',
            },
            {
                src: '/logo.jpg',
                sizes: '526x527',
                type: 'image/jpeg',
                purpose: 'maskable',
            },
            {
                src: '/logo.jpg',
                sizes: '526x527',
                type: 'image/jpeg',
                purpose: 'any',
            }
        ],
        screenshots: [
            {
                src: '/logo.jpg', // Temporary placeholder, should be a screenshot of the app
                sizes: '526x527',
                type: 'image/jpeg',
                form_factor: 'wide',
                label: 'Desktop View'
            },
            {
                src: '/logo.jpg', // Temporary placeholder
                sizes: '526x527',
                type: 'image/jpeg',
                label: 'Mobile View'
            }
        ]
    }
}
