import React, {useRef, useState } from "react";
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

function QrcodeProfile({userDetails,path}) {
  // const PORTFOLIO = `http://${userDetails?.username}.localhost:3000`
  const PORTFOLIO = `https://${userDetails?.username}.dgtportfolio.com`
  // const PORTFOLIO = `https://${userDetails?.username}.dgtportfolio.vercel.app`
  const qrCodeRef = useRef(null);
  const [copied, setCopied] = useState(false);
  

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
              title: "QR Code",
              text: "Check out this QR Code!",
            })
            .catch((error) => console.error("Sharing failed", error));
        });
      }
    } else {
      alert("Your browser doesn't support the Web Share API.");
    }
  };

  const ShareLink = () => {
    const url = PORTFOLIO;

    if (navigator.share) {
      navigator
        .share({
          url: url,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      alert("Share not supported on this browser");
    }
  };
   const copyProfileLink = () => {
    const urlToCopy = PORTFOLIO
    navigator.clipboard.writeText(urlToCopy).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger>
          <div className="flex p-2 rounded-full w-10 cursor-pointer  duration-200  ">
            <QrCode />
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center justify-between">
              <div>QR Code Profile</div>
              <AlertDialogCancel><X /></AlertDialogCancel>
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex flex-col justify-center items-center  ">
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
                 <div className={`p-1.5 rounded-md ${copied ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                    <LinkIcon size={16} />
                 </div>
                 <span className={`text-sm font-medium truncate ${copied ? "text-green-700" : "text-gray-600"}`}>
                  {PORTFOLIO}
                </span>
              </div>

              <div className="shrink-0 pl-2">
                {copied ? (
                  <CheckCircle2 size={20} className="text-green-600 animate-in zoom-in duration-300" />
                ) : (
                  <Copy size={20} className="text-gray-400 hover:text-gray-600" />
                )}
              </div>
               </div>
                <div className="flex flex-row gap-3">
                  <button
                    className="flex items-center justify-center gap-1 p-2 bg-blue-300 hover:bg-blue-400 transition-colors rounded-md my-2 text-black font-medium"
                    onClick={DownloadQRCode}
                  >
                    <Download size={16} />
                    <span>Download QrCode</span>
                  </button>
                  <button
                    className="flex items-center justify-center gap-1 p-2 bg-green-300 hover:bg-green-400 transition-colors rounded-md my-2 text-black font-medium"
                    onClick={ShareQRCode}
                  >
                    <QrCode size={16} />
                    <span>Share Qrcode</span>
                  </button>
                  <button
                    className="flex items-center justify-center gap-1 p-2 bg-yellow-300 hover:bg-yellow-400 transition-colors rounded-md my-2 text-black font-medium"
                    onClick={ShareLink}
                  >
                    <Share2 size={16} />
                    <span>Share Link</span>
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
