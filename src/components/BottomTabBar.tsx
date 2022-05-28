import {NativeBaseProvider, Box, HStack, Center} from 'native-base';
import React, {useCallback, useRef} from 'react';
import {Div} from './common/Div';
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

const BottomTabBar = ({state, descriptors, navigation}) => {
  const isFocusedOnCapsule = state.history[
    state.history.length - 1
  ].key.startsWith(NAV_NAMES.Capsule);
  descriptors[
    state.history[state.history.length - 1].key
  ]?.navigation?.isFocused();
  const bottomPopupRef = useRef<BottomSheetModal>(null);
  const {currentUser} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const List = useCallback(
    state.routes.map((route, index) => {
      const {key, name} = route;
      const {options} = descriptors[key];
      const changeProfileOnLongPress = options.tabBarLabel == NAV_NAMES.Profile;
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
      const handleLongPress = () => {
        mediumBump();
        bottomPopupRef?.current?.expand();
      };
      const conditionalProps = changeProfileOnLongPress
        ? {onLongPress: handleLongPress}
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
  const getSnapPoints = itemsLength => {
    const fullHeight = 0.9 * DEVICE_HEIGHT;
    const unceilingedHeight = itemsLength * 70 + (HAS_NOTCH ? 130 : 110);
    if (unceilingedHeight > fullHeight) return [fullHeight];
    return [fullHeight, unceilingedHeight];
  };
  return (
    <>
      <BottomPopup
        ref={bottomPopupRef}
        snapPoints={getSnapPoints(currentUser?.nfts?.length || 0)}
        index={-1}>
        <NftChooseBottomSheetScrollView
          nfts={currentUser?.nfts}
          title={'Identity 변경하기'}
        />
      </BottomPopup>
      <Div
        h80={HAS_NOTCH}
        h60={!HAS_NOTCH}
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
      </Div>
    </>
  );
};

export default BottomTabBar;
