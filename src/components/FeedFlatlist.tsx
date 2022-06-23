import React, {forwardRef} from 'react';
import {ActivityIndicator, FlatList, RefreshControl} from 'react-native';
import {DEVICE_HEIGHT} from 'src/modules/styles';
import {Div} from './common/Div';
import {Span} from './common/Span';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Plus, Zap} from 'react-native-feather';
import {useGotoNewPost} from 'src/hooks/useGoto';
import {PostOwnerType, PostType} from 'src/screens/NewPostScreen';
import ListEmptyComponent from './common/ListEmptyComponent';
import {Colors} from 'src/modules/styles';
import {Img} from './common/Img';
import {ICONS} from 'src/modules/icons';

export enum EnableAddType {
  Post = 'post',
  Proposal = 'proposal',
}

function FeedFlatlist(
  {
    refreshing,
    onRefresh,
    onEndReached = null,
    isPaginating = false,
    isNotPaginatable = false,
    renderItem,
    data,
    TopComponent,
    HeaderComponent = null,
    enableAddType = EnableAddType.Post,
    enableAdd = false,
  },
  ref,
) {
  const gotoNewPost = useGotoNewPost({postOwnerType: PostOwnerType.Nft});
  const gotoNewProposal = () =>
    gotoNewPost(null, null, null, PostType.Proposal);
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
  return (
    <Div flex={1} bgWhite relative>
      <Div h={notchHeight}></Div>
      <FlatList
        ref={ref}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => (item as any).id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={
          <>
            {isPaginating && (
              <Div itemsCenter py15>
                <ActivityIndicator />
              </Div>
            )}
            {isNotPaginatable && (
              <Div itemsCenter py15>
                <Span textCenter>피드를 모두 확인했습니다.</Span>
              </Div>
            )}
            <Div h={50}></Div>
            <Div h={27} />
          </>
        }
        ListHeaderComponent={
          <Div
            bgWhite
            px15
            h={50}
            justifyCenter
            borderBottom={0.5}
            borderGray200>
            {TopComponent}
          </Div>
        }
        ListEmptyComponent={
          <ListEmptyComponent h={DEVICE_HEIGHT - headerHeight * 2} />
        }
        stickyHeaderIndices={[0]}
        // @ts-ignore
        stickyHeaderHiddenOnScroll
        data={data}
        onEndReached={onEndReached}
        renderItem={renderItem}></FlatList>
      {enableAdd &&
        (enableAddType == EnableAddType.Post ? (
          <Div
            rounded100
            bgPrimary
            absolute
            w54
            h54
            p12
            bottom15
            right15
            onPress={() => gotoNewPost()}
            style={{
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 4,
            }}>
            <Plus
              strokeWidth={2}
              color={Colors.white}
              height={30}
              width={30}></Plus>
          </Div>
        ) : (
          <Div
            rounded100
            bgWhite
            absolute
            w54
            h54
            p12
            bottom15
            right15
            itemsCenter
            justifyCenter
            onPress={gotoNewProposal}
            style={{
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 4,
            }}>
            <Img source={ICONS.lightBulb} h22 w22 />
          </Div>
        ))}
    </Div>
  );
}

export default forwardRef(FeedFlatlist);
