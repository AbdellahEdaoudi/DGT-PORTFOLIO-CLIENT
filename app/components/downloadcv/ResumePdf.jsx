import { Page, Text, View, Document, StyleSheet, Image, Link, Font, Svg, Path } from '@react-pdf/renderer';

// Register fonts for multilingual support
Font.register({
    family: 'Roboto',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/roboto/v50/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWubEbWmT.ttf' },
        { src: 'https://fonts.gstatic.com/s/roboto/v50/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWuYjammT.ttf', fontWeight: 'bold' },
        { src: 'https://fonts.gstatic.com/s/roboto/v50/KFOKCnqEu92Fr1Mu53ZEC9_Vu3r1gIhOszmOClHrs6ljXfMMLoHQiA8.ttf', fontStyle: 'italic' }
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

// ===================== SVG ICONS =====================
const LocationIcon = ({ isRTL }) => (
    <Svg width={7} height={7} viewBox="0 0 24 24" style={{ marginRight: isRTL ? 0 : 2.5, marginLeft: isRTL ? 2.5 : 0, alignSelf: 'center' }}>
        <Path fill="#DC2626" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </Svg>
);

const PhoneIcon = ({ isRTL }) => (
    <Svg width={7} height={7} viewBox="0 0 24 24" style={{ marginRight: isRTL ? 0 : 2.5, marginLeft: isRTL ? 2.5 : 0, alignSelf: 'center' }}>
        <Path fill="#16A34A" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </Svg>
);

const MailIcon = ({ isRTL }) => (
    <Svg width={7} height={7} viewBox="0 0 24 24" style={{ marginRight: isRTL ? 0 : 2.5, marginLeft: isRTL ? 2.5 : 0, alignSelf: 'center' }}>
        <Path fill="#2563EB" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </Svg>
);

const GlobeIcon = ({ isRTL }) => (
    <Svg width={7} height={7} viewBox="0 0 24 24" style={{ marginRight: isRTL ? 0 : 2.5, marginLeft: isRTL ? 2.5 : 0, alignSelf: 'center' }}>
        <Path fill="#0891B2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </Svg>
);

const GithubIcon = ({ isRTL }) => (
    <Svg width={7.5} height={7.5} viewBox="0 0 24 24" style={{ marginRight: isRTL ? 0 : 2.5, marginLeft: isRTL ? 2.5 : 0, alignSelf: 'center' }}>
        <Path fill="#181717" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </Svg>
);

const LinkedinIcon = ({ isRTL }) => (
    <Svg width={7.5} height={7.5} viewBox="0 0 24 24" style={{ marginRight: isRTL ? 0 : 2.5, marginLeft: isRTL ? 2.5 : 0, alignSelf: 'center' }}>
        <Path fill="#0A66C2" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </Svg>
);

// ===================== DESIGN TOKENS =====================
const COLORS = {
    name: '#0F172A',         // dark slate/black
    title: '#1D4ED8',        // refined royal blue
    body: '#334155',         // dark crisp body text
    muted: '#64748B',        // secondary text & dates
    hairline: '#CBD5E1',     // light dividers
    border: '#E2E8F0',       // section borders
    tagBg: '#F1F5F9',        // tag background
    tagBorder: '#CBD5E1',
};

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        paddingTop: 22,
        paddingBottom: 22,
        paddingHorizontal: 28,
        fontSize: 8.5,
        lineHeight: 1.32,
        color: COLORS.body,
    },

    // ---------- HEADER (Executive Compact) ----------
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 8,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerLeft: {
        flex: 1,
        paddingRight: 14,
    },
    name: {
        fontSize: 19,
        fontWeight: 'bold',
        color: COLORS.name,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
        lineHeight: 1.15,
    },
    title: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.title,
        textTransform: 'uppercase',
        letterSpacing: 0.3,
        marginBottom: 4,
        lineHeight: 1.2,
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginBottom: 2.5,
    },
    contactItemWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contactItem: {
        fontSize: 8,
        color: COLORS.muted,
    },
    contactLink: {
        fontSize: 8,
        color: COLORS.name,
        textDecoration: 'none',
    },
    separator: {
        fontSize: 7.5,
        color: COLORS.hairline,
        marginHorizontal: 5,
    },
    profileImage: {
        width: 58,
        height: 68,
        borderRadius: 5,
        objectFit: 'cover',
        borderWidth: 1,
        borderColor: COLORS.hairline,
    },

    // ---------- SECTION (Compact 1-Page Layout) ----------
    section: {
        marginBottom: 7,
    },
    sectionTitle: {
        fontSize: 9.5,
        fontWeight: 'bold',
        color: COLORS.name,
        textTransform: 'uppercase',
        marginBottom: 4,
        paddingBottom: 2,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        letterSpacing: 0.4,
    },
    summaryText: {
        fontSize: 8.5,
        color: COLORS.body,
        textAlign: 'justify',
        lineHeight: 1.38,
    },

    // ---------- EXPERIENCE / ENTRIES ----------
    entry: {
        marginBottom: 5,
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    entryTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        color: COLORS.name,
    },
    entryDate: {
        fontSize: 8,
        color: COLORS.muted,
        fontWeight: 'bold',
    },
    entrySubtitle: {
        fontSize: 8.5,
        fontWeight: 'bold',
        color: COLORS.title,
        marginTop: 0.5,
        marginBottom: 2,
    },
    bulletRow: {
        flexDirection: 'row',
        marginBottom: 2,
        paddingLeft: 2,
    },
    bulletDash: {
        fontSize: 9,
        color: COLORS.title,
        width: 10,
    },
    bulletText: {
        fontSize: 8,
        color: COLORS.body,
        flex: 1,
        lineHeight: 1.35,
    },

    // ---------- TAGS (Skills) ----------
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        fontSize: 7.5,
        fontWeight: 'bold',
        color: COLORS.name,
        backgroundColor: COLORS.tagBg,
        borderWidth: 0.5,
        borderColor: COLORS.tagBorder,
        borderRadius: 3,
        paddingVertical: 2,
        paddingHorizontal: 6,
        marginRight: 4,
        marginBottom: 3.5,
    },

    // ---------- EDUCATION ----------
    eduEntry: {
        marginBottom: 4,
    },
    eduDegree: {
        fontSize: 9,
        fontWeight: 'bold',
        color: COLORS.name,
    },
    eduSchool: {
        fontSize: 8.5,
        color: COLORS.body,
        marginTop: 1,
    },

    // ---------- LANGUAGES ----------
    langRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    langItem: {
        fontSize: 8,
        color: COLORS.body,
    },

    // ---------- CERTIFICATES ----------
    certRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 2.5,
    },
    certDash: {
        fontSize: 8.5,
        color: COLORS.title,
        width: 10,
    },
    certText: {
        fontSize: 8,
        color: COLORS.body,
        flex: 1,
        lineHeight: 1.35,
    },
});

