/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Provider } from 'react-redux';
import rootReducer from './src/CombineReducers'

const AppProvider = () => (<Provider store={rootReducer}>
    <App />	
</Provider>)

AppRegistry.registerComponent(appName, () => AppProvider);
