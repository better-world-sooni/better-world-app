import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import apis from 'src/modules/apis';
import {JWT} from 'src/modules/constants';
import {
  asyncActions,
  useApiGET,
  useApiGETAsync,
  useApiPOSTWithToken,
  useApiPUTWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import {DrawEventFeedFilter} from 'src/screens/Home/StoreScreen';

const usePreloadData = () => {
  const apiGETAsync = useApiGETAsync();
  const updateUnreadNotificationCount = useUpdateUnreadNotificationCount();
  return async jwt => {
    await Promise.all([
      apiGETAsync(apis.profile._(), jwt),
      apiGETAsync(apis.nft._(), jwt),
      apiGETAsync(apis.post.list._(), jwt),
      apiGETAsync(apis.feed.social(), jwt),
      apiGETAsync(apis.feed.draw_event._(DrawEventFeedFilter.Notice), jwt),
      apiGETAsync(apis.nft_collection._(), jwt),
      apiGETAsync(apis.chat.chatRoom.all(), jwt),
      updateUnreadNotificationCount(jwt),
    ]);
  };
};

export const useLogin = () => {
  const dispatch = useDispatch();
  const apiPOSTWithToken = useApiPOSTWithToken();
  const preloadData = usePreloadData();
  return (address, password, successHandler?, errHandler?) => {
    apiPOSTWithToken(
      apis.auth.password._(),
      {
        address,
        password: password,
      },
      props => {
        dispatch(async () => {
          const {jwt, user} = props.data;
          await AsyncStorage.setItem(JWT, jwt);
          await preloadData(jwt);
          await dispatch(
            appActions.login({
              token: jwt,
              currentUser: user,
              currentNft: user.main_nft,
            }),
          );
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
  const preloadData = usePreloadData();
  return (props, successHandler?) => {
    dispatch(async () => {
      const {jwt, user} = props;
      await AsyncStorage.setItem(JWT, jwt);
      await preloadData(jwt);
      await dispatch(
        appActions.login({
          token: jwt,
          currentUser: user,
          currentNft: user.main_nft,
        }),
      );
      if (successHandler) {
        await successHandler(props);
      }
    });
  };
};

export const useChangeAccount = () => {
  const dispatch = useDispatch();
  const apiPUTWithToken = useApiPUTWithToken();
  const preloadData = usePreloadData();
  return (contractAddress, tokenId, successHandler?, errHandler?) => {
    apiPUTWithToken(
      apis.nft.contractAddressAndTokenId(contractAddress, tokenId),
      {
        property: 'main',
      },
      props => {
        dispatch(async () => {
          const {jwt, user, nft} = props.data;
          await AsyncStorage.setItem(JWT, jwt);
          await preloadData(jwt);
          await dispatch(
            appActions.changeAccount({
              token: jwt,
              currentUser: user,
              currentNft: nft,
            }),
          );
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
  const apiGETAsync = useApiGETAsync();
  const preloadData = usePreloadData();
  return async (token, successHandler?, errHandler?) => {
    await apiGETAsync(
      apis.auth.user._(),
      token,
      async props => {
        const {jwt, user, current_nft} = props.data;
        await AsyncStorage.setItem(JWT, jwt);
        await preloadData(jwt);
        dispatch(
          appActions.login({
            token: jwt,
            currentUser: user,
            currentNft: current_nft,
          }),
        );
        if (successHandler) {
          await successHandler(props);
        }
      },
      async props => {
        await errHandler(props);
      },
    );
  };
};

export const useUpdateUnreadNotificationCount = () => {
  const dispatch = useDispatch();
  const reloadGETWithToken = useReloadGETWithToken();
  const apiGET = useApiGETAsync();
  return (jwt = null) => {
    if (!jwt) {
      reloadGETWithToken(apis.feed.count(), ({data}) => {
        const payload = {
          unreadNotificationCount: data.unread_notification_count,
        };
        dispatch(appActions.updateUnreadNotificationCount(payload));
      });
      return;
    }
    apiGET(apis.feed.count(), jwt, ({data}) => {
      const payload = {
        unreadNotificationCount: data.unread_notification_count,
      };
      dispatch(appActions.updateUnreadNotificationCount(payload));
    });
  };
};

export const useLogout = (callback?) => {
  return async () => {
    await appActions.logout();
    await asyncActions.reset();
    await AsyncStorage.removeItem(JWT);
    if (callback) {
      await callback();
    }
  };
};

const appSlice = createSlice({
  name: 'app',
  initialState: {
    isLoggedIn: false,
    unreadNotificationCount: 0,
    unreadChatRoomCount: 0,
    session: {
      currentUser: null,
      token: null,
      currentNft: null,
    },
  },
  reducers: {
    login(state, action) {
      const {token, currentUser, currentNft} = action.payload;
      state.session = {
        currentUser,
        currentNft,
        token,
      };
      state.isLoggedIn = true;
    },
    updateCurrentNftName(state, action) {
      const {name} = action.payload;
      state.session.currentNft.name = name;
      state.isLoggedIn = true;
    },
    updateCurrentNftStory(state, action) {
      const {story} = action.payload;
      state.session.currentNft.story = story;
      state.isLoggedIn = true;
    },
    changeAccount(state, action) {
      const {token, currentUser, currentNft} = action.payload;
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
    updateUnreadNotificationCount(state, action) {
      const {unreadNotificationCount} = action.payload;
      state.unreadNotificationCount = unreadNotificationCount;
    },
    updateUnreadChatRoomCount(state, action) {
      const {unreadChatRoomCount} = action.payload;
      state.unreadChatRoomCount = unreadChatRoomCount;
    },
    incrementUnreadChatRoomCount(state, action) {
      const {deltum} = action.payload;
      state.unreadChatRoomCount += deltum;
    },
  },
});

export const appReducer = appSlice.reducer;
export const appActions = appSlice.actions;
