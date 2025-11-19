"use client";
import { useEffect, useState, useContext } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { MyContext } from "../Context/MyContext";
import axios from "axios";
import MagicalLoader from "../Components/MagicalLoader";
import Header from "../Components/header";
import { toast } from "react-toastify"


export default function SubscriptionPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const {EmailUser,userDetails} = useContext(MyContext);

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

  if (loading || !plans) return <MagicalLoader />;

  const uiPlans = [
    { name: "Subscribe Monthly", description: "$10 for the month after", price: "$1", period: "/first month", highlight: false },
    { name: "Subscribe 4 Months", description: "Great mid‑term offer", price: "$30", period: "/4 months", highlight: false },
    { name: "Subscribe Yearly", description: "Best value", price: "$60", period: "/year", highlight: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black flex flex-col pb-10 md:pb-0">
      <Header />
      <div className="text-center mt-5 mb-8">
            <h2 className="text-xl md:text-4xl max-w-2xl mx-auto font-bold text-white">Choose the perfect plan for your creative portfolio</h2>
      </div>
      <PayPalScriptProvider
        options={{
          "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
          currency: "USD",
          intent: "subscription",
          vault: true,
        }}
      >
        <div className=" mx-auto  grid grid-cols-1 md:grid-cols-3 gap-8">
          {uiPlans.map((uiPlan, index) => {
            const plan = plans[index];
            if (!plan) return null;

            return (
              <div
                key={index}
                className={`relative p-8 rounded-3xl border transition-transform duration-300 hover:scale-105 shadow-lg ${
              uiPlan.highlight
                ? "bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-cyan-400/50 shadow-lg shadow-cyan-500/20 md:scale-105"
                : "bg-slate-800/50 border-purple-500/20 hover:border-purple-400/50 hover:bg-purple-500/10"
            }`}
              >
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
                  createSubscription={(data, actions) => actions.subscription.create({ plan_id: plan.id })}
                  onApprove={async (data) => {
                    try {
                      await axios.post("/api/subscriptions", {
                        userEmail: EmailUser,
                        planId: plan.id,
                        nameplan: plan.name,
                        subscriptionID: data.subscriptionID,
                      });
                    } catch (err) {
                      console.error("Error saving subscription:", err.response?.data || err.message);
                      alert("An error occurred while saving the subscription. Please try again or contact support.");
                    }
                    window.location.href = "/success"
                  }}
                />
              </div>
            );
          })}
        </div>
      </PayPalScriptProvider>
    </div>
  );
}
