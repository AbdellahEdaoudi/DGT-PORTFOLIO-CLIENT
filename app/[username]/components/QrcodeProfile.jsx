import React, { useRef, useState, useEffect } from "react";
import QRCode from "qrcode.react";
import { CheckCircle2, Copy, Download, LinkIcon, QrCode, Share2, X } from "../../Components/Icons";
import { createPortal } from "react-dom";

const translations = {
  en: {
    qrCodeProfile: "QR Code",
    downloadQrCode: "Download",
    shareQrCode: "Share QR",
    shareLink: "Share Link",
    copyLink: "Copy Link",
    checkOutQrCode: "Check out this QR Code!",
    sharingFailed: "Sharing failed",
    webShareApiUnsupported: "Your browser doesn't support the Web Share API.",
    successfulShare: "Successful share",
    errorSharing: "Error sharing",
    shareUnsupported: "Share not supported on this browser",
  },
  fr: {
    qrCodeProfile: "Code QR",
    downloadQrCode: "Télécharger",
    shareQrCode: "Partager QR",
    shareLink: "Partager lien",
    copyLink: "Copier lien",
    checkOutQrCode: "Découvrez ce code QR !",
    sharingFailed: "Échec du partage",
    webShareApiUnsupported: "Votre navigateur ne prend pas en charge l'API Web Share.",
    successfulShare: "Partage réussi",
    errorSharing: "Erreur de partage",
    shareUnsupported: "Le partage n'est pas pris en charge sur ce navigateur",
  },
  es: {
    qrCodeProfile: "Código QR",
    downloadQrCode: "Descargar",
    shareQrCode: "Compartir QR",
    shareLink: "Compartir enlace",
    copyLink: "Copiar enlace",
    checkOutQrCode: "¡Mira este código QR!",
    sharingFailed: "Error al compartir",
    webShareApiUnsupported: "Tu navegador no admite la API Web Share.",
    successfulShare: "Compartir exitoso",
    errorSharing: "Error al compartir",
    shareUnsupported: "Compartir no es compatible con este navegador",
  },
  ar: {
    qrCodeProfile: "رمز الاستجابة السريعة",
    downloadQrCode: "تحميل",
    shareQrCode: "مشاركة الرمز",
    shareLink: "مشاركة الرابط",
    copyLink: "نسخ الرابط",
    checkOutQrCode: "اطلع على رمز الاستجابة السريعة هذا!",
    sharingFailed: "فشل المشاركة",
    webShareApiUnsupported: "متصفحك لا يدعم واجهة برمجة تطبيقات Web Share.",
    successfulShare: "مشاركة ناجحة",
    errorSharing: "خطأ في المشاركة",
    shareUnsupported: "المشاركة غير مدعومة في هذا المتصفح",
  },
  de: {
    qrCodeProfile: "QR-Code",
    downloadQrCode: "Herunterladen",
    shareQrCode: "QR teilen",
    shareLink: "Link teilen",
    copyLink: "Link kopieren",
    checkOutQrCode: "Schauen Sie sich diesen QR-Code an!",
    sharingFailed: "Teilen fehlgeschlagen",
    webShareApiUnsupported: "Ihr Browser unterstützt die Web Share API nicht.",
    successfulShare: "Erfolgreiche Freigabe",
    errorSharing: "Fehler beim Teilen",
    shareUnsupported: "Teilen wird in diesem Browser nicht unterstützt",
  },
  ru: {
    qrCodeProfile: "QR-код",
    downloadQrCode: "Скачать",
    shareQrCode: "Поделиться QR",
    shareLink: "Поделиться",
    copyLink: "Скопировать",
    checkOutQrCode: "Посмотрите этот QR-код!",
    sharingFailed: "Ошибка при обмене",
    webShareApiUnsupported: "Ваш браузер не поддерживает Web Share API.",
    successfulShare: "Успешный обмен",
    errorSharing: "Ошибка при обмене",
    shareUnsupported: "Обмен не поддерживается в этом браузере",
  },
  ja: {
    qrCodeProfile: "QRコード",
    downloadQrCode: "ダウンロード",
    shareQrCode: "QRを共有",
    shareLink: "リンクを共有",
    copyLink: "リンクをコピー",
    checkOutQrCode: "このQRコードをチェックしてください！",
    sharingFailed: "共有に失敗しました",
    webShareApiUnsupported: "お使いのブラウザはWeb Share APIをサポートしていません。",
    successfulShare: "共有に成功しました",
    errorSharing: "共有エラー",
    shareUnsupported: "このブラウザでは共有がサポートされていません",
  },
  zh: {
    qrCodeProfile: "二维码",
    downloadQrCode: "下载",
    shareQrCode: "分享二维码",
    shareLink: "分享链接",
    copyLink: "复制链接",
    checkOutQrCode: "查看此二维码！",
    sharingFailed: "分享失败",
    webShareApiUnsupported: "您的浏览器不支持Web Share API。",
    successfulShare: "分享成功",
    errorSharing: "分享错误",
    shareUnsupported: "此浏览器不支持分享",
  },
  nl: {
    qrCodeProfile: "QR-code",
    downloadQrCode: "Downloaden",
    shareQrCode: "Deel QR",
    shareLink: "Deel link",
    copyLink: "Kopieer link",
    checkOutQrCode: "Bekijk deze QR-code!",
    sharingFailed: "Delen mislukt",
    webShareApiUnsupported: "Uw browser ondersteunt de Web Share API niet.",
    successfulShare: "Succesvol gedeeld",
    errorSharing: "Fout bij delen",
    shareUnsupported: "Delen niet ondersteund in deze browser",
  },
  pt: {
    qrCodeProfile: "Código QR",
    downloadQrCode: "Baixar",
    shareQrCode: "Compartilhar QR",
    shareLink: "Compartilhar Link",
    copyLink: "Copiar Link",
    checkOutQrCode: "Confira este Código QR!",
    sharingFailed: "Falha ao compartilhar",
    webShareApiUnsupported: "Seu navegador não suporta a API Web Share.",
    successfulShare: "Compartilhamento bem-sucedido",
    errorSharing: "Erro ao compartilhar",
    shareUnsupported: "Compartilhamento não suportado neste navegador",
  },
  it: {
    qrCodeProfile: "Codice QR",
    downloadQrCode: "Scarica",
    shareQrCode: "Condividi QR",
    shareLink: "Condividi Link",
    copyLink: "Copia Link",
    checkOutQrCode: "Dai un'occhiata a questo Codice QR!",
    sharingFailed: "Condivisione fallita",
    webShareApiUnsupported: "Il tuo browser non supporta la Web Share API.",
    successfulShare: "Condivisione riuscita",
    errorSharing: "Errore durante la condivisione",
    shareUnsupported: "Condivisione non supportata su questo browser",
  },
  tr: {
    qrCodeProfile: "QR Kod",
    downloadQrCode: "İndir",
    shareQrCode: "QR Paylaş",
    shareLink: "Bağlantı Paylaş",
    copyLink: "Kopyala",
    checkOutQrCode: "Bu QR Koduna göz atın!",
    sharingFailed: "Paylaşım başarısız",
    webShareApiUnsupported: "Tarayıcınız Web Share API'sini desteklemiyor.",
    successfulShare: "Başarılı paylaşım",
    errorSharing: "Paylaşım hatası",
    shareUnsupported: "Bu tarayıcıda paylaşım desteklenmiyor",
  },
  hi: {
    qrCodeProfile: "QR कोड",
    downloadQrCode: "डाउनलोड",
    shareQrCode: "QR साझा करें",
    shareLink: "लिंक साझा करें",
    copyLink: "लिंक कॉपी करें",
    checkOutQrCode: "इस QR कोड को देखें!",
    sharingFailed: "साजा करने में विफल",
    webShareApiUnsupported: "आपका ब्राउज़र वेब शेयर API का समर्थन नहीं करता है।",
    successfulShare: "सफलतापूर्वक साझा किया गया",
    errorSharing: "साझा करने में त्रुटि",
    shareUnsupported: "इस ब्राउज़र पर साझा करना समर्थित नहीं है",
  },
  ko: {
    qrCodeProfile: "QR 코드",
    downloadQrCode: "다운로드",
    shareQrCode: "QR 공유",
    shareLink: "링크 공유",
    copyLink: "링크 복사",
    checkOutQrCode: "이 QR 코드를 확인하세요!",
  },
};

