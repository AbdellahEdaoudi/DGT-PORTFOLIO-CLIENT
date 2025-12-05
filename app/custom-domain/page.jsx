"use client"
import { useState, useEffect, useContext } from 'react';
import { MyContext } from '../Context/MyContext';
import { toast } from 'react-toastify';
import { Globe, CheckCircle, AlertCircle, ExternalLink, Loader2, Trash2, X } from 'lucide-react';
import axios from 'axios';
import Header from '../Components/header';
import MagicalLoader from '../Components/MagicalLoader';

export default function CustomDomainPage() {
    const {EmailUser} = useContext(MyContext);
    const [customDomain, setCustomDomain] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [showRemoveModal, setShowRemoveModal] = useState(false);

    const fetchSettings = async () => {
        setIsFetching(true);
        try {
            const res = await axios.get(`/api/proxy/custom-domain/settings/${EmailUser}`);
            if (res.data.status) {
                setCustomDomain(res.data.data.customDomain || '');
                setIsSaved(!!res.data.data.customDomain);
                setIsVerified(res.data.data.customDomainVerified || false);
            }
        } catch (e) { console.error(e); }
        finally { setIsFetching(false); }
    };

    useEffect(() => {
        fetchSettings();
    }, [EmailUser]);

    const handleSave = async () => {
        if (!customDomain) return toast.error('Enter a domain');
        setIsLoading(true);
        try {
            const res = await axios.post(`/api/proxy/custom-domain/set`, {
                customDomain: customDomain.toLowerCase()
            });
            if (res.data.status) {
                toast.success(res.data.message);
                setIsSaved(true);
                setIsVerified(false);
            } else toast.error(res.data.message);
        } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
        finally { setIsLoading(false); }
    };

    const handleVerify = async () => {
        setIsLoading(true);
        try {
            const res = await axios.post(`/api/proxy/custom-domain/verify`, {});
            if (res.data.status) {
                toast.success(res.data.message);
                setIsVerified(true);
            } else toast.error(res.data.message);
        } catch (e) { toast.error(e.response?.data?.message || 'Verification Failed'); }
        finally { setIsLoading(false); }
    };

    const confirmRemove = async () => {
        setIsLoading(true);
        setShowRemoveModal(false);
        try {
            await axios.delete(`/api/proxy/custom-domain/remove`);
            setCustomDomain('');
            setIsSaved(false);
            setIsVerified(false);
            toast.success('Domain removed successfully');
        } catch (e) { toast.error('Error removing domain'); }
        finally { setIsLoading(false); }
    };

    if (isFetching) {
        return <MagicalLoader />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            <Header />
            <div className="max-w-3xl mx-auto pt-4 px-4 sm:px-6">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Custom Domain</h1>
                    <p className="text-slate-400 text-base sm:text-lg">Connect your own domain to your portfolio instantly.</p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-5 sm:p-8 border border-slate-700/50 shadow-xl">
                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-slate-300 mb-2 ml-1">Your Domain Name</label>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={customDomain}
                                    onChange={(e) => { setCustomDomain(e.target.value); setIsSaved(false); }}
                                    placeholder="example.com"
                                    className="w-full bg-slate-900/80 border border-slate-600 rounded-xl px-5 py-4 text-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none"
                                    disabled={isVerified || isLoading}
                                />
                            </div>
                            {!isVerified && (
                                <button
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-4 sm:py-0 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save'}
                                </button>
                            )}
                        </div>
                    </div>

                    {isSaved && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className={`p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 border ${isVerified ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'} mb-6`}>
                                {isVerified ? <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1 sm:mt-0" /> : <AlertCircle className="w-6 h-6 flex-shrink-0 mt-1 sm:mt-0" />}
                                <div>
                                    <h3 className="font-bold text-lg">{isVerified ? 'Domain Active & Verified' : 'Verification Pending'}</h3>
                                    <p className="text-sm opacity-80 leading-relaxed">{isVerified ? 'Your domain is correctly configured and live.' : 'Please configure your DNS settings to verify ownership.'}</p>
                                </div>
                            </div>

                            {isVerified ? (
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => window.open(`https://${customDomain}`, '_blank')}
                                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ExternalLink className="w-4 h-4" /> Visit Site
                                    </button>
                                    <button
                                        onClick={() => setShowRemoveModal(true)}
                                        disabled={isLoading}
                                        className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Trash2 className="w-4 h-4" /> Remove Domain</>}
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-slate-900/80 p-5 sm:p-6 rounded-xl border border-slate-700/50">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                        <Globe className="w-5 h-5 text-cyan-400" />
                                        DNS Configuration
                                    </h3>
                                    <div className="space-y-4 mb-6 text-sm text-slate-300">
                                        <p>To connect your domain, please follow these steps:</p>
                                        <ol className="list-decimal list-inside space-y-3 sm:space-y-2 ml-1 sm:ml-2">
                                            <li>Log in to your domain provider (e.g., Namecheap, GoDaddy).</li>
                                            <li>Navigate to the <strong>DNS Management</strong> section.</li>
                                            <li>Add an <strong>A Record</strong> with the following details:
                                                <ul className="list-disc list-inside ml-4 sm:ml-6 mt-2 space-y-1 text-slate-400 bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                                                    <li><strong>Type:</strong> A</li>
                                                    <li><strong>Name:</strong> @ </li>
                                                    <li><strong>Value:</strong> 76.76.21.21</li>
                                                </ul>
                                            </li>
                                        </ol>
                                    </div>

                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                                        <p className="text-blue-400 text-sm">
                                            <strong>Note:</strong> DNS changes can take up to 48 hours to propagate globally, though it usually happens much faster.
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleVerify}
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Verifying DNS...
                                            </>
                                        ) : (
                                            'Verify DNS Configuration'
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            {showRemoveModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="w-6 h-6 text-red-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white mb-2">Remove Custom Domain?</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Are you sure you want to remove <span className="text-cyan-400 font-semibold">{customDomain}</span>?
                                    This action will disconnect your custom domain from your portfolio.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowRemoveModal(false)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row gap-3">
                            <button
                                onClick={() => setShowRemoveModal(false)}
                                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-semibold transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmRemove}
                                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
