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

const MetaverseScreen = props => {
  const tokenId = props.route?.params?.tokenId;
  const contractAddress = props.route?.params?.contractAddress;
  const navigation = useNavigation();
  const homeUrl =
    'http://localhost:3100/0xe5e47d1540d136777c0b4e0865f467987c3d6513/5?jwt=eyJhbGciOiJSUzI1NiJ9.eyJ1c2VyX3V1aWQiOiIxMUVDQzNCNC00MEY5LTQyNjgtOEUxMS00NTNENkQ2MjQ3MDAiLCJleHAiOjE2NTQwODQ1MTQsIm5mdCI6eyJjb250cmFjdF9hZGRyZXNzIjoiMHhlNWU0N2QxNTQwZDEzNjc3N2MwYjRlMDg2NWY0Njc5ODdjM2Q2NTEzIiwidG9rZW5faWQiOjV9fQ.v3pGBWNvVZnZ0WWMLcuIK4uaT4Gg4TUdny5WXlmWPTnvjh8ufpiDNgOhm7_EBbGpmk_nVdh_m0yaSU21VNQpyzX81zZTpjZ2ZDfCCW4g3L2Zr1ARwVje2DpSaQIb3DycbntWg91YGaBY3zPTt7JjDBrW86Himi0_K3NRRtf7wT8fr1kF04sMiCuMf29M8Ba2rdTZQgichj2BzwEv67ynLDkv5HNmtI1j8VYUg9Nifbmk_C2XOhv7VxNXqGSf-RRUpHHHjv9FzAh-5ZUHNhzUmFUBlygqUeSCXQJPhp9Fi251aJ9SKcjaJauKpTn6_WrO7uwDtY2M4EkyZyrbaGpUkQ';
  const handleBwwMessage = message => {};

  return (
    <Div flex backgroundColor={'white'}>
      <CustomHeaderWebView
        uri={homeUrl}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        onbwwMessage={handleBwwMessage}
      />
    </Div>
  );
};

export default MetaverseScreen;
