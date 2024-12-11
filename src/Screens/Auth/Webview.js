import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon package

const { height: screenHeight } = Dimensions.get('window');

const OAuthWebView = ({ authUrl, handleWebViewChange}) => {
  const [loading, setLoading] = useState(true);
    var authurl = authUrl
  const handleWebViewNavigationStateChange = (navState) => {
    handleWebViewChange(navState)
  };

  return (
    <View style={[styles.container]}>
      {loading && (
        <ActivityIndicator
          style={styles.loadingIndicator}
          size="large"
          color="#007AFF"
        />
      )}
      <WebView
        source={{ uri: authurl }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={handleWebViewNavigationStateChange}
        incognito={true}
        style={[styles.webview, { height: screenHeight * 0.7 }]} // 70% of screen height
        userAgent="Chrome/18.0.1025.133 Mobile Safari/535.19"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative', // Ensure the close button is on top of the WebView
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -25,
    marginTop: -25,
  },
  closeButton: {
    position: 'absolute',
    top: 20, // Close button at the top
    right: 20, // Close button on the right side
    zIndex: 10, // Ensure the button is above the WebView
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Optional: semi-transparent background for the button
    borderRadius: 50,
    padding: 10,
  },
  webview: {
    flex: 1,
    borderRadius: 10, // Optional: rounded corners for the WebView
  },
});

export default OAuthWebView;
