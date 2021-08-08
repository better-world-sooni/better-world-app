import React, { useEffect} from 'react';
import {LogBox, StatusBar, View} from 'react-native';
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
    <View style={{flex: 1, backgroundColor: "#2e2e2e"}}>
      <StatusBar barStyle="dark-content" backgroundColor={varStyle.gray100} />
      <AppContent />
      <Div bgWhite h70 borderRadius={10} mt2 >
        
        <Row pt5>
          <Col></Col>
          <Col auto >
          <Img w21 h50 source={IMAGES.mainLogo} />

          </Col>
          <Col></Col>
        </Row>
      </Div>
    </View>
  );
};

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
};

export default codePush(codePushOptions)(withRootReducer(App));
