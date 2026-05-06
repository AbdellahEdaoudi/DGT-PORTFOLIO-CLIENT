import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Link, Font } from '@react-pdf/renderer';

// Register fonts for multilingual support
Font.register({
    family: 'Roboto',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/roboto/v50/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWubEbWmT.ttf' }, // Regular
        { src: 'https://fonts.gstatic.com/s/roboto/v50/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWuYjammT.ttf', fontWeight: 'bold' }, // Bold
        { src: 'https://fonts.gstatic.com/s/roboto/v50/KFOKCnqEu92Fr1Mu53ZEC9_Vu3r1gIhOszmOClHrs6ljXfMMLoHQiA8.ttf', fontStyle: 'italic' } // Italic
    ]
});

Font.register({
    family: 'Vazirmatn',
    fonts: [
        { src: 'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/ttf/Vazirmatn-Regular.ttf' },
        { src: 'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/ttf/Vazirmatn-Bold.ttf', fontWeight: 'bold' }
    ]
});

Font.register({
    family: 'Noto Sans JP',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/notosansjp/v55/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75s.ttf' }, // Regular
        { src: 'https://fonts.gstatic.com/s/notosansjp/v55/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFPYk75s.ttf', fontWeight: 'bold' } // Bold
    ]
});

Font.register({
    family: 'Noto Sans SC',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/notosanssc/v39/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG9_FnYw.ttf' }, // Regular
        { src: 'https://fonts.gstatic.com/s/notosanssc/v39/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaGzjCnYw.ttf', fontWeight: 'bold' } // Bold
    ]
});

Font.register({
    family: 'Noto Sans KR',
    fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-kr/files/noto-sans-kr-korean-400-normal.woff' }, // Regular
        { src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-kr/files/noto-sans-kr-korean-700-normal.woff', fontWeight: 'bold' } // Bold
    ]
});

Font.register({
    family: 'Noto Sans Devanagari',
    fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-devanagari/files/noto-sans-devanagari-devanagari-400-normal.woff' }, // Regular
        { src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-devanagari/files/noto-sans-devanagari-devanagari-700-normal.woff', fontWeight: 'bold' } // Bold
    ]
});

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontSize: 10,
        lineHeight: 1.5,
        color: '#374151',
    },
    header: {
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 20,
    },
    headerLeft: {
        flex: 1,
        paddingRight: 20,
    },
    name: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 26, // Increased margin to prevent sticking
        letterSpacing: -0.5,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 12,
        color: '#374151', // Dark Gray/Black
        fontWeight: 'bold',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    contactItem: {
        fontSize: 9,
        color: '#6B7280',
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        objectFit: 'cover',
        marginLeft: 0,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#111827',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 10,
        borderLeftWidth: 3,
        borderLeftColor: '#111827', // Black
        paddingLeft: 8,
    },
    item: {
        marginBottom: 12,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 2,
    },
    itemTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    itemSubtitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#374151', // Dark Gray/Black
    },
    itemDate: {
        fontSize: 9,
        color: '#9CA3AF',
        fontStyle: 'italic', // Default to italic, will be overridden for CJK
    },
    description: {
        fontSize: 10,
        color: '#4B5563',
        marginTop: 2,
        textAlign: 'justify',
    },
    skillContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    skillBadge: {
        backgroundColor: '#F3F4F6', // Light Gray
        color: '#1F2937', // Dark Gray/Black
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        fontSize: 9,
        fontWeight: 'bold',
    },
    link: {
        color: '#111827', // Black
        textDecoration: 'none',
    },
});

