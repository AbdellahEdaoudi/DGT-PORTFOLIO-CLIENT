"use client";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { ArrowUp, ArrowDown, CheckCheck, Loader, Plus, Trash2, Award, Upload, X } from "lucide-react";

import { useTranslation } from "../../lib/translations";

export default function Certificates({ userData, setUserDetails }) {
    const { t } = useTranslation(userData?.displayLanguage || 'en');
    // Initialize certificates. If cfimage exists, use it.
    const [certificates, setCertificates] = useState(userData.certificates || []);
    const [loading, setLoading] = useState(false);

    // Helper to compress image (similar to Userinfo)
    const compressImage = async (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    let width = img.width;
                    let height = img.height;
                    const maxSize = 1200;
                    if (width > height && width > maxSize) {
                        height = (height * maxSize) / width;
                        width = maxSize;
                    } else if (height > maxSize) {
                        width = (width * maxSize) / height;
                        height = maxSize;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        const compressedFile = new File([blob], file.name, {
                            type: "image/jpeg",
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    }, "image/jpeg", 0.8);
                };
            };
        });
    };

    const addArrayItem = (array, setArray, newItem) => {
        if (array.length >= 5) {
            toast.error(t('maxCertificatesLimit') || "Max 5 certificates allowed");
            return;
        }
        setArray([...array, newItem]);
    };

    const removeArrayItem = (array, setArray, index) =>
        setArray(array.filter((_, i) => i !== index));

    const updateObjectInArray = (array, setArray, index, key, value) => {
        const updated = [...array];
        updated[index] = { ...updated[index], [key]: value };
        setArray(updated);
    };

    const moveItemUp = (index) => {
        if (index === 0) return;
        const newCertificates = [...certificates];
        [newCertificates[index - 1], newCertificates[index]] = [newCertificates[index], newCertificates[index - 1]];
        setCertificates(newCertificates);
    };

    const moveItemDown = (index) => {
        if (index === certificates.length - 1) return;
        const newCertificates = [...certificates];
        [newCertificates[index], newCertificates[index + 1]] = [newCertificates[index + 1], newCertificates[index]];
        setCertificates(newCertificates);
    };

    const handleFileSelect = async (event, index) => {
        const file = event.target.files[0];
        if (!file) return;

        // Optional early check, though compression will reduce it
        if (file.size > 5 * 1024 * 1024) {
            toast.error(t('fileSizeError') || "File is too large, please pick smaller image");
            return;
        }

        // Create preview immediately for UI
        const previewUrl = URL.createObjectURL(file);

        try {
            // Compress
            // Note: Compression takes a bit, but for UI responsiveness we show preview first
            const compressed = await compressImage(file);

            const updated = [...certificates];
            updated[index] = {
                ...updated[index],
                file: compressed,
                previewUrl: previewUrl,
                cfimage: ""
            };
            setCertificates(updated);
        } catch (e) {
            console.error("Compression error", e);
            toast.error("Error processing image");
        }
    };

    const clearFile = (index) => {
        const updated = [...certificates];
        updated[index] = {
            ...updated[index],
            file: null,
            previewUrl: "",
            cfimage: ""
        };
        setCertificates(updated);
    };

    const saveCertificates = async () => {
        setLoading(true);
        try {
            const formData = new FormData();

            // Separate files and data
            // We will send 'certificates' as JSON string
            // And files as 'image_INDEX'

            // Validate: prevent saving if any certificate has no image
            for (const cert of certificates) {
                if (!cert.cfimage && !cert.file) {
                    toast.error(t('imageRequired') || "Each certificate must have an image.");
                    setLoading(false);
                    return;
                }
            }

            // Prepare metadata array to be stringified
            // Only send description and cfimage
            const certificatesMeta = certificates.map(c => ({
                description: c.description,
                cfimage: c.cfimage,
            }));

            formData.append("certificates", JSON.stringify(certificatesMeta));

            // Append files
            certificates.forEach((cert, index) => {
                if (cert.file) {
                    formData.append(`image_${index}`, cert.file);
                }
            });

            const response = await axios.put(`/api/proxy/users/update/certificates`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            // Update local state with the returned (updated) user data certificates
            if (response.data && response.data.certificates) {
                setCertificates(response.data.certificates);
                if (setUserDetails) {
                    setUserDetails(prev => ({
                        ...prev,
                        certificates: response.data.certificates
                    }));
                }
            }

            toast(
                <p className="flex gap-3 items-center">
                    <CheckCheck className="text-green-500" /> {t('savedSuccessfully')}
                </p>,
                { autoClose: 2000 }
            );
        } catch (error) {
            console.error("Error updating certificates:", error);
            toast.error(t('errorMessage'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4" dir={userData?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Award className="text-blue-500" /> {t('certificates') || "Certificates"}
            </h3>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-2 md:p-4 rounded-xl border border-blue-200 space-y-3">
                <div className="space-y-2">
                    {certificates.map((cert, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-xl p-2 md:p-4 shadow-sm hover:shadow-md transition-all duration-300 space-y-3"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div className="flex flex-col gap-1">
                                    {/* File Selection / Display Logic */}
                                    {!(cert.cfimage || cert.previewUrl) ? (
                                        <div className="relative h-full">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileSelect(e, index)}
                                                className="hidden"
                                                id={`cert-upload-${index}`}
                                            />
                                            <label
                                                htmlFor={`cert-upload-${index}`}
                                                className={`flex flex-col items-center justify-center gap-2 w-full h-full min-h-[100px] px-3 py-2 border-2 border-dashed ${!cert.cfimage && !cert.file ? 'border-red-300 bg-red-50' : 'border-blue-400 bg-blue-50'} rounded-lg cursor-pointer hover:bg-blue-100 transition`}
                                            >
                                                <Upload size={24} className={!cert.cfimage && !cert.file ? 'text-red-500' : 'text-blue-600'} />
                                                <span className={`${!cert.cfimage && !cert.file ? 'text-red-500' : 'text-blue-600'} text-sm font-medium`}>
                                                    {t('selectCertificateImage') || "Select Image (Required)"} *
                                                </span>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="relative h-full min-h-[100px] flex flex-col items-center justify-center gap-2 px-3 py-2 border border-blue-200 rounded-lg bg-blue-50 overflow-hidden group">
                                            {/* Preview Image Background */}
                                            <div className="absolute inset-0 z-0 opacity-20">
                                                <img src={cert.previewUrl || cert.cfimage} alt="preview" className="w-full h-full object-cover" />
                                            </div>

                                            <div className="z-10 flex flex-col items-center gap-2">
                                                <span className="text-sm text-blue-900 font-semibold truncate max-w-[200px]">
                                                    {cert.file ? (t('fileSelected') || "New Image Selected") : (t('imageUploaded') || "Image Uploaded")}
                                                </span>

                                                <div className="flex gap-2">
                                                    <a href={cert.previewUrl || cert.cfimage} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-white/80 hover:bg-white rounded-full text-xs text-blue-600 font-bold shadow-sm transition">
                                                        {t('view') || "View"}
                                                    </a>
                                                    <button type="button" onClick={() => clearFile(index)} className="px-3 py-1 bg-white/80 hover:bg-white rounded-full text-xs text-red-600 font-bold shadow-sm transition">
                                                        {t('remove') || "Remove"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <textarea
                                        placeholder={t('certificateDescription') || "Description / Title"}
                                        value={cert.description || ""}
                                        maxLength={200}
                                        rows={4}
                                        onChange={(e) =>
                                            updateObjectInArray(certificates, setCertificates, index, "description", e.target.value)
                                        }
                                        className="w-full h-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition resize-none"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-row-reverse gap-2">
                                <button
                                    type="button"
                                    onClick={() => moveItemUp(index)}
                                    disabled={index === 0}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <ArrowUp size={18} className="text-gray-600" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => moveItemDown(index)}
                                    disabled={index === certificates.length - 1}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <ArrowDown size={18} className="text-gray-600" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeArrayItem(certificates, setCertificates, index)}
                                    className="flex-1 hover:bg-red-100 rounded-lg p-1 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={18} className="text-red-500" /> {t('delete')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() =>
                        addArrayItem(certificates, setCertificates, {
                            description: "",
                            cfimage: "",
                        })
                    }
                    disabled={certificates.length >= 5}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
                >
                    <Plus size={18} /> {t('addCertificate') || "Add Certificate"}
                </button>
                {certificates.length >= 5 && (
                    <p className="text-xs text-red-500 text-center">{t('maxCertificatesReached') || "Maximum limit of 5 certificates reached."}</p>
                )}
            </div>

            <div className="flex justify-end py-4 border-b-2 border-gray-200">
                <button
                    onClick={saveCertificates}
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg"
                >
                    {loading ? (
                        <>
                            <Loader size={20} className="animate-spin" /> {t('saving')}
                        </>
                    ) : (
                        `💾 ${t('save')}`
                    )}
                </button>
            </div>
        </div>
    );
}
