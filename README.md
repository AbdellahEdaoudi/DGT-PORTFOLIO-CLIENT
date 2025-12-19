# 🚀 DGT Portfolio - Next-Generation Portfolio Builder

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<div align="center">
  <img src="https://res.cloudinary.com/doamdzah7/image/upload/v1762630258/xq0uuvxnjp1panywpnxm.png" alt="DGT Portfolio Banner" width="100%" />
  
  <p align="center">
    <strong>Build a clean, modern, and high-converting portfolio in minutes. No code required.</strong>
    <br />
    <a href="https://dgtportfolio.com">View Demo</a>
    ·
    <a href="https://dgtportfolio.com/support">Report Bug</a>
    ·
    <a href="https://dgtportfolio.com/support">Request Feature</a>
  </p>
</div>

---

## ✨ Features

- **🌐 Dynamic Subdomains**: Every user gets a unique `username.dgtportfolio.com` URL.
- **🏠 Custom Domain Support**: Link your own domain (e.g., `yourname.com`) directly to your portfolio.
- **🌍 Multi-language Support**: Full i18n support including Arabic (RTL), English, French, Spanish, Russian, and more.
- **🎨 Modern Themes**: Choose from multiple professionally designed themes (ThemeTwo, ThemeThirteen, etc.).
- **🖱️ Drag & Drop Builder**: Easily reorder sections (Projects, Skills, Experience) with a smooth UI.
- **📝 PDF Resume Generation**: Automatically create a downloadable PDF version of your portfolio.
- **📱 Responsive & Fast**: Optimized for all devices and lightning-fast loading speeds using Next.js App Router.
- **💳 Payment Integration**: Built-in PayPal support for subscriptions or services.
- **📊 Analytics**: Integrated stats dashboard for monitoring portfolio visitors.
- **🔍 SEO Optimized**: Server-side metadata generation for better search engine rankings.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Library**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Context API
- **Internationalization**: [i18next](https://www.i18next.com/)

### Features & Utilities
- **Drag & Drop**: [@dnd-kit](https://dnd-kit.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **PDF Generation**: [@react-pdf/renderer](https://react-pdf.org/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Animations**: CSS Keyframes & Tailwind Animate

---

## 🚀 Getting Started

To get the frontend running locally, follow these steps:

### Prerequisites
- Node.js (v18.x or later)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AbdellahEdaoudi/DGT-PORTFOLIO-CLIENT.git
   cd dgtportfolio/front
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root of the `front` directory and add the necessary configuration.

4. **Run the development server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📂 Project Structure

```bash
front/
├── app/                 # Next.js App Router (Pages & Components)
│   ├── [username]/      # Dynamic user profile pages
│   ├── Admin/           # Admin dashboard
│   ├── Components/      # Reusable UI components
│   ├── dictionaries/    # i18n translation files
│   ├── update-profile/  # Portfolio builder/editor interface
│   └── globals.css      # Tailwind & Global styles
├── public/              # Static assets (images, icons, svgs)
├── lib/                 # Utility functions & API clients
└── package.json         # Project dependencies & scripts
```

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  Built with Abdellah Edaoudi
</div>

---

### باللغة العربية 🇸🇦

**DGT Portfolio** هي منصة متطورة لإنشاء الملفات الشخصية (Portfolios) للمحترفين والمستقلين. تتيح لك المنصة بناء موقعك الخاص في دقائق معدودة مع دعم كامل للنطاقات الفرعية (Subdomains) والنطاقات المخصصة (Custom Domains)، بالإضافة إلى دعم اللغة العربية بشكل كامل وتوليد السير الذاتية بصيغة PDF تلقائياً.

### Français 🇫🇷

**DGT Portfolio** est une plateforme avancée de création de portfolios pour professionnels et freelances. La plateforme vous permet de construire votre propre site en quelques minutes avec un support complet des sous-domaines et des domaines personnalisés, ainsi qu'un support multilingue et une génération automatique de CV au format PDF.

### Español 🇪🇸

**DGT Portfolio** es una plataforma avanzada para crear portafolios profesionales para expertos y freelancers. Permite construir tu sitio en minutos con soporte total para subdominios y dominios personalizados, además de soporte multilingüe completo y generación automática de currículums en PDF.

### Deutsch 🇩🇪

**DGT Portfolio** ist eine moderne Plattform zur Erstellung professioneller Portfolios für Experten und Freelancer. Mit Unterstützung für Subdomains und eigene Domains können Sie in wenigen Minuten Ihre eigene Website erstellen. Inklusive vollständiger Mehrsprachigkeit und automatischer PDF-Lebenslauferstellung.

### Русский 🇷🇺

**DGT Portfolio** — это современная платформа для создания профессиональных портфолио для экспертов и фрилансеров. Она позволяет создать собственный сайт за считанные минуты с полной поддержкой поддоменов и пользовательских доменов, а также многоязычности и автоматической генерации резюме в формате PDF.

### 日本語 🇯🇵

**DGT Portfolio** は、プロフェッショナルやフリーランサー向けに設計された次世代のポートフォリオ作成プラットフォームです。サブドメインやカスタムドメイン、多言語対応、PDF履歴書の自動生成をサポートしており、わずか数分で自分専用のサイトを構築できます。

### 中文 🇨🇳

**DGT Portfolio** 是一个为专业人士和自由职业者打造的先进作品集创建平台。它支持子域名和自定义域名，提供完整的多语言支持，并能自动生成 PDF 简历，让你在几分钟内即可构建出个人专属网站。

### Nederlands 🇳🇱

**DGT Portfolio** is een geavanceerd platform voor het maken van professionele portfolio's voor experts en freelancers. Hiermee bouw je in enkele minuten je eigen site met volledige ondersteuning voor subdomeinen en eigen domeinen, inclusief meertaligheid en automatische PDF-cv-generatie.

### Português 🇵🇹

**DGT Portfolio** é uma plataforma avançada para a criação de portfólios profissionais para especialistas e freelancers. Permite construir o seu próprio site em minutos com suporte total para subdomínios e domínios personalizados, para além de suporte multilingue e geração automática de currículos em PDF.

### Italiano 🇮🇹

**DGT Portfolio** è una piattaforma avanzata per la creazione di portfolio professionali per esperti e freelance. Ti permette di costruire il tuo sito in pochi minuti con supporto completo per sottodomini e domini personalizzati, oltre al supporto multilingue e alla generazione automatica di CV in PDF.

### हिन्दी 🇮🇳

**DGT Portfolio** पेशेवरों और फ्रीलांसरों के लिए एक उन्नत पोर्टफोलियो निर्माण मंच है। यह आपको सबडोमेन और कस्टम डोमेन के पूर्ण समर्थन के साथ मिनटों में अपनी साइट बनाने की अनुमति देता है, साथ ही पूर्ण बहुभाषी समर्थन और स्वचालित पीडीएफ बायोडाटा निर्माण भी प्रदान करता है।

### Türkçe 🇹🇷

**DGT Portfolio**, profesyoneller ve serbest çalışanlar için geliştirilmiş yeni nesil bir portföy oluşturma platformudur. Alt alan adları ve özel alan adları desteği, tam çoklu dil desteği ve otomatik PDF özgeçmiş oluşturma özelliği ile dakikalar içinde kendi sitenizi kurmanıza olanak tanır.

### 한국어 🇰🇷

**DGT Portfolio**는 전문가와 프리랜서를 위한 차세대 포트폴리오 제작 플랫폼입니다. 서브도메인 및 커스텀 도메인 지원, 다국어 지원, PDF 이력서 자동 생성 기능을 통해 단 몇 분 만에 나만의 전문적인 사이트를 구축할 수 있습니다.
