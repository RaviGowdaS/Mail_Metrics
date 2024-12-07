import React, { useState } from 'react';
import { View, Text, Modal, ActivityIndicator, StyleSheet, TouchableWithoutFeedback } from 'react-native';

const LoaderComponent = ({ loading }) => {
    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={loading}
            onRequestClose={() => { }}
        >
            <View style={styles.modalContainer}>
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#4285F4" />
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    overlay: {
        flex: 1, 
        width: '100%',
    },
    loaderContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
    loadingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4285F4', 
        marginTop: 10,
    },
});

export default LoaderComponent;
