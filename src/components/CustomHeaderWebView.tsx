import React, {useCallback, useRef, useState} from 'react';
import {WebView} from 'react-native-webview';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';

export default function CustomHeaderWebView({uri, onbwwMessage, ...restProps}) {
  const {token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const webviewRef = useRef(null);

  const injectedJavascript = `(function() {
        window.postMessage = function(data) {
            window.ReactNativeWebView.postMessage(data);
        };
        })(); (function() {
        window.isWebview = true
    })()`;

  const tryParseJSONObject = useCallback(jsonString => {
    try {
      var o = JSON.parse(jsonString);
      if (o && typeof o === 'object') {
        return o;
      }
    } catch (e) {}
    return false;
  }, []);
  const handleMessage = event => {
    const message = tryParseJSONObject(event.nativeEvent.data);
    if (message && 'bwwMessage' in message) {
      onbwwMessage(message.bwwMessage);
    }
  };

  return (
    <WebView
      allowsBackForwardNavigationGestures={true}
      {...restProps}
      source={{
        uri,
        headers: {
          webViewCookie: token,
        },
      }}
      ref={webviewRef}
      onScroll={event => {
        if (event.nativeEvent.contentOffset.y < -100) {
          webviewRef?.current &&
            !webviewRef.current.state.scrollReloaded &&
            webviewRef.current.reload();
        }
      }}
      injectedJavaScript={injectedJavascript}
      onMessage={handleMessage}
    />
  );
}
