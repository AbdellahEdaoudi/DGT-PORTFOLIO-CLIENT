"use client";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { handleApiError } from "../../utils/apiErrorHandler";
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useToast } from "../../components/Toast";
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
  ImagePlus,
} from "../../components/lucide-react";
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

export default function Projects({ data, setData, content }) {
  const toast = useToast();
  const user = data?.user || {};
  
  // Initialize projects with collapsed: true and localId
  const [projects, setProjects] = useState(
    (user.projects || []).map((p) => ({
      ...p,
      collapsed: true,
      localId: p._id || `id-${Math.random().toString(36).substr(2, 9)}`,
    })),
  );

  // Track original order for comparison
  const [originalOrder, setOriginalOrder] = useState(
    (user.projects || []).filter((p) => p._id).map((p) => p._id),
  );

  const [loading, setLoading] = useState(false);
  const [savingIds, setSavingIds] = useState(new Set());
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [validationErrors, setValidationErrors] = useState({});
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [highlightedId, setHighlightedId] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Per-project image state: { [localId]: { preview: string|null, file: File|null } }
  const [projectImages, setProjectImages] = useState(() => {
    const init = {};
    (user.projects || []).forEach((p, i) => {
      const localId = p._id || `id-${i}`;
      init[localId] = { preview: p.image || null, file: null };
    });
    return init;
  });

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
      setProjects((items) => {
        const oldIndex = items.findIndex((item) => item.localId === active.id);
        const newIndex = items.findIndex((item) => item.localId === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Image compression handler
  const handleProjectImageUpload = async (localId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedBlob = await imageCompression(file, {
        maxSizeMB: 0.19,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      });
      const compressedFile = new File([compressedBlob], file.name, {
        type: compressedBlob.type || file.type,
        lastModified: Date.now(),
      });
      const dataUrl = await imageCompression.getDataUrlFromFile(compressedFile);
      setProjectImages(prev => ({
        ...prev,
        [localId]: { preview: dataUrl, file: compressedFile },
      }));
    } catch (err) {
      console.error("Image compression error:", err);
    }
  };

  const addArrayItem = (array, setArray, newItem) => {
    if (array.length >= 10) return;
    const localId = `new-${Date.now()}`;
    setArray([
      ...array,
      {
        ...newItem,
        collapsed: false,
        localId,
      },
    ]);
    // Init image state for new project
    setProjectImages(prev => ({ ...prev, [localId]: { preview: null, file: null } }));
    setHighlightedId(`new-${array.length}`);
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
    const updated = [...projects];
    updated[index] = {
      ...updated[index],
      collapsed: !updated[index].collapsed,
    };
    setProjects(updated);
  };

  const moveItemUp = (index) => {
    if (index === 0) return;
    const newItems = [...projects];
    const itemToMove = newItems[index];
    [newItems[index - 1], newItems[index]] = [
      newItems[index],
      newItems[index - 1],
    ];
    setProjects(newItems);

    // Subtle highlight for the moved item
    const targetId = itemToMove._id || `new-${index - 1}`;
    setHighlightedId(targetId);
    setTimeout(() => setHighlightedId(null), 1500);
  };

  const moveItemDown = (index) => {
    if (index === projects.length - 1) return;
    const newItems = [...projects];
    const itemToMove = newItems[index];
    [newItems[index], newItems[index + 1]] = [
      newItems[index + 1],
      newItems[index],
    ];
    setProjects(newItems);

    // Subtle highlight for the moved item
    const targetId = itemToMove._id || `new-${index + 1}`;
    setHighlightedId(targetId);
    setTimeout(() => setHighlightedId(null), 1500);
  };

  // 🟢 Save Single Project
  const saveProjectItem = async (index) => {
    const project = projects[index];
    const imgState = projectImages[project.localId] || {};
    const errors = {};
    if (!project.title?.trim()) errors.title = true;
    if (!project.description?.trim()) errors.description = true;
    if (!project.link?.trim()) errors.link = true;
    // Image is required: either existing URL or a newly uploaded file
    if (!imgState.preview && !imgState.file) errors.image = true;
    if (!project.technologies || project.technologies.length === 0)
      errors.technologies = true;

    if (Object.keys(errors).length > 0) {
      setValidationErrors((prev) => ({ ...prev, [index]: errors }));
      if (project.collapsed) toggleCollapse(index);
      return;
    }

    setSavingIds((prev) => new Set(prev).add(index));
    try {
      const { collapsed, localId, image, ...projectData } = project;

      // Build FormData
      const formData = new FormData();
      Object.entries(projectData).forEach(([key, val]) => {
        if (key === 'technologies') {
          (val || []).forEach(t => formData.append('technologies[]', t));
        } else if (val !== undefined && val !== null) {
          formData.append(key, val);
        }
      });
      // Append image: file if newly selected, else keep old URL
      if (imgState.file) {
        formData.append('image', imgState.file);
      } else if (imgState.preview) {
        formData.append('image', imgState.preview);
      }

      const res = await axios.put(
        `${SERVER_URL}/api/users/update/projects/item`,
        formData,
        { withCredentials: true }
      );

      const newProjectsList = res.data.projects;
      const mergedProjects = newProjectsList.map((p, i) => {
        const oldP =
          projects.find((op) => op._id === p._id) ||
          (projects[i] && !projects[i]._id ? projects[i] : null);
        return {
          ...p,
          collapsed: oldP ? oldP.collapsed : true,
          localId: oldP
            ? oldP.localId
            : `id-${Math.random().toString(36).substr(2, 9)}`,
        };
      });

      setProjects(mergedProjects);
      if (setData) {
        setData((prev) => ({
          ...prev,
          user: {
            ...(prev?.user || {}),
            projects: newProjectsList,
          },
        }));
      }
      localStorage.setItem(`data_${data?.user?.username}`, JSON.stringify({
        ...data,
        user: {
          ...(data?.user || {}),
          projects: newProjectsList,
        },
      }));

      // Update projectImages with the final Cloudinary URL from server
      const savedProject = mergedProjects[index];
      if (savedProject) {
        setProjectImages(prev => ({
          ...prev,
          [savedProject.localId]: { preview: savedProject.image || null, file: null },
        }));
      }

      toast.success(content?.savedSuccessfully);
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });

      // Trigger success effect
      if (savedProject && savedProject._id) {
        setHighlightedId(savedProject._id);
        setTimeout(() => setHighlightedId(null), 2000);
      }
    } catch (error) {
      await handleApiError({ error, defaultErrorMsg: content?.errorMessage, toast });
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
    const index = projectToDelete;
    if (index === null) return;
    setProjectToDelete(null);

    const project = projects[index];
    if (!project._id) {
      // Just remove from state
      setProjects(projects.filter((_, i) => i !== index));
      return;
    }

    setDeletingIds((prev) => new Set(prev).add(project._id));
    try {
      const res = await axios.delete(
        `${SERVER_URL}/api/users/update/projects/${project._id}`,
        { withCredentials: true },
      );

      const newProjectsList = res.data.projects;
      // Re-map localIds
      setProjects(
        newProjectsList.map((p) => ({
          ...p,
          collapsed: true,
          localId: p._id || `id-${Math.random().toString(36).substr(2, 9)}`,
        })),
      );

      if (setData) {
        setData((prev) => ({
          ...prev,
          user: {
            ...(prev?.user || {}),
            projects: newProjectsList,
          },
        }));
      }
      localStorage.setItem(`data_${data?.user?.username}`, JSON.stringify({
        ...data,
        user: {
          ...(data?.user || {}),
          projects: newProjectsList,
        },
      }));
      toast.success(
        content?.deletedSuccessfully || "Deleted successfully",
      );
    } catch (error) {
      await handleApiError({ error, defaultErrorMsg: content?.errorMessage, toast });
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(project._id);
        return next;
      });
    }
  };

  // 🟢 Save Order Only
  const saveOrder = async () => {
    setLoading(true);
    try {
      const projectsWithIds = projects
        .filter((p) => p._id)
        .map((p) => ({ _id: p._id }));

      if (projectsWithIds.length !== projects.length) {
        toast.warning(
          content?.saveNewItemsFirst || "Please save new items first",
        );
        setLoading(false);
        return;
      }

      await axios.put(
        `${SERVER_URL}/api/users/update/projects/order`,
        {
          projects: projectsWithIds,
        },
        { withCredentials: true },
      );

      // Update global state
      const orderedProjects = projects.map(({ collapsed, localId, ...rest }) => rest);
      if (setData) {
        setData((prev) => ({
          ...prev,
          user: {
            ...(prev?.user || {}),
            projects: orderedProjects,
          },
        }));
      }
      localStorage.setItem(`data_${data?.user?.username}`, JSON.stringify({
        ...data,
        user: {
          ...(data?.user || {}),
          projects: orderedProjects,
        },
      }));

      // Update original order after successful save
      const newOrder = projects.filter((p) => p._id).map((p) => p._id);
      setOriginalOrder(newOrder);

      toast.success(content?.orderSaved || "Order saved");
    } catch (error) {
      await handleApiError({ error, defaultErrorMsg: content?.errorMessage, toast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="space-y-4"
      dir={user?.displayLanguage === "ar" ? "rtl" : "ltr"}
    >
      <h3 className="text-lg font-bold text-gray-800">
        🚀 {content?.title}
      </h3>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-2 md:p-4 rounded-xl border border-green-200 space-y-3">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={projects.map((p) => p.localId)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {projects.map((proj, index) => (
                <SortableItem key={proj.localId} id={proj.localId}>
                  {({
                    attributes,
                    listeners,
                    setActivatorNodeRef,
                    isDragging,
                  }) => (
                    <div
                      key={proj._id || `new-${index}`}
                      className={`bg-white pb-1 border rounded-xl shadow-sm hover:shadow-md transition-all duration-500 overflow-hidden ${
                        deletingIds.has(proj._id)
                          ? "opacity-60 grayscale pointer-events-none ring-2 ring-red-100 border-red-200 scale-[0.99]"
                          : validationErrors[index]
                            ? "border-red-300 ring-1 ring-red-200"
                            : isDragging
                              ? "border-green-400 bg-green-50 shadow-lg scale-[1.02] z-50"
                              : highlightedId === proj._id ||
                                  highlightedId === `new-${index}`
                                ? "border-blue-400 bg-blue-50/50 shadow-md scale-[1.01]"
                                : "border-gray-200"
                      }`}
                    >
                      {/* Collapsible Header with Editable Title */}
                      <div className="p-1 sm:p-4 flex items-center justify-between gap-1 sm:gap-3 bg-white">
                        <div className="flex-grow flex items-center gap-1 sm:gap-3">
                          {/* Draggable Grip Handle + Number */}
                          <div
                            ref={setActivatorNodeRef}
                            {...listeners}
                            {...attributes}
                            className="flex-shrink-0 h-4 sm:h-8 px-1 sm:px-2 flex items-center justify-center gap-0.5 sm:gap-1 bg-green-100 text-green-700 rounded-lg border border-green-200 shadow-sm cursor-grab active:cursor-grabbing hover:bg-green-200 transition-colors touch-none"
                          >
                            <GripVertical className="w-2 h-2 sm:w-3 sm:h-3 opacity-50" />
                            <span className="font-bold text-[8px] sm:text-xs">
                              {index + 1}
                            </span>
                          </div>
                          <div className="w-full">
                            <input
                              type="text"
                              placeholder={content?.projectTitle}
                              value={proj.title}
                              maxLength={100}
                              onChange={(e) =>
                                updateObjectInArray(
                                  projects,
                                  setProjects,
                                  index,
                                  "title",
                                  e.target.value,
                                )
                              }
                              className={`w-full px-1 py-0.5 sm:px-3 sm:py-2 text-[9px] sm:text-base border rounded-lg focus:outline-none transition bg-white ${validationErrors[index]?.title ? "border-red-500 ring-1 ring-red-100" : "border-gray-300 focus:ring-2 focus:ring-green-500"}`}
                              onClick={(e) => e.stopPropagation()}
                            />
                            {validationErrors[index]?.title && (
                              <p className="text-red-500 text-[8px] sm:text-xs mt-0.5 sm:mt-1.5 flex items-center gap-1 font-medium animate-in slide-in-from-top-1">
                                <AlertCircle className="w-2.5 h-2.5 sm:w-[14px] sm:h-[14px]" />
                                {content?.titleRequired ||
                                  "Title is required"}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-0 sm:gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleCollapse(index)}
                            className={`p-0.5 sm:p-2 rounded-lg transition-colors flex items-center gap-1 sm:gap-2 text-[8px] sm:text-sm font-medium ${proj.collapsed ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            title={
                              proj.collapsed
                                ? content?.edit
                                : content?.collapse || "Collapse"
                            }
                          >
                            {proj.collapsed ? (
                              <Pencil className="w-2.5 h-2.5 sm:w-[16px] sm:h-[16px]" />
                            ) : (
                              <X className="w-2.5 h-2.5 sm:w-[16px] sm:h-[16px]" />
                            )}
                            <span className="hidden md:inline">
                              {proj.collapsed
                                ? content?.edit
                                : content?.close || "Close"}
                            </span>
                          </button>

                          <div className="w-px h-3 sm:h-6 bg-gray-200 mx-0.5 sm:mx-1"></div>

                          <button
                            type="button"
                            onClick={() => moveItemUp(index)}
                            disabled={index === 0}
                            className="p-0.5 sm:p-1.5 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed hidden sm:block"
                            title={content?.moveUp || "Move Up"}
                          >
                            <ArrowUp className="w-2.5 h-2.5 sm:w-[16px] sm:h-[16px] text-gray-600" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItemDown(index)}
                            disabled={index === projects.length - 1}
                            className="p-0.5 sm:p-1.5 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed hidden sm:block"
                            title={content?.moveDown || "Move Down"}
                          >
                            <ArrowDown className="w-2.5 h-2.5 sm:w-[16px] sm:h-[16px] text-gray-600" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setProjectToDelete(index)}
                            className="p-0.5 sm:p-1.5 hover:bg-red-100 rounded-lg transition-colors text-red-500 ml-0.5 sm:ml-1"
                            title={content?.delete}
                            disabled={deletingIds.has(proj._id)}
                          >
                            {deletingIds.has(proj._id) ? (
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

                      {!proj.collapsed && (
                        <div className="p-3 md:p-4 border-t border-gray-100 space-y-3 bg-gray-50/50 animate-in fade-in slide-in-from-top-1 duration-200">
                          <div>
                            <textarea
                              placeholder={content?.projectDescription}
                              value={proj.description || ""}
                              maxLength={2000}
                              onChange={(e) =>
                                updateObjectInArray(
                                  projects,
                                  setProjects,
                                  index,
                                  "description",
                                  e.target.value,
                                )
                              }
                              className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-base border rounded-lg focus:outline-none h-16 sm:h-20 transition bg-white ${validationErrors[index]?.description ? "border-red-500 ring-1 ring-red-100" : "border-gray-300 focus:ring-2 focus:ring-green-500"}`}
                            />
                            {validationErrors[index]?.description && (
                              <p className="text-red-500 text-[9px] sm:text-xs mt-1 sm:mt-1.5 flex items-center gap-1 sm:gap-1.5 font-medium animate-in slide-in-from-top-1">
                                <AlertCircle className="w-3 h-3 sm:w-[14px] sm:h-[14px]" />
                                {content?.descriptionRequired ||
                                  "Description is required"}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 sm:gap-2">
                            <div>
                              <input
                                type="url"
                                placeholder={content?.projectLink}
                                value={proj.link || ""}
                                maxLength={1000}
                                onChange={(e) =>
                                  updateObjectInArray(
                                    projects,
                                    setProjects,
                                    index,
                                    "link",
                                    e.target.value,
                                  )
                                }
                                className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-base border rounded-lg focus:outline-none transition bg-white ${validationErrors[index]?.link ? "border-red-500 ring-1 ring-red-100" : "border-gray-300 focus:ring-2 focus:ring-green-500"}`}
                              />
                              {validationErrors[index]?.link && (
                                <p className="text-red-500 text-[9px] sm:text-xs mt-1 sm:mt-1.5 flex items-center gap-1 sm:gap-1.5 font-medium animate-in slide-in-from-top-1">
                                  <AlertCircle className="w-3 h-3 sm:w-[14px] sm:h-[14px]" />
                                  {content?.linkRequired ||
                                    "Link is required"}
                                </p>
                              )}
                            </div>

                            <div>
                              {/* Image upload with preview */}
                              <div className="flex items-center gap-2">
                                <label
                                  htmlFor={`proj-img-${proj.localId}`}
                                  className={`cursor-pointer flex items-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-sm border rounded-lg transition bg-white hover:bg-green-50 ${
                                    validationErrors[index]?.image
                                      ? "border-red-500 text-red-500"
                                      : "border-gray-300 text-green-700 hover:border-green-400"
                                  }`}
                                >
                                  <ImagePlus className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span>{content?.projectImage || "Project Image"}</span>
                                  <input
                                    id={`proj-img-${proj.localId}`}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleProjectImageUpload(proj.localId, e)}
                                  />
                                </label>
                                {/* Preview thumbnail */}
                                {projectImages[proj.localId]?.preview && (
                                  <div className="relative flex-shrink-0">
                                    <Image
                                      src={projectImages[proj.localId].preview}
                                      alt="preview"
                                      width={56}
                                      height={56}
                                      className="w-10 h-10 sm:w-14 sm:h-14 object-cover rounded-lg border border-green-200 shadow-sm"
                                      unoptimized
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setProjectImages(prev => ({
                                          ...prev,
                                          [proj.localId]: { preview: null, file: null },
                                        }))
                                      }
                                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow transition-colors"
                                    >
                                      <X size={10} />
                                    </button>
                                  </div>
                                )}
                              </div>
                              {validationErrors[index]?.image && (
                                <p className="text-red-500 text-[9px] sm:text-xs mt-1 sm:mt-1.5 flex items-center gap-1 sm:gap-1.5 font-medium animate-in slide-in-from-top-1">
                                  <AlertCircle className="w-3 h-3 sm:w-[14px] sm:h-[14px]" />
                                  {content?.imageRequired || "Image is required"}
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <input
                              type="text"
                              placeholder={
                                content?.technologies + " (e.g. t1,t2,t3)"
                              }
                              value={(proj.technologies || []).join(", ")}
                              onChange={(e) =>
                                updateObjectInArray(
                                  projects,
                                  setProjects,
                                  index,
                                  "technologies",
                                  e.target.value
                                    .split(",")
                                    .map((t) => t.trim()),
                                )
                              }
                              className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-base border rounded-lg focus:outline-none transition bg-white ${validationErrors[index]?.technologies ? "border-red-500 ring-1 ring-red-100" : "border-gray-300 focus:ring-2 focus:ring-green-500"}`}
                            />
                            {validationErrors[index]?.technologies && (
                              <p className="text-red-500 text-[9px] sm:text-xs mt-1 sm:mt-1.5 flex items-center gap-1 sm:gap-1.5 font-medium animate-in slide-in-from-top-1">
                                <AlertCircle className="w-3 h-3 sm:w-[14px] sm:h-[14px]" />
                                {content?.technologiesRequired ||
                                  "Technologies are required"}
                              </p>
                            )}
                          </div>

                          {proj.technologies &&
                            proj.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {proj.technologies.map((tech, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[9px] sm:text-xs bg-green-100 text-green-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}

                          <div className="flex justify-end pt-2">
                            <button
                              type="button"
                              onClick={() => saveProjectItem(index)}
                              disabled={savingIds.has(index)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 transition-colors disabled:opacity-50"
                            >
                              {savingIds.has(index) ? (
                                <Loader size={12} className="animate-spin" />
                              ) : (
                                <CheckCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                              )}
                              {content?.save || "Save"}
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
          onClick={() =>
            addArrayItem(projects, setProjects, {
              title: "",
              description: "",
              link: "",
              image: "",
              technologies: [],
              collapsed: false, // Expand the new item
            })
          }
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-1.5 sm:py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 mt-2 text-xs sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />{" "}
          {content?.addProject}
        </button>
      </div>

      {/* Only show Save Order button if there are 2+ items */}
      {projects.filter((p) => p._id).length >= 2 && (
        <div className="flex justify-end py-4 border-b-2 border-gray-200">
          <button
            onClick={saveOrder}
            disabled={
              loading ||
              (() => {
                const currentOrder = projects
                  .filter((p) => p._id)
                  .map((p) => p._id);
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
                {content?.saving}
              </>
            ) : (
              `💾 ${content?.saveOrder || "Save Order"}`
            )}
          </button>
        </div>
      )}

      {/* Professional Delete Modal with Portal - Inlined */}
      {mounted &&
        projectToDelete !== null &&
        createPortal(
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9999] p-4 animate-in fade-in duration-200">
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative flex flex-col items-center text-center transform transition-all scale-100 border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setProjectToDelete(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100"
                title={content?.close || "Close"}
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
                      {content?.deleteConfirm ||
                        "Are you sure you want to delete this project?"}
                    </span>
                    <span className="font-bold text-black border-t pt-2 mt-1 break-all">
                      "
                      {projects[projectToDelete]?.title ||
                        content?.thisProject ||
                        "this project"}
                      "
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setProjectToDelete(null)}
                  className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-all duration-200"
                >
                  {content?.cancel || "Cancel"}
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md transition duration-200 flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  <span>{content?.delete || "Delete"}</span>
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
