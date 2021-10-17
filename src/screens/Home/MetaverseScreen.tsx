import React, { useCallback, useRef, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/rootReducer';
import { useFocusEffect } from '@react-navigation/core';
import { setChatBody, setChatHeadEnabled, setChatRoom } from 'src/redux/chatReducer';

interface MetasunganWindowMessage{
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


const MetaSunganScreen = () =>  {
  // constants
  const injectedJavascript = `(function() {
    window.postMessage = function(data) {
      window.ReactNativeWebView.postMessage(data);
    };
  })()`;

  // redux
  const { currentUser, token } = useSelector(
    (root: RootState) => (root.app.session),
    shallowEqual,
  );
  const dispatch = useDispatch();

  // state and ref
  const webViewRef = useRef(null);

  // functions
  const metasunganUrl = (token) => {return `http://localhost:3000/?jwtToken=${token}`};
  const reload = () => {
    webViewRef && webViewRef.current.reload();
  }
  const tryParseJSONObject = useCallback((jsonString) => {
    try {
        var o = JSON.parse(jsonString);
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { }
    return false;
  }, []);
  const handleMessage = (event) => {
    const message = tryParseJSONObject(event.nativeEvent.data)
    if (message && "metasunganWindowMessage" in message){
      handleMetasunganWindowMessage(message.metasunganWindowMessage);
    }
  }
  const handleMetasunganWindowMessage = (message: MetasunganWindowMessage) => {
    console.log(message.payload)
    if(message.action == MetasunganAction.ENTER_CHAT_ROOM) {
      dispatch(setChatRoom(message.payload.chatRoom));
      dispatch(setChatBody({ enabled: true, enabledRoomId: message.payload.chatRoom._id}))
    } else if(message.action == MetasunganAction.OPEN_CHAT_ROOM){
      dispatch(setChatBody({ enabled: true, enabledRoomId: message.payload.chatRoomId}))
    }
  }
  
  useFocusEffect(
    useCallback(() => {
      reload()
    },[]),
  )
  
  return (
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
  );
  
}

export default MetaSunganScreen