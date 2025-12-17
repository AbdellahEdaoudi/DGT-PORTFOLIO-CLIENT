"use client"
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ArrowUp, ArrowDown, CheckCheck, Loader, LayoutList, GripVertical } from '../../Components/Icons'
import { useTranslation } from '../../lib/translations'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const DEFAULT_ORDER = ["services", "experience", "skills", "projects", "education", "certificates", "languages"]

// ... imports remain the same as previous step, just reusing them.
// Note: I will only replace the SortableItem function and the map loop in the main component.

function SortableSectionItem({ id, index, label, moveUp, moveDown, isFirst, isLast }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        position: 'relative',
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center justify-between p-4 bg-white border-2 border-transparent border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all group ${isDragging ? 'opacity-50 ring-2 ring-teal-500 bg-teal-50' : ''}`}
        >
            <span className="font-semibold text-gray-700 capitalize flex items-center gap-3 select-none">
                {/* Drag Handle */}
                <div
                    ref={setActivatorNodeRef}
                    {...attributes}
                    {...listeners}
                    className="text-gray-400 cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded focus:outline-none touch-none"
                    title="Drag to reorder"
                >
                    <GripVertical size={20} />
                </div>

                <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    {index + 1}
                </span>
                {label}
            </span>
            <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => moveUp(index, e)}
                    disabled={isFirst}
                    className={`p-2 rounded-lg transition-colors ${isFirst ? 'text-gray-300 opacity-20' : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'}`}
                    title="Move Up"
                >
                    <ArrowUp size={20} />
                </button>
                <button
                    onClick={(e) => moveDown(index, e)}
                    disabled={isLast}
                    className={`p-2 rounded-lg transition-colors ${isLast ? 'text-gray-300 opacity-20' : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'}`}
                    title="Move Down"
                >
                    <ArrowDown size={20} />
                </button>
            </div>
        </div>
    )
}

export default function SectionOrdering({ userData, setUserDetails }) {
    const { t } = useTranslation(userData?.displayLanguage || 'en')
    const [order, setOrder] = useState(userData?.sectionOrder && userData.sectionOrder.length > 0 ? userData.sectionOrder : DEFAULT_ORDER)
    const [loading, setLoading] = useState(false)

    // Sensors for drag detection (Mouse + Touch)
    // Removed distance constraint as we now use a dedicated handle
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    useEffect(() => {
        const currentOrder = userData?.sectionOrder && userData.sectionOrder.length > 0 ? userData.sectionOrder : DEFAULT_ORDER
        const missing = DEFAULT_ORDER.filter(item => !currentOrder.includes(item))
        if (missing.length > 0) {
            setOrder([...currentOrder, ...missing])
        } else {
            setOrder(currentOrder)
        }
    }, [userData])

    const handleDragEnd = (event) => {
        const { active, over } = event

        if (active.id !== over?.id) {
            setOrder((items) => {
                const oldIndex = items.indexOf(active.id)
                const newIndex = items.indexOf(over.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const moveUp = (index, e) => {
        e.stopPropagation()
        if (index === 0) return
        const newOrder = [...order]
        const temp = newOrder[index]
        newOrder[index] = newOrder[index - 1]
        newOrder[index - 1] = temp
        setOrder(newOrder)
    }

    const moveDown = (index, e) => {
        e.stopPropagation()
        if (index === order.length - 1) return
        const newOrder = [...order]
        const temp = newOrder[index]
        newOrder[index] = newOrder[index + 1]
        newOrder[index + 1] = temp
        setOrder(newOrder)
    }

    const saveOrder = async () => {
        setLoading(true)
        try {
            await axios.put('/api/proxy/users/update/section-order', { sectionOrder: order })
            if (setUserDetails) {
                setUserDetails(prev => ({ ...prev, sectionOrder: order }))
            }
            toast(<p className='flex gap-3 items-center'><CheckCheck className="text-teal-500" />{t('savedSuccessfully')}</p>, { autoClose: 2000 })
        } catch (error) {
            console.error(error)
            toast.error(t('errorMessage') || "Error saving")
        } finally {
            setLoading(false)
        }
    }

    const getLabel = (key) => {
        const labels = {
            services: t('services'),
            experience: t('workExperience'),
            skills: t('skills'),
            projects: t('projects'),
            education: t('education'),
            certificates: t('certificates'),
            languages: t('languages')
        }
        return labels[key] || key
    }

    return (
        <div className="space-y-6" dir={userData?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}>
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <LayoutList className="text-teal-600" />
                    {t('sectionOrdering') || (userData?.displayLanguage === 'ar' ? "ترتيب الأقسام" : "Section Ordering")}
                </h3>
            </div>

            <div className="space-y-3 max-w-2xl mx-auto">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={order}
                        strategy={verticalListSortingStrategy}
                    >
                        {order.map((item, index) => (
                            <SortableSectionItem
                                key={item}
                                id={item}
                                index={index}
                                label={getLabel(item)}
                                moveUp={moveUp}
                                moveDown={moveDown}
                                isFirst={index === 0}
                                isLast={index === order.length - 1}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>

            <div className="flex justify-end py-4 border-t border-gray-200 mt-8">
                <button
                    onClick={saveOrder}
                    disabled={loading}
                    className="bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg"
                >
                    {loading ? (
                        <>
                            <Loader size={20} className="animate-spin" /> {t('saving')}
                        </>
                    ) : (
                        `💾 ${t('save')}`
                    )}
                </button>
            </div>
        </div>
    )
}
