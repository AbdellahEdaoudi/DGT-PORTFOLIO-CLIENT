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
} from '../../Components/Icons'
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

const ITEM_ICONS = {
    services: Layers,
    experience: Briefcase,
    skills: CheckCircle,
    projects: FolderOpen,
    education: GraduationCap,
    certificates: Award,
    languages: Globe
}

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

    const Icon = ITEM_ICONS[id] || LayoutList

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                flex items-center justify-between p-3 md:p-4
                bg-white border text-gray-700
                rounded-xl shadow-sm hover:shadow-md transition-all duration-200
                group
                ${isDragging
                    ? 'border-teal-500 ring-1 ring-teal-500 bg-teal-50 shadow-lg scale-[1.02]'
                    : 'border-gray-200 hover:border-teal-200'
                }
            `}
        >
            <div className="flex items-center gap-3 md:gap-4 flex-1 overflow-hidden">
                {/* Drag Handle */}
                <div
                    ref={setActivatorNodeRef}
                    {...attributes}
                    {...listeners}
                    className="
                        text-gray-400 hover:text-teal-600 cursor-grab active:cursor-grabbing
                        p-1.5 hover:bg-teal-50 rounded-lg transition-colors touch-none
                    "
                    title="Drag to reorder"
                >
                    <GripVertical size={20} />
                </div>

                {/* Index & Icon */}
                <div className="flex items-center gap-3">
                    <span className="hidden md:flex w-6 h-6 items-center justify-center text-xs font-mono font-medium text-gray-400 bg-gray-50 rounded-md">
                        {index + 1}
                    </span>
                    <div className={`p-2 rounded-lg ${isDragging ? 'bg-teal-100 text-teal-700' : 'bg-gray-50 text-gray-500 group-hover:bg-teal-50 group-hover:text-teal-600'} transition-colors`}>
                        <Icon size={20} />
                    </div>
                </div>

                {/* Label */}
                <span className={`font-bold text-sm md:text-base capitalize truncate ${isDragging ? 'text-teal-900' : 'text-gray-700'}`}>
                    {label}
                </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 pl-2 border-l border-gray-100 ml-2">
                <button
                    onClick={(e) => moveUp(index, e)}
                    disabled={isFirst}
                    className={`
                        p-1.5 md:p-2 rounded-lg transition-all duration-200
                        ${isFirst
                            ? 'text-gray-200 cursor-not-allowed'
                            : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700 active:scale-95'
                        }
                    `}
                    title="Move Up"
                >
                    <ArrowUp size={18} />
                </button>
                <button
                    onClick={(e) => moveDown(index, e)}
                    disabled={isLast}
                    className={`
                        p-1.5 md:p-2 rounded-lg transition-all duration-200
                        ${isLast
                            ? 'text-gray-200 cursor-not-allowed'
                            : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700 active:scale-95'
                        }
                    `}
                    title="Move Down"
                >
                    <ArrowDown size={18} />
                </button>
            </div>
        </div>
    )
}

export default function SectionOrdering({ userData, setUserDetails }) {
    const { t } = useTranslation(userData?.displayLanguage || 'en')
    const [order, setOrder] = useState(userData?.sectionOrder && userData.sectionOrder.length > 0 ? userData.sectionOrder : DEFAULT_ORDER)
    const [loading, setLoading] = useState(false)

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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <LayoutList className="text-teal-600" />
                        {t('sectionOrdering') || (userData?.displayLanguage === 'ar' ? "ترتيب الأقسام" : "Section Ordering")}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {userData?.displayLanguage === 'ar'
                            ? "قم بسحب وإفلات الأقسام لترتيبها حسب رغبتك في العرض"
                            : "Drag and drop sections to reorder how they appear on your portfolio"
                        }
                    </p>
                </div>

                <button
                    onClick={saveOrder}
                    disabled={loading}
                    className="
                        hidden md:flex
                        bg-gray-900 hover:bg-gray-800
                        text-white font-bold px-8 py-3 rounded-xl
                        shadow-lg hover:shadow-xl disabled:opacity-50 disabled:shadow-none
                        transition-all duration-300 items-center gap-2.5 transform hover:-translate-y-0.5
                    "
                >
                    {loading ? (
                        <>
                            <Loader size={20} className="animate-spin" /> {t('saving')}
                        </>
                    ) : (
                        <>
                            <CheckCheck size={20} /> {t('save')}
                        </>
                    )}
                </button>
            </div>

            <div className="space-y-3 max-w-3xl mx-auto">
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

            <div className="md:hidden pt-4 border-t border-gray-100">
                <button
                    onClick={saveOrder}
                    disabled={loading}
                    className="
                        w-full justify-center
                        bg-gray-900 hover:bg-gray-800
                        text-white font-bold px-6 py-3.5 rounded-xl
                        shadow-lg hover:shadow-xl disabled:opacity-50 
                        transition-all duration-300 flex items-center gap-2
                    "
                >
                    {loading ? (
                        <>
                            <Loader size={20} className="animate-spin" /> {t('saving')}
                        </>
                    ) : (
                        <>
                            <CheckCheck size={20} /> {t('save')}
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
