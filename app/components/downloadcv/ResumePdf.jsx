import { Page, Text, View, Document, StyleSheet, Image, Link, Font } from '@react-pdf/renderer';
import { getDownloadCvTranslation } from '../../translations/download-cv';

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
        { src: 'https://fonts.gstatic.com/s/notosansjp/v55/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75s.ttf' },
        { src: 'https://fonts.gstatic.com/s/notosansjp/v55/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFPYk75s.ttf', fontWeight: 'bold' }
    ]
});

Font.register({
    family: 'Noto Sans SC',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/notosanssc/v39/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG9_FnYw.ttf' },
        { src: 'https://fonts.gstatic.com/s/notosanssc/v39/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaGzjCnYw.ttf', fontWeight: 'bold' }
    ]
});

Font.register({
    family: 'Noto Sans KR',
    fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-kr/files/noto-sans-kr-korean-400-normal.woff' },
        { src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-kr/files/noto-sans-kr-korean-700-normal.woff', fontWeight: 'bold' }
    ]
});

Font.register({
    family: 'Noto Sans Devanagari',
    fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-devanagari/files/noto-sans-devanagari-devanagari-400-normal.woff' },
        { src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-devanagari/files/noto-sans-devanagari-devanagari-700-normal.woff', fontWeight: 'bold' }
    ]
});

// ===================== DESIGN TOKENS =====================
const COLORS = {
    ink: '#111827',       // headings, name
    body: '#374151',      // body text
    muted: '#6B7280',     // dates, secondary text
    subtitleAccent: '#2563EB', // professional blue
    hairline: '#E5E7EB',  // section divider lines
    tagBg: '#F3F4F6',
    tagBorder: '#E5E7EB',
};

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        paddingTop: 40,
        paddingBottom: 40,
        paddingHorizontal: 45,
        fontSize: 10,
        lineHeight: 1.5,
        color: COLORS.body,
    },

    // ---------- HEADER ----------
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottomWidth: 1.5,
        borderBottomColor: COLORS.ink,
        paddingBottom: 16,
        marginBottom: 20,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        objectFit: 'cover',
        marginRight: 16,
    },
    nameBlock: {
        justifyContent: 'center',
        flexDirection: 'column',
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.ink,
        lineHeight: 1.2,
        marginBottom: 2,
    },
    title: {
        fontSize: 11,
        fontWeight: 'bold',
        color: COLORS.subtitleAccent,
        lineHeight: 1.2,
        marginTop: 2,
    },
    contactBlock: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    contactLine: {
        fontSize: 9,
        color: COLORS.muted,
        marginBottom: 3,
        textAlign: 'right',
        lineHeight: 1.3,
    },
    contactLink: {
        fontSize: 9,
        color: COLORS.ink,
        marginBottom: 3,
        textDecoration: 'none',
        textAlign: 'right',
    },
    contactLinkInline: {
        color: COLORS.ink,
        textDecoration: 'none',
        fontSize: 9,
    },

    // ---------- SECTION ----------
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.ink,
        textTransform: 'uppercase',
        marginBottom: 10,
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.hairline,
    },
    summaryText: {
        fontSize: 10,
        color: COLORS.body,
        textAlign: 'justify',
        lineHeight: 1.6,
    },

    // ---------- EXPERIENCE / GENERIC ENTRY ----------
    entry: {
        marginBottom: 14,
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    entryTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: COLORS.ink,
    },
    entryDate: {
        fontSize: 9,
        color: COLORS.muted,
        fontWeight: 'bold',
    },
    entrySubtitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.subtitleAccent,
        marginTop: 2,
        marginBottom: 4,
    },
    bulletRow: {
        flexDirection: 'row',
        marginBottom: 3,
        paddingLeft: 4,
    },
    bulletDash: {
        fontSize: 10,
        color: COLORS.subtitleAccent,
        width: 12,
    },
    bulletText: {
        fontSize: 10,
        color: COLORS.body,
        flex: 1,
        lineHeight: 1.5,
    },

    // ---------- TAGS (skills) ----------
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        fontSize: 9,
        fontWeight: 'bold',
        color: COLORS.ink,
        backgroundColor: COLORS.tagBg,
        borderWidth: 0.5,
        borderColor: COLORS.tagBorder,
        borderRadius: 4,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginRight: 6,
        marginBottom: 6,
    },

    // ---------- EDUCATION ----------
    eduEntry: {
        marginBottom: 10,
    },
    eduDegree: {
        fontSize: 10.5,
        fontWeight: 'bold',
        color: COLORS.ink,
    },
    eduSchool: {
        fontSize: 9.5,
        color: COLORS.body,
        marginTop: 2,
    },
    eduYear: {
        fontSize: 9,
        color: COLORS.muted,
        marginTop: 2,
    },

    // ---------- LANGUAGES ----------
    langRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.hairline,
        paddingBottom: 4,
    },
    langName: {
        fontSize: 10,
        color: COLORS.body,
    },
    langLevel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.ink,
    },

    // ---------- PROJECTS ----------
    projHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    projTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: COLORS.ink,
    },
    projLink: {
        fontSize: 9,
        color: COLORS.subtitleAccent,
        fontWeight: 'bold',
        textDecoration: 'none',
    },
    projDesc: {
        fontSize: 10,
        color: COLORS.body,
        marginTop: 3,
        lineHeight: 1.5,
    },
    projTech: {
        fontSize: 8.5,
        color: COLORS.muted,
        marginTop: 4,
    },

    // ---------- CERTIFICATES ----------
    certRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    certDash: {
        fontSize: 10,
        color: COLORS.subtitleAccent,
        width: 12,
    },
    certText: {
        fontSize: 10,
        color: COLORS.body,
        flex: 1,
        lineHeight: 1.5,
    },
});

