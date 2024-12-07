import axios from 'axios';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { authorize, refresh } from 'react-native-app-auth';
import MailCore from "react-native-mailcore";
import { oauthConfig } from '../../Utils/Helper';
import { useDispatch, useSelector } from 'react-redux';
import { handleLogin } from './AuthAction';
import LoaderComponent from '../../Components/LoaderComponent';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-simple-toast';

const LoginScreen = (props) => {

  const dispatch = useDispatch()
  const pageLoad = useSelector(state => state.AuthReducer.isLoading)
  const [isConnected, setIsConnected] = React.useState(true);
  
  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleGmailLogin = async () => {
    if(isConnected) {
      dispatch(handleLogin())
    } else {
      Toast.show('No internet connection', Toast.LONG);
    }
  };

  return (
    <>
    <LoaderComponent loading={pageLoad} />
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome to Mail Metrics</Text>
      <Text style={styles.subtitle}>Login to access your Gmail insights</Text>
      <TouchableOpacity style={styles.loginButton} onPress={handleGmailLogin}>
        <Text style={styles.loginButtonText}>Login with Gmail</Text>
      </TouchableOpacity>
    </View>
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
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default LoginScreen;
