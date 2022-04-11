import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice} from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import APIS from 'src/modules/apis';
import { JWT } from 'src/modules/constants';
import { connectWs } from 'src/redux/wsReducer';
import {
  asyncActions,
  useApiGET,
  useApiGETWithToken,
  useApiPOST,
} from 'src/redux/asyncReducer';

export const useLogin = () => {
  const dispatch = useDispatch();
  const apiPOST = useApiPOST();
  const apiGETWithToken = useApiGETWithToken();
  return (email, password, successHandler?, errHandler?) => {
    apiPOST(
      APIS.auth.email.signin(),
      {
        address: email,
        password: password,
      },
      props => {
        dispatch(async () => {
          const { jwt } = props.data;
          await apiGETWithToken(APIS.profile.my(), jwt)
          await apiGETWithToken(APIS.chat.chatRoom.main(), jwt)
          await AsyncStorage.setItem(JWT, jwt);
          // dispatch(connectWs(jwt))
          dispatch(appActions.login(props.data));
          if (successHandler) {
            await successHandler(props);
          }
        });
      },
      async props => {
        await errHandler(props);
      },
    );
  };
};

export const useSocialLogin = () => {
  const dispatch = useDispatch();
  const apiPOST = useApiPOST();
  return (body, successHandler?, errHandler?) => {
    apiPOST(
      APIS.auth.signIn(),
      body,
      props => {
        dispatch(async () => {
          if (!props.data.is_new_user) {
            const { jwtToken } = props.data;
            await AsyncStorage.setItem(JWT, jwtToken);
            dispatch(appActions.login(props.data));
          }
          if (successHandler) {
            await successHandler(props);
          }
        });
      },
      async props => {
        await errHandler(props);
      },
    );
  };
};

export const useAutoLogin = () => {
  const dispatch = useDispatch();
  const apiGET = useApiGET();
  return (token, successHandler?, errHandler?) => {
    apiGET(
      APIS.auth.user(token),
      props => {
        dispatch(async () => {
          await AsyncStorage.setItem(JWT, token);
          const payload = {
            user: props.data,
            jwtToken: token,
          };
          dispatch(appActions.login(payload));
          if (successHandler) {
            await successHandler(props);
          }
        });
      },
      async props => {
        await errHandler(props);
      },
    );
  };
};

export const useLogout = (callback?) => {
  const dispatch = useDispatch();
  return () => {
    dispatch(async () => {
      if (callback) {
        await callback();
      }
      await AsyncStorage.removeItem(JWT);
      dispatch(appActions.logout());
      dispatch(asyncActions.reset());
    });
  };
};

const appSlice = createSlice({
  name: 'app',
  initialState: {
    isLoggedIn: false,
    session: {
      currentUser: null,
      token: null,
    },
    badge: 0,
  },
  reducers: {
    setBadge(state, action){
      state.badge = action.payload;
    },
    login(state, action) {
      const { jwt, user } = action.payload;
      state.session = {
        currentUser: user,
        token: jwt,
      };
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.session.currentUser = null;
      state.session.token = null;
    },
    updateUserAvatar(state, action) {
      const {avatar, ...rest} = state.session.currentUser;
      const newUser = {avatar: action.payload, ...rest}
      state.session.currentUser = newUser;
    },
  },
});

export const appReducer = appSlice.reducer;
export const appActions = appSlice.actions;
