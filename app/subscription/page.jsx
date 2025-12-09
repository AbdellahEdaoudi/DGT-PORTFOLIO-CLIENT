"use client";
import { useEffect, useState, useContext } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { MyContext } from "../Context/MyContext";
import axios from "axios";
import MagicalLoader from "../Components/MagicalLoader";
import Header from "../Components/header";
import { toast } from "react-toastify"
import { Loader } from "lucide-react";

const plansTranslations = {
  en: {
    promoMonthly: { name: "Promo Monthly", description: "Special promo offer", period: "/month" },
    promo6Month: { name: "Promo 6-Month", description: "Great value for 6 months", period: "/6 months" },
    promoAnnual: { name: "Promo Annual", description: "Best deal for the year", period: "/year" },
    subMonthly: { name: "Subscribe Monthly", description: "$10 for the month after", period: "/first month" },
    sub4Months: { name: "Subscribe 4 Months", description: "Great mid‑term offer", period: "/4 months" },
    subYearly: { name: "Subscribe Yearly", description: "Best value", period: "/year" },
    recommended: "Recommended",
    placeholder: "Promo Code",
    applyBtn: "Apply",
    verifyingBtn: "Verifying..."
  },
  fr: {
    promoMonthly: { name: "Promo Mensuel", description: "Offre promotionnelle spéciale", period: "/mois" },
    promo6Month: { name: "Promo 6 Mois", description: "Excellente valeur pour 6 mois", period: "/6 mois" },
    promoAnnual: { name: "Promo Annuelle", description: "Meilleure offre de l'année", period: "/an" },
    subMonthly: { name: "Abonnement Mensuel", description: "10 $ pour le mois suivant", period: "/premier mois" },
    sub4Months: { name: "Abonnement 4 Mois", description: "Superbe offre à moyen terme", period: "/4 mois" },
    subYearly: { name: "Abonnement Annuel", description: "Meilleure valeur", period: "/an" },
    recommended: "Recommandé",
    placeholder: "Code promo",
    applyBtn: "Appliquer",
    verifyingBtn: "Vérification..."
  },
  ar: {
    promoMonthly: { name: "عرض شهري", description: "عرض ترويجي خاص", period: "/شهر" },
    promo6Month: { name: "عرض 6 أشهر", description: "قيمة رائعة لمدة 6 أشهر", period: "/6 أشهر" },
    promoAnnual: { name: "عرض سنوي", description: "أفضل صفقة لهذا العام", period: "/سنة" },
    subMonthly: { name: "اشتراك شهري", description: "10 دولارات للشهر التالي", period: "/الشهر الأول" },
    sub4Months: { name: "اشتراك 4 أشهر", description: "عرض متوسط المدى رائع", period: "/4 أشهر" },
    subYearly: { name: "اشتراك سنوي", description: "أفضل قيمة", period: "/سنة" },
    recommended: "موصى به",
    placeholder: "رمز ترويجي",
    applyBtn: "تطبيق",
    verifyingBtn: "جار التحقق..."
  },
  de: {
    promoMonthly: { name: "Promo Monatlich", description: "Spezielles Promo-Angebot", period: "/Monat" },
    promo6Month: { name: "Promo 6 Monate", description: "Toller Wert für 6 Monate", period: "/6 Monate" },
    promoAnnual: { name: "Promo Jährlich", description: "Bestes Angebot des Jahres", period: "/Jahr" },
    subMonthly: { name: "Monatsabo", description: "10 $ für den Monat danach", period: "/erster Monat" },
    sub4Months: { name: "4-Monats-Abo", description: "Tolles mittelfristiges Angebot", period: "/4 Monate" },
    subYearly: { name: "Jahresabo", description: "Bester Wert", period: "/Jahr" },
    recommended: "Empfohlen",
    placeholder: "Promo-Code",
    applyBtn: "Anwenden",
    verifyingBtn: "Überprüfen..."
  },
  ru: {
    promoMonthly: { name: "Промо ежемесячно", description: "Специальное промо предложение", period: "/месяц" },
    promo6Month: { name: "Промо 6 месяцев", description: "Отличная цена за 6 месяцев", period: "/6 месяцев" },
    promoAnnual: { name: "Промо ежегодно", description: "Лучшая сделка года", period: "/год" },
    subMonthly: { name: "Подписка на месяц", description: "10 $ за следующий месяц", period: "/первый месяц" },
    sub4Months: { name: "Подписка на 4 месяца", description: "Отличное среднесрочное предложение", period: "/4 месяца" },
    subYearly: { name: "Подписка на год", description: "Лучшая цена", period: "/год" },
    recommended: "Рекомендуется",
    placeholder: "Промокод",
    applyBtn: "Применить",
    verifyingBtn: "Проверка..."
  },
  ja: {
    promoMonthly: { name: "月額プロモ", description: "特別プロモオファー", period: "/月" },
    promo6Month: { name: "6ヶ月プロモ", description: "6ヶ月間のお得なプラン", period: "/6ヶ月" },
    promoAnnual: { name: "年間プロモ", description: "年間ベストディール", period: "/年" },
    subMonthly: { name: "月額サブスクリプション", description: "翌月10ドル", period: "/初月" },
    sub4Months: { name: "4ヶ月サブスクリプション", description: "中期のお得なオファー", period: "/4ヶ月" },
    subYearly: { name: "年間サブスクリプション", description: "ベストバリュー", period: "/年" },
    recommended: "おすすめ",
    placeholder: "プロモーションコード",
    applyBtn: "適用",
    verifyingBtn: "確認中..."
  },
  zh: {
    promoMonthly: { name: "月度促销", description: "特别促销优惠", period: "/月" },
    promo6Month: { name: "6个月促销", description: "6个月超值优惠", period: "/6个月" },
    promoAnnual: { name: "年度促销", description: "年度最佳交易", period: "/年" },
    subMonthly: { name: "月度订阅", description: "下个月10美元", period: "/首月" },
    sub4Months: { name: "4个月订阅", description: "绝佳的中期优惠", period: "/4个月" },
    subYearly: { name: "年度订阅", description: "最佳价值", period: "/年" },
    recommended: "推荐",
    placeholder: "促销代码",
    applyBtn: "应用",
    verifyingBtn: "验证中..."
  },
  es: {
    promoMonthly: { name: "Promo Mensual", description: "Oferta promocional especial", period: "/mes" },
    promo6Month: { name: "Promo 6 Meses", description: "Gran valor por 6 meses", period: "/6 meses" },
    promoAnnual: { name: "Promo Anual", description: "Mejor oferta del año", period: "/año" },
    subMonthly: { name: "Suscripción Mensual", description: "$10 para el mes siguiente", period: "/primer mes" },
    sub4Months: { name: "Suscripción 4 Meses", description: "Gran oferta a medio plazo", period: "/4 meses" },
    subYearly: { name: "Suscripción Anual", description: "Mejor valor", period: "/año" },
    recommended: "Recomendado",
    placeholder: "Código promocional",
    applyBtn: "Aplicar",
    verifyingBtn: "Verificando..."
  }
};

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

  const currentLang = userDetails?.displayLanguage || "en";
  const t = plansTranslations[currentLang] || plansTranslations["en"];

  const uiPlans = appliedPromo
    ? [
      { name: t.promoMonthly.name, description: t.promoMonthly.description, price: "$1", period: t.promoMonthly.period, highlight: false },
      { name: t.promo6Month.name, description: t.promo6Month.description, price: "$5", period: t.promo6Month.period, highlight: false },
      { name: t.promoAnnual.name, description: t.promoAnnual.description, price: "$9", period: t.promoAnnual.period, highlight: true },
    ]
    : [
      { name: t.subMonthly.name, description: t.subMonthly.description, price: "$1", period: t.subMonthly.period, highlight: false },
      { name: t.sub4Months.name, description: t.sub4Months.description, price: "$30", period: t.sub4Months.period, highlight: false },
      { name: t.subYearly.name, description: t.subYearly.description, price: "$60", period: t.subYearly.period, highlight: true },
    ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black flex flex-col pb-10 md:pb-0">
      <Header lang={userDetails?.displayLanguage} />
      {/* Promo Code Section */}
      <div className="flex flex-col items-center justify-center my-8 gap-2">
        <div className="flex items-center shadow-lg shadow-purple-500/10 rounded-full ">
          <input
            type="text"
            placeholder={t.placeholder}
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
                <Loader className="animate-spin" /> {t.verifyingBtn}
              </div>
            ) : (
              t.applyBtn
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
                      {t.recommended}
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
            );
          })}
        </div>
      </PayPalScriptProvider>
    </div>
  );
}
