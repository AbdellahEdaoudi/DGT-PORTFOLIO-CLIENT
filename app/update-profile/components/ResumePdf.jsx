import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Link, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#111827',
        paddingBottom: 10,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 14,
        color: '#4B5563',
        marginTop: 4,
        marginBottom: 8,
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
        marginTop: 5,
    },
    contactItem: {
        fontSize: 10,
        color: '#6B7280',
        flexDirection: 'row',
        alignItems: 'center',
    },
    link: {
        color: '#2563EB',
        textDecoration: 'none',
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111827',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        marginBottom: 8,
        paddingBottom: 2,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    leftCol: {
        width: '25%',
    },
    rightCol: {
        width: '75%',
    },
    date: {
        fontSize: 10,
        color: '#6B7280',
        fontStyle: 'italic',
    },
    company: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#374151',
    },
    role: {
        fontSize: 11,
        color: '#1F2937',
        fontWeight: 'bold',
    },
    description: {
        fontSize: 10,
        color: '#4B5563',
        marginTop: 2,
        lineHeight: 1.4,
    },
    skillContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    skillBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        fontSize: 10,
        color: '#374151',
    },
    projectItem: {
        marginBottom: 10,
    },
    projectTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#111827',
    },
    projectLink: {
        fontSize: 9,
        color: '#2563EB',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        objectFit: 'cover',
    },
});

const ResumePdf = ({ userData }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return dateString;
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={styles.name}>{userData?.fullname || 'Your Name'}</Text>
                            <Text style={styles.title}>{userData?.category || 'Professional Title'}</Text>
                        </View>
                        {/* If you want to show image, uncomment below. Note: Image needs to be a valid URL or base64 */}
                        {userData?.urlimage && (
                            <Image
                                src={userData.urlimage}
                                style={styles.profileImage}
                            />
                        )}
                    </View>

                    <View style={styles.contactRow}>
                        {userData?.email && (
                            <Text style={styles.contactItem}>{userData.email}</Text>
                        )}
                        {userData?.phoneNumber && (
                            <Text style={styles.contactItem}> • {userData.phoneNumber}</Text>
                        )}
                        {userData?.country && (
                            <Text style={styles.contactItem}> • {userData.country}</Text>
                        )}
                        {userData?.username && (
                            <Link src={`https://${userData.username}.dgtportfolio.com`} style={styles.contactItem}>
                                <Text style={styles.link}> • {userData.username}.dgtportfolio.com</Text>
                            </Link>
                        )}
                    </View>
                </View>

                {/* Summary */}
                {userData?.about && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Summary</Text>
                        <Text style={styles.description}>{userData.about}</Text>
                    </View>
                )}

                {/* Experience */}
                {userData?.experience && userData.experience.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Experience</Text>
                        {userData.experience.map((exp, index) => (
                            <View key={index} style={styles.row}>
                                <View style={styles.leftCol}>
                                    <Text style={styles.date}>
                                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                    </Text>
                                </View>
                                <View style={styles.rightCol}>
                                    <Text style={styles.company}>{exp.company}</Text>
                                    <Text style={styles.role}>{exp.role}</Text>
                                    <Text style={styles.description}>{exp.description}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Skills */}
                {userData?.skills && userData.skills.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Skills</Text>
                        <View style={styles.skillContainer}>
                            {userData.skills.map((skill, index) => (
                                <Text key={index} style={styles.skillBadge}>
                                    {skill.name || skill}
                                </Text>
                            ))}
                        </View>
                    </View>
                )}

                {/* Projects */}
                {userData?.projects && userData.projects.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Projects</Text>
                        {userData.projects.map((proj, index) => (
                            <View key={index} style={styles.projectItem}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={styles.projectTitle}>{proj.title}</Text>
                                    {proj.link && <Link src={proj.link} style={styles.projectLink}>View Project</Link>}
                                </View>
                                <Text style={styles.description}>{proj.description}</Text>
                                {proj.technologies && proj.technologies.length > 0 && (
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                                        {proj.technologies.map((tech, i) => (
                                            <Text key={i} style={{ fontSize: 8, color: '#4B5563', backgroundColor: '#F3F4F6', padding: 2, borderRadius: 2 }}>{tech}</Text>
                                        ))}
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* Education */}
                {userData?.education && userData.education.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Education</Text>
                        {userData.education.map((edu, index) => (
                            <View key={index} style={styles.row}>
                                <View style={styles.leftCol}>
                                    <Text style={styles.date}>
                                        {formatDate(edu.startYear)} - {formatDate(edu.endYear)}
                                    </Text>
                                </View>
                                <View style={styles.rightCol}>
                                    <Text style={styles.company}>{edu.school}</Text>
                                    <Text style={styles.role}>{edu.degree} {edu.field ? `in ${edu.field}` : ''}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Languages */}
                {userData?.languages && userData.languages.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Languages</Text>
                        <View style={styles.skillContainer}>
                            {userData.languages.map((lang, index) => (
                                <Text key={index} style={styles.skillBadge}>
                                    {lang.language || lang} {lang.level ? `(${lang.level})` : ''}
                                </Text>
                            ))}
                        </View>
                    </View>
                )}

            </Page>
        </Document>
    );
};

export default ResumePdf;
