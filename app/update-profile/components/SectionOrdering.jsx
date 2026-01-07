"use client"
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import {
    ArrowUp,
    ArrowDown,
    CheckCheck,
    Loader,
    LayoutList,
    GripVertical,
    Briefcase,
    GraduationCap,
    Award,
    Globe,
    FolderOpen,
    Layers,
    CheckCircle
} from '../../components/Icons'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    TouchSensor,
    MouseSensor,
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
const ITEM_ICONS = {
    services: Layers,
    experience: Briefcase,
    skills: CheckCircle,
    projects: FolderOpen,
    education: GraduationCap,
    certificates: Award,
    languages: Globe
}

function SortableSectionItem({ id, index, label, moveUp, moveDown, isFirst, isLast, recentlyMoved }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        position: 'relative',
        touchAction: 'none', // Prevent browser scrolling while dragging
    }

    const Icon = ITEM_ICONS[id] || LayoutList

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`
                flex items-center justify-between p-1 sm:p-4
                bg-white border text-gray-700
                rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-200
                group cursor-grab active:cursor-grabbing
                ${isDragging
                    ? 'border-cyan-500 ring-1 ring-cyan-500 bg-cyan-50 shadow-lg scale-[1.02]'
                    : recentlyMoved
                        ? 'border-cyan-400 ring-2 ring-cyan-200 bg-cyan-50 shadow-md scale-[1.01] z-10'
                        : 'border-gray-200 hover:border-cyan-200'
                }
            `}
        >
            <div className="flex items-center gap-1 sm:gap-4 flex-1 overflow-hidden">
                {/* Drag Handle (Visual only now) */}
                <div
                    className="
                        text-gray-400
                        p-0.5 sm:p-1.5 rounded-lg transition-colors
                    "
                >
                    <GripVertical className="w-2.5 h-2.5 sm:w-[20px] sm:h-[20px]" />
                </div>

                {/* Index & Icon */}
                <div className="flex items-center gap-1 sm:gap-3">
                    <span className="flex w-4 h-4 sm:w-6 sm:h-6 items-center justify-center text-[8px] sm:text-xs font-mono font-medium text-gray-500 bg-gray-100 rounded-md border border-gray-200">
                        {index + 1}
                    </span>
                    <div className={`p-0.5 sm:p-2 rounded-lg ${isDragging || recentlyMoved ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-50 text-gray-500 group-hover:bg-cyan-50 group-hover:text-cyan-600'} transition-colors`}>
                        <Icon className="w-2.5 h-2.5 sm:w-[20px] sm:h-[20px]" />
                    </div>
                </div>

                {/* Label */}
                <span className={`font-bold text-[10px] sm:text-base capitalize truncate ${isDragging || recentlyMoved ? 'text-cyan-900' : 'text-gray-700'}`}>
                    {label}
                </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1 pl-1 sm:pl-2 border-l border-gray-100 ml-1 sm:ml-2">
                <button
                    onClick={(e) => moveUp(index, e)}
                    disabled={isFirst}
                    className={`
                        p-0.5 sm:p-2 rounded-lg transition-all duration-200
                        ${isFirst
                            ? 'text-gray-200 cursor-not-allowed'
                            : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700 active:scale-95'
                        }
                    `}
                    title="Move Up"
                    onPointerDown={(e) => e.stopPropagation()} // Prevent drag start on button
                    onTouchStart={(e) => e.stopPropagation()}
                >
                    <ArrowUp className="w-2.5 h-2.5 sm:w-[18px] sm:h-[18px]" />
                </button>
                <button
                    onClick={(e) => moveDown(index, e)}
                    disabled={isLast}
                    className={`
                        p-0.5 sm:p-2 rounded-lg transition-all duration-200
                        ${isLast
                            ? 'text-gray-200 cursor-not-allowed'
                            : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700 active:scale-95'
                        }
                    `}
                    title="Move Down"
                    onPointerDown={(e) => e.stopPropagation()} // Prevent drag start on button
                    onTouchStart={(e) => e.stopPropagation()}
                >
                    <ArrowDown className="w-2.5 h-2.5 sm:w-[18px] sm:h-[18px]" />
                </button>
            </div>
        </div>
    )
}
import { getTranslation } from '../../translations/update-profile'
import DragTutorial from './DragTutorial'

