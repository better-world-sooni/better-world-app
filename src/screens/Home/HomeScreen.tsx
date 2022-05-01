import React, {useRef} from 'react';
import {Div} from 'src/components/common/Div';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {HAS_NOTCH} from 'src/modules/constants';
import {RootState} from 'src/redux/rootReducer';
import CustomHeaderWebView from 'src/components/CustomHeaderWebView';
import {urls} from 'src/modules/urls';
import {useChangeAccount} from 'src/redux/appReducer';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {NAV_NAMES} from 'src/modules/navNames';

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
      <Div h={HAS_NOTCH ? 44 : 20} />
      <CustomHeaderWebView
        uri={homeUrl}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        onbwwMessage={handleBwwMessage}
      />
    </Div>
  );
};

export default HomeScreen;
