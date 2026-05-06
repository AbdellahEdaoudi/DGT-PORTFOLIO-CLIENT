import axios from "axios";
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
  GripVertical,
} from "../../components/Icons";
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

export default function Education({ userData, setUserDetails }) {
  const t = getTranslation(userData?.displayLanguage || "en");

  // Initialize education with collapsed: true and localId
  const [education, setEducation] = useState(
    (userData.education || []).map((e) => ({
      ...e,
      collapsed: true,
      localId: e._id || `id-${Math.random().toString(36).substr(2, 9)}`,
    })),
  );

  // Track original order for comparison
  const [originalOrder, setOriginalOrder] = useState(
    (userData.education || []).filter((e) => e._id).map((e) => e._id),
  );

  const [loading, setLoading] = useState(false);
  const [savingIds, setSavingIds] = useState(new Set());
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [validationErrors, setValidationErrors] = useState({});
  const [itemToDelete, setItemToDelete] = useState(null); // Index of item to delete
  const [highlightedId, setHighlightedId] = useState(null);
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
      setEducation((items) => {
        const oldIndex = items.findIndex((item) => item.localId === active.id);
        const newIndex = items.findIndex((item) => item.localId === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addArrayItem = (array, setArray, newItem) => {
    if (array.length >= 10) return;
    const newIndex = array.length;
    setArray([
      ...array,
      {
        ...newItem,
        collapsed: false,
        localId: `new-${Date.now()}`, // Unique local ID for DnD
      },
    ]);
    // Highlight the newly added item
    setHighlightedId(`new-${newIndex}`);
    setTimeout(() => setHighlightedId(null), 2000);
  };

  const updateObjectInArray = (array, setArray, index, key, value) => {
    const updated = [...array];
    updated[index] = { ...updated[index], [key]: value };
    setArray(updated);

    // Clear validation error when user types
    if (validationErrors[index]?.[key]) {
      setValidationErrors((prev) => ({
        ...prev,
        [index]: { ...prev[index], [key]: false },
      }));
    }
  };

  const toggleCollapse = (index) => {
    const updated = [...education];
    updated[index] = {
      ...updated[index],
      collapsed: !updated[index].collapsed,
    };
    setEducation(updated);
  };

  const moveItemUp = (index) => {
    if (index === 0) return;
    const newItems = [...education];
    const itemToMove = newItems[index];
    [newItems[index - 1], newItems[index]] = [
      newItems[index],
      newItems[index - 1],
    ];
    setEducation(newItems);

    // Highlight the moved item
    const targetId = itemToMove._id || `new-${index - 1}`;
    setHighlightedId(targetId);
    setTimeout(() => setHighlightedId(null), 1500);
  };

  const moveItemDown = (index) => {
    if (index === education.length - 1) return;
    const newItems = [...education];
    const itemToMove = newItems[index];
    [newItems[index], newItems[index + 1]] = [
      newItems[index + 1],
      newItems[index],
    ];
    setEducation(newItems);

    // Highlight the moved item
    const targetId = itemToMove._id || `new-${index + 1}`;
    setHighlightedId(targetId);
    setTimeout(() => setHighlightedId(null), 1500);
  };

  // 🟢 Save Single Education Item
  const saveEducationItem = async (index) => {
    const item = education[index];
    const errors = {};
    if (!item.school?.trim()) errors.school = true;
    if (!item.degree?.trim()) errors.degree = true;
    if (!item.field?.trim()) errors.field = true;
    if (!item.startYear?.trim()) errors.startYear = true;
    if (!item.endYear?.trim()) errors.endYear = true;

    if (Object.keys(errors).length > 0) {
      setValidationErrors((prev) => ({ ...prev, [index]: errors }));
      // Expand if collapsed to show errors
      if (item.collapsed) toggleCollapse(index);
      return;
    }

    setSavingIds((prev) => new Set(prev).add(index));
    try {
      // Exclude localId and collapsed before sending to server
      const { collapsed, localId, ...itemData } = item;
      const res = await axios.put(
        "/api/proxy/users/update/education/item",
        itemData,
      );

      const newEducationList = res.data.education;
      const mergedEducation = newEducationList.map((e, i) => {
        // Find existing item to preserve localId and collapsed state
        const oldE =
          education.find((op) => op._id === e._id) ||
          (education[i] && !education[i]._id ? education[i] : null);
        return {
          ...e,
          collapsed: oldE ? oldE.collapsed : true,
          localId: oldE
            ? oldE.localId
            : `id-${Math.random().toString(36).substr(2, 9)}`,
        };
      });

      setEducation(mergedEducation);
      if (setUserDetails) {
        setUserDetails((prev) => ({ ...prev, education: newEducationList }));
      }

      toast.success(t("education.savedSuccessfully"));
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });

      // Trigger success effect
      const savedItem = mergedEducation[index];
      if (savedItem && savedItem._id) {
        setHighlightedId(savedItem._id);
        setTimeout(() => setHighlightedId(null), 2000);
      }
    } catch (error) {
      console.error("Error saving education:", error);
      toast.error(t("education.errorMessage"));
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }
  };

  // 🟢 Delete Logic (Called from Modal)
  const confirmDelete = async () => {
    const index = itemToDelete;
    if (index === null) return;
    setItemToDelete(null);

    const item = education[index];
    if (!item._id) {
      // Just remove from state
      setEducation(education.filter((_, i) => i !== index));
      return;
    }

    setDeletingIds((prev) => new Set(prev).add(item._id));
    try {
      const res = await axios.delete(
        `/api/proxy/users/update/education/${item._id}`,
      );

      const newEducationList = res.data.education;
      // Re-map with localIds
      setEducation(
        newEducationList.map((e) => ({
          ...e,
          collapsed: true,
          localId: e._id || `id-${Math.random().toString(36).substr(2, 9)}`,
        })),
      );

      if (setUserDetails) {
        setUserDetails((prev) => ({ ...prev, education: newEducationList }));
      }
      toast.success(
        t("education.deletedSuccessfully") || "Deleted successfully",
      );
    } catch (error) {
      console.error("Error deleting education:", error);
      toast.error(t("education.errorMessage"));
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(item._id);
        return next;
      });
    }
  };

  // 🟢 Save Order Only
  const saveOrder = async () => {
    setLoading(true);
    try {
      const educationWithIds = education
        .filter((e) => e._id)
        .map((e) => ({ _id: e._id }));

      if (educationWithIds.length !== education.length) {
        toast.warning(
          t("education.saveNewItemsFirst") || "Please save new items first",
        );
        setLoading(false);
        return;
      }

      await axios.put(`/api/proxy/users/update/education/order`, {
        education: educationWithIds,
      });

      // Update global state
      if (setUserDetails) {
        setUserDetails((prev) => ({
          ...prev,
          education: education.map(({ collapsed, localId, ...rest }) => rest),
        }));
      }

      // Update original order after successful save
      const newOrder = education.filter((e) => e._id).map((e) => e._id);
      setOriginalOrder(newOrder);

      toast(
        <p className="flex gap-3 items-center">
          <CheckCheck className="text-blue-500" />{" "}
          {t("education.orderSaved") || "Order saved"}
        </p>,
        { autoClose: 2000 },
      );
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(t("education.errorMessage"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="space-y-4"
      dir={userData?.displayLanguage === "ar" ? "rtl" : "ltr"}
    >
      <h3 className="text-lg font-bold text-gray-800">
        🎓 {t("education.title")}
      </h3>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-2 md:p-4 rounded-xl border border-blue-200 space-y-3">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={education.map((e) => e.localId)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {education.map((edu, index) => (
                <SortableItem key={edu.localId} id={edu.localId}>
                  {({
                    attributes,
                    listeners,
                    setActivatorNodeRef,
                    isDragging,
                  }) => (
                    <div
                      key={edu._id || index}
                      className={`bg-white pb-1 border rounded-xl shadow-sm hover:shadow-md transition-all duration-500 overflow-hidden ${
                        deletingIds.has(edu._id)
                          ? "opacity-60 grayscale pointer-events-none ring-2 ring-red-100 border-red-200 scale-[0.99]"
                          : validationErrors[index]
                            ? "border-red-300 ring-1 ring-red-200"
                            : isDragging
                              ? "border-blue-400 bg-blue-50 shadow-lg scale-[1.02] z-50"
                              : highlightedId === edu._id ||
                                  highlightedId === `new-${index}`
                                ? "border-blue-400 bg-blue-50/50 shadow-md scale-[1.01]"
                                : "border-gray-200"
                      }`}
                    >
                      {/* Collapsible Header with Editable School */}
                      <div className="p-1 sm:p-4 flex items-center justify-between gap-1 sm:gap-3 bg-white">
                        <div className="flex-grow flex items-center gap-1 sm:gap-3">
                          {/* Draggable Number Handle */}
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
                          <div className="w-full">
                            <input
                              type="text"
                              placeholder={t("education.school")}
                              value={edu.school}
                              maxLength={100}
                              onChange={(e) =>
                                updateObjectInArray(
                                  education,
                                  setEducation,
                                  index,
                                  "school",
                                  e.target.value,
                                )
                              }
                              className={`w-full px-1 py-0.5 sm:px-3 sm:py-2 text-[9px] sm:text-base border rounded-lg focus:outline-none transition bg-white ${validationErrors[index]?.school ? "border-red-500 ring-1 ring-red-100" : "border-gray-300 focus:ring-2 focus:ring-blue-500"}`}
                              onClick={(e) => e.stopPropagation()}
                            />
                            {validationErrors[index]?.school && (
                              <p className="text-red-500 text-[8px] sm:text-xs mt-0.5 sm:mt-1.5 flex items-center gap-1 font-medium animate-in slide-in-from-top-1">
                                <AlertCircle className="w-2.5 h-2.5 sm:w-[14px] sm:h-[14px]" />
                                {t("education.schoolRequired") ||
                                  "School is required"}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-0 sm:gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleCollapse(index)}
                            className={`p-0.5 sm:p-2 rounded-lg transition-colors flex items-center gap-1 sm:gap-2 text-[8px] sm:text-sm font-medium ${edu.collapsed ? "bg-blue-50 text-blue-700 hover:bg-blue-100" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            title={
                              edu.collapsed
                                ? t("education.edit")
                                : t("education.collapse") || "Collapse"
                            }
                          >
                            {edu.collapsed ? (
                              <Pencil className="w-2.5 h-2.5 sm:w-[16px] sm:h-[16px]" />
                            ) : (
                              <X className="w-2.5 h-2.5 sm:w-[16px] sm:h-[16px]" />
                            )}
                            <span className="hidden md:inline">
                              {edu.collapsed
                                ? t("education.edit")
                                : t("education.close") || "Close"}
                            </span>
                          </button>

                          <div className="w-px h-3 sm:h-6 bg-gray-200 mx-0.5 sm:mx-1"></div>

                          <button
                            type="button"
                            onClick={() => moveItemUp(index)}
                            disabled={index === 0}
                            className="p-0.5 sm:p-1.5 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed hidden sm:block"
                            title={t("education.moveUp") || "Move Up"}
                          >
                            <ArrowUp className="w-2.5 h-2.5 sm:w-[16px] sm:h-[16px] text-gray-600" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItemDown(index)}
                            disabled={index === education.length - 1}
                            className="p-0.5 sm:p-1.5 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed hidden sm:block"
                            title={t("education.moveDown") || "Move Down"}
                          >
                            <ArrowDown className="w-2.5 h-2.5 sm:w-[16px] sm:h-[16px] text-gray-600" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setItemToDelete(index)}
                            className="p-0.5 sm:p-1.5 hover:bg-red-100 rounded-lg transition-colors text-red-500 ml-0.5 sm:ml-1"
                            title={t("education.delete")}
                            disabled={deletingIds.has(edu._id)}
                          >
                            {deletingIds.has(edu._id) ? (
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

                      {!edu.collapsed && (
                        <div className="p-3 md:p-4 border-t border-gray-100 space-y-3 bg-gray-50/50 animate-in fade-in slide-in-from-top-1 duration-200">
                          <div>
                            <input
                              type="text"
                              placeholder={t("education.degree")}
                              value={edu.degree || ""}
                              maxLength={100}
                              onChange={(e) =>
                                updateObjectInArray(
                                  education,
                                  setEducation,
                                  index,
                                  "degree",
                                  e.target.value,
                                )
                              }
                              className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-base border rounded-lg focus:outline-none transition bg-white ${validationErrors[index]?.degree ? "border-red-500 ring-1 ring-red-100" : "border-gray-300 focus:ring-2 focus:ring-blue-500"}`}
                            />
                            {validationErrors[index]?.degree && (
                              <p className="text-red-500 text-[9px] sm:text-xs mt-1 sm:mt-1.5 flex items-center gap-1 sm:gap-1.5 font-medium animate-in slide-in-from-top-1">
                                <AlertCircle className="w-3 h-3 sm:w-[14px] sm:h-[14px]" />
                                {t("education.degreeRequired") ||
                                  "Degree is required"}
                              </p>
                            )}
                          </div>

                          <div>
                            <input
                              type="text"
                              placeholder={t("education.field")}
                              value={edu.field || ""}
                              maxLength={100}
                              onChange={(e) =>
                                updateObjectInArray(
                                  education,
                                  setEducation,
                                  index,
                                  "field",
                                  e.target.value,
                                )
                              }
                              className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-base border rounded-lg focus:outline-none transition bg-white ${validationErrors[index]?.field ? "border-red-500 ring-1 ring-red-100" : "border-gray-300 focus:ring-2 focus:ring-blue-500"}`}
                            />
                            {validationErrors[index]?.field && (
                              <p className="text-red-500 text-[9px] sm:text-xs mt-1 sm:mt-1.5 flex items-center gap-1 sm:gap-1.5 font-medium animate-in slide-in-from-top-1">
                                <AlertCircle className="w-3 h-3 sm:w-[14px] sm:h-[14px]" />
                                {t("education.fieldRequired") ||
                                  "Field is required"}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                            <div>
                              <input
                                type="text"
                                placeholder={t("education.startYear")}
                                value={edu.startYear || ""}
                                maxLength={20}
                                onChange={(e) =>
                                  updateObjectInArray(
                                    education,
                                    setEducation,
                                    index,
                                    "startYear",
                                    e.target.value,
                                  )
                                }
                                className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-base border rounded-lg focus:outline-none transition bg-white ${validationErrors[index]?.startYear ? "border-red-500 ring-1 ring-red-100" : "border-gray-300 focus:ring-2 focus:ring-blue-500"}`}
                              />
                              {validationErrors[index]?.startYear && (
                                <p className="text-red-500 text-[9px] sm:text-xs mt-1 sm:mt-1.5 flex items-center gap-1 sm:gap-1.5 font-medium animate-in slide-in-from-top-1">
                                  <AlertCircle className="w-3 h-3 sm:w-[14px] sm:h-[14px]" />
                                  {t("education.startYearRequired") ||
                                    "Start year is required"}
                                </p>
                              )}
                            </div>

                            <div>
                              <input
                                type="text"
                                placeholder={t("education.endYear")}
                                maxLength={20}
                                value={edu.endYear || ""}
                                onChange={(e) =>
                                  updateObjectInArray(
                                    education,
                                    setEducation,
                                    index,
                                    "endYear",
                                    e.target.value,
                                  )
                                }
                                className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-base border rounded-lg focus:outline-none transition bg-white ${validationErrors[index]?.endYear ? "border-red-500 ring-1 ring-red-100" : "border-gray-300 focus:ring-2 focus:ring-blue-500"}`}
                              />
                              {validationErrors[index]?.endYear && (
                                <p className="text-red-500 text-[9px] sm:text-xs mt-1 sm:mt-1.5 flex items-center gap-1 sm:gap-1.5 font-medium animate-in slide-in-from-top-1">
                                  <AlertCircle className="w-3 h-3 sm:w-[14px] sm:h-[14px]" />
                                  {t("education.endYearRequired") ||
                                    "End year is required"}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-end pt-2">
                            <button
                              type="button"
                              onClick={() => saveEducationItem(index)}
                              disabled={savingIds.has(index)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 transition-colors disabled:opacity-50"
                            >
                              {savingIds.has(index) ? (
                                <Loader size={12} className="animate-spin" />
                              ) : (
                                <CheckCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                              )}
                              {t("education.save") || "Save"}
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
          disabled={education.length >= 10}
          onClick={() => {
            if (education.length < 10) {
              addArrayItem(education, setEducation, {
                school: "",
                degree: "",
                field: "",
                startYear: "",
                endYear: "",
                collapsed: false,
              });
            }
          }}
          className={`w-full text-white py-1.5 sm:py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 mt-2 text-xs sm:text-base ${education.length >= 10 ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"}`}
        >
          <Plus className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />{" "}
          {education.length >= 10 ? t("education.maxLimit") : t("education.addEducation")}
        </button>
      </div>

      {/* Only show Save Order button if there are 2+ items */}
      {education.filter((e) => e._id).length >= 2 && (
        <div className="flex justify-end py-4 border-b-2 border-gray-200">
          <button
            onClick={saveOrder}
            disabled={
              loading ||
              (() => {
                const currentOrder = education
                  .filter((e) => e._id)
                  .map((e) => e._id);
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
                {t("education.saving")}
              </>
            ) : (
              `💾 ${t("education.saveOrder") || "Save Order"}`
            )}
          </button>
        </div>
      )}

      {/* Professional Delete Modal with Portal - Inlined */}
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
                title={t("education.close") || "Close"}
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
                      {t("education.deleteConfirm") ||
                        "Are you sure you want to delete this education?"}
                    </span>
                    <span className="font-bold text-black border-t pt-2 mt-1 break-all">
                      "
                      {education[itemToDelete]?.school ||
                        t("education.thisEducation") ||
                        "this education"}
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
                  {t("education.cancel") || "Cancel"}
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md transition duration-200 flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  <span>{t("education.delete") || "Delete"}</span>
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
