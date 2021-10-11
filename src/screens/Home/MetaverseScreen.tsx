import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from 'src/redux/rootReducer';
// import CookieManager from '@react-native-community/cookies';

const metasunganUrl = 'http://localhost:3000/'

const MetaSunganScreen = () =>  {

  const { userToken } = useSelector(
    (root: RootState) => ({ userToken: root.app.session.token }),
    shallowEqual,
  );

  // const navChange = e => {
  //   if (e.url == metasunganUrl) {
  //     CookieManager.set(metasunganUrl, {
  //       name: 'jwtToken',
  //       value: userToken,
  //     }).then((done) => {
  //       console.log('CookieManager.set =>', done);
  //     })
  //   }
  // };
  
  
  return <WebView source={{ 
    uri: metasunganUrl,
    headers: {
      Cookie: `jwtToken=${userToken};`,
    },
  }} 
  thirdPartyCookiesEnabled={true}
  sharedCookiesEnabled={true}
  // onNavigationStateChange={navChange}
  />;
  
}

export default MetaSunganScreen