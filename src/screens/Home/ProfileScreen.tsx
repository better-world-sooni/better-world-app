import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useLayoutEffect, useState, useRef} from 'react';
import {WebView} from 'react-native-webview';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {NAV_NAMES} from 'src/modules/navNames';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {LogOut, PlusSquare} from 'react-native-feather';
import {
  Direction,
  GRAY_COLOR,
  HAS_NOTCH,
  iconSettings,
  LINE2_Linked_List,
  MAIN_LINE2,
  MY_ROUTE,
  Selecting,
  shortenStations,
  truncateKlaytnAddress,
} from 'src/modules/constants';
import {appActions, useLogout} from 'src/redux/appReducer';
import {RootState} from 'src/redux/rootReducer';
import CustomHeaderWebView from 'src/components/CustomHeaderWebView';




const ProfileScreen = props => {
  const navigation = useNavigation();
  const logout = useLogout(() => navigation.navigate(NAV_NAMES.SignIn));
  const {currentUser, token, mainNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const webViewRef = useRef(null);
  
  const contractAddress = mainNft.contract_address;
  const tokenId = mainNft.token_id;
  const profileUri = `http://localhost:3001/nft-profile/${contractAddress}/${tokenId}`;
  const testUri = 'https://naver.com'


  return (
    <Div flex backgroundColor={'white'}>
      <Div h={HAS_NOTCH ? 44 : 10} />
      <Row itemsCenter py10 px20 bg={'white'}>
        <Col justifyCenter bgGray300 rounded20 h30 wFull mr20 px20>
          <Span gray500>Search by address or username</Span>
        </Col>
        <Col pl15 auto onPress={logout}>
          <LogOut {...iconSettings} color={'black'}></LogOut>
        </Col>
      </Row>
      <CustomHeaderWebView
        source={{
          uri: profileUri,
          headers: {
            'webViewCookie': token,
          },
        }}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
      />
    </Div>
  );
};

export default ProfileScreen;
  