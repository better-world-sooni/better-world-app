import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice} from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import APIS from 'src/modules/apis';
// import {getServerLocale} from 'src/modules/utils';
import {JWT_TOKEN} from 'src/modules/contants';
import {
  asyncActions,
  useApiGETWithToken,
  useApiPOST,
} from 'src/redux/asyncReducer';

export const useLogin = () => {
  const dispatch = useDispatch();
  const apiPOST = useApiPOST();
  return (email, password, successHandler?, errHandler?) => {
    apiPOST(
      APIS.auth.signIn(),
      {
        email: email,
        password: password,
      },
      props => {
        dispatch(async () => {
          const { jwtToken } = props.data;
          await AsyncStorage.setItem(JWT_TOKEN, jwtToken);
          dispatch(appActions.login(props.data));
          if (successHandler) {
            const success = await successHandler(props);
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
            const {jwt_token} = props.data;
            await AsyncStorage.setItem(JWT_TOKEN, jwt_token);
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
  const apiGETWithToken = useApiGETWithToken();
  return (token, successHandler?, errHandler?) => {
    apiGETWithToken(
      APIS.profile.get(),
      token,
      props => {
        dispatch(async () => {
          await AsyncStorage.setItem(JWT_TOKEN, token);
          const payload = {
            ...props.data,
            jwt_token: token,
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
      await AsyncStorage.removeItem(JWT_TOKEN);
      dispatch(appActions.logout());
      dispatch(asyncActions.reset());
      if (callback) {
        console.log("bhansdofnoiaskdjnfjkasd")
        await callback();
      }
    });
  };
};

const appSlice = createSlice({
  name: 'app',
  initialState: {
    isLoggedIn: false,
    session: {
      // user: null,
      token: null,
    },
  },
  reducers: {
    setTempLocale(state, action) {
      const { locale } = action.payload;
    },
    login(state, action) {
      const { jwtToken } = action.payload;
      state.session = {
        token: jwtToken,
      };
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
      // state.session.user = null;
      state.session.token = null;
    },
    // updateUser(state, action) {
    //   const {user} = action.payload;
    //   state.session.user = user;
    // },
  },
});

export const appReducer = appSlice.reducer;
export const appActions = appSlice.actions;
