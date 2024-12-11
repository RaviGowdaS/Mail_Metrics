import AsyncStorage from '@react-native-async-storage/async-storage';



export const oauthConfig = {
    issuer: 'https://accounts.google.com',
    clientId: '1030848012340-0h5783pca718hk3gonl8n3v4loimofbd.apps.googleusercontent.com', 
    redirectUrl: 'com.mailandroid.metrics:/oauth2redirect/google',
    scopes: ['openid', 'profile', 'email', 'https://mail.google.com/', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'], // Scopes for Gmail
};


export const storeLocalStorageInfo = async (storename, value) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('@' + storename, jsonValue)
    } catch (e) {
    }
}

export const getLocalStorageInfo = async (storename) => {
    try {
        const jsonValue = await AsyncStorage.getItem('@' + storename)
        const value = JSON.parse(jsonValue)
        return value
    } catch (e) {
    }
}


export const deleteLocalStorageInfo = async (storename) => {
    try {
        const js = await AsyncStorage.removeItem('@' + storename);
        return true;
    } catch (e) {
        return false;
    }
}
