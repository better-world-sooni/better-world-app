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
import React from 'react';
import {s_common} from 'src/i18n/text/s_common';
import {useLocale} from 'src/i18n/useLocale';
import {ICONS} from 'src/modules/icons';
import {Div} from './common/Div';
import {Img} from './common/Img';
import {Span} from './common/Span';
import {Style} from './common/Style';
import { IMAGES } from 'src/modules/images';

const BottomTabBar = ({state, descriptors, navigation}) => {
  const {t} = useLocale();
  const list = state.routes.map((route, index) => {
    const {key, name} = route;
    const {options} = descriptors[key];
    const label =
      options.tabBarLabel !== undefined
        ? options.tabBarLabel
        : options.title !== undefined
        ? options.title
        : name;
    const isFocused = state.index === index;
    // const image = label === t(s_common.home) && (
    //   <Img
    //     w24
    //     h24
    //     isActive={isFocused}
    //     source={ICONS.iconHomeInactive}
    //     a_source={ICONS.iconHomeActive}
    //   />
    // );
    const image = (
      <Img w40
          h40
          isActive={isFocused}
          a_source={IMAGES.mainLogo}
          source={IMAGES.mainLogo} />
    );
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
    return {
      label,
      isFocused,
      key,
      name,
      image,
      onPress,
    };
  });
  return (
    <Div h80>
      <NativeBaseProvider >
        <Box flex={1} safeAreaTop>
          <Center flex={1}>
          </Center>
          <HStack bg="white" safeAreaBottom paddingTop={2} shadow={1}>
          {list.map(item => {
            return (
              <Div
                key={item.key}
                onPress={item.onPress}
                flex
                itemsCenter
                justifyCenter>
                {item.image}
                <Span
                  sectionBody2
                  styleComp={[
                    item.isFocused ? <Style primary bold /> : <Style black />,
                  ]}>
                  {/* {item.label} */}
                </Span>
              </Div>
            );
          })}
          </HStack>
        </Box>
      </NativeBaseProvider>
    </Div>
  );
};

export default BottomTabBar;
