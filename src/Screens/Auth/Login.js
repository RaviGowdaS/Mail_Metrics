import axios from 'axios';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { handleLogin } from './AuthAction'; 
import LoaderComponent from '../../Components/LoaderComponent';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/MaterialIcons';
import OAuthWebView from './Webview'; 

const LoginScreen = (props) => {
  const dispatch = useDispatch();
  const pageLoad = useSelector(state => state.AuthReducer.isLoading);
  const check2fa = useSelector(state => state.AuthReducer.check2FA);
  const [isConnected, setIsConnected] = React.useState(true);
  const [loadWeb, setLoadWeb] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [isEmailValid, setIsEmailValid] = React.useState(false);
  const [storedCode, setStoredCode] = React.useState('');
  const [authUrl, setAuthUrl] = React.useState('');
  const [isCheck2faUpdated, setIsCheck2faUpdated] = React.useState(false);

  const clientId = '1030848012340-0h5783pca718hk3gonl8n3v4loimofbd.apps.googleusercontent.com';
  const redirectUri = 'com.mailandroid.metrics:/oauth2redirect/google';
  const responseType = 'code';
  const scope = 'openid profile email https://mail.google.com/';

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    const unsubscribe =  Linking.addEventListener('url', handleDeepLink);
    return () => unsubscribe.remove();
  }, [check2fa]);

  React.useEffect(() => {
    if (check2fa) {
      console.log('2FA is enabled');
      setIsCheck2faUpdated(true);
    }
  }, [check2fa]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  };

  const handleDeepLink = (event) => {
    const url = event.url || '';
    const parsedUrl = new URL(url);
    const authCode = parsedUrl.searchParams.get('code');

    console.log(check2fa, 'check2fa before checking deep link');
    if (authCode) {
      if (check2fa === true) {
        console.log('2FA verified, proceeding with token exchange');
        exchangeAuthCodeForToken(authCode);
      } else {
        console.log('Storing auth code for later');
        setStoredCode(authCode);
      }
    }
  };

  const exchangeAuthCodeForToken = async (authCode) => {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: authCode,
        client_id: clientId,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }).toString(),
    });

    const data = await response.json();
    if (data.access_token) {
      dispatch(handleLogin(data));
    } else {
      dispatch({ type: 'Logout' });
    }
  };

  const handleGmailLogin = async () => {
    setAuthUrl(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&login_hint=${email}`);
    setLoadWeb(true);
  };

  const closeWebView = () => {
    setLoadWeb(false);
    if (!check2fa && storedCode) {
      exchangeAuthCodeForToken(storedCode);
    }
  };

  const handleWebViewChange = (navState) => {
    const { url } = navState;
    if (url.includes('/dp?')) {
      dispatch({ type: 'Check2FA_State' });
    }
    if (url === 'https://www.google.com/') {
      setAuthUrl('https://myaccount.google.com/signinoptions/two-step-verification/enroll');
    }
  };

  return (
    <>
      <LoaderComponent loading={pageLoad} />
      <View style={styles.container}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Welcome to Mail Metrics</Text>
        <Text style={styles.subtitle}>Login to access your Gmail insights</Text>
        <TextInput
          style={styles.emailInput}
          placeholder="Enter your email"
          placeholderTextColor="#A0AEC0"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            validateEmail(text);
          }}
          keyboardType="email-address"
        />
        <TouchableOpacity
          style={[styles.loginButton, !isEmailValid && styles.disabledLoginButton]}
          onPress={handleGmailLogin}
          disabled={!isEmailValid}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
      {loadWeb && (
        <>
          <TouchableOpacity style={styles.closeButton} onPress={closeWebView}>
            <Icon name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <View style={styles.containerWeb}>
            <OAuthWebView
              authUrl={authUrl}
              handleWebViewChange={handleWebViewChange}
            />
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#010066',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 10,
    zIndex: 1,
    backgroundColor: 'transparent',
    padding: 10,
  },
  containerWeb: {
    position: 'absolute',
    backgroundColor: '#010066',
    bottom: 0,
    height: '93%',
    width: '100%',
  },
  emailInput: {
    width: '70%',
    backgroundColor: '#1A202C',
    color: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    borderColor: '#2D3748',
    borderWidth: 1,
    textAlign: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#D1D5DB',
    marginBottom: 30,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#34A853',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  disabledLoginButton: {
    backgroundColor: '#2C5F3B',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
