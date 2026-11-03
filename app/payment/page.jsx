"use client";
import { useState, useContext, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { MyContext } from "../context/context";
import axios from "axios";
import { handleApiError } from "../utils/apiErrorHandler";
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
import Header from "../components/LandingPage/header";
import { useToast } from "../components/Toast";
import { getTranslation } from "../translations/others";
import { Check } from "../components/lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PaymentPage() {
  const toast = useToast();
  const { data, loadingAll } = useContext(MyContext);
  const userDetails = data?.user;
  const userPayment = data?.payment;
  const [loading, setLoading] = useState(false);
  const currentLang = userDetails?.displayLanguage || "en";
  const [dictionary, setDictionary] = useState({});

  useEffect(() => {
    getTranslation(currentLang).then((dict) => setDictionary(dict || {}));
  }, [currentLang]);

  const content = dictionary?.payment || {};
  const successContent = dictionary?.success || {};

  const ERROR_MESSAGES = {
    UNAUTHORIZED: content.errors?.unauthorized,
    ALREADY_PAID: content.errors?.alreadyPaid,
    ORDER_ALREADY_PROCESSED: content.errors?.orderAlreadyProcessed,
    PAYPAL_CAPTURE_FAILED: content.errors?.paypalCaptureFailed,
    PAYPAL_AUTH_FAILED: content.errors?.paypalAuthFailed,
    PAYPAL_GATEWAY_ERROR: content.errors?.paypalGatewayError,
    PAYMENT_NOT_COMPLETED: content.errors?.paymentNotCompleted,
    CANNOT_VERIFY_AMOUNT: content.errors?.cannotVerifyAmount,
    INVALID_PAYMENT_AMOUNT: content.errors?.invalidPaymentAmount,
    SERVER_UNREACHABLE: content.errors?.serverUnreachable,
    SERVER_ERROR: content.errors?.serverError,
    MISSING_ORDER_ID: content.errors?.serverError,
  };

  return (
    <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID, currency: "USD" }}>
      {loadingAll ? (
        <div className="min-h-screen bg-slate-950 flex flex-col">
          <Header lang={userDetails?.displayLanguage} />
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-3xl bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-6 animate-pulse">
              <div className="h-8 w-32 bg-slate-800 rounded"></div>
              <div className="h-4 w-full bg-slate-800/60 rounded"></div>
              <div className="h-12 w-28 bg-slate-800 rounded"></div>
              <div className="h-24 w-full bg-slate-800/40 rounded-xl"></div>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
          <div className="relative flex flex-col items-center justify-center p-10 md:p-14 bg-slate-900/60 border border-cyan-500/20 rounded-3xl shadow-[0_0_40px_rgba(6,182,212,0.1)] backdrop-blur-md max-w-lg w-full text-center">
            <div className="relative bg-white rounded-full w-32 h-32 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full animate-[spin_3s_linear_infinite]"></div>
              <div className="absolute inset-2 border-4 border-purple-500/30 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
              <div className="absolute inset-4 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <Image src="/Logowbg.png" alt="Platform Logo" width={80} height={80} className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" priority />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
              {content.processingPayment}
            </h2>
            <p className="text-slate-400 leading-relaxed">
              {content.processingDescription || "Securely confirming your payment with the gateway. This process takes a few seconds."}
            </p>
            <div className="mt-8 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm font-medium">
                {content.processingWarning || "⚠️ Please do not close this page or go back to avoid payment issues."}
              </p>
            </div>
          </div>
        </div>
      ) : userPayment && userPayment.status === "ACTIVE" ? (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black flex flex-col">
          <Header lang={userDetails?.displayLanguage} />
          <div dir={userDetails?.displayLanguage === "ar" ? "rtl" : "ltr"} className="flex-1 flex items-center justify-center w-full px-4 sm:px-6 py-6">
            <div className="relative w-full max-w-lg p-6 sm:p-10 rounded-3xl border shadow-2xl bg-slate-800/80 border-emerald-500/40 backdrop-blur-md text-center overflow-hidden">
              <div className="flex justify-center mb-6 relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse"></div>
                <div className="relative w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center border-2 border-emerald-400/50 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                  <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 drop-shadow-md tracking-tight">
                {content.activePayment || (currentLang === "ar" ? "خطة مدى الحياة مفعلة" : "LIFETIME PLAN ACTIVE")}
              </h3>

              <p className="text-slate-300 text-sm sm:text-base mb-8 leading-relaxed">
                {content.portfolioVisible || (currentLang === "ar" ? "البورتفوليو الخاص بك مرئي حالياً للزوار مع وصول شامل مدى الحياة." : "Your portfolio is currently visible to visitors with full lifetime access.")}
              </p>

              <div className="w-full p-5 bg-slate-900/50 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center mb-8">
                <span className="text-emerald-400 text-lg sm:text-xl font-bold uppercase tracking-wider mb-2">
                  {content.lifetime?.name}
                </span>
                <span className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  {content.unlimitedAccess || "Unlimited Access"}
                </span>
              </div>

              <Link href={`/dp/${userDetails?.username || ""}`}>
                <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3.5 px-6 rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] transition-all duration-300">
                  {successContent.goToPortfolio || (currentLang === "ar" ? "عرض البورتفوليو الخاص بي" : "View My Portfolio")}
                </button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black flex flex-col">
          <Header lang={userDetails?.displayLanguage} />
          <div dir={userDetails?.displayLanguage === "ar" ? "rtl" : "ltr"} className="flex-1 flex items-center justify-center w-full px-4 sm:px-6 py-8 sm:py-12">
            <div className="relative w-full max-w-4xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-black px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap shadow-md">
                  {content.bestValue || "Best Value"}
                </span>
              </div>

              <div className="rounded-3xl border shadow-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-cyan-400/50 shadow-cyan-500/20 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Left: Price & CTA */}
                  <div className="p-8 pt-10 flex flex-col justify-center border-b md:border-b-0 md:border-r border-cyan-400/20">
                    <h3 className="text-2xl font-extrabold mb-2 text-white">
                      {content.lifetime?.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-6">
                      {content.lifetime?.description}
                    </p>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                          {currentLang === "ar" ? "١٠٠$" : "$100"}
                        </span>
                        <span className="text-gray-400 text-lg">
                          {content.lifetime?.period}
                        </span>
                      </div>
                    </div>

                    <div className="relative w-full min-h-[90px]">
                      <div className="absolute inset-0 bg-slate-700/30 animate-pulse rounded-lg" />
                      <div className="relative z-10">
                        <PayPalButtons
                          style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              intent: "CAPTURE",
                              application_context: { shipping_preference: "NO_SHIPPING" },
                              purchase_units: [{ description: "Digital SaaS Lifetime Access - No Physical Shipping",
                              amount: { currency_code: "USD", value: "100" } }]
                            });
                          }}
                          onError={() => { toast.error(content.paymentFailed); }}
                          onApprove={async (data) => {
                            if (loading) return;
                            setLoading(true);
                            try {
                              toast.info(content.processingPayment);
                              await axios.post(`${SERVER_URL}/api/payment`, { orderId: data.orderID }, { withCredentials: true });
                              toast.success(content.purchaseSuccess);
                              window.location.href = "/success";
                            } catch (err) {
                              const code = err.response?.data?.code;
                              const msg = ERROR_MESSAGES[code] || content.errors?.serverError;
                              await handleApiError({ error: err, defaultErrorMsg: msg, toast });
                            } finally {
                              setLoading(false);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right: Features grid */}
                  <div className="p-8 pt-10 bg-slate-950/30 flex flex-col justify-center">
                    <p className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-4">
                      {content.whatsIncluded || "What's included"}
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                      {(content.features || []).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm leading-snug">
                          <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PayPalScriptProvider>
  );
}
