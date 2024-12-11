
import MailCore from "react-native-mailcore";
import * as Actions from './AuthConstants'
import { deleteLocalStorageInfo, oauthConfig, storeLocalStorageInfo } from '../../Utils/Helper';
import { Linking } from 'react-native';
import moment from "moment";
import axios from "axios";

export const handleLogin = (result) => async (dispatch, getState) => {
    try {
        dispatch({ type: Actions.Login_Pending });
        console.log(result,"resultresultresultresultresultresult")
        if (!result.access_token || !result.id_token) {
            dispatch({ type: Actions.Login_Failure });
            console.error('Access token or ID token missing.');
            return;
        }

        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${result.access_token}` },
          });
        const userInfo = await userInfoResponse.json();
        console.log('User Info:', userInfo);

        try {
            const imapData = await loginToImap(userInfo.email, result.access_token);
            console.log('IMAP connection successful', imapData);
            if (imapData?.status == 'SUCCESS') {
                const expiryTimeUtc = moment.utc().add(result.expiresIn, 'seconds').format();
                const payload = {
                    ...userInfo,
                    access_token: result.access_token,
                    access_tokenExpirationDate: expiryTimeUtc,
                    refresh_token: result.refresh_token,
                };

                await storeLocalStorageInfo('AuthInfo', payload);

                dispatch({ type: Actions.Login_Success, payload });
            } else {
                dispatch({ type: Actions.Login_Failure });
            }

        } catch (imapError) {
            console.error('IMAP login failed:', imapError);
            dispatch({ type: Actions.Login_Failure });
        }
    } catch (error) {
        console.error('Error during Gmail login:', error);
        dispatch({ type: Actions.Login_Failure });
    }
};




export const handleRefresh = (AuthInfo) => async (dispatch, getState) => {
    dispatch({ type: Actions.Login_Pending });

  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const clientId = '1030848012340-0h5783pca718hk3gonl8n3v4loimofbd.apps.googleusercontent.com';

  try {
    const response = await axios.post(tokenUrl, {
      grant_type: 'refresh_token',
      client_id: clientId,
      refresh_token: AuthInfo.refresh_token,
    });
    console.log(response,"refresh response")
    if (response.status === 200) {
      const { access_token, expires_in } = response.data;
      console.log('Access token refreshed successfully:', access_token);

      try {
        const imapData = await loginToImap(AuthInfo.email, access_token);

        if (imapData?.status === 'SUCCESS') {
          console.log('IMAP connection successful', imapData);

          const payload = {
            ...AuthInfo,
            access_token,
            access_tokenExpirationDate: moment.utc().add(expires_in, 'seconds').format(),
          };

          await storeLocalStorageInfo('AuthInfo', payload);

          dispatch({ type: Actions.Login_Success, payload });
        } else {
          console.error('IMAP login failed:', imapData);
          dispatch({ type: Actions.Login_Failure });
        }
      } catch (imapError) {
        console.error('IMAP login error:', imapError);
        dispatch({ type: Actions.Login_Failure });
      }
    } else {
      console.error('Failed to refresh access token:', response.data);
      dispatch({ type: Actions.Login_Failure });
    }
  } catch (error) {
    console.error('Error refreshing access token:', error);
    dispatch({ type: Actions.Login_Failure });
  }
}


export const loginToImap = async (email, access_token) => {
    return new Promise((resolve, reject) => {
        MailCore.loginImap({
            hostname: "imap.gmail.com",
            port: 993,
            authType: 256,
            username: email,
            password: access_token,
        })
            .then(async (result) => {
                console.log(result, "Login successful");
                resolve(result);
            })
            .catch((error) => {
                console.log(error, "Login failed");
                reject(error); 
            });
    });

};




export const handleLogoutDispatch = () => async (dispatch, getState) => {
      deleteLocalStorageInfo('AuthInfo')
      dispatch({type: Actions.Logout})
}
