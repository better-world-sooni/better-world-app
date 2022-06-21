import React, {useState} from 'react';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  usePutPromiseFnWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import Post from 'src/components/common/Post';
import ListFlatlist from 'src/components/ListFlatlist';
import {X} from 'react-native-feather';
import {ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ForumFeedFilter} from './Home/HomeScreen';

export default function CollectionFeedTagSelectScreen({
  route: {
    params: {primaryKey, foreignKeyName},
  },
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {
    data: feedRes,
    isLoading: feedLoading,
    isPaginating: feedPaginating,
    page,
    isNotPaginatable,
  } = useApiSelector(apis.feed.forum);
  const {goBack} = useNavigation();
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleEndReached = () => {
    if (feedPaginating || isNotPaginatable) return;
    paginateGetWithToken(
      apis.feed.forum(ForumFeedFilter.Resolved, page + 1),
      'feed',
    );
  };
  const reloadGetWithToken = useReloadGETWithToken();
  const putPromiseFnWithToken = usePutPromiseFnWithToken();
  const onRefresh = () => {
    if (feedLoading) return;
    reloadGetWithToken(apis.feed.forum(ForumFeedFilter.Resolved));
  };
  const putPrimaryKey = async postId => {
    if (loading) return;
    setLoading(true);
    const {data} = await putPromiseFnWithToken({
      url: apis.post.postId._(postId).url,
      body: {
        property: foreignKeyName,
        value: primaryKey,
      },
    });
    setLoading(false);
    if (data.success) {
      reloadGetWithToken(apis.feed.social());
      reloadGetWithToken(apis.feed.forum());
      goBack();
    } else {
      setError('참조중 문제가 발생하였습니다.');
    }
  };

  return (
    <ListFlatlist
      onRefresh={onRefresh}
      data={feedRes ? feedRes.feed : []}
      BackIcon={X}
      refreshing={feedLoading}
      onEndReached={handleEndReached}
      isPaginating={feedPaginating}
      title={loading ? <ActivityIndicator /> : error || '게시물 선택'}
      renderItem={({item}) => {
        return (
          <Post
            key={(item as any).id}
            post={item}
            selectableFn={putPrimaryKey}
          />
        );
      }}
    />
  );
}
