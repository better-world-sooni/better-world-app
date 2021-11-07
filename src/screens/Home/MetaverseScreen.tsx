import React, {useCallback, useRef, useState} from 'react';
import {WebView} from 'react-native-webview';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {useFocusEffect} from '@react-navigation/core';
import {setChatBody, setChatRoom} from 'src/redux/chatReducer';
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

interface MetasunganWindowMessage {
  payload: any;
  action: MetasunganAction;
}
interface ChatRoom {
  chatRoom: {
    __v: number;
    _id: string;
    chatBubbleId: string;
    createdAt: string;
    messages: Array<Record<string, any>>;
    title: string;
    updatedAt: string;
    usernames: Array<string>;
  };
}
interface ChatRoomId {
  chatRoomId: string;
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

  // state and ref
  const webViewRef = useRef(null);

  // functions
  const metasunganUrl = token => {
    return `https://metaverse.metasgid.com/?jwtToken=${token}`;
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
  const handleMetasunganWindowMessage = (message: MetasunganWindowMessage) => {
    console.log(message.payload);
    if (message.action == MetasunganAction.ENTER_CHAT_ROOM) {
      dispatch(setChatRoom(message.payload.chatRoom));
      dispatch(
        setChatBody({
          enabled: true,
          enabledRoomId: message.payload.chatRoom._id,
        }),
      );
    } else if (message.action == MetasunganAction.OPEN_CHAT_ROOM) {
      dispatch(
        setChatBody({enabled: true, enabledRoomId: message.payload.chatRoomId}),
      );
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
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
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
