"use client";
import axios from "axios";
import {
  CheckCheck,
  Loader,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  X,
  AlertCircle,
  GripVertical,
} from "../../components/Icons";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
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

export default function Services({ userData, setUserDetails }) {
  const t = getTranslation(userData?.displayLanguage || "en");

  // Transform to objects with local ID
  const [services, setServices] = useState(
    (userData.services || []).map((s, i) => ({
      value: s,
      localId: `id-${i}-${Math.random().toString(36).substr(2, 9)}`,
    })),
  );
  const [loading, setLoading] = useState(false);
  const [movedItemIndex, setMovedItemIndex] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [mounted, setMounted] = useState(false);

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

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setServices((items) => {
        const oldIndex = items.findIndex((item) => item.localId === active.id);
        const newIndex = items.findIndex((item) => item.localId === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        setMovedItemIndex(newIndex);
        setTimeout(() => setMovedItemIndex(null), 1000);

        return newItems;
      });
    }
  };

  const updateArrayItem = (array, setArray, index, value) => {
    const updated = [...array];
    updated[index] = { ...updated[index], value: value };
    setArray(updated);
  };

  const confirmDelete = () => {
    if (itemToDelete === null) return;
    setServices(services.filter((_, i) => i !== itemToDelete));
    setItemToDelete(null);
  };

  // Helper functions for array management
  const addArrayItem = (array, setArray, newItem) => {
    if (array.length >= 10) return;
    setArray([
      ...array,
      {
        value: newItem,
        localId: `new-${Date.now()}`,
      },
    ]);
  };

  const moveItemUp = (index) => {
    if (index === 0) return;
    const updated = [...services];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setServices(updated);
    setMovedItemIndex(index - 1);
    setTimeout(() => setMovedItemIndex(null), 1000);
  };

  const moveItemDown = (index) => {
    if (index === services.length - 1) return;
    const updated = [...services];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setServices(updated);
    setMovedItemIndex(index + 1);
    setTimeout(() => setMovedItemIndex(null), 1000);
  };

  const UpServices = async (e) => {
    e.preventDefault();
    // Filter empty services to ensure data quality
    const validServices = services
      .filter((s) => s.value.trim() !== "")
      .map((s) => s.value);

    setLoading(true);
    try {
      await axios.put(`/api/proxy/users/update/services`, {
        services: validServices,
      });

      // Update global state to reflect changes immediately without refresh
      if (setUserDetails) {
        setUserDetails((prev) => ({
          ...prev,
          services: validServices,
        }));
      }

      // Sync local state with validServices maintaining IDs if possible or regen
      setServices(
        validServices.map((s, i) => ({
          value: s,
          localId:
            services[i] && services[i].value === s
              ? services[i].localId
              : `id-${Math.random().toString(36).substr(2, 9)}`,
        })),
      );

      toast(
        <p className="flex gap-3 items-center">
          <CheckCheck className="text-teal-500" />
          {t("services.savedSuccessfully")}
        </p>,
        {
          autoClose: 2000,
        },
      );
    } catch (error) {
      toast.error(t("services.errorMessage"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir={userData?.displayLanguage === "ar" ? "rtl" : "ltr"}>
      {/* Services - Teal Style */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800">
          💼 {t("services.title")}
        </h3>
        <div className="bg-gradient-to-br from-teal-50 to-green-50 p-2 md:p-4 rounded-xl border border-teal-200 space-y-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={services.map((s) => s.localId)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {services.map((serviceObj, index) => (
                  <SortableItem
                    key={serviceObj.localId}
                    id={serviceObj.localId}
                  >
                    {({
                      attributes,
                      listeners,
                      setActivatorNodeRef,
                      isDragging,
                    }) => (
                      <div
                        className={`flex gap-0.5 sm:gap-2 items-center transition-all duration-500 rounded-lg p-0.5 sm:p-1 ${isDragging ? "bg-teal-50 scale-[1.02] shadow-lg ring-1 ring-teal-300 z-50" : movedItemIndex === index ? "bg-teal-100 ring-2 ring-teal-300" : "hover:bg-teal-50/50"}`}
                      >
                        {/* Draggable Grip Handle + Number */}
                        <div
                          ref={setActivatorNodeRef}
                          {...listeners}
                          {...attributes}
                          className="flex-shrink-0 h-4 sm:h-8 px-1 sm:px-2 flex items-center justify-center gap-0.5 sm:gap-1 bg-teal-100 text-teal-700 rounded-lg border border-teal-200 shadow-sm cursor-grab active:cursor-grabbing hover:bg-teal-200 transition-colors touch-none"
                        >
                          <GripVertical className="w-2 h-2 sm:w-3 sm:h-3 opacity-50" />
                          <span className="font-bold text-[8px] sm:text-xs">
                            {index + 1}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={serviceObj.value}
                          maxLength={150}
                          onChange={(e) =>
                            updateArrayItem(
                              services,
                              setServices,
                              index,
                              e.target.value,
                            )
                          }
                          className="flex-1 min-w-0 px-1 py-0.5 sm:px-3 sm:py-2 text-[9px] sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white transition"
                          placeholder={`Service ${index + 1}`}
                        />
                        <div className="flex items-center gap-0 sm:gap-1 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => moveItemUp(index)}
                            disabled={index === 0}
                            className="p-0.5 sm:p-1.5 hover:bg-teal-100 rounded-lg transition-colors text-teal-600 disabled:opacity-30 disabled:cursor-not-allowed hidden sm:block"
                          >
                            <ArrowUp className="w-2.5 h-2.5 sm:w-[18px] sm:h-[18px]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItemDown(index)}
                            disabled={index === services.length - 1}
                            className="p-0.5 sm:p-1.5 hover:bg-teal-100 rounded-lg transition-colors text-teal-600 disabled:opacity-30 disabled:cursor-not-allowed hidden sm:block"
                          >
                            <ArrowDown className="w-2.5 h-2.5 sm:w-[18px] sm:h-[18px]" />
                          </button>
                          <div className="w-px h-3 sm:h-6 bg-teal-200 mx-0.5 sm:mx-1"></div>
                          <button
                            type="button"
                            onClick={() => setItemToDelete(index)}
                            className="p-0.5 sm:p-1.5 hover:bg-red-100 rounded-lg transition-colors text-red-500"
                          >
                            <Trash2 className="w-2.5 h-2.5 sm:w-[18px] sm:h-[18px]" />
                          </button>
                        </div>
                      </div>
                    )}
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <button
            type="button"
            disabled={services.length >= 10}
            onClick={() => {
              if (services.length < 10) {
                addArrayItem(services, setServices, "");
              }
            }}
            className={`w-full text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${services.length >= 10 ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700"}`}
          >
            <Plus size={18} />{" "}
            {services.length >= 10 ? "10 Max" : t("services.addService")}
          </button>
        </div>
      </div>
      {/* Submit Button */}
      <div className="flex justify-end py-4 border-b-2 border-gray-200">
        <button
          onClick={UpServices}
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg"
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" />{" "}
              {t("services.saving")}
            </>
          ) : (
            `💾 ${t("services.save")}`
          )}
        </button>
      </div>

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
                title="Close"
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
                      Are you sure you want to delete this service?
                    </span>
                    <span className="font-bold text-black border-t pt-2 mt-1 break-all">
                      "
                      {services[itemToDelete]?.value ||
                        t("services.thisService") ||
                        "this service"}
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
                  {t("services.cancel") || "Cancel"}
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md transition duration-200 flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  <span>{t("services.delete") || "Delete"}</span>
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