const translations = {
    en: {
        summary: "Professional Summary",
        experience: "Experience",
        skills: "Skills",
        projects: "Projects",
        education: "Education",
        languages: "Languages",
        certificates: "Certificates",
        services: "Services",
        viewProject: "View Project",
        nameFallback: "Your Name",
        titleFallback: "Professional Title"
    },
    fr: {
        summary: "Résumé Professionnel",
        experience: "Expérience",
        skills: "Compétences",
        projects: "Projets",
        education: "Éducation",
        languages: "Langues",
        certificates: "Certificats",
        services: "Services",
        viewProject: "Voir le projet",
        nameFallback: "Votre Nom",
        titleFallback: "Titre Professionnel"
    },
    ar: {
        summary: "نبذة",
        experience: "الخبرة",
        skills: "المهارات",
        projects: "المشاريع",
        education: "التعليم",
        languages: "اللغات",
        certificates: "الشهادات",
        services: "الخدمات",
        viewProject: "عرض المشروع",
        nameFallback: "الاسم",
        titleFallback: "المسمى الوظيفي"
    },
    de: {
        summary: "Berufliche Zusammenfassung",
        experience: "Berufserfahrung",
        skills: "Fähigkeiten",
        projects: "Projekte",
        education: "Ausbildung",
        languages: "Sprachen",
        certificates: "Zertifikate",
        services: "Dienstleistungen",
        viewProject: "Projekt ansehen",
        nameFallback: "Ihr Name",
        titleFallback: "Berufsbezeichnung"
    },
    ru: {
        summary: "Профессиональное резюме",
        experience: "Опыт работы",
        skills: "Навыки",
        projects: "Проекты",
        education: "Образование",
        languages: "Языки",
        certificates: "Сертификаты",
        services: "Услуги",
        viewProject: "Посмотреть проект",
        nameFallback: "Ваше Имя",
        titleFallback: "Профессиональный заголовок"
    },
    ja: {
        summary: "職務要約",
        experience: "職歴",
        skills: "スキル",
        projects: "プロジェクト",
        education: "学歴",
        languages: "言語",
        certificates: "証明書",
        services: "サービス",
        viewProject: "プロジェクトを見る",
        nameFallback: "氏名",
        titleFallback: "職種"
    },
    zh: {
        summary: "专业摘要",
        experience: "工作经验",
        skills: "技能",
        projects: "项目",
        education: "教育",
        languages: "语言",
        certificates: "证书",
        services: "服务",
        viewProject: "查看项目",
        nameFallback: "姓名",
        titleFallback: "职位"
    },
    es: {
        summary: "Resumen Profesional",
        experience: "Experiencia",
        skills: "Habilidades",
        projects: "Proyectos",
        education: "Educación",
        languages: "Idiomas",
        certificates: "Certificados",
        services: "Servicios",
        viewProject: "Ver Proyecto",
        nameFallback: "Su Nombre",
        titleFallback: "Título Profesional"
    },
    nl: {
        summary: "Professionele Samenvatting",
        experience: "Ervaring",
        skills: "Vaardigheden",
        projects: "Projecten",
        education: "Opleiding",
        languages: "Talen",
        certificates: "Certificaten",
        services: "Diensten",
        viewProject: "Bekijk project",
        nameFallback: "Uw Naam",
        titleFallback: "Professionele Titel"
    },
    pt: {
        summary: "Resumo Profissional",
        experience: "Experiência",
        skills: "Habilidades",
        projects: "Projetos",
        education: "Educação",
        languages: "Idiomas",
        certificates: "Certificados",
        services: "Serviços",
        viewProject: "Ver Projeto",
        nameFallback: "Seu Nome",
        titleFallback: "Título Profissional"
    },
    it: {
        summary: "Riepilogo Professionale",
        experience: "Esperienza",
        skills: "Competenze",
        projects: "Progetti",
        education: "Istruzione",
        languages: "Lingue",
        certificates: "Certificati",
        services: "Servizi",
        viewProject: "Vedi Progetto",
        nameFallback: "Il Tuo Nome",
        titleFallback: "Titolo Professionale"
    },
    hi: {
        summary: "पेशेवर सारांश",
        experience: "अनुभव",
        skills: "कौशल",
        projects: "परियोजनाएं",
        education: "शिक्षा",
        languages: "भाषाएं",
        certificates: "प्रमाणपत्र",
        services: "सेवाएं",
        viewProject: "परियोजना देखें",
        nameFallback: "आपका नाम",
        titleFallback: "पेशेवर शीर्षक"
    },
    tr: {
        summary: "Profesyonel Özet",
        experience: "Deneyim",
        skills: "Beceriler",
        projects: "Projeler",
        education: "Eğitim",
        languages: "Diller",
        certificates: "Sertifikalar",
        services: "Hizmetler",
        viewProject: "Projeyi Görüntüle",
        nameFallback: "Adınız",
        titleFallback: "Profesyonel Unvan"
    },
    ko: {
        summary: "전문 요약",
        experience: "경력",
        skills: "기술",
        projects: "프로젝트",
        education: "교육",
        languages: "언어",
        certificates: "자격증",
        services: "서비스",
        viewProject: "프로젝트 보기",
        nameFallback: "당신의 이름",
        titleFallback: "전문 직함"
    },
    id: {
        summary: "Ringkasan Profesional",
        experience: "Pengalaman",
        skills: "Keahlian",
        projects: "Proyek",
        education: "Pendidikan",
        languages: "Bahasa",
        certificates: "Sertifikat",
        services: "Layanan",
        viewProject: "Lihat Proyek",
        nameFallback: "Nama Anda",
        titleFallback: "Gelar Profesional"
    },
    pl: {
        summary: "Podsumowanie Zawodowe",
        experience: "Doświadczenie",
        skills: "Umiejętności",
        projects: "Projekty",
        education: "Edukacja",
        languages: "Języki",
        certificates: "Certyfikaty",
        services: "Usługi",
        viewProject: "Zobacz projekt",
        nameFallback: "Twoje Imię",
        titleFallback: "Tytuł Zawodowy"
    },
    sv: {
        summary: "Professionell sammanfattning",
        experience: "Erfarenhet",
        skills: "Färdigheter",
        projects: "Projekt",
        education: "Utbildning",
        languages: "Språk",
        certificates: "Certifikat",
        services: "Tjänster",
        viewProject: "Visa projekt",
        nameFallback: "Ditt namn",
        titleFallback: "Yrkesroll"
    },
    vi: {
        summary: "Tóm tắt chuyên môn",
        experience: "Kinh nghiệm",
        skills: "Kỹ năng",
        projects: "Dự án",
        education: "Học vấn",
        languages: "Ngôn ngữ",
        certificates: "Chứng chỉ",
        services: "Dịch vụ",
        viewProject: "Xem dự án",
        nameFallback: "Tên của bạn",
        titleFallback: "Chức danh nghề nghiệp"
    }
};

