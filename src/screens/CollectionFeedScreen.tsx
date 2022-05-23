import React from 'react';
import {Col} from 'src/components/common/Col';
import apis from 'src/modules/apis';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
import Post from 'src/components/common/Post';
import {Img} from 'src/components/common/Img';
import {IMAGES} from 'src/modules/images';
import FeedFlatlist from 'src/components/FeedFlatlist';
import {Div} from 'src/components/common/Div';
import {useNavigation} from '@react-navigation/native';
import {ChevronLeft} from 'react-native-feather';
import FeedFlatlistWorklet from 'src/components/FeedFlatlistWorklet';
import {Span} from 'src/components/common/Span';

export default function CollectionFeedScreen({
  route: {
    params: {contractAddress, title},
  },
}) {
  const {data: feedRes, isLoading: feedLoad} = useApiSelector(
    apis.feed.collection,
  );
  const {goBack} = useNavigation();
  const reloadGetWithToken = useReloadGETWithToken();
  const onRefresh = () => {
    reloadGetWithToken(apis.feed.collection(contractAddress));
  };
  return (
    <FeedFlatlistWorklet
      refreshing={feedLoad}
      onRefresh={onRefresh}
      renderItem={({item, index}) => {
        return <Post key={(item as any).id} post={item} />;
      }}
      data={feedRes ? feedRes.feed : []}
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
