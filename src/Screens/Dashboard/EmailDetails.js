import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Importing the vector icons library


const EmailDetails = (props) => {
  const emailData  = props.route.params;
  return (
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{emailData?.subject}</Text>
      </View>

      <View style={styles.senderSection}>
        <Text style={styles.senderName}>{emailData?.from.displayName} <Text style={styles.senderDate}> - {emailData?.from.mailbox}</Text></Text>
        <Text style={styles.senderDate}>{emailData.date?.split(' ')[1] + ' ' + emailData.date?.split(' ')[2]}</Text>
      </View>

      <View style={styles.bodySection}>
        <WebView
          originWhitelist={['*']}
          source={{ html: emailData?.body }}
          style={styles.webview}
          scalesPageToFit={true}
          javaScriptEnabled={true}
        />
      </View>
    </ScrollView>
  );
};

export default EmailDetails;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#010066',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#888',
  },
  senderSection: {
    marginBottom: 20,
  },
  senderName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  senderDate: {
    fontSize: 14,
    color: '#888',
  },
  bodySection: {
    marginBottom: 20,
    flex: 1,
  },
  webview: {
    height: 400,
    marginTop: 10,
  },
  linksSection: {
    marginTop: 20,
  },
  linkText: {
    fontSize: 16,
    color: '#4DA6FF', 
    marginBottom: 10,
  },
});