const ResumePdf = ({ userData }) => {
    const lang = userData?.displayLanguage || 'en';
    const t = translations[lang] || translations['en'];
    const isRTL = lang === 'ar';

    const getFontFamily = (language) => {
        switch (language) {
            case 'ar': return 'Vazirmatn';
            case 'ja': return 'Noto Sans JP';
            case 'zh': return 'Noto Sans SC';
            case 'ko': return 'Noto Sans KR';
            case 'hi': return 'Noto Sans Devanagari';
            case 'ru': return 'Roboto';
            default: return 'Roboto';
        }
    };

    const fontFamily = getFontFamily(lang);
    const disableItalic = ['ja', 'zh', 'ko', 'hi'].includes(lang);

    // Dynamic Styles Helper
    const s = (styleName, extra = {}) => {
        const base = styles[styleName];
        const rtl = isRTL ? rtlStyles[styleName] : {};
        return [base, rtl, extra];
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return dateString;
    };

    // Render Function Validators
    const hasData = (data) => data && data.length > 0;

    // Render functions for each section
    const renderExperience = () => (
        hasData(userData?.experience) && (
            <View style={styles.section} key="experience">
                <Text style={s('sectionTitle')}>{t.experience}</Text>
                {userData.experience.map((exp, index) => (
                    <View key={index} style={styles.item}>
                        <View style={s('itemHeader')}>
                            <Text style={s('itemTitle')}>{exp.role}</Text>
                            <Text style={[styles.itemDate, disableItalic && { fontStyle: 'normal' }]}>
                                {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                            </Text>
                        </View>
                        <Text style={s('itemSubtitle')}>{exp.company}</Text>
                        <Text style={s('description')}>{exp.description}</Text>
                    </View>
                ))}
            </View>
        )
    );

    const renderSkills = () => (
        hasData(userData?.skills) && (
            <View style={styles.section} key="skills">
                <Text style={s('sectionTitle')}>{t.skills}</Text>
                <View style={s('skillContainer')}>
                    {userData.skills.map((skill, index) => (
                        <Text key={index} style={styles.skillBadge}>
                            {skill.name || skill}
                        </Text>
                    ))}
                </View>
            </View>
        )
    );

    const renderProjects = () => (
        hasData(userData?.projects) && (
            <View style={styles.section} key="projects">
                <Text style={s('sectionTitle')}>{t.projects}</Text>
                {userData.projects.map((proj, index) => (
                    <View key={index} style={styles.item}>
                        <View style={s('itemHeader')}>
                            <Text style={s('itemTitle')}>{proj.title}</Text>
                            {proj.link && (
                                <Link src={proj.link} style={{ ...styles.link, fontSize: 9 }}>
                                    {t.viewProject}
                                </Link>
                            )}
                        </View>
                        <Text style={s('description')}>{proj.description}</Text>
                        {proj.technologies && proj.technologies.length > 0 && (
                            <View style={[styles.skillContainer, isRTL ? rtlStyles.skillContainer : {}]}>
                                {proj.technologies.map((tech, i) => (
                                    <Text key={i} style={{ fontSize: 8, color: '#6B7280' }}>• {tech}</Text>
                                ))}
                            </View>
                        )}
                    </View>
                ))}
            </View>
        )
    );

    const renderEducation = () => (
        hasData(userData?.education) && (
            <View style={styles.section} key="education">
                <Text style={s('sectionTitle')}>{t.education}</Text>
                {userData.education.map((edu, index) => (
                    <View key={index} style={styles.item}>
                        <View style={s('itemHeader')}>
                            <Text style={s('itemTitle')}>{edu.school}</Text>
                            <Text style={[styles.itemDate, disableItalic && { fontStyle: 'normal' }]}>
                                {formatDate(edu.startYear)} - {formatDate(edu.endYear)}
                            </Text>
                        </View>
                        <Text style={s('itemSubtitle')}>{edu.degree} {edu.field ? `in ${edu.field}` : ''}</Text>
                    </View>
                ))}
            </View>
        )
    );

    const renderLanguages = () => (
        hasData(userData?.languages) && (
            <View style={styles.section} key="languages">
                <Text style={s('sectionTitle')}>{t.languages}</Text>
                <View style={s('skillContainer')}>
                    {userData.languages.map((lang, index) => (
                        <Text key={index} style={styles.skillBadge}>
                            {lang.language || lang} {lang.level ? `(${lang.level})` : ''}
                        </Text>
                    ))}
                </View>
            </View>
        )
    );

    // New: Certificates rendering
    const renderCertificates = () => (
        hasData(userData?.certificates) && (
            <View style={styles.section} key="certificates">
                <Text style={s('sectionTitle')}>{t.certificates}</Text>
                <View style={{ flexDirection: 'column', gap: 6 }}>
                    {userData.certificates.map((cert, index) => (
                        cert.description && (
                            <View key={index} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                                <Text style={{ fontSize: 10, color: '#374151', paddingHorizontal: 4 }}>•</Text>
                                <Text style={{ fontSize: 10, color: '#4B5563', textAlign: isRTL ? 'right' : 'left', flex: 1 }}>
                                    {cert.description}
                                </Text>
                            </View>
                        )
                    ))}
                </View>
            </View>
        )
    );

    const renderServices = () => (
        hasData(userData?.services) && (
            <View style={styles.section} key="services">
                <Text style={s('sectionTitle')}>{t.services}</Text>
                <View style={s('skillContainer')}>
                    {userData.services.map((service, index) => (
                        <Text key={index} style={styles.skillBadge}>
                            {typeof service === 'string' ? service : (service.name || service.title)}
                        </Text>
                    ))}
                </View>
            </View>
        )
    );


    // Determine Section Order
    const defaultOrder = ["experience", "skills", "projects", "education", "languages", "certificates", "services"];
    // If userData.sectionOrder is present, use it. Append missing keys to ensure everything is rendered if data exists.
    const userOrder = userData?.sectionOrder && userData.sectionOrder.length > 0 ? userData.sectionOrder : defaultOrder;

    // Ensure we don't miss any sections if they have data but aren't in the custom order (fallback)
    const orderToRender = [...new Set([...userOrder, ...defaultOrder])];

    const renderSection = (key) => {
        switch (key) {
            case 'experience': return renderExperience();
            case 'skills': return renderSkills();
            case 'projects': return renderProjects();
            case 'education': return renderEducation();
            case 'languages': return renderLanguages();
            case 'certificates': return renderCertificates();
            case 'services': return renderServices();
            default: return null;
        }
    };

    return (
        <Document>
            <Page size="A4" style={[styles.page, { fontFamily }, isRTL ? rtlStyles.page : {}]}>
                {/* Header */}
                <View style={[styles.header, isRTL ? rtlStyles.header : {}]}>
                    <View style={s('headerLeft')}>
                        <Text style={s('name')}>{userData?.fullname || t.nameFallback}</Text>
                        <Text style={s('title')}>{userData?.category || t.titleFallback}</Text>

                        <View style={s('contactRow')}>
                            {userData?.email && (
                                <Text style={styles.contactItem}>{userData.email}</Text>
                            )}
                            {userData?.phoneNumber && (
                                <Text style={styles.contactItem}>• {userData.phoneNumber}</Text>
                            )}
                            {userData?.country && (
                                <Text style={styles.contactItem}>• {userData.country}</Text>
                            )}
                            {userData?.username && (
                                <Link
                                    src={`${userData.customDomainVerified ? `https://${userData.customDomain}` : `https://${userData.username}.dgtportfolio.com`}`}
                                    style={styles.contactItem}>
                                    <Text style={styles.link}>• {userData.username}.dgtportfolio.com</Text>
                                </Link>
                            )}
                        </View>
                    </View>
                    {userData?.urlimage && (
                        <Image
                            src={userData.urlimage}
                            style={styles.profileImage}
                            alt={`${userData?.fullname || 'Profile'} photo`}
                        />
                    )}
                </View>

                {/* Summary - usually fixed at top, but could be part of order if desired. Keeping fixed for now as it's an intro. */}
                {userData?.about && (
                    <View style={styles.section}>
                        <Text style={s('sectionTitle')}>{t.summary}</Text>
                        <Text style={s('description')}>{userData.about}</Text>
                    </View>
                )}

                {/* Dynamic Content Sections */}
                {orderToRender.map(key => renderSection(key))}

            </Page>
        </Document>
    );
};

// RTL Overrides
const rtlStyles = StyleSheet.create({
    page: {
        direction: 'rtl',
    },
    header: {
        flexDirection: 'row-reverse',
    },
    headerLeft: {
        paddingRight: 0,
        paddingLeft: 25,
        alignItems: 'flex-end',
    },
    name: {
        textAlign: 'right',
        letterSpacing: 0,
    },
    title: {
        textAlign: 'right',
        letterSpacing: 0,
    },
    contactRow: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start',
    },
    sectionTitle: {
        textAlign: 'right',
        borderLeftWidth: 0,
        paddingLeft: 0,
        borderRightWidth: 3,
        borderRightColor: '#111827',
        paddingRight: 8,
        letterSpacing: 0,
    },
    itemHeader: {
        flexDirection: 'row-reverse',
    },
    itemTitle: {
        textAlign: 'right',
    },
    itemSubtitle: {
        textAlign: 'right',
    },
    description: {
        textAlign: 'right',
    },
    skillContainer: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start',
    },
});

export default ResumePdf;
