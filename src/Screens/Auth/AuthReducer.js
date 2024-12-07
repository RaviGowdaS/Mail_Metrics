import * as Actions from './AuthConstants';


export const initialState = {
  userInfo: undefined,
  LoginError: "",
  isLoading: true,
}



const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Login_Pending:
      return {
        ...state,
        isLoading: true
      }
    case Actions.Login_Success:
      return {
        ...state,
        userInfo: action.payload,
        isLoading: false
      }
    case Actions.Login_Failure:
      return {
        ...state,
        userInfo: undefined,
        isLoading: false
      }
    case Actions.Logout:
      return {
        userInfo: undefined,
        isLoading: false
      }

    default:
      return {
        ...state
      }
  }
}

export default AuthReducer;