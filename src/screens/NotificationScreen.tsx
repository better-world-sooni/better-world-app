import React, {useEffect, useState} from 'react';
import {Div} from 'src/components/common/Div';
import Post from 'src/components/common/Post';
import apis from 'src/modules/apis';
import {HAS_NOTCH} from 'src/modules/constants';
import {KeyboardAvoidingView} from 'src/modules/viewComponents';
import {Row} from 'src/components/common/Row';
import {useNavigation} from '@react-navigation/native';
import {Col} from 'src/components/common/Col';
import {ChevronLeft} from 'react-native-feather';
import {Span} from 'src/components/common/Span';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {BlurView} from '@react-native-community/blur';
import {CustomBlurView} from 'src/components/common/CustomBlurView';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import {RefreshControl} from 'react-native';
import {Img} from 'src/components/common/Img';
import {ICONS} from 'src/modules/icons';
import {
  getNftName,
  getNftProfileImage,
  useIsCurrentNft,
} from 'src/modules/nftUtils';
import {createdAtText} from 'src/modules/timeUtils';
import useFollow from 'src/hooks/useFollow';
import {IMAGES} from 'src/modules/images';
import {
  useGotoNftCollectionProfile,
  useGotoNftProfile,
  useGotoPost,
} from 'src/hooks/useGoto';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import ListFlatlist from 'src/components/ListFlatlist';
import Notification from 'src/components/Notification';

export default function NotificationScreen() {
  const {
    data: notificationRes,
    isLoading: notificationLoading,
    isPaginating: notificationPaginating,
    page,
    isNotPaginatable,
  } = useApiSelector(apis.notification.list._);
  const reloadGetWithToken = useReloadGETWithToken();
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleRefresh = () => {
    if (notificationLoading) return;
    reloadGetWithToken(apis.notification.list._());
  };
  const handleEndReached = () => {
    if (notificationPaginating || isNotPaginatable) return;
    paginateGetWithToken(apis.notification.list._(page + 1), 'notifications');
  };
  return (
    <ListFlatlist
      onRefresh={handleRefresh}
      data={notificationRes?.notifications || []}
      refreshing={notificationLoading}
      onEndReached={handleEndReached}
      isPaginating={notificationPaginating}
      title={'알림'}
      enableBack={false}
      renderItem={({item}) => (
        <Notification key={(item as any).id} notification={item} />
      )}
    />
  );
}
