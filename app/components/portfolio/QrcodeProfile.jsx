import React, { useRef, useState, useEffect } from "react";
import QRCode from "qrcode.react";
import { CheckCircle2, Copy, Download, LinkIcon, QrCode, Share2, X } from "../Icons";
import { createPortal } from "react-dom";
import { getTranslation } from "../../translations/portfolio";

function QrcodeProfile({ userDetails, className, isOpen, onClose }) {
  const PORTFOLIO = userDetails?.customDomain && userDetails?.customDomainVerified ? `https://${userDetails?.customDomain}` : `https://${userDetails?.username}.dgtportfolio.com`;
  const PORTFOLIO_2 = `https://dgtportfolio.com/dp/${userDetails?.username}`;

  const qrCodeRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [copied2, setCopied2] = useState(false);
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = isOpen !== undefined;
  const showModal = isControlled ? isOpen : internalIsOpen;

  // Translation function using the central system
  const t = getTranslation(userDetails?.displayLanguage || 'en');
  const tp = (key) => t(`qrcode.${key}`);

  // Preload the QR code logo to ensure it appears instantly
  useEffect(() => {
    const img = new Image();
    img.src = "/LogoinQrcode.png";
  }, []);

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
              title: tp("qrCodeProfile"),
              text: tp("checkOutQrCode"),
            })
            .catch((error) => console.error(tp("sharingFailed"), error));
        });
      }
    } else {
      alert(tp("webShareApiUnsupported"));
    }
  };

  const ShareLink = () => {
    const url = PORTFOLIO;

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          url: url,
        })
        .then(() => console.log(tp("successfulShare")))
        .catch((error) => console.log(tp("errorSharing"), error));
    } else {
      alert(tp("shareUnsupported"));
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

  const copyProfileLink2 = () => {
    const urlToCopy = PORTFOLIO_2;
    navigator.clipboard
      .writeText(urlToCopy)
      .then(() => {
        setCopied2(true);
        setTimeout(() => setCopied2(false), 2000);
      })
      .catch((err) => console.error("Copy failed", err));
  };

  return (
    <>
      <div
        onClick={() => !isControlled && setInternalIsOpen(true)}
        className={`size-10 flex items-center justify-center transition-colors cursor-pointer ${className || "text-cyan-400 border border-cyan-500/30"}`}
        title={tp("qrCodeProfile")}
      >
        <QrCode size={22} />
      </div>

      {showModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 relative">

            {/* Header */}
            <div
              dir={userDetails?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}
              className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/80"
            >
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100/50 rounded-full text-purple-600">
                  <QrCode size={18} />
                </div>
                <h2 className="text-lg font-bold text-gray-800">
                  {tp("qrCodeProfile")}
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
              className="p-4 flex flex-col justify-center items-center"
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
              <div className="border border-gray-200 p-2 rounded-xl bg-white shadow-sm mb-4">
                <QRCode
                  id="qrcode"
                  value={PORTFOLIO}
                  size={150}
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
                    px-3 py-2 mb-2 border rounded-lg
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

              {/* URL Display 2 */}
              <div
                onClick={copyProfileLink2}
                className={`
                     flex items-center justify-between gap-3 w-full
                    px-3 py-2 mb-4 border rounded-lg
                    cursor-pointer transition-all duration-200
                    hover:bg-gray-50/80 active:scale-[0.98] select-none shadow-sm
                    ${copied2 ? "border-green-500 bg-green-50/50" : "border-gray-200"}
                  `} >
                <div className="flex items-center gap-3 min-w-0">
                  <LinkIcon size={16} className="text-gray-400 shrink-0" />
                  <span className={`text-sm font-medium truncate ${copied2 ? "text-green-700" : "text-gray-600"}`}>
                    {PORTFOLIO_2}
                  </span>
                </div>
                {copied2 ? (
                  <CheckCircle2 size={18} className="text-green-600 animate-in zoom-in duration-300 shrink-0" />
                ) : (
                  <Copy size={18} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0" />
                )}
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  className="flex items-center justify-center gap-2 p-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200 transition-all rounded-lg text-gray-700 hover:text-black group"
                  onClick={DownloadQRCode}
                >
                  <Download size={18} className="text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">{tp("downloadQrCode")}</span>
                </button>

                <button
                  className="flex items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200 transition-all rounded-lg text-gray-700 hover:text-black group"
                  onClick={ShareQRCode}
                >
                  <QrCode size={18} className="text-green-500 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">{tp("shareQrCode")}</span>
                </button>

                <button
                  className="flex items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200 transition-all rounded-lg text-gray-700 hover:text-black group"
                  onClick={ShareLink}
                >
                  <Share2 size={18} className="text-purple-500 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">{tp("shareLink")}</span>
                </button>

                <button
                  className="flex items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200 transition-all rounded-lg text-gray-700 hover:text-black group"
                  onClick={copyProfileLink}
                >
                  <Copy size={18} className="text-orange-500 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">{tp("copyLink")}</span>
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
