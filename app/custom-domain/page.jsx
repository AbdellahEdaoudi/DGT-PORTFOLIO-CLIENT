"use client"
import { useState, useEffect, useContext } from 'react';
import { MyContext } from '../Context/MyContext';
import { toast } from 'react-toastify';
import { Globe, CheckCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import axios from 'axios';

export default function CustomDomainPage() {
    const { userDetails } = useContext(MyContext);
    const [customDomain, setCustomDomain] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (userDetails?.email) fetchSettings();
    }, [userDetails]);

    const fetchSettings = async () => {
        try {
            const res = await axios.get(`/api/proxy/custom-domain/settings/${userDetails.email}`);
            if (res.data.status) {
                setCustomDomain(res.data.data.customDomain || '');
                setIsVerified(res.data.data.customDomainVerified || false);
            }
        } catch (e) { console.error(e); }
    };

    const handleSave = async () => {
        if (!customDomain) return toast.error('Enter a domain');
        setIsLoading(true);
        try {
            const res = await axios.post(`/api/proxy/custom-domain/set`, {
                email: userDetails.email,
                customDomain: customDomain.toLowerCase()
            });
            if (res.data.status) {
                toast.success(res.data.message);
                setIsVerified(false);
            } else toast.error(res.data.message);
        } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
        finally { setIsLoading(false); }
    };

    const handleVerify = async () => {
        setIsLoading(true);
        try {
            const res = await axios.post(`/api/proxy/custom-domain/verify`, { email: userDetails.email });
            if (res.data.status) {
                toast.success(res.data.message);
                setIsVerified(true);
            } else toast.error(res.data.message);
        } catch (e) { toast.error(e.response?.data?.message || 'Verification Failed'); }
        finally { setIsLoading(false); }
    };

    const handleRemove = async () => {
        if (!confirm('Remove domain?')) return;
        try {
            await axios.delete(`/api/proxy/custom-domain/remove`, { data: { email: userDetails.email } });
            setCustomDomain('');
            setIsVerified(false);
            toast.success('Removed');
        } catch (e) { toast.error('Error'); }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-2 text-cyan-400">Custom Domain</h1>
                <p className="text-gray-400 mb-8">Connect your own domain to your portfolio.</p>

                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="mb-6">
                        <label className="block text-sm font-bold mb-2">Your Domain</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={customDomain}
                                onChange={(e) => setCustomDomain(e.target.value)}
                                placeholder="example.com"
                                className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3"
                                disabled={isVerified}
                            />
                            {!isVerified && (
                                <button onClick={handleSave} disabled={isLoading} className="bg-cyan-600 px-6 rounded-lg font-bold">
                                    {isLoading ? '...' : 'Save'}
                                </button>
                            )}
                        </div>
                    </div>

                    {customDomain && (
                        <div className="mb-6">
                            <div className={`p-4 rounded-lg flex items-center gap-2 ${isVerified ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                                {isVerified ? <CheckCircle /> : <AlertCircle />}
                                <span className="font-bold">{isVerified ? 'Active & Verified' : 'Pending Verification'}</span>
                            </div>

                            {isVerified && (
                                <div className="mt-4 flex gap-2">
                                    <button onClick={() => window.open(`https://${customDomain}`, '_blank')} className="flex-1 bg-slate-700 py-2 rounded-lg">Visit Site</button>
                                    <button onClick={handleRemove} className="flex-1 bg-red-900/50 text-red-400 py-2 rounded-lg">Remove</button>
                                </div>
                            )}

                            {!isVerified && (
                                <div className="mt-6 bg-slate-900 p-4 rounded-lg">
                                    <h3 className="font-bold mb-3">DNS Configuration</h3>
                                    <p className="text-sm text-gray-400 mb-4">Go to your domain provider (Namecheap, GoDaddy...) and add this record:</p>

                                    <div className="grid grid-cols-3 gap-4 text-sm font-mono bg-black/30 p-3 rounded">
                                        <div>Type: <span className="text-cyan-400">A Record</span></div>
                                        <div>Host: <span className="text-cyan-400">@</span></div>
                                        <div>Value: <span className="text-cyan-400">76.76.21.21</span></div>
                                    </div>

                                    <button onClick={handleVerify} disabled={isLoading} className="w-full mt-4 bg-cyan-600 py-3 rounded-lg font-bold hover:bg-cyan-500">
                                        Verify DNS
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
