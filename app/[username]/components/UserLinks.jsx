import React, { useState, useEffect } from "react";
import { Link as LinkIcon, X, ExternalLink } from "../../Components/Icons";
import { createPortal } from "react-dom";

const translations = {
  en: {
    businessLinks: "Business Links",
    noBusinessLinks: "No Business Links available.",
  },
  fr: {
    businessLinks: "Liens Commerciaux",
    noBusinessLinks: "Aucun lien commercial disponible.",
  },
  es: {
    businessLinks: "Enlaces de Negocio",
    noBusinessLinks: "No hay enlaces de negocio disponibles.",
  },
  ar: {
    businessLinks: "روابط الأعمال",
    noBusinessLinks: "لا توجد روابط عمل متاحة.",
  },
  de: {
    businessLinks: "Geschäftslinks",
    noBusinessLinks: "Keine Geschäftslinks verfügbar.",
  },
  ru: {
    businessLinks: "Бизнес-ссылки",
    noBusinessLinks: "Нет доступных бизнес-ссылок.",
  },
  ja: {
    businessLinks: "ビジネスリンク",
    noBusinessLinks: "利用可能なビジネスリンクはありません。",
  },
  zh: {
    businessLinks: "商业链接",
    noBusinessLinks: "无可用商业链接。",
  },
  nl: {
    businessLinks: "Zakelijke links",
    noBusinessLinks: "Geen zakelijke links beschikbaar.",
  },
  pt: {
    businessLinks: "Links de Negócios",
    noBusinessLinks: "Nenhum link de negócio disponível.",
  },
  it: {
    businessLinks: "Link Aziendali",
    noBusinessLinks: "Nessun link aziendale disponibile.",
  },
  tr: {
    businessLinks: "İş Bağlantıları",
    noBusinessLinks: "Mevcut iş bağlantısı yok.",
  },
  hi: {
    businessLinks: "व्यापार लिंक",
    noBusinessLinks: "कोई व्यापार लिंक उपलब्ध नहीं है।",
  },
  ko: {
    businessLinks: "비즈니스 링크",
    noBusinessLinks: "이용 가능한 비즈니스 링크가 없습니다.",
  },
};

function UserLinks({ userLinks = [], lang, className, isOpen, onClose }) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = isOpen !== undefined;
  const showModal = isControlled ? isOpen : internalIsOpen;
  const currentLanguage = lang || "en";
  const t = translations[currentLanguage] || translations.en;

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  const handleClose = (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    if (isControlled && onClose) {
      onClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  return (
    <>
      <div
        onClick={() => !isControlled && setInternalIsOpen(true)}
        className={`size-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer ${className || "text-cyan-400 border border-cyan-500/30"}`}
        title={t.businessLinks}
      >
        <LinkIcon size={20} />
      </div>

      {showModal &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div
              className={`bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 relative`}
            >
              <div
                dir={currentLanguage === "ar" ? "rtl" : "ltr"}
                className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-100/50 rounded-full text-cyan-600">
                    <LinkIcon size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">
                    {t.businessLinks}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-gray-200/80 text-gray-500 transition-colors hover:rotate-90 duration-300"
                >
                  <X size={20} />
                </button>
              </div>

              <div
                dir={currentLanguage === "ar" ? "rtl" : "ltr"}
                className="p-5 max-h-[60vh] overflow-y-auto custom-scrollbar"
              >
                <div className="flex flex-col gap-3">
                  {userLinks.length > 0 ? (
                    userLinks.map((lnk, i) => (
                      <a
                        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
                        href={lnk.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={i}
                        className="group flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-cyan-200 bg-white hover:bg-cyan-50/30 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <div className="p-3 rounded-full bg-gray-50 text-gray-400 group-hover:bg-cyan-100 group-hover:text-cyan-600 transition-colors duration-300">
                          <ExternalLink size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-cyan-700 truncate transition-colors">
                            {lnk.namelink}
                          </p>
                          <p className="text-xs text-gray-400 truncate group-hover:text-cyan-600/70 transition-colors">
                            {lnk.link}
                          </p>
                        </div>
                        <div className={`text-gray-300 group-hover:text-cyan-400 transition-transform duration-300 ${currentLanguage === 'ar' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}>
                          <div className={currentLanguage === 'ar' ? "rotate-180" : ""}>➔</div>
                        </div>
                      </a>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-700 gap-3">
                      <LinkIcon size={40} className="opacity-20" />
                      <p className="text-sm">{t.noBusinessLinks}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                <button onClick={handleClose} className="text-xs font-semibold text-gray-500 hover:text-gray-800 uppercase tracking-wide transition-colors">
                  Close
                </button>
              </div>

            </div>
            {/* Backdrop click to close */}
            <div
              className="absolute inset-0 -z-10 cursor-default"
              onClick={handleClose}
            />
          </div>,
          document.body
        )}
    </>
  );
}

export default UserLinks;
