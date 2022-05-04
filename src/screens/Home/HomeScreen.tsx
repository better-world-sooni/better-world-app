import React, {useRef} from 'react';
import {Div} from 'src/components/common/Div';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {HAS_NOTCH, iconSettings, iconSettingsSm} from 'src/modules/constants';
import {RootState} from 'src/redux/rootReducer';
import CustomHeaderWebView from 'src/components/CustomHeaderWebView';
import {urls} from 'src/modules/urls';
import {useChangeAccount} from 'src/redux/appReducer';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {NAV_NAMES} from 'src/modules/navNames';
import {StatusBar} from 'react-native';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {Img} from 'src/components/common/Img';
import {IMAGES} from 'src/modules/images';
import {ICONS} from 'src/modules/icons';
import {X, MessageCircle, Bell} from 'react-native-feather';
import Colors from 'src/constants/Colors';

const HomeScreen = () => {
  const navigation = useNavigation();
  const homeUrl = urls.home();
  const handleBwwMessage = message => {
    if (message.action == 'handleClickCapsule') {
      navigation.navigate(NAV_NAMES.Metaverse, {
        tokenId: message.tokenId,
        contractAddress: message.contractAddress,
      });
    }
  };

  return (
    <Div flex backgroundColor={'white'}>
      <StatusBar animated={true} barStyle={'dark-content'} />
      <Div h={HAS_NOTCH ? 44 : 20} />
      <Row itemsCenter>
        <Col px25>
          <Bell {...iconSettings} color={Colors.primary.DEFAULT} />
        </Col>
        <Col itemsCenter>
          <Img w45 h45 source={IMAGES.betterWorldBlueLogo} />
        </Col>
        <Col itemsEnd px25>
          <MessageCircle {...iconSettings} color={Colors.primary.DEFAULT} />
        </Col>
      </Row>
    </Div>
  );
};

export default HomeScreen;