// ===================== RTL OVERRIDES =====================
const rtlStyles = StyleSheet.create({
    page: { direction: 'rtl' },
    header: { flexDirection: 'row-reverse' },
    headerLeft: { flexDirection: 'row-reverse' },
    profileImage: { marginRight: 0, marginLeft: 16 },
    name: { textAlign: 'right' },
    title: { textAlign: 'right' },
    contactBlock: { alignItems: 'flex-start' },
    contactLine: { textAlign: 'left' },
    contactLink: { textAlign: 'left' },
    sectionTitle: { textAlign: 'right' },
    summaryText: { textAlign: 'right' },
    entryHeader: { flexDirection: 'row-reverse' },
    entryTitle: { textAlign: 'right' },
    entrySubtitle: { textAlign: 'right' },
    bulletRow: { flexDirection: 'row-reverse', paddingLeft: 0, paddingRight: 4 },
    bulletText: { textAlign: 'right' },
    tagRow: { flexDirection: 'row-reverse', justifyContent: 'flex-start' },
    tag: { marginRight: 0, marginLeft: 6 },
    eduDegree: { textAlign: 'right' },
    eduSchool: { textAlign: 'right' },
    eduYear: { textAlign: 'right' },
    langRow: { flexDirection: 'row-reverse' },
    projHeader: { flexDirection: 'row-reverse' },
    projTitle: { textAlign: 'right' },
    projDesc: { textAlign: 'right' },
    projTech: { textAlign: 'right' },
    certRow: { flexDirection: 'row-reverse' },
    certText: { textAlign: 'right' },
});

// ===================== TRANSLATIONS (Moved to /translations/download-cv) =====================

