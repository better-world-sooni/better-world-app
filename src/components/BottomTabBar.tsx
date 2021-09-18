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
import {ICONS} from 'src/modules/icons';
import {Div} from './common/Div';
import {Img} from './common/Img';
import {Span} from './common/Span';
import {Style} from './common/Style';
import { IMAGES } from 'src/modules/images';
import { Row } from './common/Row';
import { Col } from './common/Col';

const BottomTabBar = ({state, descriptors, navigation}) => {
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
    const image = options.tabBarIcon({focused: isFocused})
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
    <Div h80 borderTopLeftRadius={10} borderTopRightRadius={10} overflowHidden >
      {/* <Row ><Col></Col><Col itemsCenter fontSize={15} bold><Span >나는 지금.. 역삼역!</Span></Col><Col></Col></Row> */}
      <NativeBaseProvider >
        <Box flex={1} safeAreaTop >
          <Center flex={1}>
          </Center>
          <HStack bg="white" safeAreaBottom paddingTop={5} shadow={1}>
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
