import {NativeBaseProvider, HStack} from 'native-base';
import React, { useState, useEffect, useCallback } from "react";
import { Keyboard, Text, TextInput, StyleSheet, View } from "react-native";
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {Span} from 'src/components/common/Span';
import {NAV_NAMES} from 'src/modules/navNames';
import {Colors, DEVICE_WIDTH} from 'src/modules/styles';
import {openNftList} from 'src/utils/bottomPopupUtils';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';

const BottomTabBar = ({state, descriptors, navigation}) => {
  const unreadChatRoomCount = useSelector(
    (root: RootState) => root.app.unreadChatRoomCount,
  );
  const [keyboardStatus, setKeyboardStatus] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const notchHeight = useSafeAreaInsets().bottom;

  const List = useCallback(
    state.routes.map((route, index) => {
      const [lastPress, setLastPress] = useState(null);
      const {key, name} = route;
      const {options} = descriptors[key];
      const changeProfileOnLongPress = options.tabBarLabel == NAV_NAMES.Social;
      const isFocused = state.index === index;
      const image = options.tabBarIcon({focused: isFocused});
      const handlePress = () => {
        const multiTapDelay = 500;
        const now = Date.now();
        setLastPress(now);
        if (isFocused && now - lastPress <= multiTapDelay) {
          const event = navigation.emit({
            type: 'tabDoublePress',
            target: key,
            canPreventDefault: true,
          });
        } else {
          const event = navigation.emit({
            type: 'tabPress',
            target: key,
            canPreventDefault: true,
          });
          if (!event.defaultPrevented) {
            navigation.navigate(name);
          }
        }
      };

      const conditionalProps = changeProfileOnLongPress
        ? {onLongPress: openNftList}
        : {};

      return (
        <Div
          key={key}
          onPress={handlePress}
          {...conditionalProps}
          flex={1}
          itemsCenter
          justifyCenter
          relative
          pt13
          pb={notchHeight + 15}>
          {image}
          {name == NAV_NAMES.ChatList && unreadChatRoomCount > 0 && (
            <Div
              absolute
              px4
              py2
              top5
              right={(DEVICE_WIDTH - 30) / 6 - 17}
              auto
              rounded100
              bgDanger
              itemsCenter
              justifyCenter>
              <Span white fontSize={10} bold>
                {unreadChatRoomCount} 명
              </Span>
            </Div>
          )}
        </Div>
      );
    }),
    [state, descriptors, navigation, unreadChatRoomCount],
  );

  return (
    !keyboardStatus && (
      <Row borderTopColor={Colors.gray[200]} borderTopWidth={0.5}>
        {List}
      </Row>
    )
  );
};

export default BottomTabBar;
