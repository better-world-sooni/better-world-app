import React, { useCallback, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from 'src/redux/rootReducer';
// import CookieManager from '@react-native-community/cookies';
import { useFocusEffect } from '@react-navigation/core';



const MetaSunganScreen = () =>  {
  const webViewRef = useRef(null);
  const { userToken } = useSelector(
    (root: RootState) => ({ userToken: root.app.session.token }),
    shallowEqual,
  );
  const metasunganUrl = `http://localhost:3000/?jwtToken=${userToken}`;
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
  const reload = () => {
    webViewRef && webViewRef.current.reload();
  }
  useFocusEffect(
    useCallback(() => {
      reload()
    },[]),
  )
  console.log(metasunganUrl);
  
  return (
    <WebView 
        ref={webViewRef}
        source={{ 
          uri: metasunganUrl,
          // headers: {
          //   Cookie: `jwtToken=${userToken};`,
          // },
        }} 
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        // onNavigationStateChange={navChange}
        />
  );
  
}

export default MetaSunganScreen