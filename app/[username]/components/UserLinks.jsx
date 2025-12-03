"use client";
import React from "react";
import { Link as LinkIcon, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";

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
};

function UserLinks({ userLinks = [], lang }) {
  const currentLanguage = lang || "en"; // Prioritize 'lang' for translation, then 'language', default to English
  const t = translations[currentLanguage] || translations.en; // Fallback to English

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div className=" px-2 hover:cursor-pointer flex items-center justify-center sm:justify-start md:justify-start gap-2">
          <LinkIcon width={18} />
        </div>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="sr-only">{t.businessLinks}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div 
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
            className="rounded-lg text-black">
              <div className="flex items-center justify-between mx-3 text-3xl font-semibold text-center text-gray-800 mb-4">
                <span>{t.businessLinks}</span>
                <AlertDialogCancel><X /></AlertDialogCancel>
              </div>

              <div 
              dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
              className="p-2 space-y-3 overflow-y-auto scrollbar-non max-h-96">
                <div className="p-2 space-y-3">
                  {userLinks.length > 0 ? (
                    userLinks.map((lnk, i) => (
                      <a dir={`${currentLanguage === "ar" ? "rtl" : "ltr"}`}
                        href={lnk.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={i}
                        className="flex border border-gray-300 shadow-md duration-300 hover:bg-gray-100 pl-3 items-center gap-2 rounded-lg p-2"
                      >
                        <p className="p-2 border border-gray-300 rounded-full text-teal-600">
                          <LinkIcon />
                        </p>
                        <p className="text-sm break-all text-black">{lnk.namelink}</p>
                      </a>
                    ))
                  ) : (
                    <p className="text-center text-black">
                      {t.noBusinessLinks}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          {/* <AlertDialogCancel>Close</AlertDialogCancel> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default UserLinks;
