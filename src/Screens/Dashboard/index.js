import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import LoaderComponent from '../../Components/LoaderComponent';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Importing the vector icons library
import { useSelector } from 'react-redux';
import MailCore from "react-native-mailcore";

const { width: screenWidth } = Dimensions.get('window');

const Dashboard = (props) => {
    const AuthInfo = useSelector(state => state.AuthReducer.userInfo)
    const [carouselItems, setCarouselItems] = useState([]);
    const [loading, setLoading] = React.useState(false);
    const [totalEmails, setTotalEmails] = useState(0);

    React.useEffect(() => {
        fetchEmailCount()
    }, []);

    const handleRefresh = () => {
        fetchEmailCount()
    };

    const fetchEmailCount = async () => {
        setLoading(true);
        MailCore.getMails({
            folder: 'INBOX',
            requestKind: 2,
        })
            .then((result) => {
                console.log(result.totalMailCount, "length")
                console.log('Fetched emails:', result.mails[result.mails.length - 1]);
                const totalMailCount = result.totalMailCount;
                setTotalEmails(totalMailCount);

                const latestMails = result.mails
                    .slice(-100)
                    .reverse();
                setCarouselItems(latestMails);

                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.error('Error fetching emails:', error);
            });
    };


    const renderCarouselItem = ({ item, index }) => (
        <TouchableOpacity style={styles.card} onPress={() => getMailData(item.id)}>
            <Text style={styles.subject}>{item.subject}</Text>
            <Text style={styles.from}>{item.from}</Text>
            <Text style={styles.date}>{item.date?.split(' ')[1] + ' ' + item.date?.split(' ')[2]}</Text>
            {item.attachments > 0 && (
                <View style={styles.attachment}>
                    <MaterialIcons name="attach-file" size={20} color="#4285F4" />
                    <Text style={styles.attachmentText}>{item.attachments} Attachment(s)</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    const toggleDrawer = () => {
        props.navigation.openDrawer()
    }
    const getMailData = (messageId) => {
        MailCore.getMail({
            folder: 'INBOX',
            messageId: messageId,
            requestKind: 2
        })
            .then(result => {
                let mail = {
                    id: result.id,
                    date: result.date,
                    from: result.from,
                    to: result.to,
                    cc: result.cc,
                    bcc: result.bcc,
                    subject: result.subject,
                    body: result.body,
                    attachments: result.attachments
                }
                props.navigation.navigate('EmailDetails', mail)
                console.log(mail)
            })
            .catch(error => {
                alert(error);
            });
    }

    return (
        <>
            <LoaderComponent loading={loading} />
            <View style={styles.container}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => toggleDrawer()}>
                        <Image
                            source={{ uri: AuthInfo.picture }}
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>
                    <Text style={styles.title}>{`Inbox(${totalEmails})`}</Text>
                    <MaterialIcons
                        name="refresh"
                        size={30}
                        color="white"
                        onPress={handleRefresh}
                        style={styles.refreshIcon}
                    />
                </View>
                <Carousel
                    data={carouselItems}
                    renderItem={renderCarouselItem}
                    sliderWidth={screenWidth}
                    itemWidth={screenWidth * 0.6}
                    loop={true}
                    inactiveSlideScale={0.9}
                    inactiveSlideOpacity={0.7}
                    activeSlideAlignment="center"
                />
                <View style={styles.descriptionContainer}>
                    <MaterialIcons name="info" size={30} color="#fff" style={styles.infoIcon} />
                    <View style={styles.descriptionTextContainer}>
                        <Text style={styles.descriptionText}>
                            Mail Metrics helps you track and manage your emails efficiently. Stay updated with the latest messages, access key insights, and enjoy a seamless experience with our user-friendly dashboard.
                        </Text>
                    </View>
                </View>

            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#010066',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    refreshIcon: {
        padding: 10,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
    },
    centeredContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emailCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
        height: 120,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    emailCardText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4285F4',
        marginTop: 10,
    },
    emailIcon: {
        marginBottom: 10,
    },
    carouselContainer: {
        marginTop: 20,
        justifyContent: 'center'
    },
    card: {
        width: screenWidth * 0.6,
        height: 200,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        margin: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        alignSelf: 'center'
    },
    subject: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#010066',
        marginBottom: 8,
    },
    from: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    date: {
        fontSize: 14,
        color: '#999',
        marginBottom: 12,
    },
    attachment: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    attachmentText: {
        fontSize: 14,
        color: '#4285F4',
        marginLeft: 5,
    },
    descriptionContainer: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#010066',
        borderRadius: 10,
        padding: 16,
    },
    infoIcon: {
        marginRight: 16,
    },
    descriptionTextContainer: {
        flex: 1,
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 14,
        color: '#f0f0f0',
    },
});

export default Dashboard;
