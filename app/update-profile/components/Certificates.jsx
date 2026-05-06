import axios from "axios";
import NextImage from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";
import {
  ArrowUp,
  ArrowDown,
  CheckCheck,
  Loader,
  Plus,
  Trash2,
  X,
  Pencil,
  AlertCircle,
  Upload,
  Award,
  GripVertical,
} from "../../components/Icons";
import ImageModal from "../../components/portfolio/ImageModal";
import { getTranslation } from "../../translations/update-profile";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Item Wrapper
const SortableItem = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    position: "relative",
  };

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? "z-50" : ""}>
      {children({ attributes, listeners, setActivatorNodeRef, isDragging })}
    </div>
  );
};

export default function Certificates({ userData, setUserDetails }) {
  const t = getTranslation(userData?.displayLanguage || "en");

  // Initialize with collapsed: true and localId
  const [certificates, setCertificates] = useState(
    (userData.certificates || []).map((e) => ({
      ...e,
      collapsed: true,
      localId: e._id || `id-${Math.random().toString(36).substr(2, 9)}`,
    })),
  );
  // Track original order for comparison
  const [originalOrder, setOriginalOrder] = useState(
    (userData.certificates || []).filter((c) => c._id).map((c) => c._id),
  );
  const [savingIds, setSavingIds] = useState(new Set());
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [validationErrors, setValidationErrors] = useState({});
  const [itemToDelete, setItemToDelete] = useState(null);
  const [highlightedId, setHighlightedId] = useState(null);
  const [loading, setLoading] = useState(false); // For order save
  const [selectedImage, setSelectedImage] = useState(null); // For ImageModal
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setCertificates((items) => {
        const oldIndex = items.findIndex((item) => item.localId === active.id);
        const newIndex = items.findIndex((item) => item.localId === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Compression Helper
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
          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            "image/jpeg",
            0.8,
          );
        };
      };
    });
  };

  const addArrayItem = (array, setArray, newItem) => {
    if (array.length >= 10) return;
    const newIndex = array.length;
    setArray([
      ...array,
      {
        ...newItem,
        collapsed: false,
        localId: `new-${Date.now()}`,
      },
    ]);
    // Subtle highlight for the newly added item
    setHighlightedId(`new-${newIndex}`);
    setTimeout(() => setHighlightedId(null), 2000);
  };

  const updateObjectInArray = (array, setArray, index, key, value) => {
    const updated = [...array];
    updated[index] = { ...updated[index], [key]: value };
    setArray(updated);

    if (validationErrors[index]?.[key]) {
      setValidationErrors((prev) => ({
        ...prev,
        [index]: { ...prev[index], [key]: false },
      }));
    }
  };

  const updateFileInArray = async (index, file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("certificates.fileSizeError") || "File is too large");
      return;
    }
    try {
      const compressed = await compressImage(file);
      const previewUrl = URL.createObjectURL(compressed);

      const updated = [...certificates];
      updated[index] = {
        ...updated[index],
        file: compressed,
        previewUrl: previewUrl,
      };
      setCertificates(updated);

      // Clear error
      if (validationErrors[index]?.image) {
        setValidationErrors((prev) => ({
          ...prev,
          [index]: { ...prev[index], image: false },
        }));
      }
    } catch (e) {
      console.error("Compression error", e);
      toast.error(t("certificates.errorMessage") || "Error processing image");
    }
  };

  const clearFile = (index) => {
    const updated = [...certificates];
    updated[index] = {
      ...updated[index],
      file: null,
      previewUrl: null,
    };
    setCertificates(updated);
  };

  const toggleCollapse = (index) => {
    const updated = [...certificates];
    updated[index] = {
      ...updated[index],
      collapsed: !updated[index].collapsed,
    };
    setCertificates(updated);
  };

  const moveItemUp = (index) => {
    if (index === 0) return;
    const newItems = [...certificates];
    const itemToMove = newItems[index];
    [newItems[index - 1], newItems[index]] = [
      newItems[index],
      newItems[index - 1],
    ];
    setCertificates(newItems);

    // Subtle highlight for the moved item
    const targetId = itemToMove._id || `new-${index - 1}`;
    setHighlightedId(targetId);
    setTimeout(() => setHighlightedId(null), 1500);
  };

  const moveItemDown = (index) => {
    if (index === certificates.length - 1) return;
    const newItems = [...certificates];
    const itemToMove = newItems[index];
    [newItems[index], newItems[index + 1]] = [
      newItems[index + 1],
      newItems[index],
    ];
    setCertificates(newItems);

    // Subtle highlight for the moved item
    const targetId = itemToMove._id || `new-${index + 1}`;
    setHighlightedId(targetId);
    setTimeout(() => setHighlightedId(null), 1500);
  };

  // 🟢 Save Single Certificate
  const saveCertificateItem = async (index) => {
    const item = certificates[index];
    const errors = {};
    // Validation
    if (!item.cfimage && !item.file) errors.image = true;
    if (!item.title?.trim()) errors.title = true;
    if (!item.description?.trim()) errors.description = true;

    if (Object.keys(errors).length > 0) {
      setValidationErrors((prev) => ({ ...prev, [index]: errors }));
      if (item.collapsed) toggleCollapse(index);
      return;
    }

    setSavingIds((prev) => new Set(prev).add(index));
    try {
      let finalImageUrl = item.cfimage || "";

      // 1. Upload Image if new file selected
      if (item.file) {
        const formData = new FormData();
        formData.append("file", item.file);

        const uploadRes = await axios.post(
          "/api/proxy/users/update/certificates/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        finalImageUrl = uploadRes.data.url;
      }

      // 2. Save Item Data
      const payload = {
        _id: item._id, // if exists
        title: item.title,
        description: item.description,
        cfimage: finalImageUrl,
      };

      const res = await axios.put(
        "/api/proxy/users/update/certificates/item",
        payload,
      );

      const newCertList = res.data.certificates;
      const mergedCerts = newCertList.map((e, i) => {
        const oldE =
          certificates.find((op) => op._id === e._id) ||
          (certificates[i] && !certificates[i]._id ? certificates[i] : null);
        return {
          ...e,
          collapsed: oldE ? oldE.collapsed : true,
          localId: oldE
            ? oldE.localId
            : `id-${Math.random().toString(36).substr(2, 9)}`,
        };
      });

      setCertificates(mergedCerts);
      if (setUserDetails) {
        setUserDetails((prev) => ({ ...prev, certificates: newCertList }));
      }

      toast.success(t("certificates.savedSuccessfully"));
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });

      const savedItem = mergedCerts[index];
      if (savedItem && savedItem._id) {
        setHighlightedId(savedItem._id);
        setTimeout(() => setHighlightedId(null), 2000);
      }
    } catch (error) {
      console.error("Error saving certificate:", error);
      toast.error(t("certificates.errorMessage"));
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }
  };

  // 🟢 Delete Logic
  const confirmDelete = async () => {
    const index = itemToDelete;
    if (index === null) return;
    setItemToDelete(null);

    const item = certificates[index];
    if (!item._id) {
      setCertificates(certificates.filter((_, i) => i !== index));
      return;
    }

    setDeletingIds((prev) => new Set(prev).add(item._id));
    try {
      const res = await axios.delete(
        `/api/proxy/users/update/certificates/${item._id}`,
      );
      const newCertList = res.data.certificates;
      // Preserving state consistency isn't critical for localId here as list is replaced but good practice
      setCertificates(
        newCertList.map((e) => ({
          ...e,
          collapsed: true,
          localId: e._id || `id-${Math.random().toString(36).substr(2, 9)}`,
        })),
      );

      if (setUserDetails) {
        setUserDetails((prev) => ({ ...prev, certificates: newCertList }));
      }
      toast.success(
        t("certificates.deletedSuccessfully") || "Deleted successfully",
      );
    } catch (error) {
      console.error("Error deleting certificate:", error);
      toast.error(t("certificates.errorMessage"));
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(item._id);
        return next;
      });
    }
  };

  // 🟢 Save Order
  const saveOrder = async () => {
    setLoading(true);
    try {
      const certificatesWithIds = certificates
        .filter((e) => e._id)
        .map((e) => ({ _id: e._id }));
      if (certificatesWithIds.length !== certificates.length) {
        toast.warning(
          t("certificates.saveNewItemsFirst") || "Please save new items first",
        );
        setLoading(false);
        return;
      }

      await axios.put(`/api/proxy/users/update/certificates/order`, {
        certificates: certificatesWithIds,
      });

      if (setUserDetails) {
        setUserDetails((prev) => ({
          ...prev,
          certificates: certificates.map(
            ({ collapsed, file, previewUrl, localId, ...rest }) => rest,
          ),
        }));
      }

      // Update original order after successful save
      const newOrder = certificates.filter((c) => c._id).map((c) => c._id);
      setOriginalOrder(newOrder);

      toast(
        <p className="flex gap-3 items-center">
          <CheckCheck className="text-blue-500" />{" "}
          {t("certificates.orderSaved") || "Order saved"}
        </p>,
        { autoClose: 2000 },
      );
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(t("certificates.errorMessage"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="space-y-4"
      dir={userData?.displayLanguage === "ar" ? "rtl" : "ltr"}
    >
      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        <Award className="text-blue-500" />{" "}
        {t("certificates.title") || "Certificates"}
      </h3>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-2 md:p-4 rounded-xl border border-blue-200 space-y-3">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={certificates.map((c) => c.localId)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {certificates.map((cert, index) => (
                <SortableItem key={cert.localId} id={cert.localId}>
                  {({
                    attributes,
                    listeners,
                    setActivatorNodeRef,
                    isDragging,
                  }) => (
                    <div
                      key={cert._id || index}
                      className={`bg-white pb-1 border rounded-xl shadow-sm hover:shadow-md transition-all duration-500 overflow-hidden ${
                        deletingIds.has(cert._id)
                          ? "opacity-60 grayscale pointer-events-none ring-2 ring-red-100 border-red-200 scale-[0.99]"
                          : validationErrors[index]
                            ? "border-red-300 ring-1 ring-red-200"
                            : isDragging
                              ? "border-blue-400 bg-blue-50 shadow-lg scale-[1.02] z-50"
                              : highlightedId === cert._id ||
                                  highlightedId === `new-${index}`
                                ? "border-blue-400 bg-blue-50/50 shadow-md scale-[1.01]"
                                : "border-gray-200"
                      }`}
                    >
                      {/* Header */}
                      <div className="p-1 sm:p-4 flex items-center justify-between gap-1 sm:gap-3 bg-white">
                        <div className="flex-grow flex items-center gap-1 sm:gap-3">
                          {/* Draggable Grip Handle + Number */}
                          <div
                            ref={setActivatorNodeRef}
                            {...listeners}
                            {...attributes}
                            className="flex-shrink-0 h-4 sm:h-8 px-1 sm:px-2 flex items-center justify-center gap-0.5 sm:gap-1 bg-blue-100 text-blue-700 rounded-lg border border-blue-200 shadow-sm cursor-grab active:cursor-grabbing hover:bg-blue-200 transition-colors touch-none"
                          >
                            <GripVertical className="w-2 h-2 sm:w-3 sm:h-3 opacity-50" />
                            <span className="font-bold text-[8px] sm:text-xs">
                              {index + 1}
                            </span>
                          </div>
                          {/* Mini Preview in Header */}
                          <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-md bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 relative">
                            {cert.previewUrl || cert.cfimage ? (
                              <NextImage
                                src={cert.previewUrl || cert.cfimage}
                                alt="preview"
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <Award className="text-gray-300 w-3 h-3 sm:w-6 sm:h-6 m-auto mt-1 sm:mt-2" />
                            )}
                          </div>
                          <div className="w-full">
                            <input
                              type="text"
                              placeholder={
                                t("certificates.certificateTitle") ||
                                "Certificate Title"
                              }
                              value={cert.title || ""}
                              maxLength={100}
                              onChange={(e) =>
                                updateObjectInArray(
                                  certificates,
                                  setCertificates,
                                  index,
                                  "title",
                                  e.target.value,
                                )
                              }
                              className={`w-full px-1 py-0.5 sm:px-3 sm:py-2 text-[9px] sm:text-base border rounded-lg focus:outline-none transition bg-white ${validationErrors[index]?.title ? "border-red-500 ring-1 ring-red-100" : "border-gray-300 focus:ring-2 focus:ring-blue-500"}`}
                              onClick={(e) => e.stopPropagation()} // Prevent expand
                            />
                            {validationErrors[index]?.title && (
                              <p className="text-red-500 text-[8px] sm:text-xs mt-0.5 sm:mt-1.5 flex items-center gap-1 font-medium animate-in slide-in-from-top-1">
                                <AlertCircle className="w-2.5 h-2.5 sm:w-[14px] sm:h-[14px]" />
                                {t("certificates.titleRequired") ||
                                  "Title is required"}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-0 sm:gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleCollapse(index)}
                            className={`p-0.5 sm:p-2 rounded-lg transition-colors flex items-center gap-1 sm:gap-2 text-[8px] sm:text-sm font-medium ${cert.collapsed ? "bg-blue-50 text-blue-700 hover:bg-blue-100" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            title={
                              cert.collapsed
                                ? t("certificates.edit")
                                : t("certificates.collapse") || "Collapse"
                            }
                          >
                            {cert.collapsed ? (
                              <Pencil className="w-2.5 h-2.5 sm:w-[16px] sm:h-[16px]" />
                            ) : (
                              <X className="w-2.5 h-2.5 sm:w-[16px] sm:h-[16px]" />
                            )}
                            <span className="hidden md:inline">
                              {cert.collapsed
                                ? t("certificates.edit")
                                : t("certificates.close") || "Close"}
                            </span>
                          </button>

                          <div className="w-px h-3 sm:h-6 bg-gray-200 mx-0.5 sm:mx-1"></div>

                          <button
                            type="button"
                            onClick={() => moveItemUp(index)}
                            disabled={index === 0}
                            className="p-0.5 sm:p-1.5 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed hidden sm:block"
                          >
                            <ArrowUp className="w-2.5 h-2.5 sm:w-[16px] sm:h-[16px] text-gray-600" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItemDown(index)}
                            disabled={index === certificates.length - 1}
                            className="p-0.5 sm:p-1.5 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed hidden sm:block"
                          >
                            <ArrowDown className="w-2.5 h-2.5 sm:w-[16px] sm:h-[16px] text-gray-600" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setItemToDelete(index)}
                            className="p-0.5 sm:p-1.5 hover:bg-red-100 rounded-lg transition-colors text-red-500 ml-0.5 sm:ml-1"
                            disabled={deletingIds.has(cert._id)}
                          >
                            {deletingIds.has(cert._id) ? (
                              <Loader
                                size={12}
                                className="w-2.5 h-2.5 sm:w-[16px] sm:h-[16px] animate-spin"
                              />
                            ) : (
                              <Trash2 className="w-2.5 h-2.5 sm:w-[16px] sm:h-[16px]" />
                            )}
                          </button>
                        </div>
                      </div>

                      {!cert.collapsed && (
                        <div className="p-3 md:p-4 border-t border-gray-100 space-y-3 bg-gray-50/50 animate-in fade-in slide-in-from-top-1 duration-200">
                          {/* Image Selector */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                            <div className="flex flex-col gap-1 sm:gap-2">
                              <label className="text-[10px] sm:text-sm font-medium text-gray-700 ml-1">
                                {t("certificates.certificateImage") ||
                                  "Certificate Image"}
                              </label>
                              {!(cert.cfimage || cert.previewUrl) ? (
                                <div className="relative">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                      updateFileInArray(
                                        index,
                                        e.target.files[0],
                                      )
                                    }
                                    className="hidden"
                                    id={`cert-upload-${index}`}
                                  />
                                  <label
                                    htmlFor={`cert-upload-${index}`}
                                    className={`flex flex-col items-center justify-center gap-1 sm:gap-2 w-full h-24 sm:h-32 px-2 py-1.5 sm:px-3 sm:py-2 border-2 border-dashed ${validationErrors[index]?.image ? "border-red-300 bg-red-50" : "border-blue-400 bg-blue-50"} rounded-lg cursor-pointer hover:bg-blue-100 transition`}
                                  >
                                    <Upload className="text-blue-600 w-4 h-4 sm:w-6 sm:h-6" />
                                    <span
                                      className={`${validationErrors[index]?.image ? "text-red-500" : "text-blue-600"} text-[9px] sm:text-sm font-medium`}
                                    >
                                      {t(
                                        "certificates.selectCertificateImage",
                                      ) || "Select Image (Required)"}{" "}
                                      *
                                    </span>
                                  </label>
                                  {validationErrors[index]?.image && (
                                    <p className="text-red-500 text-[9px] sm:text-xs mt-0.5 sm:mt-1.5 flex items-center gap-1 font-medium animate-in slide-in-from-top-1">
                                      <AlertCircle className="w-3 h-3 sm:w-[14px] sm:h-[14px]" />
                                      {t("certificates.imageRequired") ||
                                        "Image is required"}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <div className="relative w-full h-32 sm:h-48 rounded-lg overflow-hidden border border-gray-200 group">
                                  <NextImage
                                    src={cert.previewUrl || cert.cfimage}
                                    alt="preview"
                                    fill
                                    className="object-contain bg-gray-900/5"
                                    unoptimized
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setSelectedImage(
                                          cert.previewUrl || cert.cfimage,
                                        )
                                      }
                                      className="px-2 py-1 sm:px-3 sm:py-1 bg-white rounded-full text-[9px] sm:text-xs font-bold text-gray-800 hover:bg-gray-100"
                                    >
                                      {t("certificates.view")}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = [...certificates];
                                        updated[index] = {
                                          ...updated[index],
                                          file: null,
                                          previewUrl: null,
                                          cfimage: "",
                                        }; // Full clear
                                        setCertificates(updated);
                                      }}
                                      className="px-2 py-1 sm:px-3 sm:py-1 bg-white rounded-full text-[9px] sm:text-xs font-bold text-red-600 hover:bg-red-50"
                                    >
                                      {t("certificates.remove")}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-1 sm:gap-2">
                              <label className="text-[10px] sm:text-sm font-medium text-gray-700 ml-1">
                                {t("certificates.description")}
                              </label>
                              <textarea
                                placeholder={
                                  t("certificates.description") || "Description"
                                }
                                value={cert.description || ""}
                                maxLength={200}
                                rows={5}
                                onChange={(e) =>
                                  updateObjectInArray(
                                    certificates,
                                    setCertificates,
                                    index,
                                    "description",
                                    e.target.value,
                                  )
                                }
                                className={`w-full h-24 sm:h-full p-2 sm:p-3 text-[10px] sm:text-base border rounded-lg focus:outline-none transition bg-white resize-none ${validationErrors[index]?.description ? "border-red-500 ring-1 ring-red-100" : "border-gray-300 focus:ring-2 focus:ring-blue-500"}`}
                              />
                              {validationErrors[index]?.description && (
                                <p className="text-red-500 text-[9px] sm:text-xs mt-1 sm:mt-1.5 flex items-center gap-1 sm:gap-1.5 font-medium animate-in slide-in-from-top-1">
                                  <AlertCircle className="w-3 h-3 sm:w-[14px] sm:h-[14px]" />
                                  {t("certificates.descriptionRequired") ||
                                    "Description is required"}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-end pt-2">
                            <button
                              type="button"
                              onClick={() => saveCertificateItem(index)}
                              disabled={savingIds.has(index)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 transition-colors disabled:opacity-50"
                            >
                              {savingIds.has(index) ? (
                                <Loader size={12} className="animate-spin" />
                              ) : (
                                <CheckCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                              )}
                              {t("certificates.save") || "Save"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <button
          type="button"
          disabled={certificates.length >= 10}
          onClick={() => {
            if (certificates.length < 10) {
              addArrayItem(certificates, setCertificates, {
                title: "",
                description: "",
                cfimage: "",
                collapsed: false,
              });
            }
          }}
          className={`w-full text-white py-1.5 sm:py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 mt-2 text-xs sm:text-base ${certificates.length >= 10 ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"}`}
        >
          <Plus className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />{" "}
          {certificates.length >= 10
            ? t("certificates.maxLimit")
            : t("certificates.addCertificate")}
        </button>
      </div>

      {/* Only show Save Order button if there are 2+ items */}
      {certificates.filter((c) => c._id).length >= 2 && (
        <div className="flex justify-end py-4 border-b-2 border-gray-200">
          <button
            onClick={saveOrder}
            disabled={
              loading ||
              (() => {
                const currentOrder = certificates
                  .filter((c) => c._id)
                  .map((c) => c._id);
                return (
                  JSON.stringify(currentOrder) === JSON.stringify(originalOrder)
                );
              })()
            }
            className="bg-gray-800 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-4 py-2 sm:px-8 sm:py-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg text-xs sm:text-base"
          >
            {loading ? (
              <>
                <Loader
                  size={20}
                  className="animate-spin w-4 h-4 sm:w-5 sm:h-5"
                />{" "}
                {t("certificates.saving")}
              </>
            ) : (
              `💾 ${t("certificates.saveOrder") || "Save Order"}`
            )}
          </button>
        </div>
      )}

      {/* Delete Modal */}
      {mounted &&
        itemToDelete !== null &&
        createPortal(
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9999] p-4 animate-in fade-in duration-200">
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative flex flex-col items-center text-center transform transition-all scale-100 border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setItemToDelete(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100"
                title={t("certificates.close") || "Close"}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500 ring-4 ring-red-50">
                <AlertCircle size={32} />
              </div>

              <div className="w-full">
                <div className="text-gray-600 mb-6 text-base leading-relaxed">
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-gray-800">
                      {t("certificates.deleteConfirm") ||
                        "Are you sure you want to delete this certificate?"}
                    </span>
                    <span className="font-bold text-black border-t pt-2 mt-1 break-all">
                      "
                      {certificates[itemToDelete]?.title ||
                        t("certificates.thisCertificate") ||
                        "this certificate"}
                      "
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setItemToDelete(null)}
                  className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-all duration-200"
                >
                  {t("certificates.cancel") || "Cancel"}
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md transition duration-200 flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  <span>{t("certificates.delete") || "Delete"}</span>
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageSrc={selectedImage}
        altText={t("certificates.certificatePreview") || "Certificate Preview"}
      />
    </div>
  );
}
