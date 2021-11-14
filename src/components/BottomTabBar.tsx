import {
  NativeBaseProvider,
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  Icon,
  HStack,
  Center,
  Pressable,
} from 'native-base';
import React, {useCallback} from 'react';
import {ICONS} from 'src/modules/icons';
import {Div} from './common/Div';
import {Img} from './common/Img';
import {Span} from './common/Span';
import {Style} from './common/Style';
import {IMAGES} from 'src/modules/images';
import {Row} from './common/Row';
import {Col} from './common/Col';
import {GRAY_COLOR, LINE2_COLOR} from 'src/modules/constants';

const BottomTabBar = ({state, descriptors, navigation}) => {
  const List = useCallback(
    state.routes.map((route, index) => {
      const {key, name} = route;
      const {options} = descriptors[key];
      const label =
        options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : name;
      const isFocused = state.index === index;
      const image = options.tabBarIcon({focused: isFocused});
      const onPress = () => {
        const event = navigation.emit({
          type: 'tabPress',
          target: key,
          canPreventDefault: true,
        });
        if (!isFocused && !event.defaultPrevented) {
          navigation.navigate(name);
        }
      };
      return (
        <Div key={key} onPress={onPress} flex itemsCenter justifyCenter pb10>
          {image}
          <Span
            sectionBody2
            styleComp={[
              isFocused ? <Style color={LINE2_COLOR} bold /> : <Style black />,
            ]}>
            {label}
          </Span>
        </Div>
      );
    }),
    [state, descriptors, navigation],
  );
  return (
    <Div
      h80
      borderTopColor={GRAY_COLOR}
      borderTopWidth={0.2}
      overflowHidden
      bgWhite>
      <NativeBaseProvider>
        <Box flex={1} safeAreaTop>
          <Center flex={1}></Center>
          <HStack bg={'white'} safeAreaBottom paddingTop={5} shadow={1}>
            {List}
          </HStack>
        </Box>
      </NativeBaseProvider>
    </Div>
  );
};

export default BottomTabBar;
