import { authorize, refresh, revoke } from 'react-native-app-auth';
import MailCore from "react-native-mailcore";
import * as Actions from './AuthConstants'
import { deleteLocalStorageInfo, oauthConfig, storeLocalStorageInfo } from '../../Utils/Helper';

export const handleLogin = () => async (dispatch, getState) => {
    try {
        dispatch({ type: Actions.Login_Pending });

        const result = await authorize(oauthConfig);

        if (!result.accessToken || !result.idToken) {
            dispatch({ type: Actions.Login_Failure });
            console.error('Access token or ID token missing.');
            return;
        }

        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${result.accessToken}`,
            },
        });
        const userInfo = await userInfoResponse.json();
        console.log('User Info:', userInfo);

        try {
            const imapData = await loginToImap(userInfo.email, result.accessToken);
            console.log('IMAP connection successful', imapData);
            if (imapData?.status == 'SUCCESS') {
                const payload = {
                    ...userInfo,
                    accessToken: result.accessToken,
                    accessTokenExpirationDate: result.accessTokenExpirationDate,
                    refreshToken: result.refreshToken,
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
    dispatch({ type: Actions.Login_Pending })
    console.log(AuthInfo,'AuthInfoAuthInfoAuthInfo')
    const refreshedState = await refresh(oauthConfig, {
        refreshToken: AuthInfo.refreshToken,
    });
    if (refreshedState) {
        try {
            const imapData = await loginToImap(AuthInfo.email, refreshedState.accessToken);
            if (imapData?.status == 'SUCCESS') {
                console.log('IMAP connection successful', imapData);
                const payload = {
                    ...AuthInfo,
                    accessToken: refreshedState.accessToken,
                    accessTokenExpirationDate: refreshedState.accessTokenExpirationDate,
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
    } else {
        dispatch({ type: Actions.Login_Failure })
    }
}


export const loginToImap = (email, accessToken) => {
    return new Promise((resolve, reject) => {
        MailCore.loginImap({
            hostname: "imap.gmail.com",
            port: 993,
            authType: 256,
            username: email,
            password: accessToken,
        })
            .then((result) => {
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
    const AuthInfo = getState().AuthReducer.userInfo
    const isRevokedToken = await revoke(oauthConfig, {
        tokenToRevoke: AuthInfo.refreshToken,
      });
      console.log(isRevokedToken,'isRevokedTokenisRevokedToken')
      deleteLocalStorageInfo('AuthInfo')
      dispatch({type: Actions.Logout})
}