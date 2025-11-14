"use client";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { CheckCheck, Loader, Plus, Trash2 } from "lucide-react";

export default function Education({ userData }) {
  const [education, setEducation] = useState(userData.education || []);
  const [loading, setLoading] = useState(false);

  const addArrayItem = (array, setArray, newItem) => setArray([...array, newItem]);
  const removeArrayItem = (array, setArray, index) =>
    setArray(array.filter((_, i) => i !== index));
  const updateObjectInArray = (array, setArray, index, key, value) => {
    const updated = [...array];
    updated[index] = { ...updated[index], [key]: value };
    setArray(updated);
  };

  const saveEducation = async () => {
    setLoading(true);
    try {
      await axios.put(`/api/proxy/users/update/education`, { education });
      toast(
        <p className="flex gap-3 items-center">
          <CheckCheck className="text-blue-500" /> Saved successfully!
        </p>,
        { autoClose: 2000 }
      );
    } catch (error) {
      console.error("Error updating education:", error);
      toast.error("Failed to update education!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800">🎓 Education</h3>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200 space-y-3">
        <div className="space-y-2">
          {education.map((edu, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="School/University Name"
                  value={edu.school}
                  onChange={(e) =>
                    updateObjectInArray(education, setEducation, index, "school", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
                />
                <input
                  type="text"
                  placeholder="Degree (e.g. Bachelor)"
                  value={edu.degree || ""}
                  onChange={(e) =>
                    updateObjectInArray(education, setEducation, index, "degree", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
                />
                <input
                  type="text"
                  placeholder="Field (e.g. Computer Science)"
                  value={edu.field || ""}
                  onChange={(e) =>
                    updateObjectInArray(education, setEducation, index, "field", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Start Year"
                    value={edu.startYear || ""}
                    onChange={(e) =>
                      updateObjectInArray(education, setEducation, index, "startYear", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
                  />
                  <input
                    type="text"
                    placeholder="End Year"
                    value={edu.endYear || ""}
                    onChange={(e) =>
                      updateObjectInArray(education, setEducation, index, "endYear", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeArrayItem(education, setEducation, index)}
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
            addArrayItem(education, setEducation, {
              school: "",
              degree: "",
              field: "",
              startYear: "",
              endYear: "",
            })
          }
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
        >
          <Plus size={18} /> Add Education
        </button>
      </div>

      <div className="flex justify-end py-4 border-b-2 border-gray-200">
        <button
          onClick={saveEducation}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg"
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
