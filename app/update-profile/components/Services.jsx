"use client"
import axios from 'axios'
import { CheckCheck, Loader, Plus, Trash2 } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function  Services({userData}) {
  const [services, setServices] = useState(userData.services || [])
  const [loading, setLoading] = useState(false)
  const updateArrayItem = (array, setArray, index, value) => {
      const updated = [...array]
      updated[index] = value
      setArray(updated)
    }
  const removeArrayItem = (array, setArray, index) => {
    setArray(array.filter((_, i) => i !== index))
  }
  // Helper functions for array management
  const addArrayItem = (array, setArray, newItem) => {
    setArray([...array, newItem])
  }


  const UpServices = async (e) => {
      e.preventDefault()
      setLoading(true)
      try {
        await axios.put(`/api/proxy/users/update/services`, {
          services,
        })
         toast(<p className='flex gap-3 items-center'><CheckCheck className="text-teal-500" /> 
         Saved successfully!</p>, {
          autoClose: 2000,
        })
      } catch (error) {
        // console.error("[v0] Error updating services:", error)
      } finally {
        setLoading(false)
      }
    }
  
  return (
    <div>
        {/* Services - Teal Style */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800">💼 Services</h3>
        <div className="bg-gradient-to-br from-teal-50 to-green-50 p-2 md:p-4 rounded-xl border border-teal-200 space-y-3">
          <div className="space-y-2">
            {services.map((service, index) => (
              <div key={index} className="flex gap-2">
              <input
                type="text"
                value={service}
                maxLength={50}
                onChange={(e) => updateArrayItem(services, setServices, index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white transition"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(services, setServices, index)}
                className="hover:bg-red-100 rounded-lg p-2 transition-colors"
              >
                <Trash2 size={18} className="text-red-500" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addArrayItem(services, setServices, "")}
          className="w-full bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
        >
          <Plus size={18} /> Add Service
        </button>
              </div>
            </div>
     {/* Submit Button */}
            <div className="flex justify-end py-4 border-b-2 border-gray-200">
              <button onClick={UpServices}
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg"
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
  )
}