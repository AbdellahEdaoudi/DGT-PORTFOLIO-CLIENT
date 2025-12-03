import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Link } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.5,
        color: '#374151',
    },
    header: {
        marginBottom: 30,
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
        fontStyle: 'italic',
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
                    <View style={styles.headerLeft}>
                        <Text style={styles.name}>{userData?.fullname || 'Your Name'}</Text>
                        <Text style={styles.title}>{userData?.category || 'Professional Title'}</Text>

                        <View style={styles.contactRow}>
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
                                <Link src={`https://${userData.username}.dgtportfolio.com`} style={styles.contactItem}>
                                    <Text style={styles.link}>• {userData.username}.dgtportfolio.com</Text>
                                </Link>
                            )}
                        </View>
                    </View>
                    {userData?.urlimage && (
                        <Image
                            src={userData.urlimage}
                            style={styles.profileImage}
                        />
                    )}
                </View>

                {/* Summary */}
                {userData?.about && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Professional Summary</Text>
                        <Text style={styles.description}>{userData.about}</Text>
                    </View>
                )}

                {/* Experience */}
                {userData?.experience && userData.experience.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Experience</Text>
                        {userData.experience.map((exp, index) => (
                            <View key={index} style={styles.item}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemTitle}>{exp.role}</Text>
                                    <Text style={styles.itemDate}>
                                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                    </Text>
                                </View>
                                <Text style={styles.itemSubtitle}>{exp.company}</Text>
                                <Text style={styles.description}>{exp.description}</Text>
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
                            <View key={index} style={styles.item}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemTitle}>{proj.title}</Text>
                                    {proj.link && (
                                        <Link src={proj.link} style={{ ...styles.link, fontSize: 9 }}>
                                            View Project
                                        </Link>
                                    )}
                                </View>
                                <Text style={styles.description}>{proj.description}</Text>
                                {proj.technologies && proj.technologies.length > 0 && (
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                                        {proj.technologies.map((tech, i) => (
                                            <Text key={i} style={{ fontSize: 8, color: '#6B7280' }}>• {tech}</Text>
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
                            <View key={index} style={styles.item}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemTitle}>{edu.school}</Text>
                                    <Text style={styles.itemDate}>
                                        {formatDate(edu.startYear)} - {formatDate(edu.endYear)}
                                    </Text>
                                </View>
                                <Text style={styles.itemSubtitle}>{edu.degree} {edu.field ? `in ${edu.field}` : ''}</Text>
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
