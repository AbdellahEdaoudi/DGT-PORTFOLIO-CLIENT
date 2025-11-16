"use client";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { CheckCheck, Loader, Plus, Trash2 } from "lucide-react";

export default function Projects({ userData }) {
  const [projects, setProjects] = useState(userData.projects || []);
  const [loading, setLoading] = useState(false);

  const addArrayItem = (array, setArray, newItem) => setArray([...array, newItem]);
  const removeArrayItem = (array, setArray, index) =>
    setArray(array.filter((_, i) => i !== index));
  const updateObjectInArray = (array, setArray, index, key, value) => {
    const updated = [...array];
    updated[index] = { ...updated[index], [key]: value };
    setArray(updated);
  };

  const saveProjects = async () => {
    setLoading(true);
    try {
      await axios.put(`/api/proxy/users/update/projects`, { projects });
      toast(
        <p className="flex gap-3 items-center">
          <CheckCheck className="text-green-500" /> Saved successfully!
        </p>,
        { autoClose: 2000 }
      );
    } catch (error) {
      console.error("Error updating projects:", error);
      toast.error("Failed to update projects!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800">🚀 Projects</h3>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-2 md:p-4 rounded-xl border border-green-200 space-y-3">
        <div className="space-y-2">
          {projects.map((proj, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-2 md:p-4 shadow-sm hover:shadow-md transition-all duration-300 space-y-3"
            >
              <input
                type="text"
                placeholder="Project Title"
                value={proj.title}
                onChange={(e) =>
                  updateObjectInArray(projects, setProjects, index, "title", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white transition"
              />

              <textarea
                placeholder="Project Description"
                value={proj.description || ""}
                onChange={(e) =>
                  updateObjectInArray(projects, setProjects, index, "description", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white h-20 transition"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  type="url"
                  placeholder="Project Link"
                  value={proj.link || ""}
                  onChange={(e) =>
                    updateObjectInArray(projects, setProjects, index, "link", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white transition"
                />
                <input
                  type="url"
                  placeholder="Image URL"
                  value={proj.image || ""}
                  onChange={(e) =>
                    updateObjectInArray(projects, setProjects, index, "image", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white transition"
                />
              </div>

              <input
                type="text"
                placeholder="Technologies (comma separated)"
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
                  placeholder="Start Date"
                  value={proj.startDate || ""}
                  onChange={(e) =>
                    updateObjectInArray(projects, setProjects, index, "startDate", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white transition"
                />
                <input
                  type="text"
                  placeholder="End Date"
                  value={proj.endDate || ""}
                  onChange={(e) =>
                    updateObjectInArray(projects, setProjects, index, "endDate", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white transition"
                />
              </div>

              <button
                type="button"
                onClick={() => removeArrayItem(projects, setProjects, index)}
                className="w-full hover:bg-red-100 rounded-lg p-1 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={18} className="text-red-500" /> Delete
              </button>
            </div>
          ))}
        </div>

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
            })
          }
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
        >
          <Plus size={18} /> Add Project
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
              <Loader size={20} className="animate-spin" /> Saving...
            </>
          ) : (
            "💾 Save"
          )}
        </button>
      </div>
    </div>
  );
}
