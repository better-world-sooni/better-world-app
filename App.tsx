import React, { useEffect} from 'react';
import {LogBox, Platform, StatusBar, View} from 'react-native';
import codePush from 'react-native-code-push';
import {withRootReducer} from './src/redux/withRootReducer';
import {AppContent} from 'src/components/AppContent';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faWalking, faBus, faSubway } from '@fortawesome/free-solid-svg-icons'

library.add(faWalking, faBus, faSubway)

const App = () => {
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

  return (
      <AppContent />
  );
};

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
};

export default codePush(codePushOptions)(withRootReducer(App));
