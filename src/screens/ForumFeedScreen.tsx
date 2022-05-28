import React from 'react';
import {Col} from 'src/components/common/Col';
import apis from 'src/modules/apis';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
import Post from 'src/components/common/Post';
import {Div} from 'src/components/common/Div';
import {useNavigation} from '@react-navigation/native';
import {ChevronLeft} from 'react-native-feather';
import FeedFlatlistWithHeader from 'src/components/FeedFlatlistWithHeader';
import {Span} from 'src/components/common/Span';

export default function ForumFeedScreen({
  route: {
    params: {postId, title},
  },
}) {
  const {data: repostRes, isLoading: repostLoad} = useApiSelector(
    apis.post.postId.repost.list,
  );
  const {goBack} = useNavigation();
  const reloadGetWithToken = useReloadGETWithToken();
  const onRefresh = () => {
    reloadGetWithToken(apis.post.postId.repost.list(postId, 1));
  };
  return (
    <FeedFlatlistWithHeader
      refreshing={repostLoad}
      onRefresh={onRefresh}
      renderItem={({item, index}) => {
        return <Post key={(item as any).id} post={item} />;
      }}
      data={repostRes ? repostRes.proposals : []}
      HeaderComponent={
        <>
          <Col itemsStart>
            <Div auto rounded100 onPress={goBack}>
              <ChevronLeft
                width={30}
                height={30}
                color="black"
                strokeWidth={2}
              />
            </Div>
          </Col>
          <Col auto>
            <Span bold fontSize={19}>
              {title}
            </Span>
          </Col>
          <Col></Col>
        </>
      }
    />
  );
}
