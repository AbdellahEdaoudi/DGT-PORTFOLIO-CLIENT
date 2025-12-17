"use client";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { ArrowUp, ArrowDown, CheckCheck, Loader, Plus, Trash2, X, Pencil } from "../../Components/Icons";

import { useTranslation } from "../../lib/translations";

export default function Projects({ userData, setUserDetails }) {
  const { t } = useTranslation(userData?.displayLanguage || 'en');
  // Initialize projects with collapsed: true for existing items to save space
  const [projects, setProjects] = useState(
    (userData.projects || []).map(p => ({ ...p, collapsed: true }))
  );
  const [loading, setLoading] = useState(false);

  // Reverted to append new items to the end of the array as button is now at bottom
  const addArrayItem = (array, setArray, newItem) => setArray([...array, newItem]);

  const removeArrayItem = (array, setArray, index) =>
    setArray(array.filter((_, i) => i !== index));

  const updateObjectInArray = (array, setArray, index, key, value) => {
    const updated = [...array];
    updated[index] = { ...updated[index], [key]: value };
    setArray(updated);
  };

  const toggleCollapse = (index) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], collapsed: !updated[index].collapsed };
    setProjects(updated);
  };

  const moveItemUp = (index) => {
    if (index === 0) return;
    const newProjects = [...projects];
    [newProjects[index - 1], newProjects[index]] = [newProjects[index], newProjects[index - 1]];
    setProjects(newProjects);
  };

  const moveItemDown = (index) => {
    if (index === projects.length - 1) return;
    const newProjects = [...projects];
    [newProjects[index], newProjects[index + 1]] = [newProjects[index + 1], newProjects[index]];
    setProjects(newProjects);
  };

  const saveProjects = async () => {
    setLoading(true);
    try {
      // Clean projects (remove collapsed property) before saving
      const cleanProjects = projects.map(({ collapsed, ...rest }) => rest);
      await axios.put(`/api/proxy/users/update/projects`, { projects: cleanProjects });

      // Update global state to reflect changes immediately without refresh
      if (setUserDetails) {
        setUserDetails(prev => ({
          ...prev,
          projects: cleanProjects
        }));
      }

      toast(
        <p className="flex gap-3 items-center">
          <CheckCheck className="text-green-500" /> {t('savedSuccessfully')}
        </p>,
        { autoClose: 2000 }
      );
    } catch (error) {
      console.error("Error updating projects:", error);
      toast.error(t('errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4" dir={userData?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <h3 className="text-lg font-bold text-gray-800">🚀 {t('projects')}</h3>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-2 md:p-4 rounded-xl border border-green-200 space-y-3">
        <div className="space-y-2">
          {projects.map((proj, index) => (
            <div
              key={index}
              className="bg-white pb-1 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* Collapsible Header with Editable Title */}
              <div
                className="p-3 md:p-4 flex items-center justify-between gap-3 bg-white"
              >
                <div className="flex-grow">
                  <input
                    type="text"
                    placeholder={t('projectTitle')}
                    value={proj.title}
                    maxLength={100}
                    onChange={(e) =>
                      updateObjectInArray(projects, setProjects, index, "title", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white transition"
                  />
                </div>

                <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleCollapse(index)}
                    className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${proj.collapsed ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    title={proj.collapsed ? t('edit') : t('collapse') || "Collapse"}
                  >
                    {proj.collapsed ? <Pencil size={16} /> : <X size={16} />}
                    <span className="hidden md:inline">{proj.collapsed ? t('edit') : (t('close') || "Close")}</span>
                  </button>

                  <div className="w-px h-6 bg-gray-200 mx-1"></div>

                  <button
                    type="button"
                    onClick={() => moveItemUp(index)}
                    disabled={index === 0}
                    className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title={t('moveUp') || "Move Up"}
                  >
                    <ArrowUp size={16} className="text-gray-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItemDown(index)}
                    disabled={index === projects.length - 1}
                    className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title={t('moveDown') || "Move Down"}
                  >
                    <ArrowDown size={16} className="text-gray-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeArrayItem(projects, setProjects, index)}
                    className="p-1.5 hover:bg-red-100 rounded-lg transition-colors text-red-500 ml-1"
                    title={t('delete')}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {!proj.collapsed && (
                <div className="p-3 md:p-4 border-t border-gray-100 space-y-3 bg-gray-50/50 animate-in fade-in slide-in-from-top-1 duration-200">
                  <textarea
                    placeholder={t('projectDescription')}
                    value={proj.description || ""}
                    maxLength={2000}
                    onChange={(e) =>
                      updateObjectInArray(projects, setProjects, index, "description", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white h-20 transition"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input
                      type="url"
                      placeholder={t('projectLink')}
                      value={proj.link || ""}
                      maxLength={1000}
                      onChange={(e) =>
                        updateObjectInArray(projects, setProjects, index, "link", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white transition"
                    />
                    <input
                      type="url"
                      placeholder={t('projectImage')}
                      value={proj.image || ""}
                      maxLength={1000}
                      onChange={(e) =>
                        updateObjectInArray(projects, setProjects, index, "image", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white transition"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder={t('technologies') + " (e.g. t1,t2,t3)"}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white transition"
                  />

                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {proj.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder={t('startDate')}
                      value={proj.startDate || ""}
                      maxLength={20}
                      onChange={(e) =>
                        updateObjectInArray(projects, setProjects, index, "startDate", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white transition"
                    />
                    <input
                      type="text"
                      placeholder={t('endDate')}
                      value={proj.endDate || ""}
                      maxLength={20}
                      onChange={(e) =>
                        updateObjectInArray(projects, setProjects, index, "endDate", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white transition"
                    />
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
              startDate: "",
              endDate: "",
              collapsed: false // Expand the new item
            })
          }
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 mt-2"
        >
          <Plus size={18} /> {t('addProject')}
        </button>
      </div>

      <div className="flex justify-end py-4 border-b-2 border-gray-200">
        <button
          onClick={saveProjects}
          disabled={loading}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg"
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" /> {t('saving')}
            </>
          ) : (
            `💾 ${t('save')} `
          )}
        </button>
      </div>
    </div>
  );
}
