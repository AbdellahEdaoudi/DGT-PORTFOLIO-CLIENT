"use client";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";
import { ArrowUp, ArrowDown, CheckCheck, Loader, Plus, Trash2, X, Pencil, AlertCircle } from "../../components/Icons";
import { getTranslation } from '../../translations/update-profile'

export default function Projects({ userData, setUserDetails }) {
  const t = getTranslation(userData?.displayLanguage || 'en');
  const [projects, setProjects] = useState(
    (userData.projects || []).map(p => ({ ...p, collapsed: true }))
  );
  // Track original order for comparison
  const [originalOrder, setOriginalOrder] = useState(
    (userData.projects || []).filter(p => p._id).map(p => p._id)
  );
  const [loading, setLoading] = useState(false);
  const [savingIds, setSavingIds] = useState(new Set());
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [validationErrors, setValidationErrors] = useState({});
  const [projectToDelete, setProjectToDelete] = useState(null); // ID or Index of project to delete
  const [highlightedId, setHighlightedId] = useState(null);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  const addArrayItem = (array, setArray, newItem) => {
    if (array.length >= 10) return;
    const newIndex = array.length;
    setArray([...array, { ...newItem, collapsed: false }]);
    // Subtle highlight for the newly added item
    setHighlightedId(`new-${newIndex}`);
    setTimeout(() => setHighlightedId(null), 2000);
  };

  const updateObjectInArray = (array, setArray, index, key, value) => {
    const updated = [...array];
    updated[index] = { ...updated[index], [key]: value };
    setArray(updated);

    // Clear validation error when user types
    if (validationErrors[index]?.[key]) {
      setValidationErrors(prev => ({
        ...prev,
        [index]: { ...prev[index], [key]: false }
      }));
    }
  };

  const toggleCollapse = (index) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], collapsed: !updated[index].collapsed };
    setProjects(updated);
  };

  const moveItemUp = (index) => {
    if (index === 0) return;
    const newItems = [...projects];
    const itemToMove = newItems[index];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
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
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    setProjects(newItems);

    // Subtle highlight for the moved item
    const targetId = itemToMove._id || `new-${index + 1}`;
    setHighlightedId(targetId);
    setTimeout(() => setHighlightedId(null), 1500);
  };

  // 🟢 Save Single Project
  const saveProjectItem = async (index) => {
    const project = projects[index];
    const errors = {};
    if (!project.title?.trim()) errors.title = true;
    if (!project.description?.trim()) errors.description = true;

    if (Object.keys(errors).length > 0) {
      setValidationErrors(prev => ({ ...prev, [index]: errors }));
      // Expand if collapsed to show errors
      if (project.collapsed) toggleCollapse(index);
      return;
    }

    setSavingIds(prev => new Set(prev).add(index));
    try {
      const { collapsed, ...projectData } = project;
      const res = await axios.put('/api/proxy/users/update/projects/item', projectData);

      const newProjectsList = res.data.projects;
      const mergedProjects = newProjectsList.map((p, i) => {
        const oldP = projects.find(op => op._id === p._id) || (projects[i] && !projects[i]._id ? projects[i] : null);
        return { ...p, collapsed: oldP ? oldP.collapsed : true };
      });

      setProjects(mergedProjects);
      if (setUserDetails) {
        setUserDetails(prev => ({ ...prev, projects: newProjectsList }));
      }

      toast.success(t('projects.savedSuccessfully'));
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[index];
        return next;
      });

      // Trigger success effect
      const savedProject = mergedProjects[index];
      if (savedProject && savedProject._id) {
        setHighlightedId(savedProject._id);
        setTimeout(() => setHighlightedId(null), 2000);
      }

    } catch (error) {
      console.error("Error saving project:", error);
      toast.error(t('projects.errorMessage'));
    } finally {
      setSavingIds(prev => {
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

    setDeletingIds(prev => new Set(prev).add(project._id));
    try {
      const res = await axios.delete(`/api/proxy/users/update/projects/${project._id}`);

      const newProjectsList = res.data.projects;
      setProjects(newProjectsList.map(p => ({ ...p, collapsed: true })));

      if (setUserDetails) {
        setUserDetails(prev => ({ ...prev, projects: newProjectsList }));
      }
      toast.success(t('projects.deletedSuccessfully') || "Deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error(t('projects.errorMessage'));
    } finally {
      setDeletingIds(prev => {
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
      const projectsWithIds = projects.filter(p => p._id).map(p => ({ _id: p._id }));

      if (projectsWithIds.length !== projects.length) {
        toast.warning(t('projects.saveNewItemsFirst') || "Please save new items first");
        setLoading(false);
        return;
      }

      await axios.put(`/api/proxy/users/update/projects/order`, { projects: projectsWithIds });

      // Update global state
      if (setUserDetails) {
        setUserDetails(prev => ({
          ...prev,
          projects: projects.map(({ collapsed, ...rest }) => rest)
        }));
      }

      // Update original order after successful save
      const newOrder = projects.filter(p => p._id).map(p => p._id);
      setOriginalOrder(newOrder);

      toast(
        <p className="flex gap-3 items-center">
          <CheckCheck className="text-green-500" /> {t('projects.orderSaved') || "Order saved"}
        </p>,
        { autoClose: 2000 }
      );
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(t('projects.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4" dir={userData?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <h3 className="text-lg font-bold text-gray-800">🚀 {t('projects.title')}</h3>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-2 md:p-4 rounded-xl border border-green-200 space-y-3">
        <div className="space-y-2">
          {projects.map((proj, index) => (
            <div
              key={proj._id || `new-${index}`}
              className={`bg-white pb-1 border rounded-xl shadow-sm hover:shadow-md transition-all duration-500 overflow-hidden ${deletingIds.has(proj._id) ? 'opacity-60 grayscale pointer-events-none ring-2 ring-red-100 border-red-200 scale-[0.99]' :
                validationErrors[index] ? 'border-red-300 ring-1 ring-red-200' :
                  (highlightedId === proj._id || highlightedId === `new-${index}`) ? 'border-blue-400 bg-blue-50/50 shadow-md scale-[1.01]' :
                    'border-gray-200'
                }`}
            >
              {/* Collapsible Header with Editable Title */}
              <div
                className="p-1 sm:p-4 flex items-center justify-between gap-1 sm:gap-3 bg-white"
              >
                <div className="flex-grow flex items-center gap-1 sm:gap-3">
                  <div className="flex-shrink-0 w-4 h-4 sm:w-8 sm:h-8 flex items-center justify-center bg-green-100 text-green-700 rounded-full font-bold text-[8px] sm:text-sm border border-green-200 shadow-sm">
                    {index + 1}
                  </div>
                  <div className="w-full">
                    <input
                      type="text"
                      placeholder={t('projects.projectTitle')}
                      value={proj.title}
                      maxLength={100}
                      onChange={(e) =>
                        updateObjectInArray(projects, setProjects, index, "title", e.target.value)
                      }
                      className={`w-full px-1 py-0.5 sm:px-3 sm:py-2 text-[9px] sm:text-base border rounded-lg focus:outline-none transition bg-white ${validationErrors[index]?.title ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-300 focus:ring-2 focus:ring-green-500'}`}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {validationErrors[index]?.title && (
                      <p className="text-red-500 text-[8px] sm:text-xs mt-0.5 sm:mt-1.5 flex items-center gap-1 font-medium animate-in slide-in-from-top-1">
                        <AlertCircle className="w-2.5 h-2.5 sm:w-[14px] sm:h-[14px]" />
                        {t('projects.titleRequired') || "Title is required"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-0 sm:gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleCollapse(index)}
                    className={`p-0.5 sm:p-2 rounded-lg transition-colors flex items-center gap-1 sm:gap-2 text-[8px] sm:text-sm font-medium ${proj.collapsed ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    title={proj.collapsed ? t('projects.edit') : t('projects.collapse') || "Collapse"}
                  >
                    {proj.collapsed ? <Pencil className="w-2.5 h-2.5 sm:w-[16px] sm:h-[16px]" /> : <X className="w-2.5 h-2.5 sm:w-[16px] sm:h-[16px]" />}
                    <span className="hidden md:inline">{proj.collapsed ? t('projects.edit') : (t('projects.close') || "Close")}</span>
                  </button>

                  <div className="w-px h-3 sm:h-6 bg-gray-200 mx-0.5 sm:mx-1"></div>

                  <button
                    type="button"
                    onClick={() => moveItemUp(index)}
                    disabled={index === 0}
                    className="p-0.5 sm:p-1.5 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title={t('projects.moveUp') || "Move Up"}
                  >
                    <ArrowUp className="w-2.5 h-2.5 sm:w-[16px] sm:h-[16px] text-gray-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItemDown(index)}
                    disabled={index === projects.length - 1}
                    className="p-0.5 sm:p-1.5 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title={t('projects.moveDown') || "Move Down"}
                  >
                    <ArrowDown className="w-2.5 h-2.5 sm:w-[16px] sm:h-[16px] text-gray-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectToDelete(index)}
                    className="p-0.5 sm:p-1.5 hover:bg-red-100 rounded-lg transition-colors text-red-500 ml-0.5 sm:ml-1"
                    title={t('projects.delete')}
                    disabled={deletingIds.has(proj._id)}
                  >
                    {deletingIds.has(proj._id) ? <Loader size={12} className="w-2.5 h-2.5 sm:w-[16px] sm:h-[16px] animate-spin" /> : <Trash2 className="w-2.5 h-2.5 sm:w-[16px] sm:h-[16px]" />}
                  </button>
                </div>
              </div>

              {!proj.collapsed && (
                <div className="p-3 md:p-4 border-t border-gray-100 space-y-3 bg-gray-50/50 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div>
                    <textarea
                      placeholder={t('projects.projectDescription')}
                      value={proj.description || ""}
                      maxLength={2000}
                      onChange={(e) =>
                        updateObjectInArray(projects, setProjects, index, "description", e.target.value)
                      }
                      className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-base border rounded-lg focus:outline-none h-16 sm:h-20 transition bg-white ${validationErrors[index]?.description ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-300 focus:ring-2 focus:ring-green-500'}`}
                    />
                    {validationErrors[index]?.description && (
                      <p className="text-red-500 text-[9px] sm:text-xs mt-1 sm:mt-1.5 flex items-center gap-1 sm:gap-1.5 font-medium animate-in slide-in-from-top-1">
                        <AlertCircle className="w-3 h-3 sm:w-[14px] sm:h-[14px]" />
                        {t('projects.descriptionRequired') || "Description is required"}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 sm:gap-2">
                    <input
                      type="url"
                      placeholder={t('projects.projectLink')}
                      value={proj.link || ""}
                      maxLength={1000}
                      onChange={(e) =>
                        updateObjectInArray(projects, setProjects, index, "link", e.target.value)
                      }
                      className="px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white transition"
                    />
                    <input
                      type="url"
                      placeholder={t('projects.projectImage')}
                      value={proj.image || ""}
                      maxLength={1000}
                      onChange={(e) =>
                        updateObjectInArray(projects, setProjects, index, "image", e.target.value)
                      }
                      className="px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white transition"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder={t('projects.technologies') + " (e.g. t1,t2,t3)"}
                    value={(proj.technologies || []).join(", ")}
                    onChange={(e) =>
                      updateObjectInArray(
                        projects,
                        setProjects,
                        index,
                        "technologies",
                        e.target.value.split(",").map((t) => t.trim())
                      )
                    }
                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white transition"
                  />

                  {proj.technologies && proj.technologies.length > 0 && (
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
                      {savingIds.has(index) ? <Loader size={12} className="animate-spin" /> : <CheckCheck className="w-3 h-3 sm:w-4 sm:h-4" />}
                      {t('projects.save') || "Save"}
                    </button>
                  </div>

                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Project Button Moved to Bottom */}
        <button
          type="button"
          onClick={() =>
            addArrayItem(projects, setProjects, {
              title: "",
              description: "",
              link: "",
              image: "",
              technologies: [],
              collapsed: false // Expand the new item
            })
          }
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-1.5 sm:py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 mt-2 text-xs sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> {t('projects.addProject')}
        </button>
      </div>

      {/* Only show Save Order button if there are 2+ items */}
      {projects.filter(p => p._id).length >= 2 && (
        <div className="flex justify-end py-4 border-b-2 border-gray-200">
          <button
            onClick={saveOrder}
            disabled={loading || (() => {
              const currentOrder = projects.filter(p => p._id).map(p => p._id);
              return JSON.stringify(currentOrder) === JSON.stringify(originalOrder);
            })()}
            className="bg-gray-800 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-4 py-2 sm:px-8 sm:py-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg text-xs sm:text-base"
          >
            {loading ? (
              <>
                <Loader size={20} className="animate-spin w-4 h-4 sm:w-5 sm:h-5" /> {t('projects.saving')}
              </>
            ) : (
              `💾 ${t('projects.saveOrder') || "Save Order"}`
            )}
          </button>
        </div>
      )}

      {/* Professional Delete Modal with Portal - Inlined */}
      {mounted && projectToDelete !== null && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9999] p-4 animate-in fade-in duration-200">
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative flex flex-col items-center text-center transform transition-all scale-100 border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setProjectToDelete(null)}
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
                  <span className="font-semibold text-gray-800">Are you sure you want to delete this project?</span>
                  <span className="font-bold text-black border-t pt-2 mt-1 break-all">"{projects[projectToDelete]?.title || t('projects.thisProject') || "this project"}"</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => setProjectToDelete(null)}
                className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-all duration-200"
              >
                {t('projects.cancel') || "Cancel"}
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md transition duration-200 flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                <span>{t('projects.delete') || "Delete"}</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