// ===================== RTL OVERRIDES =====================
const rtlStyles = StyleSheet.create({
    page: { direction: 'rtl' },
    header: { flexDirection: 'row-reverse' },
    headerLeft: { paddingRight: 0, paddingLeft: 14 },
    name: { textAlign: 'right' },
    title: { textAlign: 'right' },
    contactRow: { flexDirection: 'row-reverse' },
    sectionTitle: { textAlign: 'right' },
    summaryText: { textAlign: 'right' },
    entryHeader: { flexDirection: 'row-reverse' },
    entryTitle: { textAlign: 'right' },
    entrySubtitle: { textAlign: 'right' },
    bulletRow: { flexDirection: 'row-reverse', paddingLeft: 0, paddingRight: 2 },
    bulletText: { textAlign: 'right' },
    tagRow: { flexDirection: 'row-reverse', justifyContent: 'flex-start' },
    tag: { marginRight: 0, marginLeft: 4 },
    eduDegree: { textAlign: 'right' },
    eduSchool: { textAlign: 'right' },
    langRow: { flexDirection: 'row-reverse' },
    certRow: { flexDirection: 'row-reverse' },
    certText: { textAlign: 'right' },
});

const cleanLinkText = (url) => {
    if (!url) return '';
    return url.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/$/, '');
};

