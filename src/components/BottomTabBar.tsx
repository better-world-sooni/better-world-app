import {NativeBaseProvider, HStack} from 'native-base';
import React, {useCallback} from 'react';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {Span} from 'src/components/common/Span';
import {NAV_NAMES} from 'src/modules/navNames';
import {Colors} from 'src/modules/styles';
import {openNftList} from 'src/utils/bottomPopupUtils';

const BottomTabBar = ({state, descriptors, navigation}) => {
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
          relative
          >
          {image}
          {name === NAV_NAMES.ChatList && 
            <Col relative left={1} auto rounded100 bgDanger px8 py4 justifyCenter>
              <Span white fontSize={12} medium>
                {options.tabBarBadge}
              </Span>
            </Col> 
          }
        </Div>
      );
    }),
    [state, descriptors, navigation],
  );

  return (
    <>
      <Row borderTopColor={Colors.gray[200]} borderTopWidth={0.5}>
        <NativeBaseProvider>
          <HStack
            bg={Colors.white}
            safeAreaBottom
            height={10}
            paddingBottom={0}
          >
            {List}
          </HStack>
        </NativeBaseProvider>
      </Row>
    </>
  );
};

export default BottomTabBar;
