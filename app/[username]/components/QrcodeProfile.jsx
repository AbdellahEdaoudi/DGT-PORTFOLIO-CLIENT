import React, { useRef, useState } from "react";
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
import QRCode from "qrcode.react";
import { CheckCircle2, Copy, Download, LinkIcon, QrCode, Share2, X } from "lucide-react";

// Translation object for all supported languages
const translations = {
  en: {
    qrCodeProfile: "QR Code Profile",
    downloadQrCode: "Download QRCode",
    shareQrCode: "Share Qrcode",
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
    qrCodeProfile: "Profil code QR",
    downloadQrCode: "Télécharger le code QR",
    shareQrCode: "Partager le code QR",
    shareLink: "Partager le lien",
    copyLink: "Copier le lien",
    checkOutQrCode: "Découvrez ce code QR !",
    sharingFailed: "Échec du partage",
    webShareApiUnsupported: "Votre navigateur ne prend pas en charge l'API Web Share.",
    successfulShare: "Partage réussi",
    errorSharing: "Erreur de partage",
    shareUnsupported: "Le partage n'est pas pris en charge sur ce navigateur",
  },
  es: {
    qrCodeProfile: "Perfil de código QR",
    downloadQrCode: "Descargar código QR",
    shareQrCode: "Compartir código QR",
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
    qrCodeProfile: "ملف تعريف رمز الاستجابة السريعة",
    downloadQrCode: "تحميل رمز الاستجابة السريعة",
    shareQrCode: "مشاركة رمز الاستجابة السريعة",
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
    qrCodeProfile: "QR-Code-Profil",
    downloadQrCode: "QR-Code herunterladen",
    shareQrCode: "QR-Code teilen",
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
    qrCodeProfile: "Профиль QR-кода",
    downloadQrCode: "Скачать QR-код",
    shareQrCode: "Поделиться QR-кодом",
    shareLink: "Поделиться ссылкой",
    copyLink: "Скопировать ссылку",
    checkOutQrCode: "Посмотрите этот QR-код!",
    sharingFailed: "Ошибка при обмене",
    webShareApiUnsupported: "Ваш браузер не поддерживает Web Share API.",
    successfulShare: "Успешный обмен",
    errorSharing: "Ошибка при обмене",
    shareUnsupported: "Обмен не поддерживается в этом браузере",
  },
  ja: {
    qrCodeProfile: "QRコードプロフィール",
    downloadQrCode: "QRコードをダウンロード",
    shareQrCode: "QRコードを共有",
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
    qrCodeProfile: "二维码资料",
    downloadQrCode: "下载二维码",
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
};

function QrcodeProfile({ userDetails }) {
  const PORTFOLIO = `https://${userDetails?.username}.dgtportfolio.com`;
  const qrCodeRef = useRef(null);
  const [copied, setCopied] = useState(false);

  // Determine the display language, defaulting to 'en' if not available or supported
  const lang = userDetails?.displayLanguage && translations[userDetails.displayLanguage]
    ? userDetails.displayLanguage
    : 'en';

  const t = (key) => translations[lang][key] || translations.en[key]; // Translation function

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
    if (navigator.share && qrCodeRef.current) {
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

    if (navigator.share) {
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
    navigator.clipboard.writeText(urlToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger>
          <div className="flex p-2 rounded-full w-10   duration-200  ">
            <QrCode />
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle 
            dir={userDetails?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}
            className="flex items-center justify-between">
              <div>{t("qrCodeProfile")}</div>
              <AlertDialogCancel><X /></AlertDialogCancel>
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div 
              dir={userDetails?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}
              className="flex flex-col justify-center items-center  ">
                <div className={`mb-6 hidden`} ref={qrCodeRef}>
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
                <div className="border-2 rounded-md ">
                  <QRCode
                    id="qrcode"
                    value={PORTFOLIO}
                    size={200}
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
                            height: 50,
                            width: 50,
                            excavate: true,
                          }
                        : {}
                    }
                  />
                </div>
                {/* // Copy Link */}
                <div
                  onClick={copyProfileLink}
                  className={`
                     flex items-center justify-between gap-2 mt-4
                    p-3 mb-4 border rounded-lg
                    cursor-pointer transition-all duration-200
                    hover:bg-gray-50 active:scale-[0.98] select-none
                    ${copied ? "border-green-500 bg-green-50/50" : "border-gray-200"}
                  `} >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-1 rounded-md ${copied ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                      <LinkIcon size={16} />
                    </div>
                    <span className={`text-sm font-medium truncate ${copied ? "text-green-700" : "text-gray-600"}`}>
                      {PORTFOLIO.split("//")[1]}
                    </span>
                  </div>

                  <div className="shrink-0 pl-1">
                    {copied ? (
                      <CheckCircle2 size={20} className="text-green-600 animate-in zoom-in duration-300" />
                    ) : (
                      <Copy size={20} className="text-gray-400 hover:text-gray-600" />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 justify-center gap-2 text-xs md:text-sm">
                  <button
                    className="flex items-center justify-center gap-1 p-2 bg-blue-300 hover:bg-blue-400 transition-colors rounded-md my-2 text-black font-medium"
                    onClick={DownloadQRCode}
                  >
                    <Download size={16} />
                    <span>{t("downloadQrCode")}</span>
                  </button>
                  <button
                    className="flex items-center justify-center gap-1 p-2 bg-green-300 hover:bg-green-400 transition-colors rounded-md my-2 text-black font-medium"
                    onClick={ShareQRCode}
                  >
                    <QrCode size={16} />
                    <span>{t("shareQrCode")}</span>
                  </button>

                  <button
                    className="flex items-center justify-center gap-1 p-2 bg-yellow-300 hover:bg-yellow-400 transition-colors rounded-md my-2 text-black font-medium"
                    onClick={ShareLink}
                  >
                    <Share2 size={16} />
                    <span>{t("shareLink")}</span>
                  </button>
                  <button
                    className="flex items-center justify-center gap-1 p-2 bg-orange-300 hover:bg-orange-400 transition-colors rounded-md my-2 text-black font-medium"
                    onClick={copyProfileLink}
                  >
                    <Copy size={16} />
                    <span>{t("copyLink")}</span>
                  </button>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {/* <AlertDialogCancel>Close</AlertDialogCancel> */}
            {/* <AlertDialogAction>Continue</AlertDialogAction> */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default QrcodeProfile;
