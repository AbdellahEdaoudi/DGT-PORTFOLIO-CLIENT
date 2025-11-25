"use client";
import { useEffect, useState, useContext } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { MyContext } from "../Context/MyContext";
import axios from "axios";
import MagicalLoader from "../Components/MagicalLoader";
import Header from "../Components/header";
import { toast } from "react-toastify"
import { Loader } from "lucide-react";

export default function SubscriptionPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoLoading, setPromoLoading] = useState(false); // ← loading خاص بالبرومو
  const { EmailUser, userDetails } = useContext(MyContext);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);

   useEffect(() => {
    fetch("/api/paypal/plans")
      .then((res) => res.json())
      .then((data) => {
        setPlans(data.plans);
        setLoading(false);
      }).catch((err) => {
        console.error("Error fetching plans:", err);
        setLoading(false);
      });
  }, []);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    try {
      setPromoLoading(true);
      const res = await axios.post("/api/promo/validate", { code: promoCode });
      if (res.data.valid) {
        setAppliedPromo(promoCode);
        setPlans(res.data.plans);
        toast.success(`Promo code "${promoCode}" applied!`);
      } else {
        toast.error(res.data.msg || "Invalid promo code");
        setAppliedPromo(null);
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        toast.error(
          <p className="flex gap-3 items-center">
            Too many requests! Please try again later.
          </p>,
          { autoClose: 3000 }
        );
      } else {
        const message =
          error.response?.data?.msg ||
          error.response?.data?.message ||
          "Failed to validate promo code";
        toast.error(message);
      }
      setAppliedPromo(null);
    } finally {
      setPromoLoading(false); // ← انتهاء التحميل
    }
  };

  if (loading || !plans) return <MagicalLoader />;

  const uiPlans = appliedPromo
  ? [
      { name: "Promo Monthly", description: "Special promo offer", price: "$1", period: "/month", highlight: false },
      { name: "Promo 6-Month", description: "Great value for 6 months", price: "$5", period: "/6 months", highlight: false },
      { name: "Promo Annual", description: "Best deal for the year", price: "$9", period: "/year", highlight: true },
    ]
  : [
      { name: "Subscribe Monthly", description: "$10 for the month after", price: "$1", period: "/first month", highlight: false },
      { name: "Subscribe 4 Months", description: "Great mid‑term offer", price: "$30", period: "/4 months", highlight: false },
      { name: "Subscribe Yearly", description: "Best value", price: "$60", period: "/year", highlight: true },
    ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black flex flex-col pb-10 md:pb-0">
      <Header />
      {/* Promo Code Section */}
      <div className="flex flex-col items-center justify-center my-8 gap-2">
        <div className="flex items-center shadow-lg shadow-purple-500/10 rounded-full ">
          <input
            type="text"
            placeholder="Enter Promo Code"
            maxLength={30}
            className="w-56 md:w-64 bg-slate-800/80 text-white border border-r-0 border-purple-500/30 rounded-l-full px-6 py-3 focus:outline-none focus:border-purple-500  placeholder-gray-400 transition-all"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <button
            onClick={handleApplyPromo}
            disabled={promoLoading}
            className={`bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-8 py-3 rounded-r-full font-bold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 ${promoLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {promoLoading ? (
              <div className="flex items-center gap-2">
                <Loader className="animate-spin" /> Verifying...
              </div>
            ) : (
              "Apply"
            )}
          </button>
        </div>
        {appliedPromo && (
          <p className="text-green-400 text-sm font-medium animate-pulse">
            ✓ Code {appliedPromo} applied
          </p>
        )}
      </div>

      <PayPalScriptProvider
        options={{
          "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
          currency: "USD",
          intent: "subscription",
          vault: true,
        }}
      >
        <div className="mx-auto grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                      Recommended
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
                <PayPalButtons
                  style={{ layout: "vertical", color: "gold", shape: "rect", label: "subscribe", tagline: false }}
                  createSubscription={(data, actions) => {return actions.subscription.create({plan_id: plan.id,application_context: {shipping_preference: "NO_SHIPPING"}})}}
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
                  }}/>
              </div>
            );
          })}
        </div>
      </PayPalScriptProvider>
    </div>
  );
}
