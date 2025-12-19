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
   git clone https://github.com/your-username/dgtportfolio.git
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
  Built with ❤️ by the DGT Portfolio Team.
</div>

---

### باللغة العربية 🇸🇦

**DGT Portfolio** هي منصة متطورة لإنشاء الملفات الشخصية (Portfolios) للمحترفين والمستقلين. تتيح لك المنصة بناء موقعك الخاص في دقائق معدودة مع دعم كامل للنطاقات الفرعية (Subdomains) والنطاقات المخصصة (Custom Domains)، بالإضافة إلى دعم اللغة العربية بشكل كامل وتوليد السير الذاتية بصيغة PDF تلقائياً.