const ResumePdf = ({ userData }) => {
    const lang = userData?.displayLanguage || 'en';
    const t = getDownloadCvTranslation(lang).pdf;
    const isRTL = lang === 'ar';

    const getFontFamily = (language) => {
        switch (language) {
            case 'ar': return 'Vazirmatn';
            case 'ja': return 'Noto Sans JP';
            case 'zh': return 'Noto Sans SC';
            case 'ko': return 'Noto Sans KR';
            case 'hi': return 'Noto Sans Devanagari';
            default: return 'Roboto';
        }
    };

    const fontFamily = getFontFamily(lang);

    const s = (styleName, extra = {}) => {
        const base = styles[styleName];
        const rtl = isRTL ? rtlStyles[styleName] : {};
        return [base, rtl, extra];
    };

    const formatDate = (dateString) => dateString || '';
    const hasData = (data) => data && data.length > 0;

    // ---------- SECTION RENDERERS ----------

    const renderExperience = () => (
        hasData(userData?.experience) && (
            <View style={styles.section} key="experience">
                <Text style={s('sectionTitle')}>{t.experience}</Text>
                {userData.experience.map((exp, index) => (
                    <View key={index} style={styles.entry} wrap={false}>
                        <View style={s('entryHeader')}>
                            <Text style={s('entryTitle')}>{exp.role}</Text>
                            <Text style={styles.entryDate}>
                                {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                            </Text>
                        </View>
                        <Text style={s('entrySubtitle')}>{exp.company}</Text>
                        {(exp.description || '').split('\n').map(str => str.replace(/^[-•]\s*/, '').trim()).filter(Boolean).map((line, i) => (
                            <View key={i} style={s('bulletRow')}>
                                <Text style={styles.bulletDash}>{isRTL ? '\u2013' : '\u2013'}</Text>
                                <Text style={s('bulletText')}>{line}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        )
    );

    const renderSkills = () => (
        hasData(userData?.skills) && (
            <View style={styles.section} key="skills">
                <Text style={s('sectionTitle')}>{t.skills}</Text>
                {userData.skills.map((skill, index) => {
                    const line = (skill.name || skill).replace(/^[-•]\s*/, '').trim();
                    return (
                        <View key={index} style={s('bulletRow')}>
                            <Text style={styles.bulletDash}>{isRTL ? '\u2013' : '\u2013'}</Text>
                            <Text style={s('bulletText')}>{line}</Text>
                        </View>
                    );
                })}
            </View>
        )
    );

    const renderProjects = () => (
        hasData(userData?.projects) && (
            <View style={styles.section} key="projects">
                <Text style={s('sectionTitle')}>{t.projects}</Text>
                {userData.projects.map((proj, index) => (
                    <View key={index} style={{ marginBottom: 14 }} wrap={false}>
                        <View style={s('projHeader')}>
                            <Text style={s('projTitle')}>{proj.title}</Text>
                            {proj.link && (
                                <Link src={proj.link} style={s('projLink')}>
                                    {t.viewProject}
                                </Link>
                            )}
                        </View>
                        <Text style={s('projDesc')}>{proj.description}</Text>
                        {proj.technologies && proj.technologies.length > 0 && (
                            <Text style={s('projTech')}>{proj.technologies.join('  \u00b7  ')}</Text>
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
                    <View key={index} style={styles.eduEntry}>
                        <Text style={s('eduDegree')}>{edu.degree}{edu.field ? ` \u2013 ${edu.field}` : ''}</Text>
                        <Text style={s('eduSchool')}>{edu.school}</Text>
                        <Text style={s('eduYear')}>{formatDate(edu.startYear)} - {formatDate(edu.endYear)}</Text>
                    </View>
                ))}
            </View>
        )
    );

    const renderLanguages = () => (
        hasData(userData?.languages) && (
            <View style={styles.section} key="languages">
                <Text style={s('sectionTitle')}>{t.languages}</Text>
                {userData.languages.map((language, index) => {
                    const raw = language.language || language;
                    const [name, level] = typeof raw === 'string' && raw.includes(':') ? raw.split(':').map(x => x.trim()) : [raw, language.level];
                    return (
                        <View key={index} style={s('langRow')}>
                            <Text style={styles.langName}>{name}</Text>
                            <Text style={styles.langLevel}>{level || ''}</Text>
                        </View>
                    );
                })}
            </View>
        )
    );

    const renderCertificates = () => (
        hasData(userData?.certificates) && (
            <View style={styles.section} key="certificates">
                <Text style={s('sectionTitle')}>{t.certificates}</Text>
                {userData.certificates.map((cert, index) => (
                    cert.description && (
                        <View key={index} style={s('certRow')}>
                            <Text style={styles.certDash}>{'\u2013'}</Text>
                            <Text style={s('certText')}>{cert.description}</Text>
                        </View>
                    )
                ))}
            </View>
        )
    );

    const renderServices = () => (
        hasData(userData?.services) && (
            <View style={styles.section} key="services">
                <Text style={s('sectionTitle')}>{t.services}</Text>
                {userData.services.map((service, index) => {
                    const line = (service || '').replace(/^[-•]\s*/, '').trim();
                    return line ? (
                        <View key={index} style={s('bulletRow')}>
                            <Text style={styles.bulletDash}>{isRTL ? '\u2013' : '\u2013'}</Text>
                            <Text style={s('bulletText')}>{line}</Text>
                        </View>
                    ) : null;
                })}
            </View>
        )
    );

    const defaultOrder = ["services", "experience", "projects", "education", "skills", "certificates", "languages"];

    let userOrder = userData?.sectionOrder && userData.sectionOrder.length > 0 ? userData.sectionOrder : defaultOrder;
    const orderToRender = [...new Set([...userOrder, ...defaultOrder])];

    const renderSection = (key) => {
        switch (key) {
            case 'services': return renderServices();
            case 'experience': return renderExperience();
            case 'skills': return renderSkills();
            case 'projects': return renderProjects();
            case 'education': return renderEducation();
            case 'languages': return renderLanguages();
            case 'certificates': return renderCertificates();
            default: return null;
        }
    };

    const profileUrl = userData?.username
        ? (userData.customDomainVerified && userData.customDomain
            ? `https://${userData.customDomain}`
            : `https://${userData.username}.dgtportfolio.com`)
        : null;

    return (
        <Document>
            <Page size="A4" style={[styles.page, { fontFamily }, isRTL ? rtlStyles.page : {}]}>

                {/* HEADER */}
                <View style={s('header')}>
                    <View style={s('headerLeft')}>
                        {userData?.urlimage ? (
                            <Image style={s('profileImage')} src={userData.urlimage} />
                        ) : null}
                        <View style={styles.nameBlock}>
                            <Text style={s('name')}>{(userData?.fullname || t.nameFallback).toUpperCase()}</Text>
                            <Text style={s('title')}>{(userData?.category || t.titleFallback).toUpperCase()}</Text>
                        </View>
                    </View>

                    <View style={s('contactBlock')}>
                        {userData?.email && (
                            <Text style={styles.contactLine}>
                                {t.email}: {userData.email}
                            </Text>
                        )}
                        {userData?.phoneNumber && (
                            <Text style={styles.contactLine}>
                                {t.phone}: {userData.phoneNumber}
                            </Text>
                        )}
                        {userData?.country && (
                            <Text style={styles.contactLine}>
                                {t.country}: {userData.country}
                            </Text>
                        )}
                        {profileUrl && (
                            <Text style={styles.contactLine}>
                                {t.portfolio}:{' '}
                                <Link src={profileUrl} style={styles.contactLinkInline}>
                                    {profileUrl.replace(/^https?:\/\//, '')}
                                </Link>
                            </Text>
                        )}
                        {userData?.socials?.linkedin && (
                            <Text style={styles.contactLine}>
                                {t.linkedin}:{' '}
                                <Link src={userData.socials.linkedin} style={styles.contactLinkInline}>
                                    {userData.socials.linkedin.replace(/^https?:\/\//, '')}
                                </Link>
                            </Text>
                        )}
                        {userData?.socials?.github && (
                            <Text style={styles.contactLine}>
                                {t.github}:{' '}
                                <Link src={userData.socials.github} style={styles.contactLinkInline}>
                                    {userData.socials.github.replace(/^https?:\/\//, '')}
                                </Link>
                            </Text>
                        )}
                    </View>
                </View>

                {/* SUMMARY */}
                {userData?.about && (
                    <View style={styles.section}>
                        <Text style={s('sectionTitle')}>{t.summary}</Text>
                        <Text style={s('summaryText')}>{userData.about}</Text>
                    </View>
                )}

                {/* SECTIONS RENDERED SEQUENTIALLY */}
                {orderToRender.map(key => renderSection(key))}

            </Page>
        </Document>
    );
};

export default ResumePdf;

