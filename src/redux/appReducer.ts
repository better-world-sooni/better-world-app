import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice} from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import apis from 'src/modules/apis';
import { JWT } from 'src/modules/constants';
import { connectWs } from 'src/redux/wsReducer';
import {
  asyncActions,
  useApiGET,
  useApiGETAsync,
  useApiGETWithToken,
  useApiPOSTWithToken,
  useApiPUTWithToken,
} from 'src/redux/asyncReducer';

const usePreloadData = () => {
  const apiGETAsync = useApiGETAsync();
  return async (jwt) => {
    await Promise.all([
      apiGETAsync(apis.profile._(), jwt),
      apiGETAsync(apis.nft._(), jwt),
      apiGETAsync(apis.feed._(), jwt),
      apiGETAsync(apis.post.list._(), jwt),
      apiGETAsync(apis.rank.list(), jwt),
      apiGETAsync(apis.chat.chatRoom.all(), jwt),
      apiGETAsync(apis.nft_collection.profile(), jwt),
      apiGETAsync(apis.notification.list._(), jwt)
    ])
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
          console.log(props.data)
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

export const useQrLogin = () => {
  const dispatch = useDispatch();
  const apiPOSTWithToken = useApiPOSTWithToken();
  const preloadData = usePreloadData()
  return (token, successHandler?, errHandler?) => {
    apiPOSTWithToken(
      apis.auth.jwt.qrLogin(),
      {
        token
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
  }
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

export const useAutoLogin = () => {
  const dispatch = useDispatch();
  const apiGET = useApiGET();
  const preloadData = usePreloadData()
  return (token, successHandler?, errHandler?) => {
    apiGET(
      apis.auth.user._(),
      token,
      props => {
        dispatch(async () => {
          const { jwt, user, current_nft } = props.data;
          await AsyncStorage.setItem(JWT, jwt);
          await preloadData(jwt)
          dispatch(appActions.login({
            token: jwt,
            currentUser: user,
            currentNft: current_nft
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

export const useUpdateUnreadMessageCount = () => {
  const dispatch = useDispatch();
  const apiGETWithToken = useApiGETWithToken();
  return (successHandler?, errHandler?) => {
    apiGETWithToken(
      apis.notification.list.unreadCount(),
      props => {
        dispatch(async () => {
          const payload = {
            unreadCount: props.data.unread_count
          };
          dispatch(appActions.updateUnreadCount(payload));
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
      appActions.logout()
      asyncActions.reset()
      AsyncStorage.removeItem(JWT)
    });
  };
};

const appSlice = createSlice({
  name: 'app',
  initialState: {
    isLoggedIn: false,
    unreadNotificationCount: 0,
    unreadMessagesCount: 0,
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
      state.isLoggedIn = true;
    },
    updateCurrentNftStory(state, action) {
      const { story } = action.payload;
      state.session.currentNft.story = story;
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
    updateUnreadCount(state, action) {
      const { unreadCount } = action.payload;
      state.unreadNotificationCount = unreadCount
    },
  },
});

export const appReducer = appSlice.reducer;
export const appActions = appSlice.actions;
