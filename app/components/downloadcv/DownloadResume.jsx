"use client"
import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { FileDown, Loader, X, Settings, ChevronDown, ChevronUp } from "../Icons"

import { getDownloadCvTranslation } from "../../translations/download-cv";

// ===================== CHECKBOX COMPONENT =====================
function Checkbox({ checked, onChange, label, indeterminate = false }) {
    const ref = useRef(null);
    useEffect(() => {
        if (ref.current) ref.current.indeterminate = indeterminate;
    }, [indeterminate]);
    return (
        <label className="flex items-center gap-3 cursor-pointer group select-none">
            <div className="relative flex-shrink-0">
                <input
                    ref={ref}
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="sr-only peer"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
                    ${checked || indeterminate
                        ? 'bg-blue-500 border-blue-500'
                        : 'bg-transparent border-white/30 group-hover:border-white/60'
                    }`}>
                    {checked && !indeterminate && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                    {indeterminate && (
                        <div className="w-2.5 h-0.5 bg-white rounded-full" />
                    )}
                </div>
            </div>
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors leading-tight">{label}</span>
        </label>
    );
}

// ===================== COLLAPSIBLE SECTION =====================
function CollapsibleSection({ title, sectionKey, checked, onToggleSection, children, hasItems, isRTL }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`border border-white/10 rounded-xl overflow-hidden ${isRTL ? 'dir-rtl' : ''}`}>
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/8 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                    <Checkbox checked={checked} onChange={() => onToggleSection(sectionKey)} label={title} />
                </div>
                {hasItems && (
                    <button
                        onClick={() => setOpen(o => !o)}
                        className="text-gray-400 hover:text-white transition-colors p-1 ml-2 flex-shrink-0"
                        title="Expand"
                    >
                        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                )}
            </div>
            {open && hasItems && (
                <div className="px-4 py-3 space-y-2 bg-black/20 border-t border-white/5">
                    {children}
                </div>
            )}
        </div>
    );
}

// ===================== CUSTOMIZATION MODAL =====================
function CustomizationModal({ userDetails, onConfirm, onClose, t, isRTL }) {
    const lang = userDetails?.displayLanguage || 'en';
    const ud = userDetails;

    // Build initial state from data
    const buildInitial = () => {
        const sections = {
            summary: true,
            experience: true,
            skills: true,
            projects: true,
            education: true,
            languages: true,
            certificates: true,
            services: true,
        };
        const experiences = {};
        (ud?.experience || []).forEach((_, i) => { experiences[i] = true; });
        const projects = {};
        (ud?.projects || []).forEach((_, i) => { projects[i] = true; });
        const languages = {};
        (ud?.languages || []).forEach((_, i) => { languages[i] = true; });

        return { sections, experiences, projects, languages };
    };

    const [selections, setSelections] = useState(buildInitial);

    const toggleSection = (key) => {
        setSelections(prev => ({
            ...prev,
            sections: { ...prev.sections, [key]: !prev.sections[key] }
        }));
    };

    const toggleItem = (group, idx) => {
        setSelections(prev => ({
            ...prev,
            [group]: { ...prev[group], [idx]: !prev[group][idx] }
        }));
    };

    // Check if all/some items in a group are selected
    const allChecked = (obj) => Object.values(obj).every(Boolean);
    const someChecked = (obj) => Object.values(obj).some(Boolean) && !allChecked(obj);

    const toggleAllInGroup = (group, indices) => {
        const all = indices.every(i => selections[group][i]);
        const next = {};
        indices.forEach(i => { next[i] = !all; });
        setSelections(prev => ({ ...prev, [group]: { ...prev[group], ...next } }));
    };

    const handleConfirm = () => {
        // Build filtered userData
        const filtered = { ...ud };
        if (!selections.sections.summary) filtered.about = null;
        if (!selections.sections.skills) filtered.skills = [];
        if (!selections.sections.education) filtered.education = [];
        if (!selections.sections.certificates) filtered.certificates = [];
        if (!selections.sections.services) filtered.services = [];

        if (!selections.sections.experience) {
            filtered.experience = [];
        } else {
            filtered.experience = (ud.experience || []).filter((_, i) => selections.experiences[i]);
        }

        if (!selections.sections.projects) {
            filtered.projects = [];
        } else {
            filtered.projects = (ud.projects || []).filter((_, i) => selections.projects[i]);
        }

        if (!selections.sections.languages) {
            filtered.languages = [];
        } else {
            filtered.languages = (ud.languages || []).filter((_, i) => selections.languages[i]);
        }

        onConfirm(filtered);
    };

    const expIndices = (ud?.experience || []).map((_, i) => i);
    const projIndices = (ud?.projects || []).map((_, i) => i);
    const langIndices = (ud?.languages || []).map((_, i) => i);

    const sectionList = [
        { key: 'summary', label: t.sections.summary, hasItems: false },
        { key: 'experience', label: t.sections.experience, hasItems: expIndices.length > 0 },
        { key: 'projects', label: t.sections.projects, hasItems: projIndices.length > 0 },
        { key: 'education', label: t.sections.education, hasItems: false },
        { key: 'skills', label: t.sections.skills, hasItems: false },
        { key: 'languages', label: t.sections.languages, hasItems: langIndices.length > 0 },
        { key: 'certificates', label: t.sections.certificates, hasItems: false },
        { key: 'services', label: t.sections.services, hasItems: false },
    ];

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div
                className={`bg-[#0f1623] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] ${isRTL ? 'text-right' : 'text-left'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-white">{t.modalTitle}</h2>
                        <p className="text-sm text-gray-400 mt-0.5">{t.modalSubtitle}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 flex-shrink-0">
                        <X size={22} />
                    </button>
                </div>

                {/* Scrollable content */}
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-3 modal-scrollbar">
                    {sectionList.map(({ key, label, hasItems }) => (
                        <CollapsibleSection
                            key={key}
                            sectionKey={key}
                            title={label}
                            checked={selections.sections[key]}
                            onToggleSection={toggleSection}
                            hasItems={selections.sections[key] && hasItems}
                            isRTL={isRTL}
                        >
                            {/* Experience sub-items */}
                            {key === 'experience' && expIndices.length > 0 && (
                                <div className="space-y-2 pl-2">
                                    <Checkbox
                                        checked={allChecked(selections.experiences)}
                                        indeterminate={someChecked(selections.experiences)}
                                        onChange={() => toggleAllInGroup('experiences', expIndices)}
                                        label={t.allItems}
                                    />
                                    <div className="border-t border-white/5 pt-2 space-y-2">
                                        {(ud.experience || []).map((exp, i) => (
                                            <Checkbox
                                                key={i}
                                                checked={selections.experiences[i]}
                                                onChange={() => toggleItem('experiences', i)}
                                                label={exp.role || exp.company || `Experience ${i + 1}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Projects sub-items */}
                            {key === 'projects' && projIndices.length > 0 && (
                                <div className="space-y-2 pl-2">
                                    <Checkbox
                                        checked={allChecked(selections.projects)}
                                        indeterminate={someChecked(selections.projects)}
                                        onChange={() => toggleAllInGroup('projects', projIndices)}
                                        label={t.allItems}
                                    />
                                    <div className="border-t border-white/5 pt-2 space-y-2">
                                        {(ud.projects || []).map((proj, i) => (
                                            <Checkbox
                                                key={i}
                                                checked={selections.projects[i]}
                                                onChange={() => toggleItem('projects', i)}
                                                label={proj.title || `Project ${i + 1}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Languages sub-items */}
                            {key === 'languages' && langIndices.length > 0 && (
                                <div className="space-y-2 pl-2">
                                    <Checkbox
                                        checked={allChecked(selections.languages)}
                                        indeterminate={someChecked(selections.languages)}
                                        onChange={() => toggleAllInGroup('languages', langIndices)}
                                        label={t.allItems}
                                    />
                                    <div className="border-t border-white/5 pt-2 space-y-2">
                                        {(ud.languages || []).map((lang, i) => (
                                            <Checkbox
                                                key={i}
                                                checked={selections.languages[i]}
                                                onChange={() => toggleItem('languages', i)}
                                                label={typeof lang === 'string' ? lang.split(':')[0].trim() : lang}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CollapsibleSection>
                    ))}
                </div>

                {/* Footer */}
                <div className={`flex gap-3 px-6 py-5 border-t border-white/10 flex-shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors text-sm font-medium"
                    >
                        {t.cancelBtn}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors text-sm font-bold flex items-center justify-center gap-2"
                    >
                        <FileDown size={16} />
                        {t.downloadBtn}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ===================== MAIN COMPONENT =====================
export default function DownloadResume({ userDetails, className }) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [showCustomize, setShowCustomize] = useState(false);
    const [mounted, setMounted] = useState(false);
    const isCancelledRef = useRef(false);
    const workerRef = useRef(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const lang = userDetails?.displayLanguage || 'en';
    const t = getDownloadCvTranslation(lang);
    const isRTL = lang === 'ar';
    const fullName = userDetails?.fullname || userDetails?.username || 'User';

    const startDownload = async (filteredData) => {
        setShowCustomize(false);
        try {
            isCancelledRef.current = false;
            setIsDownloading(true);

            await new Promise(resolve => setTimeout(resolve, 100));
            if (isCancelledRef.current) return;

            workerRef.current = new Worker(new URL('./pdfWorker.js', import.meta.url));

            workerRef.current.onmessage = (event) => {
                if (isCancelledRef.current) {
                    workerRef.current.terminate();
                    return;
                }
                if (event.data.success) {
                    const blob = event.data.blob;
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `cv.${userDetails?.username || 'resume'}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                } else {
                    console.error("PDF generation failed:", event.data.error);
                }
                setIsDownloading(false);
                workerRef.current.terminate();
                workerRef.current = null;
            };

            workerRef.current.onerror = (error) => {
                console.error("Worker error:", error);
                setIsDownloading(false);
                workerRef.current.terminate();
                workerRef.current = null;
            };

            workerRef.current.postMessage({ userData: filteredData });

        } catch (e) {
            console.error(e);
            if (!isCancelledRef.current) setIsDownloading(false);
        }
    };

    const handleCancel = () => {
        isCancelledRef.current = true;
        setIsDownloading(false);
        if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
        }
    };

    return (
        <>
            <div className="relative group flex">
                <button
                    type="button"
                    onClick={() => setShowCustomize(true)}
                    className={className || "text-white bg-white/10 hover:bg-white/20 font-bold px-5 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg"}
                >
                    <FileDown size={20} />
                    <span className="hidden md:block">{t.title}</span>
                </button>
            </div>

            {/* Customization Modal */}
            {showCustomize && mounted && createPortal(
                <CustomizationModal
                    userDetails={userDetails}
                    onConfirm={startDownload}
                    onClose={() => setShowCustomize(false)}
                    t={t}
                    isRTL={isRTL}
                />,
                document.body
            )}

            {/* Downloading Spinner Modal */}
            {isDownloading && mounted && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center">
                        <div className="relative mb-6">
                            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <FileDown size={24} className="text-blue-400 opacity-50" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{t.waitTitle}</h3>
                        <p className="text-gray-400 mb-8">{t.loading.replace('{name}', fullName)}</p>
                        <button
                            onClick={handleCancel}
                            className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors w-full flex items-center justify-center gap-2"
                        >
                            <X size={18} />
                            {t.cancel}
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
