"use client";
import { useEffect, useState, useContext } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { MyContext } from "../context/context";
import axios from "axios";
import Header from "../components/LandingPage/header";
import { useToast } from "../components/Toast"
import { Loader } from "../components/Icons";
import { getTranslation } from '../translations/others';

export default function SubscriptionPage() {
  const toast = useToast();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoLoading, setPromoLoading] = useState(false);
  const { EmailUser, userDetails } = useContext(MyContext);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let hasActiveSub = false;
        
        // 1. Check for Active Subscription first
        if (EmailUser) {
          try {
            const res = await axios.get(`/api/subscriptions/user/${EmailUser}`);
            if (res.data && res.data.success) {
              setActiveSubscription(res.data.data);
              hasActiveSub = true;
            }
          } catch (err) {
            console.log("No active subscription found.");
          }
        }

        // 2. Fetch plans ONLY if the user doesn't have an active subscription
        if (!hasActiveSub) {
          const plansRes = await fetch("/api/paypal/plans");
          const plansData = await plansRes.json();
          setPlans(plansData.plans);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [EmailUser]);

  const confirmCancelSubscription = async () => {
    try {
      setActionLoading(true);
      const res = await axios.post(`/api/subscriptions/${activeSubscription._id}/cancel`);
      if (res.data.success) {
        toast.success(t('subscription.cancelSuccess'));
        setActiveSubscription({ ...activeSubscription, status: "CANCELLED" });
        setShowCancelModal(false);
      }
    } catch (err) {
      console.error(err);
      toast.error(t('subscription.cancelFailed'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast.error(t('subscription.promoReq'));
      return;
    }

    try {
      setPromoLoading(true);
      const res = await axios.post("/api/promo/validate", { code: promoCode });
      if (res.data.valid) {
        setAppliedPromo(promoCode);
        setPlans(res.data.plans);
        toast.success(t('subscription.promoApplied'));
      } else {
        toast.error(res.data.msg || t('subscription.invalidPromo'));
        setAppliedPromo(null);
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        toast.error("Too many requests! Please try again later.");
      } else {
        const message =
          error.response?.data?.msg ||
          error.response?.data?.message ||
          "Failed to validate promo code";
        toast.error(message);
      }
      setAppliedPromo(null);
    } finally {
      setPromoLoading(false);
    }
  };

  const currentLang = userDetails?.displayLanguage || "en";
  const t = getTranslation(currentLang);

  const uiPlans = appliedPromo
    ? [
      // Promo Plans: Monthly $1, 6-Month $3, Annual $5
      { name: t('subscription.promoMonthly').name, description: t('subscription.promoMonthly').description, price: "$1", period: t('subscription.promoMonthly').period, highlight: false },
      { name: t('subscription.promo6Month').name, description: t('subscription.promo6Month').description, price: "$3", period: t('subscription.promo6Month').period, highlight: false },
      { name: t('subscription.promoAnnual').name, description: t('subscription.promoAnnual').description, price: "$5", period: t('subscription.promoAnnual').period, highlight: true },
    ]
    : [
      // Standard Plans: Monthly $1, 6-Month $5, Annual $9
      { name: t('subscription.subMonthly').name, description: t('subscription.subMonthly').description, price: "$1", period: t('subscription.subMonthly').period, highlight: false },
      { name: t('subscription.sub6Months').name, description: t('subscription.sub6Months').description, price: "$5", period: t('subscription.sub6Months').period, highlight: false },
      { name: t('subscription.subYearly').name, description: t('subscription.subYearly').description, price: "$9", period: t('subscription.subYearly').period, highlight: true },
    ];


  return (
    <PayPalScriptProvider
      options={{
        "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "subscription",
        vault: true,
      }}
    >
      {(loading || !plans) ? (
        <div>
          <Header lang={userDetails?.displayLanguage} />
          <div className="min-h-screen bg-slate-950 p-6">
          <div className="max-w-6xl mx-auto space-y-12 animate-pulse">
            {/* Promo Section Skeleton */}
            <div className="flex justify-center mb-8">
              <div className="w-80 h-12 bg-slate-800 rounded-full"></div>
            </div>
            {/* Plans Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-6">
                  <div className="h-8 w-32 bg-slate-800 rounded"></div>
                  <div className="h-4 w-full bg-slate-800/60 rounded"></div>
                  <div className="h-12 w-28 bg-slate-800 rounded"></div>
                  <div className="h-24 w-full bg-slate-800/40 rounded-xl"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black flex flex-col pb-10 md:pb-0">
          <Header lang={userDetails?.displayLanguage} />
          {/* Promo Code Section */}
          {(!activeSubscription || activeSubscription.status !== "ACTIVE") && (
            <div dir={userDetails?.displayLanguage === 'ar' ? 'rtl' : 'ltr'} className="flex flex-col items-center justify-center my-8 gap-2">
              <div className="fle hidden items-center shadow-lg shadow-purple-500/10 rounded-full ">
                <input
                  type="text"
                  placeholder={t('subscription.placeholder')}
                  maxLength={30}
                  className={`w-56 md:w-64 bg-slate-800/80 text-white border border-r-0 border-purple-500/30 
                    ${userDetails?.displayLanguage === 'ar' ? 'rounded-r-full' : 'rounded-l-full'} px-6 py-3 focus:outline-none focus:border-purple-500  placeholder-gray-400 transition-all`}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button
                  onClick={handleApplyPromo}
                  disabled={promoLoading}
                  className={`bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-8 py-3 
                    ${userDetails?.displayLanguage === 'ar' ? 'rounded-l-full' : 'rounded-r-full'} font-bold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 ${promoLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {promoLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader className="animate-spin" /> {t('subscription.verifyingBtn')}
                    </div>
                  ) : (
                    t('subscription.applyBtn')
                  )}
                </button>
              </div>
              {appliedPromo && (
                <p className="text-green-400 text-sm font-medium animate-pulse">
                  ✓ Code {appliedPromo} applied
                </p>
              )}
            </div>
          )}

          {activeSubscription && activeSubscription.status === "ACTIVE" ? (
             <div className="max-w-2xl mx-auto w-full px-6 mb-12 mt-10">
               <div className="bg-gradient-to-br from-purple-900/40 to-slate-900/60 border border-purple-500/30 rounded-3xl p-8 backdrop-blur-sm shadow-xl relative overflow-hidden text-center md:text-start">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
                 
                 <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                   <div>
                     <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-bold tracking-wider mb-4">
                       {t('subscription.activeSubscription')}
                     </span>
                     <h2 className="text-3xl font-bold text-white mb-2">{activeSubscription.nameplan}</h2>
                     <p className="text-gray-400 max-w-sm">
                       {t('subscription.portfolioVisible')}
                     </p>
                     
                     {activeSubscription.expiresAt && (
                       <p className="text-sm text-purple-300 mt-4 font-medium">
                         {t('subscription.renewalDate')} {new Date(activeSubscription.expiresAt).toLocaleDateString()}
                       </p>
                     )}
                   </div>
                   
                   <div className="flex-shrink-0">
                     <button 
                        onClick={() => setShowCancelModal(true)}
                        disabled={actionLoading}
                        className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-400 rounded-full font-semibold transition-all shadow-lg shadow-red-500/10 disabled:opacity-50 flex items-center gap-2"
                     >
                        {actionLoading && <Loader className="w-4 h-4 animate-spin" />}
                        {t('subscription.cancelSub')}
                     </button>
                   </div>
                 </div>
               </div>
             </div>
          ) : (
             <div dir={userDetails?.displayLanguage === 'ar' ? 'rtl' : 'ltr'} className="mx-auto grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-8">
               {uiPlans.map((uiPlan, index) => {
                 const plan = plans[index];
                 if (!plan) return null;

                 return (
                   <div key={index} className={`relative p-8 rounded-3xl border transition-transform duration-300 hover:scale-105 shadow-lg ${uiPlan.highlight
                     ? "bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-cyan-400/50 shadow-lg shadow-cyan-500/20 md:scale-105"
                     : "bg-slate-800/50 border-purple-500/20 hover:border-purple-400/50 hover:bg-purple-500/10"
                     }`}>
                     {uiPlan.highlight && (
                       <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                         <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-black px-4 py-1 rounded-full text-sm font-semibold">
                           {t('subscription.recommended')}
                         </span>
                       </div>
                     )}
                     <h3 className="text-2xl font-extrabold mb-2 text-white">{uiPlan.name}</h3>
                     <p className="text-gray-500 mb-6">{uiPlan.description}</p>
                     <div className="mb-8">
                       <div className="flex items-baseline gap-2">
                         <span className="text-5xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                           {uiPlan.price}
                         </span>
                         <span className="text-gray-400">{uiPlan.period}</span>
                       </div>
                     </div>
                     <div className="relative w-full min-h-[100px]">
                       <div className="absolute inset-0 bg-slate-700/30 animate-pulse rounded-lg" />
                       <div className="relative z-10">
                         <PayPalButtons
                           style={{ layout: "vertical", color: "gold", shape: "rect", label: "subscribe", tagline: false }}
                           createSubscription={(data, actions) => { return actions.subscription.create({ plan_id: plan.id, application_context: { shipping_preference: "NO_SHIPPING" } }) }}
                           onError={(err) => console.error("PayPal Error:", err)}
                           onApprove={async (data) => {
                             try {
                               await axios.post("/api/subscriptions", {
                                 userEmail: EmailUser,
                                 planId: plan.id,
                                 nameplan: plan.name,
                                 subscriptionID: data.subscriptionID,
                                 promoCode: appliedPromo,
                               });
                             } catch (err) {
                               console.error("Error saving subscription:", err.response?.data || err.message);
                               alert("An error occurred while saving the subscription. Please try again or contact support.");
                             }
                             window.location.href = "/success"
                           }} />
                       </div>
                     </div>
                   </div>
                 );
               })}
             </div>
          )}
          
          {showCancelModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
              <div 
                dir={userDetails?.displayLanguage === 'ar' ? 'rtl' : 'ltr'} 
                className="bg-slate-900 border border-red-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-red-500/20 transform animate-in zoom-in-95 duration-200"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6 mx-auto">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white text-center mb-2">
                   {t('subscription.confirmCancel')}
                 </h3>
                 <p className="text-gray-400 text-center mb-8">
                   {t('subscription.cancelWarning')}
                 </p>
                
                <div className="flex flex-col gap-3">
                   <button 
                     onClick={confirmCancelSubscription}
                     disabled={actionLoading}
                     className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-50"
                   >
                     {actionLoading && <Loader className="w-5 h-5 animate-spin" />}
                     {t('subscription.yesCancel')}
                   </button>
                   <button 
                     onClick={() => setShowCancelModal(false)}
                     disabled={actionLoading}
                     className="w-full px-6 py-3 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-full font-bold transition-all disabled:opacity-50"
                   >
                     {t('subscription.keepSub')}
                   </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </PayPalScriptProvider>
  );
}
