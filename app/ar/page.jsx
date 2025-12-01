import { ArrowRight, Code2, Zap, Share2, Globe2, SquareMousePointer, QrCode, Layout } from "lucide-react"
import Image from "next/image"
import ThemeSlideshow from "../Components/LandingPage/ThemeSlideshow"
import Navbar from "../Components/LandingPage/Navbar"
import AuthButtons from "../Components/LandingPage/AuthButtons"
import Link from "next/link"

export const metadata = {
    title: "DGT Portfolio - أنشئ محفظتك المهنية عبر الإنترنت",
    description: "بدون برمجة، بدون عناء. أنشئ محفظة نظيفة وعصرية في دقائق. اعرض مسارك المهني، مهاراتك، مشاريعك، وروابط عملك كما لم تفعل من قبل.",
    openGraph: {
        title: "DGT Portfolio - أنشئ محفظتك المهنية عبر الإنترنت",
        description: "بدون برمجة، بدون عناء. أنشئ محفظة نظيفة وعصرية في دقائق.",
        url: "https://dgtportfolio.com/ar",
        locale: "ar_AR",
        type: "website",
    },
}

export default function LandingPage() {
    const PORTFOLIO = `https://adam-carter.dgtportfolio.com`

    return (
        <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black text-white overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0  opacity-5" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
            </div>

            {/* Navigation */}
            <Navbar>
                <div className=" mx-auto md:mx-3 px-6 py-6 flex justify-between items-center">
                    <Link href={"/"}>
                        <div className="flex items-center gap-0.5 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent cursor-pointer">
                            <Image src={"/LogoinQrcode.png"} width={500} height={500} className="w-12 h-10" alt="DGT Portfolio - Professional Portfolio Builder" />
                            DGTPortfolio
                        </div>
                    </Link>
                    <div className="hidden md:flex gap-8">
                        <Link href={"#Features"} className="hover:text-cyan-400 transition">
                            المميزات
                        </Link>
                        <Link href={PORTFOLIO} target="_blank" className="hover:text-cyan-400 transition">
                            معرض الأعمال
                        </Link>
                        <Link href={"#pricing"} className="hover:text-cyan-400 transition">
                            الأسعار
                        </Link>
                    </div>
                    <AuthButtons labels={{
                        signIn: "تسجيل الدخول",
                        getStarted: "ابدأ الآن",
                        updateProfile: "تحديث الملف الشخصي",
                        businessLinks: "روابط العمل",
                        support: "الدعم",
                        signOut: "تسجيل الخروج"
                    }} />
                </div>
            </Navbar>
            {/* Hero Section */}
            <section className="relative pt-20 md:pt-28 md:mx-5 md:pb-20 px-6 mb-8">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    محفظتك المهنية،
                                </span>
                                <br />
                                <span className="text-white">بمستوى أرقى</span>
                            </h1>
                            <p className="text-lg  text-gray-300 leading-relaxed">
                                بدون برمجة، بدون عناء. أنشئ محفظة نظيفة وعصرية في دقائق. <br />
                                اعرض مسارك المهني، مهاراتك، مشاريعك، وروابط عملك كما لم تفعل من قبل
                                اترك انطباعاً دائماً وافتح فرصاً جديدة.
                                <span className=" m-4 text-sm bg-gradient-to-r from-cyan-400 to-purple-500 text-black rounded-full px-3  py-1 font-semibold shadow-lg shadow-cyan-500/30">
                                    مجاني لمدة 7 أيام
                                </span>
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Link href={"/update-profile"} className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition flex items-center gap-2">
                                ابدأ البناء <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link href={PORTFOLIO} target="_blank" className="px-8 py-4 border border-purple-500/50 rounded-full hover:bg-purple-500/10 transition">
                                شاهد العرض
                            </Link>
                        </div>
                    </div>
                    <ThemeSlideshow />
                </div>
            </section>

            {/* Features Section */}
            <section id="Features" className="px-6 pt-8 pb-8 md:py-12 border-t border-purple-500/20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold mb-4">لماذا تختار DGT Portfolio</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            كل ما تحتاجه لعرض أفضل أعمالك والحصول على فرص أحلامك
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Code2,
                                title: "تصميم بدون كود",
                                description: "أنشئ محافظ مذهلة دون كتابة سطر واحد من التعليمات البرمجية",
                            },
                            {
                                icon: SquareMousePointer,
                                title: "نطاق فرعي مخصص",
                                description: (
                                    <>احصل على نطاق فرعي مخصص مثل <strong>yourname.dgtportfolio.com</strong> لمحفظتك</>
                                ),
                            },
                            {
                                icon: QrCode,
                                title: "ملف تعريف عبر رمز QR",
                                description: (
                                    <>أنشئ رمز QR لمحفظتك يمكنك تنزيله أو مشاركته فوراً</>
                                ),
                            },
                            {
                                icon: Layout,
                                title: "سمات متعددة",
                                description: "اختر من بين سمات مختلفة لتخصيص شكل ومظهر محفظتك",
                            },
                            {
                                icon: Share2,
                                title: "مشاركة الروابط بسهولة",
                                description: "شارك رابط محفظتك في أي مكان بنقرة واحدة فقط",
                            },
                            {
                                icon: Zap,
                                title: "سرعة البرق",
                                description: "أوقات تحميل فائقة السرعة تحافظ على تفاعل الزوار",
                            },
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className={`p-8 rounded-2xl border transition-all duration-300 cursor-pointer 
                     hover:bg-purple-500/20 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20"
                     bg-slate-800/50 border-purple-500/20 
                `}>
                                <feature.icon className="w-12 h-12 text-cyan-400 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* Pricing / Offers Section */}
            <section id="pricing" className="px-6 py-20 border-t border-purple-500/20">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold mb-4">أسعار بسيطة وواضحة</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            اختر الخطة المثالية لمحفظتك الإبداعية
                        </p>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                name: "الخطة الشهرية",
                                description: "$10 للشهر التالي",
                                price: "$1",
                                period: "/الشهر الأول",
                                cta: "اشتراك شهري",
                                highlight: false,
                            },
                            {
                                name: "خطة 4 أشهر",
                                description: "عرض رائع متوسط المدى",
                                price: "$30",
                                period: "/4 أشهر",
                                cta: "اشتراك 4 أشهر",
                                highlight: false,
                            },
                            {
                                name: "الخطة السنوية",
                                description: "أفضل قيمة",
                                price: "$60",
                                period: "/سنة",
                                cta: "اشتراك سنوي",
                                highlight: true,
                            },
                        ].map((plan, index) => (
                            <div
                                key={index}
                                className={`relative p-8 rounded-2xl border transition-all duration-300 ${plan.highlight
                                    ? "bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-cyan-400/50 shadow-lg shadow-cyan-500/20 md:scale-105"
                                    : "bg-slate-800/50 border-purple-500/20 hover:border-purple-400/50 hover:bg-purple-500/10"
                                    }`}
                            >
                                {/* Badge */}
                                {plan.highlight && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-black px-4 py-1 rounded-full text-sm font-semibold">
                                            موصى به
                                        </span>
                                    </div>
                                )}

                                {/* Plan Name */}
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                                {/* Price */}
                                <div className="mb-8">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                            {plan.price}
                                        </span>
                                        <span className="text-gray-400">{plan.period}</span>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <Link href="/subscription" className="block">
                                    <button
                                        className={`w-full py-3 px-6 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${plan.highlight
                                            ? "bg-gradient-to-r from-cyan-400 to-purple-500 text-black hover:shadow-lg hover:shadow-cyan-500/50"
                                            : "border border-purple-500/50 text-white hover:bg-purple-500/20 hover:border-purple-400"
                                            }`}
                                    >
                                        {plan.cta}
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 py-20 border-t border-purple-500/20">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/50 rounded-3xl p-12">
                        <h2 className="text-2xl md:text-5xl font-bold mb-6">جاهز لعرض موهبتك؟</h2>
                        <p className=" md:text-xl text-gray-300 mb-8">
                            انضم إلى آلاف المبدعين الذين يبنون محافظ أحلامهم
                        </p>
                        <Link className="text-sm md:text-base" href={"/update-profile"}>
                            <button
                                className=" px-10 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition flex items-center gap-2 mx-auto">
                                أنشئ محفظتك <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-purple-500/20 px-6 py-12 text-gray-400 text-center">
                <p> © {new Date().getFullYear()} <span className="font-semibold">DGT Portfolio</span>. جميع الحقوق محفوظة.</p>
            </footer>
        </div>
    )
}