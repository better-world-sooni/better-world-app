import React, {useRef} from 'react';
import {Div} from 'src/components/common/Div';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {HAS_NOTCH} from 'src/modules/constants';
import {RootState} from 'src/redux/rootReducer';
import CustomHeaderWebView from 'src/components/CustomHeaderWebView';
import {urls} from 'src/modules/urls';
import {useChangeAccount} from 'src/redux/appReducer';
import {CommonActions} from '@react-navigation/native';
import {NAV_NAMES} from 'src/modules/navNames';

const ProfileScreen = () => {
  const homeUrl = urls.nftProfile._();
  const handleBwwMessage = message => {};

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

export default ProfileScreen;
