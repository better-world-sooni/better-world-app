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

const BottomTabBar = ({state, descriptors, navigation}) => {
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
          flex
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
      <BottomPopup ref={bottomPopupRef} snapPoints={['90%', '30%']} index={-1}>
        <NftChooseBottomSheetScrollView
          nfts={currentUser?.nfts}
          title={'Identity 변경하기'}
        />
      </BottomPopup>
      <Div h70 borderTopColor={Colors.gray[100]} borderTopWidth={0.2} bgWhite>
        <NativeBaseProvider>
          <Box flex={1} safeAreaTop>
            <Center flex={1}></Center>
            <HStack bg={'white'} safeAreaBottom paddingTop={4} shadow={1}>
              {List}
            </HStack>
          </Box>
        </NativeBaseProvider>
      </Div>
    </>
  );
};

export default BottomTabBar;
