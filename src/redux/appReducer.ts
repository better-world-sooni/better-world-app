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
  useApiPOSTWithToken,
  useApiPUTWithToken,
} from 'src/redux/asyncReducer';

const usePreloadData = () => {
  const apiGET = useApiGET();
  return async (jwt) => {
    await apiGET(apis.profile._(), jwt)
    await apiGET(apis.nft._(), jwt)
    await apiGET(apis.feed._(), jwt)
    await apiGET(apis.chat.chatRoom.all(), jwt)
  }
}

export const useLogin = () => {
  const dispatch = useDispatch();
  const apiPOSTWithToken = useApiPOSTWithToken();
  const preloadData = usePreloadData()
  return (address, password, successHandler?, errHandler?) => {
    apiPOSTWithToken(
      apis.auth.password._(),
      {
        address,
        password: password,
      },
      props => {
        dispatch(async () => {
          const { jwt, user } = props.data;
          await AsyncStorage.setItem(JWT, jwt);
          await preloadData(jwt)
          await dispatch(appActions.login({
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
  const apiPUTWithToken = useApiPUTWithToken();
  const preloadData = usePreloadData()
  return (contractAddress, tokenId, successHandler?, errHandler?) => {
    apiPUTWithToken(
      apis.nft.contractAddressAndTokenId(contractAddress, tokenId),
      {
        property: 'main',
      },
      props => {
        dispatch(async () => {
          const { jwt, user, nft } = props.data;
          await AsyncStorage.setItem(JWT, jwt);
          await preloadData(jwt)
          await dispatch(appActions.changeAccount({
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
  const apiPOSTWithToken = useApiPOSTWithToken();
  return (body, successHandler?, errHandler?) => {
    apiPOSTWithToken(
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
  const apiGETWithToken = useApiGETWithToken();
  return (token, successHandler?, errHandler?) => {
    apiGETWithToken(
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
    updateCurrentNftName(state, action) {
      const { name } = action.payload;
      state.session.currentNft.name = name;
    },
    updateCurrentNftStory(state, action) {
      const { story } = action.payload;
      state.session.currentNft.story = story;
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
