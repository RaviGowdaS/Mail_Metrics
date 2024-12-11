import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NativeBaseProvider } from 'native-base';
import LoginScreen from '../Screens/Auth/Login';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getLocalStorageInfo } from '../Utils/Helper';
import { handleLogoutDispatch, handleRefresh, loginToImap } from '../Screens/Auth/AuthAction';
import moment from 'moment';
import { Animated, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Dashboard from '../Screens/Dashboard';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, useIsDrawerOpen } from '@react-navigation/drawer';
import EmailDetails from '../Screens/Dashboard/EmailDetails';
import NetInfo from '@react-native-community/netinfo';

const RootStack = createStackNavigator();
const Drawer = createDrawerNavigator();

export const AuthStack = () => {
    return (
        <RootStack.Navigator>
            <RootStack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        </RootStack.Navigator>
    )
}

const CustomDrawerContent = (props) => {
    const dispatch = useDispatch();
    const AuthInfo = useSelector((state) => state.AuthReducer.userInfo);
    const handleLogout = () => {
        dispatch(handleLogoutDispatch());
    };
    return (
        <View>
            <View style={styles.profileContainer}>
                <View style={styles.avatar}>
                    <Image
                        source={{ uri: AuthInfo?.picture }}
                        style={styles.avatarImage}
                    />
                </View>
                <Text style={styles.name}>{AuthInfo?.name || 'User Name'}</Text>
                <Text style={styles.email}>{AuthInfo?.email || 'user@example.com'}</Text>
            </View>
            <DrawerContentScrollView {...props} style={styles.drawerContent}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
            <View style={styles.extraOptions}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};


const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
            }} drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
            <Drawer.Screen name="Dashboard" component={Dashboard} />
        </Drawer.Navigator>
    );
};

export const DashboardStack = (props) => {
    return (
        <RootStack.Navigator>
            <RootStack.Screen options={{ headerShown: false }} name="DrawerNavigator" component={DrawerNavigator} />
            <RootStack.Screen options={{ headerShown: false }} name="EmailDetails" component={EmailDetails} />
        </RootStack.Navigator>
    )
}
export const SplashView = (props) => {

    return (
        <View style={styles.container}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
        </View>
    )
}


export default function Navigation() {
    const dispatch = useDispatch()
    const AuthInfo = useSelector(state => state.AuthReducer.userInfo)
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
    React.useEffect(() => {
        if (isConnected) {
            dispatch({ type: 'Login_Pending' })
            getLocalStorageInfo('AuthInfo')
                .then(res => {
                    if (res != null) {
                        const isExpired = moment().utc().isAfter(res.access_tokenExpirationDate);
                        if (isExpired) {
                            dispatch(handleRefresh(res))
                        } else {
                            handleNav(res)
                        }
                    } else {
                        dispatch({ type: 'Login_Failure' })
                    }
                })
        }
    }, [isConnected])


    const handleNav = async (data) => {
        await loginToImap(data.email, data.access_token)
            .then(res => {
                if (res.status == 'SUCCESS') {
                    dispatch({ type: 'Login_Success', payload: data })
                }
            })
            .catch(err => {
                dispatch({ type: 'Login_Failure' })
            })
    }

    console.log(pageLoad, 'pageLoadpageLoad')


    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <NativeBaseProvider>
                    {AuthInfo != undefined && pageLoad == true ? <SplashView /> : AuthInfo != undefined && pageLoad == false ? <DashboardStack /> : pageLoad == true ? <SplashView /> : <AuthStack />}
                </NativeBaseProvider>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}


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
    profileContainer: {
        padding: 20,
        backgroundColor: '#010066',
        alignItems: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4285F4',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatarImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    email: {
        fontSize: 14,
        color: '#bbb',
        marginBottom: 10,
    },
    drawerContent: {
        flex: 1,
    },
    addAccountButton: {
        paddingVertical: 15,
        backgroundColor: '#4285F4',
        borderRadius: 5,
        marginHorizontal: 20,
        marginBottom: 15,
    },
    addAccountText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    extraOptions: {
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderColor: '#333',
    },
    logoutButton: {
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutText: {
        fontSize: 16,
        color: '#ff3b30',
        fontWeight: 'bold',
    },
});