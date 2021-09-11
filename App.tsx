import React, { useEffect} from 'react';
import {LogBox, Platform, StatusBar, View} from 'react-native';
import codePush from 'react-native-code-push';
import {withRootReducer} from './src/redux/withRootReducer';
import {AppContent} from 'src/components/AppContent';
import {varStyle} from './src/modules/styles';
import {Span} from 'src/components/common/Span';
import { Row } from 'src/components/common/Row';
import { Col } from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import { Img } from 'src/components/common/Img';
import { IMAGES } from 'src/modules/images';
import { PlusCircle } from 'react-native-feather';
import LinearGradient from 'react-native-linear-gradient';

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