export default function SectionOrdering({ userData, setUserDetails }) {
    const t = getTranslation(userData?.displayLanguage || 'en')
    const [order, setOrder] = useState(userData?.sectionOrder && userData.sectionOrder.length > 0 ? userData.sectionOrder : DEFAULT_ORDER)
    const [originalOrder, setOriginalOrder] = useState(userData?.sectionOrder && userData.sectionOrder.length > 0 ? userData.sectionOrder : DEFAULT_ORDER)
    const [loading, setLoading] = useState(false)
    const [showTutorial, setShowTutorial] = useState(true)
    const [activeMovedItem, setActiveMovedItem] = useState(null)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTutorial(false)
        }, 5000)
        return () => clearTimeout(timer)
    }, [])

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
        })
    )

    useEffect(() => {
        const currentOrder = userData?.sectionOrder && userData.sectionOrder.length > 0 ? userData.sectionOrder : DEFAULT_ORDER
        const missing = DEFAULT_ORDER.filter(item => !currentOrder.includes(item))
        const finalOrder = missing.length > 0 ? [...currentOrder, ...missing] : currentOrder
        setOrder(finalOrder)
        setOriginalOrder(finalOrder)
    }, [userData])

    const handleDragEnd = (event) => {
        const { active, over } = event
        if (active.id !== over?.id) {
            setOrder((items) => {
                const oldIndex = items.indexOf(active.id)
                const newIndex = items.indexOf(over.id)
                return arrayMove(items, oldIndex, newIndex)
            })
            // Highlight the moved item
            setActiveMovedItem(active.id)
            setTimeout(() => setActiveMovedItem(null), 1000)
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

        // Highlight the moved item
        setActiveMovedItem(temp)
        setTimeout(() => setActiveMovedItem(null), 3000)
    }

    const moveDown = (index, e) => {
        e.stopPropagation()
        if (index === order.length - 1) return
        const newOrder = [...order]
        const temp = newOrder[index]
        newOrder[index] = newOrder[index + 1]
        newOrder[index + 1] = temp
        setOrder(newOrder)

        // Highlight the moved item
        setActiveMovedItem(temp)
        setTimeout(() => setActiveMovedItem(null), 3000)
    }

    const saveOrder = async () => {
        setLoading(true)
        try {
            await axios.put('/api/proxy/users/update/section-order', { sectionOrder: order })
            if (setUserDetails) {
                setUserDetails(prev => ({ ...prev, sectionOrder: order }))
            }
            setOriginalOrder(order) // Update original order after successful save
            toast.success(t('sectionOrdering.savedSuccessfully'));
        } catch (error) {
            console.error(error)
            toast.error(t('sectionOrdering.errorMessage'))
        } finally {
            setLoading(false)
        }
    }

    // Check if order has changed
    const hasOrderChanged = () => {
        if (order.length !== originalOrder.length) return true
        return order.some((item, index) => item !== originalOrder[index])
    }

    const getLabel = (key) => {
        const labels = {
            services: t('tabs.services'),
            experience: t('tabs.experience'),
            skills: t('tabs.skills'),
            projects: t('tabs.projects'),
            education: t('tabs.education'),
            certificates: t('tabs.certificates'),
            languages: t('tabs.languages')
        }
        return labels[key] || key
    }

    return (
        <div className="space-y-6" dir={userData?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}>
            <div className="flex items-center justify-between border-b border-gray-100">
                <div className="space-y-1">
                    <h3 className="text-xs md:text-xl font-bold text-gray-800 flex items-center gap-2">
                        <LayoutList className="text-cyan-600" />
                        {t('sectionOrdering.title')}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500">
                        {t('sectionOrdering.description')}
                    </p>
                </div>
            </div>

            <div className="bg-white p-2 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 sm:space-y-8 relative">
                {showTutorial && (
                    <div className="absolute top-0 right-0 pt-4 sm:pt-10 pr-4 sm:pr-8 z-50 pointer-events-none">
                        <DragTutorial />
                    </div>
                )}
                <div className="space-y-1 sm:space-y-3 max-w-3xl mx-auto">
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
                                    recentlyMoved={activeMovedItem === item}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                        onClick={saveOrder}
                        disabled={loading || !hasOrderChanged()}
                        className="
                            w-full md:w-auto
                            bg-gray-900 hover:bg-gray-800
                            text-white font-bold px-4 py-2 sm:px-8 sm:py-3.5 rounded-lg sm:rounded-xl
                            shadow-lg hover:shadow-xl disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed
                            transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 transform hover:-translate-y-0.5
                            disabled:transform-none text-[10px] sm:text-base
                        "
                    >
                        {loading ? (
                            <>
                                <Loader size={16} className="animate-spin w-3 h-3 sm:w-5 sm:h-5" /> {t('sectionOrdering.saving')}
                            </>
                        ) : (
                            <>
                                <CheckCheck className="w-3 h-3 sm:w-5 sm:h-5" /> {t('sectionOrdering.save')}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div >
    )
}
