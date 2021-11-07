import React, {useCallback, useEffect, useState} from 'react';
import {LogBox} from 'react-native';
import codePush from 'react-native-code-push';
import {withRootReducer} from './src/redux/withRootReducer';
import {AppContent} from 'src/components/AppContent';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faWalking, faBus, faSubway} from '@fortawesome/free-solid-svg-icons';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {setMetasunganUser} from 'src/redux/metasunganReducer';
import {Manager} from 'socket.io-client';
import {setChatSocket} from 'src/redux/chatReducer';

library.add(faWalking, faBus, faSubway);

const App = () => {
  const {isLoggedIn, session} = useSelector(
    (root: RootState) => root.app,
    shallowEqual,
  );
  const dispatch = useDispatch();

  const login = useCallback(
    loginParams => {
      console.log('login metasunganUser', loginParams);
      dispatch(setMetasunganUser(loginParams.user));
    },
    [dispatch],
  );

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    LogBox.ignoreLogs([
      'Sending `onAnimatedValueUpdate` with no listeners registered',
    ]);
    LogBox.ignoreLogs([
      'Remote debugger is in a background tab which may cause apps to perform slowly.',
    ]);
  }, []);

  useEffect(() => {
    const BACKEND_URL = 'https://ws.metasgid.com';
    const manager = new Manager(BACKEND_URL, {
      reconnectionDelayMax: 5000,
      forceNew: true,
    });
    const newSocket = manager.socket('/chat', {
      auth: {
        token: session.token,
      },
    });
    newSocket.on('login', login);
    newSocket.on('disconnnect', () => dispatch(setChatSocket(null)));
    dispatch(setChatSocket(newSocket));
    return () => {
      newSocket.off('login');
      newSocket.off('disconnnect');
      newSocket.close();
      dispatch(setChatSocket(null));
    };
  }, [session.token, isLoggedIn]);

  return <AppContent />;
};

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
};

export default codePush(codePushOptions)(withRootReducer(App));
