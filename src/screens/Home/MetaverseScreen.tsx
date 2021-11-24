import React, {useCallback, useRef, useState} from 'react';
import {WebView} from 'react-native-webview';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {useFocusEffect, useNavigation} from '@react-navigation/core';
import {setChatBody} from 'src/redux/chatReducer';
import {Div} from 'src/components/common/Div';
import {
  HAS_NOTCH,
  MAIN_LINE2,
  MY_ROUTE,
  Selecting,
} from 'src/modules/constants';
import {setGlobalFilter} from 'src/redux/feedReducer';
import {ScrollSelector} from 'src/components/ScrollSelector';
import {Header} from 'src/components/Header';
import {NAV_NAMES} from 'src/modules/navNames';

interface MetasunganWindowMessage {
  payload: any;
  action: MetasunganAction;
}

enum MetasunganAction {
  ENTER_CHAT_ROOM = 'enterChatRoom',
  OPEN_CHAT_ROOM = 'openChatRoom',
}

const MetaSunganScreen = () => {
  // constants
  const injectedJavascript = `(function() {
    window.postMessage = function(data) {
      window.ReactNativeWebView.postMessage(data);
    };
  })()`;

  // redux
  const {token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const {globalFiter} = useSelector(
    (root: RootState) => root.feed,
    shallowEqual,
  );
  const {stations} = useSelector(
    (root: RootState) => root.route.route,
    shallowEqual,
  );
  const dispatch = useDispatch();

  // hooks
  const webViewRef = useRef(null);
  const navigation = useNavigation();

  // functions
  const metasunganUrl = token => {
    return `https://metaverse.metasgid.com/?jwtToken=${token}`;
    // return `http://localhost:3000/?jwtToken=${token}`;
  };
  const reload = () => {
    webViewRef && webViewRef.current.reload();
  };
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
    if (message && 'metasunganWindowMessage' in message) {
      handleMetasunganWindowMessage(message.metasunganWindowMessage);
    }
  };
  const goToChatRoom = roomId => {
    navigation.navigate(NAV_NAMES.ChatRoom, {currentChatRoomId: roomId});
  };
  const handleMetasunganWindowMessage = (message: MetasunganWindowMessage) => {
    if (message.action == MetasunganAction.ENTER_CHAT_ROOM) {
      goToChatRoom(message.payload.chatRoomId);
    }
  };

  useFocusEffect(
    useCallback(() => {
      reload();
    }, []),
  );
  const [selecting, setSelecting] = useState(Selecting.NONE);
  const selectGetterSetter = {
    [Selecting.GLOBAL_FILTER]: {
      get: globalFiter,
      set: filt => dispatch(setGlobalFilter(filt)),
      options: [MAIN_LINE2, MY_ROUTE, ...stations],
    },
  };

  return (
    <Div flex relative>
      <Div bg={'rgba(255,255,255,.3)'} absolute top width={'100%'} zIndex5>
        <Div h={HAS_NOTCH ? 44 : 20} />
        <Header
          bg={'rgba(255,255,255,0)'}
          onSelect={() => setSelecting(Selecting.GLOBAL_FILTER)}
        />
      </Div>
      <WebView
        ref={webViewRef}
        source={{
          uri: metasunganUrl(token),
        }}
        injectedJavaScript={injectedJavascript}
        onMessage={handleMessage}
      />
      {selecting && (
        <ScrollSelector
          selectedValue={selectGetterSetter[selecting].get}
          onValueChange={selectGetterSetter[selecting].set}
          options={selectGetterSetter[selecting].options}
          onClose={() => setSelecting(Selecting.NONE)}
        />
      )}
    </Div>
  );
};

export default MetaSunganScreen;
