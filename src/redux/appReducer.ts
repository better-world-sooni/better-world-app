import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice} from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import apis from 'src/modules/apis';
import { JWT } from 'src/modules/constants';
import { connectWs } from 'src/redux/wsReducer';
import {
  asyncActions,
  useApiGET,
  useApiGETWithToken,
  useApiPOST,
  useApiPUT,
} from 'src/redux/asyncReducer';

export const useLogin = () => {
  const dispatch = useDispatch();
  const apiPOST = useApiPOST();
  const apiGETWithToken = useApiGETWithToken();
  return (address, password, successHandler?, errHandler?) => {
    apiPOST(
      apis.auth.password._(),
      {
        address,
        password: password,
      },
      props => {
        dispatch(async () => {
          const { jwt, user } = props.data;
          await AsyncStorage.setItem(JWT, jwt);
          await apiGETWithToken(apis.profile._(), jwt)
          await apiGETWithToken(apis.chat.chatRoom.all(), jwt)
          dispatch(appActions.login({
            token: jwt,
            currentUser: user,
            currentNft: user.main_nft
          }));
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

export const useChangeAccount = () => {
  const dispatch = useDispatch();
  const apiPUT = useApiPUT();
  const apiGETWithToken = useApiGETWithToken();
  return (contractAddress, tokenId, successHandler?, errHandler?) => {
    apiPUT(
      apis.nft.contractAddressAndTokenId(contractAddress, tokenId),
      {
        property: 'main',
      },
      props => {
        dispatch(async () => {
          const { jwt, user, nft } = props.data;
          await AsyncStorage.setItem(JWT, jwt);
          await apiGETWithToken(apis.profile._(), jwt)
          await apiGETWithToken(apis.chat.chatRoom.all(), jwt)
          dispatch(appActions.changeAccount({
            token: jwt,
            currentUser: user,
            currentNft: nft
          }));
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
      apis.auth.user._(),
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
      apis.auth.user._(),
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
      currentNft: null,
    },
  },
  reducers: {
    login(state, action) {
      const { token, currentUser, currentNft } = action.payload;
      state.session = {
        currentUser,
        currentNft,
        token,
      };
      state.isLoggedIn = true;
    },
    changeAccount(state, action) {
      const { token, currentUser, currentNft } = action.payload;
      state.session = {
        currentUser,
        currentNft,
        token,
      };
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.session.currentUser = null;
      state.session.currentNft = null;
      state.session.token = null;
    },
  },
});

export const appReducer = appSlice.reducer;
export const appActions = appSlice.actions;
