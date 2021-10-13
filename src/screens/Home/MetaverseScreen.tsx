import React, { useCallback, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from 'src/redux/rootReducer';
import { useFocusEffect } from '@react-navigation/core';

const MetaSunganScreen = () =>  {
  const webViewRef = useRef(null);
  const { userToken } = useSelector(
    (root: RootState) => ({ userToken: root.app.session.token }),
    shallowEqual,
  );
  const metasunganUrl = `http://localhost:3000/?jwtToken=${userToken}`;
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
        }} 
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        />
  );
  
}

export default MetaSunganScreen