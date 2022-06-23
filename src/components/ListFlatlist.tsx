import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ActivityIndicator, FlatList, RefreshControl} from 'react-native';
import {ChevronLeft} from 'react-native-feather';
import {HAS_NOTCH} from 'src/modules/constants';
import {Colors, DEVICE_HEIGHT} from 'src/modules/styles';
import {Col} from './common/Col';
import {Div} from './common/Div';
import {Row} from './common/Row';
import {Span} from './common/Span';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ListEmptyComponent from './common/ListEmptyComponent';

export default function ListFlatlist({
  refreshing,
  onRefresh,
  onEndReached = null,
  isPaginating = false,
  renderItem,
  data,
  title,
  enableBack = true,
  BackIcon = ChevronLeft,
  keyExtractor = item => (item as any).id,
  HeaderRightComponent = null,
}) {
  const {goBack} = useNavigation();
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
  return (
    <Div flex={1} bgWhite>
      <Div h={notchHeight}></Div>
      <FlatList
        stickyHeaderIndices={[0]}
        // @ts-ignore
        stickyHeaderHiddenOnScroll
        showsVerticalScrollIndicator={false}
        keyExtractor={keyExtractor}
        ListEmptyComponent={
          <ListEmptyComponent h={DEVICE_HEIGHT - headerHeight * 2} />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={headerHeight}
          />
        }
        onEndReached={onEndReached}
        data={data}
        renderItem={renderItem}
        ListHeaderComponent={
          <Div bgWhite h={50} justifyCenter borderBottom={0.5} borderGray200>
            <Row itemsCenter py5 h40 px={BackIcon == ChevronLeft ? 8 : 15}>
              <Col itemsStart>
                {enableBack && (
                  <Div auto rounded100 onPress={goBack}>
                    <BackIcon
                      width={30}
                      height={30}
                      color={Colors.black}
                      strokeWidth={2}
                    />
                  </Div>
                )}
              </Col>
              <Col auto>
                <Span bold fontSize={19}>
                  {title}
                </Span>
              </Col>
              <Col itemsEnd pr={enableBack && BackIcon == ChevronLeft ? 8 : 0}>
                {HeaderRightComponent}
              </Col>
            </Row>
          </Div>
        }
        ListFooterComponent={
          <>
            {isPaginating && (
              <Div itemsCenter py15>
                <ActivityIndicator />
              </Div>
            )}
            <Div h={headerHeight}></Div>
            <Div h={HAS_NOTCH ? 27 : 12} />
          </>
        }></FlatList>
    </Div>
  );
}
