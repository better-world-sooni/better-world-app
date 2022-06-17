import {NativeBaseProvider, Box, HStack, Center} from 'native-base';
import React, {useCallback, useRef, useState, useEffect} from 'react';
import {Div} from './common/Div';
import { Row } from "src/components/common/Row"
import BottomPopup from './common/BottomPopup';
import NftChooseBottomSheetScrollView from './common/NftChooseBottomSheetScrollView';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {NAV_NAMES} from 'src/modules/navNames';
import Colors from 'src/constants/Colors';
import {mediumBump} from 'src/modules/hapticFeedBackUtils';
import {HAS_NOTCH} from 'src/modules/constants';
import {DEVICE_HEIGHT} from 'src/modules/styles';
import {EventRegister} from 'react-native-event-listeners';
import {Span} from './common/Span';
import {infoBottomPopupEvent, openNftList} from 'src/modules/bottomPopupUtils';

const BottomTabBar = ({state, descriptors, navigation}) => {
  const isFocusedOnCapsule = state.history[
    state.history.length - 1
  ].key.startsWith(NAV_NAMES.Capsule);
  descriptors[
    state.history[state.history.length - 1].key
  ]?.navigation?.isFocused();

  const List = useCallback(
    state.routes.map((route, index) => {
      const {key, name} = route;
      const {options} = descriptors[key];
      const changeProfileOnLongPress = options.tabBarLabel == NAV_NAMES.Social;
      const isFocused = state.index === index;
      const image = options.tabBarIcon({focused: isFocused});
      const handlePress = () => {
        const event = navigation.emit({
          type: 'tabPress',
          target: key,
          canPreventDefault: true,
        });
        if (!isFocused && !event.defaultPrevented) {
          navigation.navigate(name);
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
          pb10>
          {image}
        </Div>
      );
    }),
    [state, descriptors, navigation],
  );

  return (
    <>
      <Row
        borderTopColor={isFocusedOnCapsule ? 'black' : Colors.gray[100]}
        borderTopWidth={0.2}>
        <NativeBaseProvider>
          <HStack
            bg={isFocusedOnCapsule ? 'black' : 'white'}
            safeAreaBottom
            paddingTop={4}
            paddingBottom={0}>
            {List}
          </HStack>
        </NativeBaseProvider>
      </Row>
    </>
  );
};

export default BottomTabBar;
