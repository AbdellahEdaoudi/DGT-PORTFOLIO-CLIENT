import LandingPage from "../Components/LandingPage/LandingPage"
import { getDictionary } from "../dictionaries/get-dictionary"

export const metadata = {
    title: "Crea Tu Portafolio Personal Online - DGT Portfolio | Sin Código",
    description: "Sin código, sin complicaciones. Construye un portafolio limpio y moderno en minutos. Muestra tu carrera, habilidades, proyectos y enlaces de trabajo como nunca antes. Prueba gratis por 7 días. ¡Obtén tu subdominio personalizado hoy!",
    keywords: ["creador de portafolio", "portafolio online", "portafolio personal", "portafolio sin código", "sitio web portafolio", "crear portafolio", "generador de portafolio", "subdominio personalizado", "portafolio código QR", "portafolio gratis", "plantillas portafolio", "portafolio digital"],
    authors: [{ name: "DGT Portfolio" }],
    creator: "DGT Portfolio",
    publisher: "DGT Portfolio",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        title: "Crea Tu Portafolio Personal Online - DGT Portfolio",
        description: "Sin código, sin complicaciones. Construye un portafolio limpio y moderno en minutos. Muestra tu carrera, habilidades, proyectos y enlaces de trabajo como nunca antes.",
        url: "https://dgtportfolio.com/es",
        siteName: "DGT Portfolio",
        locale: "es_ES",
        type: "website",
        images: [
            {
                url: "https://dgtportfolio.com/logo.png",
                alt: "DGT Portfolio - Creador de Portafolio Personal",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Crea Tu Portafolio Personal Online - DGT Portfolio",
        description: "Sin código, sin complicaciones. Construye un portafolio limpio y moderno en minutos.",
        images: ["https://dgtportfolio.com/logo.png"],
        creator: "@dgtportfolio",
    },
    alternates: {
        canonical: "https://dgtportfolio.com/es",
        languages: {
            'en': 'https://dgtportfolio.com/en',
            'es': 'https://dgtportfolio.com/es',
            'fr': 'https://dgtportfolio.com/fr',
            'ar': 'https://dgtportfolio.com/ar',
            'de': 'https://dgtportfolio.com/de',
            'ru': 'https://dgtportfolio.com/ru',
            'ja': 'https://dgtportfolio.com/ja',
            'zh': 'https://dgtportfolio.com/zh',
        },
    },
}

export default async function Page() {
    const dict = await getDictionary('es');
    return <LandingPage dict={dict} />
}
