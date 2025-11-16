"use client";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { CheckCheck, Loader, Plus, Trash2 } from "lucide-react";

export default function Experience({ userData }) {
  const [experience, setExperience] = useState(userData.experience || []);
  const [loading, setLoading] = useState(false);

  const addArrayItem = (array, setArray, newItem) => setArray([...array, newItem]);
  const removeArrayItem = (array, setArray, index) =>
    setArray(array.filter((_, i) => i !== index));

  const updateObjectInArray = (array, setArray, index, key, value) => {
    const updated = [...array];
    updated[index] = { ...updated[index], [key]: value };
    setArray(updated);
  };

  const saveExperience = async () => {
    setLoading(true);
    try {
      await axios.put(`/api/proxy/users/update/experience`, { experience });
      toast(
        <p className="flex gap-3 items-center">
          <CheckCheck className="text-amber-500" /> Saved successfully!
        </p>,
        { autoClose: 2000 }
      );
    } catch (error) {
      console.error("Error updating experience:", error);
      toast.error("Failed to update experience!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800">⭐ Experience</h3>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-2 md:p-4 rounded-xl border border-amber-200 space-y-3">
        <div className="space-y-2">
          {experience.map((exp, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-2 md:p-4 shadow-sm hover:shadow-md transition-all duration-300 space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Company Name"
                  value={exp.company}
                  onChange={(e) =>
                    updateObjectInArray(experience, setExperience, index, "company", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white transition"
                />
                <input
                  type="text"
                  placeholder="Job Role"
                  value={exp.role}
                  onChange={(e) =>
                    updateObjectInArray(experience, setExperience, index, "role", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white transition"
                />
              </div>

              <textarea
                placeholder="Job Description"
                value={exp.description || ""}
                onChange={(e) =>
                  updateObjectInArray(experience, setExperience, index, "description", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white h-20 transition"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Start Date"
                  value={exp.startDate || ""}
                  onChange={(e) =>
                    updateObjectInArray(experience, setExperience, index, "startDate", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white transition"
                />
                <input
                  type="text"
                  placeholder="End Date"
                  value={exp.endDate || ""}
                  onChange={(e) =>
                    updateObjectInArray(experience, setExperience, index, "endDate", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white transition"
                />
              </div>

              <button
                type="button"
                onClick={() => removeArrayItem(experience, setExperience, index)}
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
            addArrayItem(experience, setExperience, {
              company: "",
              role: "",
              description: "",
              startDate: "",
              endDate: "",
            })
          }
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
        >
          <Plus size={18} /> Add Experience
        </button>
      </div>

      <div className="flex justify-end py-4 border-b-2 border-gray-200">
        <button
          onClick={saveExperience}
          disabled={loading}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg"
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
