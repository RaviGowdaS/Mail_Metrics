import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { combineReducers,compose } from 'redux'
import AuthReducer from './Screens/Auth/AuthReducer';

const AllReducers = combineReducers({
    AuthReducer
})

const rootReducer = (state, action) => {
    if (action.type === 'LOGOUT') {
        state = undefined;
    }
    return AllReducers(state, action);
}

export default createStore(rootReducer,compose(applyMiddleware(thunk)));