const ResumePdf = ({ userData, dictionary }) => {
    const lang = userData?.displayLanguage || 'en';
    const content = dictionary?.pdf || {};
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
    const hasData = (data) => Array.isArray(data) && data.length > 0;

    // Profile URL
    const profileUrl = userData?.username
        ? (userData.customDomainVerified && userData.customDomain
            ? `https://${userData.customDomain}`
            : `https://${userData.username}.mylio.site`)
        : null;

    // Contact Items Row 1 (Location | Phone | Email)
    const contactRow1 = [];
    if (userData?.location) {
        contactRow1.push({ key: 'loc', icon: LocationIcon, type: 'text', val: userData.location });
    }
    if (userData?.phoneNumber) {
        contactRow1.push({ key: 'phone', icon: PhoneIcon, type: 'text', val: userData.phoneNumber });
    }
    if (userData?.email) {
        contactRow1.push({ key: 'email', icon: MailIcon, type: 'link', val: userData.email, href: `mailto:${userData.email}` });
    }

    // Contact Items Row 2 (Portfolio | LinkedIn | GitHub)
    const contactRow2 = [];
    if (profileUrl) {
        contactRow2.push({ key: 'portfolio', icon: GlobeIcon, type: 'link', val: cleanLinkText(profileUrl), href: profileUrl });
    }
    if (userData?.socials?.linkedin) {
        contactRow2.push({ key: 'linkedin', icon: LinkedinIcon, type: 'link', val: cleanLinkText(userData.socials.linkedin), href: userData.socials.linkedin });
    }
    if (userData?.socials?.github) {
        contactRow2.push({ key: 'github', icon: GithubIcon, type: 'link', val: cleanLinkText(userData.socials.github), href: userData.socials.github });
    }

    // ---------- SECTION RENDERERS ----------
    const renderExperience = () => (
        hasData(userData?.experience) && (
            <View style={styles.section} key="experience" wrap={false}>
                <Text style={s('sectionTitle')}>{content.experience || 'Experience'}</Text>
                {userData.experience.map((exp, index) => (
                    <View key={index} style={styles.entry}>
                        <View style={s('entryHeader')}>
                            <Text style={s('entryTitle')}>{exp.role}</Text>
                            {(exp.startDate || exp.endDate) && (
                                <Text style={styles.entryDate}>
                                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                </Text>
                            )}
                        </View>
                        {exp.company ? <Text style={s('entrySubtitle')}>{exp.company}</Text> : null}
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
            <View style={styles.section} key="skills" wrap={false}>
                <Text style={s('sectionTitle')}>{content.skills || 'Skills'}</Text>
                <View style={s('tagRow')}>
                    {userData.skills.map((skill, index) => {
                        const line = (skill.name || skill).replace(/^[-•]\s*/, '').trim();
                        return line ? (
                            <Text key={index} style={styles.tag}>{line}</Text>
                        ) : null;
                    })}
                </View>
            </View>
        )
    );

    const renderEducation = () => (
        hasData(userData?.education) && (
            <View style={styles.section} key="education" wrap={false}>
                <Text style={s('sectionTitle')}>{content.education || 'Education'}</Text>
                {userData.education.map((edu, index) => (
                    <View key={index} style={styles.eduEntry}>
                        <View style={s('entryHeader')}>
                            <Text style={s('eduDegree')}>{edu.degree}{edu.field ? ` \u2013 ${edu.field}` : ''}</Text>
                            {(edu.startYear || edu.endYear) && (
                                <Text style={styles.entryDate}>{formatDate(edu.startYear)} - {formatDate(edu.endYear)}</Text>
                            )}
                        </View>
                        {edu.school ? <Text style={s('eduSchool')}>{edu.school}</Text> : null}
                    </View>
                ))}
            </View>
        )
    );

    const renderLanguages = () => (
        hasData(userData?.languages) && (
            <View style={styles.section} key="languages" wrap={false}>
                <Text style={s('sectionTitle')}>{content.languages || 'Languages'}</Text>
                <View style={s('langRow')}>
                    {userData.languages.map((language, index) => {
                        const raw = language.language || language;
                        const [name, level] = typeof raw === 'string' && raw.includes(':') ? raw.split(':').map(x => x.trim()) : [raw, language.level];
                        const text = level ? `${name} (${level})` : name;
                        return (
                            <View key={index} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', marginBottom: 2 }}>
                                {index > 0 && <Text style={styles.separator}>•</Text>}
                                <Text style={styles.langItem}>{text}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        )
    );

    const renderCertificates = () => (
        hasData(userData?.certificates) && (
            <View style={styles.section} key="certificates" wrap={false}>
                <Text style={s('sectionTitle')}>{content.certificates || 'Certificates'}</Text>
                {userData.certificates.map((cert, index) => {
                    const title = cert.title ? cert.title.trim() : '';
                    const desc = cert.description ? cert.description.trim() : '';
                    return (title || desc) ? (
                        <View key={index} style={s('certRow')}>
                            <Text style={styles.certDash}>{'\u2013'}</Text>
                            <Text style={s('certText')}>
                                {title && desc ? (
                                    <>
                                        <Text style={{ fontWeight: 'bold', color: COLORS.name }}>{title}: </Text>
                                        <Text>{desc}</Text>
                                    </>
                                ) : (
                                    title || desc
                                )}
                            </Text>
                        </View>
                    ) : null;
                })}
            </View>
        )
    );

    const defaultOrder = ["experience", "education", "skills", "certificates", "languages"];
    const allowedSections = new Set(defaultOrder);

    const userOrder = (userData?.sectionOrder && userData.sectionOrder.length > 0 ? userData.sectionOrder : defaultOrder).filter(k => allowedSections.has(k));
    const orderToRender = [...new Set([...userOrder, ...defaultOrder])];

    const renderSection = (key) => {
        switch (key) {
            case 'experience': return renderExperience();
            case 'skills': return renderSkills();
            case 'education': return renderEducation();
            case 'languages': return renderLanguages();
            case 'certificates': return renderCertificates();
            default: return null;
        }
    };

    return (
        <Document>
            <Page size="A4" style={[styles.page, { fontFamily }, isRTL ? rtlStyles.page : {}]}>

                {/* ── HEADER (Modern Executive Split Layout) ── */}
                <View style={s('header')}>
                    <View style={s('headerLeft')}>
                        <Text style={[styles.name, isRTL ? rtlStyles.name : {}]}>
                            {userData?.fullname || content.nameFallback || 'User'}
                        </Text>
                        {userData?.category ? (
                            <Text style={s('title')}>{userData.category}</Text>
                        ) : null}

                        {/* Contact Row 1 (Location | Phone | Email) */}
                        {contactRow1.length > 0 && (
                            <View style={s('contactRow')}>
                                {contactRow1.map((item, idx) => {
                                    const IconComp = item.icon;
                                    return (
                                        <View key={item.key || idx} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
                                            {idx > 0 && <Text style={styles.separator}>|</Text>}
                                            <View style={[styles.contactItemWrapper, isRTL ? { flexDirection: 'row-reverse' } : {}]}>
                                                {IconComp && <IconComp isRTL={isRTL} />}
                                                {item.type === 'link' ? (
                                                    <Link src={item.href} style={styles.contactLink}>{item.val}</Link>
                                                ) : (
                                                    <Text style={styles.contactItem}>{item.val}</Text>
                                                )}
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        )}

                        {/* Contact Row 2 (Portfolio | LinkedIn | GitHub) */}
                        {contactRow2.length > 0 && (
                            <View style={s('contactRow')}>
                                {contactRow2.map((item, idx) => {
                                    const IconComp = item.icon;
                                    return (
                                        <View key={item.key || idx} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
                                            {idx > 0 && <Text style={styles.separator}>|</Text>}
                                            <View style={[styles.contactItemWrapper, isRTL ? { flexDirection: 'row-reverse' } : {}]}>
                                                {IconComp && <IconComp isRTL={isRTL} />}
                                                <Link src={item.href} style={styles.contactLink}>{item.val}</Link>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        )}
                    </View>

                    {/* Profile Photo - Clean Circular Avatar on Right */}
                    {userData?.urlimage ? (
                        <Image style={styles.profileImage} src={userData.urlimage} />
                    ) : null}
                </View>

                {/* ── PROFESSIONAL SUMMARY ── */}
                {userData?.about ? (
                    <View style={styles.section} wrap={false}>
                        <Text style={s('sectionTitle')}>{content.summary || 'Summary'}</Text>
                        <Text style={s('summaryText')}>{userData.about}</Text>
                    </View>
                ) : null}

                {/* ── SECTIONS (Compact 1-Page Sequential Flow) ── */}
                {orderToRender.map(key => renderSection(key))}

            </Page>
        </Document>
    );
};

export default ResumePdf;
