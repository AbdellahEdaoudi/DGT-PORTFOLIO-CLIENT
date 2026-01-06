"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import MagicalLoader from "../../Components/MagicalLoader"
import { Copy, ExternalLink, Trash2 as Trash, ImagePlus as ImageIcon, FolderOpen, ArrowLeft, Check, RefreshCcw } from "../../Components/Icons"
import Image from "next/image"
import { createPortal } from "react-dom"

export default function CloudinaryGallery() {
    const [cache, setCache] = useState({})
    const [images, setImages] = useState([])
    const [folders, setFolders] = useState([])
    const [loading, setLoading] = useState(true)
    const [nextCursor, setNextCursor] = useState(null)
    const [loadingMore, setLoadingMore] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [currentFolder, setCurrentFolder] = useState("")
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, publicId: null, isDeleting: false })
    const [copiedId, setCopiedId] = useState(null)
    const [notification, setNotification] = useState(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const fetchImages = async (cursor = null, folder = "") => {
        try {
            const res = await axios.get("/api/proxy/admin/cloudinary-images", {
                params: {
                    next_cursor: cursor,
                    folder: folder
                }
            })

            const newResources = res.data.resources || []
            const newFolders = res.data.folders || []
            const newNextCursor = res.data.next_cursor || null

            if (cursor) {
                setImages(prev => [...prev, ...newResources])
                // Update cache with appended data
                setCache(prev => ({
                    ...prev,
                    [folder]: {
                        images: [...(prev[folder]?.images || []), ...newResources],
                        folders: prev[folder]?.folders || [],
                        nextCursor: newNextCursor
                    }
                }))
            } else {
                setImages(newResources)
                setFolders(newFolders)
                // Cache the fresh data
                setCache(prev => ({
                    ...prev,
                    [folder]: {
                        images: newResources,
                        folders: newFolders,
                        nextCursor: newNextCursor
                    }
                }))
            }

            setNextCursor(newNextCursor)
        } catch (error) {
            console.error("Error fetching images:", error)
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    useEffect(() => {
        if (cache[currentFolder]) {
            // Restore from cache immediately
            setImages(cache[currentFolder].images)
            setFolders(cache[currentFolder].folders)
            setNextCursor(cache[currentFolder].nextCursor)
            setLoading(false)
        } else {
            setLoading(true)
            setImages([])
            setFolders([])
            fetchImages(null, currentFolder)
        }
    }, [currentFolder])

    const handleCopyUrl = (url, id) => {
        navigator.clipboard.writeText(url)
        setCopiedId(id)
        setNotification("Link copied to clipboard")
        setTimeout(() => {
            setCopiedId(null)
            setNotification(null)
        }, 2000)
    }

    const handleFolderClick = (folderPath) => {
        setCurrentFolder(folderPath)
    }

    const handleGoBack = () => {
        if (!currentFolder) return
        const parts = currentFolder.split('/')
        parts.pop()
        setCurrentFolder(parts.join('/'))
    }

    const handleRefresh = () => {
        setLoading(true)
        setImages([])
        setFolders([])
        setNextCursor(null)
        fetchImages(null, currentFolder)
    }

    const handleDelete = (public_id) => {
        setDeleteModal({ isOpen: true, publicId: public_id, isDeleting: false })
    }

    const confirmDelete = async () => {
        const public_id = deleteModal.publicId
        if (!public_id) return

        setDeleteModal(prev => ({ ...prev, isDeleting: true }))

        try {
            const res = await axios.delete("/api/proxy/admin/cloudinary-images", {
                data: { public_id }
            })

            if (res.status === 200) {
                // Remove from local state
                setImages(prev => prev.filter(img => img.public_id !== public_id))

                // Remove from cache
                if (cache[currentFolder]) {
                    setCache(prev => ({
                        ...prev,
                        [currentFolder]: {
                            ...prev[currentFolder],
                            images: prev[currentFolder].images.filter(img => img.public_id !== public_id)
                        }
                    }))
                }

                if (selectedImage?.public_id === public_id) {
                    setSelectedImage(null)
                }

                setNotification("Image deleted successfully")
                setTimeout(() => setNotification(null), 2000)
                setDeleteModal({ isOpen: false, publicId: null, isDeleting: false })
            }
        } catch (error) {
            console.error("Delete error:", error)
            alert("Failed to delete image")
            setDeleteModal(prev => ({ ...prev, isDeleting: false }))
        }
    }

    if (loading && !nextCursor && images.length === 0 && folders.length === 0) return <MagicalLoader />

    return (
        <div className="space-y-6 relative pb-10">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {currentFolder && (
                        <button
                            onClick={handleGoBack}
                            className="p-2 hover:bg-slate-800 rounded-lg text-white transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                    )}
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            {currentFolder ? currentFolder : "Media Library"}
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                            {currentFolder ? "Browse folder contents" : "Manage your Cloudinary assets efficiently"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefresh}
                        className="p-2 bg-slate-800/50 hover:bg-slate-800 text-white rounded-lg border border-purple-500/20 transition-all hover:rotate-180 duration-500"
                        title="Refresh Data"
                    >
                        <RefreshCcw size={20} className={loading && images.length > 0 ? "animate-spin" : ""} />
                    </button>
                    <div className="bg-slate-800/50 px-4 py-2 rounded-lg border border-purple-500/20">
                        <span className="text-gray-400 text-sm">Assets: </span>
                        <span className="text-cyan-400 font-bold">{images.length}</span>
                    </div>
                </div>
            </div>

            {/* Folders Section */}
            {!nextCursor && folders.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 border-b border-purple-500/20 pb-6">
                    {folders.map((folder) => (
                        <div
                            key={folder.path}
                            onClick={() => handleFolderClick(folder.path)}
                            className="flex flex-col items-center justify-center p-4 bg-slate-800/40 hover:bg-slate-800 rounded-xl cursor-pointer border border-transparent hover:border-purple-500/40 transition-all gap-2 group"
                        >
                            <FolderOpen size={40} className="text-cyan-400/80 group-hover:text-cyan-400 transition-colors" />
                            <span className="text-sm text-gray-300 font-medium group-hover:text-white truncate w-full text-center">
                                {folder.name}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Images Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {images.map((img) => (
                    <div
                        key={img.public_id}
                        className="group relative bg-slate-800/40 rounded-xl overflow-hidden border border-purple-500/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
                    >
                        <div className="aspect-square relative cursor-pointer" onClick={() => setSelectedImage(img)}>
                            <Image
                                src={img.secure_url}
                                alt={img.public_id}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                                <p className="text-white text-xs truncate font-medium">{img.public_id.split('/').pop()}</p>
                                <p className="text-gray-400 text-[10px]">{(img.bytes / 1024).toFixed(1)} KB</p>
                            </div>
                        </div>

                        {/* Quick Actions Overlay */}
                        <div className="absolute top-2 right-2 flex gap-1 transform translate-x-10 group-hover:translate-x-0 transition-transform duration-300">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(img.public_id)
                                }}
                                className="p-1.5 bg-slate-900/90 hover:bg-red-500 text-white rounded-lg backdrop-blur-sm transition-colors shadow-lg"
                                title="Delete Image"
                            >
                                <Trash size={14} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleCopyUrl(img.secure_url, img.public_id)
                                }}
                                className={`p-1.5 ${copiedId === img.public_id ? 'bg-green-500 text-white' : 'bg-slate-900/90 hover:bg-purple-500 text-white'} rounded-lg backdrop-blur-sm transition-colors shadow-lg`}
                                title="Copy URL"
                            >
                                {copiedId === img.public_id ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                            <a
                                href={img.secure_url}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 bg-slate-900/90 hover:bg-cyan-500 text-white rounded-lg backdrop-blur-sm transition-colors shadow-lg"
                                title="Open in new tab"
                            >
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {images.length === 0 && folders.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <ImageIcon size={48} className="mb-4 opacity-50" />
                    <p>No media found in this folder</p>
                </div>
            )}

            {/* Load More Button */}
            {nextCursor && (
                <div className="flex justify-center pt-6">
                    <button
                        onClick={() => {
                            setLoadingMore(true)
                            fetchImages(nextCursor, currentFolder)
                        }}
                        disabled={loadingMore}
                        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-medium rounded-lg transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loadingMore ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Loading...
                            </>
                        ) : (
                            "Load More Assets"
                        )}
                    </button>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.isOpen && mounted && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-red-500/30 rounded-2xl max-w-sm w-full p-6 shadow-2xl shadow-red-500/10 flex flex-col gap-4 text-center">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-2 text-red-500">
                            {deleteModal.isDeleting ? (
                                <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Trash size={32} />
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-white">Delete Image?</h3>
                        <p className="text-gray-400 text-sm">
                            Are you sure you want to delete this image? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => setDeleteModal({ isOpen: false, publicId: null, isDeleting: false })}
                                disabled={deleteModal.isDeleting}
                                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleteModal.isDeleting}
                                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {deleteModal.isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Custom Floating Notification */}
            <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[100] transition-all duration-300 ${notification ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <div className="bg-slate-900/90 backdrop-blur-md border border-purple-500/30 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2">
                    <div className="bg-green-500 rounded-full p-1">
                        <Check size={12} className="text-white" />
                    </div>
                    <span className="font-medium text-sm">{notification}</span>
                </div>
            </div>

            {/* Image Detail Modal */}
            {selectedImage && mounted && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="bg-slate-900 border border-purple-500/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-purple-500/20"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="relative w-full md:w-2/3 bg-black/50 min-h-[300px] flex items-center justify-center">
                            <img
                                src={selectedImage.secure_url}
                                alt="Preview"
                                className="max-w-full max-h-[80vh] object-contain"
                            />
                        </div>
                        <div className="w-full md:w-1/3 p-6 border-l border-purple-500/10 flex flex-col gap-4 overflow-y-auto">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1 break-all">
                                    {selectedImage.public_id.split('/').pop()}
                                </h3>
                                <p className="text-sm text-cyan-400">{selectedImage.format?.toUpperCase()}</p>
                            </div>

                            <div className="space-y-3 bg-slate-800/30 p-4 rounded-xl border border-white/5">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Dimensons</span>
                                    <span className="text-white">{selectedImage.width} x {selectedImage.height}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Size</span>
                                    <span className="text-white">{(selectedImage.bytes / 1024).toFixed(2)} KB</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Created At</span>
                                    <span className="text-white">{new Date(selectedImage.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="mt-auto space-y-2">
                                <button
                                    onClick={() => handleCopyUrl(selectedImage.secure_url, selectedImage.public_id)}
                                    className={`w-full py-2.5 ${copiedId === selectedImage.public_id ? 'bg-green-600' : 'bg-slate-800 hover:bg-slate-700'} text-white rounded-lg transition-colors flex items-center justify-center gap-2 border border-white/10`}
                                >
                                    {copiedId === selectedImage.public_id ? <Check size={16} /> : <Copy size={16} />}
                                    {copiedId === selectedImage.public_id ? "Copied!" : "Copy Direct Link"}
                                </button>
                                <button
                                    onClick={() => handleDelete(selectedImage.public_id)}
                                    className="w-full py-2.5 bg-slate-800 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 border border-white/10"
                                >
                                    <Trash size={16} />
                                    Delete Image
                                </button>
                                <a
                                    href={selectedImage.secure_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 border border-white/10"
                                >
                                    <ExternalLink size={16} />
                                    Open in New Tab
                                </a>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}