function QrcodeProfile({ userDetails, className, isOpen, onClose }) {
  const PORTFOLIO = userDetails?.customDomain && userDetails?.customDomainVerified ? `https://${userDetails?.customDomain}` : `https://${userDetails?.username}.dgtportfolio.com`;
  const qrCodeRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = isOpen !== undefined;
  const showModal = isControlled ? isOpen : internalIsOpen;

  // Determine the display language, defaulting to 'en' if not available or supported
  const lang = userDetails?.displayLanguage && translations[userDetails.displayLanguage]
    ? userDetails.displayLanguage
    : 'en';

  const t = (key) => translations[lang][key] || translations.en[key]; // Translation function

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

  const DownloadQRCode = () => {
    if (qrCodeRef.current) {
      const canvas = qrCodeRef.current.querySelector("canvas");
      if (canvas) {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `${userDetails.username}.dgtportfolio.png`;
        link.click();
      }
    }
  };

  const ShareQRCode = () => {
    if (typeof navigator !== "undefined" && navigator.share && qrCodeRef.current) {
      const canvas = qrCodeRef.current.querySelector("canvas");
      if (canvas) {
        canvas.toBlob((blob) => {
          const file = new File(
            [blob],
            `${userDetails.username}.dgtportfolio.png`,
            { type: "image/png" }
          );
          navigator
            .share({
              files: [file],
              title: t("qrCodeProfile"),
              text: t("checkOutQrCode"),
            })
            .catch((error) => console.error(t("sharingFailed"), error));
        });
      }
    } else {
      alert(t("webShareApiUnsupported"));
    }
  };

  const ShareLink = () => {
    const url = PORTFOLIO;

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          url: url,
        })
        .then(() => console.log(t("successfulShare")))
        .catch((error) => console.log(t("errorSharing"), error));
    } else {
      alert(t("shareUnsupported"));
    }
  };

  const copyProfileLink = () => {
    const urlToCopy = PORTFOLIO;
    navigator.clipboard
      .writeText(urlToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Copy failed", err));
  };

  return (
    <>
      <div
        onClick={() => !isControlled && setInternalIsOpen(true)}
        className={`size-10 flex items-center justify-center transition-colors cursor-pointer ${className || "text-cyan-400 border border-cyan-500/30"}`}
        title={t("qrCodeProfile")}
      >
        <QrCode size={22} />
      </div>

      {showModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 relative">

            {/* Header */}
            <div
              dir={userDetails?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}
              className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80"
            >
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100/50 rounded-full text-purple-600">
                  <QrCode size={18} />
                </div>
                <h2 className="text-lg font-bold text-gray-800">
                  {t("qrCodeProfile")}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-gray-200/80 text-gray-500 transition-colors hover:rotate-90 duration-300"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div
              dir={userDetails?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}
              className="p-6 flex flex-col justify-center items-center"
            >
              {/* Hidden High-Res QR for Download */}
              <div className={`hidden`} ref={qrCodeRef}>
                <QRCode
                  value={PORTFOLIO}
                  size={500}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  renderAs="canvas"
                  includeMargin={true}
                  level="H"
                  imageSettings={
                    "/LogoinQrcode.png"
                      ? {
                        src: "/LogoinQrcode.png",
                        x: undefined,
                        y: undefined,
                        height: 80,
                        width: 80,
                        excavate: true,
                      }
                      : {}
                  }
                />
              </div>

              {/* Displayed QR Code */}
              <div className="border border-gray-200 p-3 rounded-xl bg-white shadow-sm mb-6">
                <QRCode
                  id="qrcode"
                  value={PORTFOLIO}
                  size={180}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  renderAs="canvas"
                  includeMargin={true}
                  level="H"
                  imageSettings={
                    "/LogoinQrcode.png"
                      ? {
                        src: "/LogoinQrcode.png",
                        x: undefined,
                        y: undefined,
                        height: 40,
                        width: 40,
                        excavate: true,
                      }
                      : {}
                  }
                />
              </div>

              {/* URL Display */}
              <div
                onClick={copyProfileLink}
                className={`
                     flex items-center justify-between gap-3 w-full
                    px-4 py-3 mb-6 border rounded-lg
                    cursor-pointer transition-all duration-200
                    hover:bg-gray-50/80 active:scale-[0.98] select-none shadow-sm
                    ${copied ? "border-green-500 bg-green-50/50" : "border-gray-200"}
                  `} >
                <div className="flex items-center gap-3 min-w-0">
                  <LinkIcon size={16} className="text-gray-400 shrink-0" />
                  <span className={`text-sm font-medium truncate ${copied ? "text-green-700" : "text-gray-600"}`}>
                    {PORTFOLIO}
                  </span>
                </div>
                {copied ? (
                  <CheckCircle2 size={18} className="text-green-600 animate-in zoom-in duration-300 shrink-0" />
                ) : (
                  <Copy size={18} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0" />
                )}
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  className="flex items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200 transition-all rounded-lg text-gray-700 hover:text-black group"
                  onClick={DownloadQRCode}
                >
                  <Download size={18} className="text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">{t("downloadQrCode")}</span>
                </button>

                <button
                  className="flex items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200 transition-all rounded-lg text-gray-700 hover:text-black group"
                  onClick={ShareQRCode}
                >
                  <QrCode size={18} className="text-green-500 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">{t("shareQrCode")}</span>
                </button>

                <button
                  className="flex items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200 transition-all rounded-lg text-gray-700 hover:text-black group"
                  onClick={ShareLink}
                >
                  <Share2 size={18} className="text-purple-500 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">{t("shareLink")}</span>
                </button>

                <button
                  className="flex items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200 transition-all rounded-lg text-gray-700 hover:text-black group"
                  onClick={copyProfileLink}
                >
                  <Copy size={18} className="text-orange-500 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">{t("copyLink")}</span>
                </button>
              </div>

            </div>
          </div>
          <div className="absolute inset-0 -z-10 cursor-default" onClick={handleClose} />
        </div>,
        document.body
      )}
    </>
  );
}

export default QrcodeProfile;
