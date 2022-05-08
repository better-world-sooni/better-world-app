import React from 'react';
import {Div} from 'src/components/common/Div';
import {HAS_NOTCH} from 'src/modules/constants';
import {RefreshControl, StatusBar} from 'react-native';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {MessageCircle, Bell} from 'react-native-feather';
import {Span} from 'src/components/common/Span';
import apis from 'src/modules/apis';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
import Post from 'src/components/common/Post';
import {ScrollView} from 'src/modules/viewComponents';
import {Img} from 'src/components/common/Img';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {getNftProfileImage} from 'src/modules/nftUtils';

const HomeScreen = () => {
  const {data: feedRes, isLoading: feedLoad} = useApiSelector(apis.feed._);
  const reloadGetWithToken = useReloadGETWithToken();
  const onRefresh = () => {
    reloadGetWithToken(apis.feed._());
  };
  return (
    <Div flex bgWhite>
      <StatusBar animated={true} barStyle={'dark-content'} />
      <Div h={HAS_NOTCH ? 44 : 20} bgWhite />
      <Row itemsCenter py8 bgWhite>
        <Col ml15>
          <Span fontSize={24} bold primary fontFamily={'UniSans'}>
            BetterWorld
          </Span>
        </Col>
        <Col auto mr15>
          <Div rounded50 bgGray200 p6>
            <Bell
              strokeWidth={2}
              color={'black'}
              fill={'black'}
              height={18}
              width={18}
            />
          </Div>
        </Col>
        <Col auto mr15>
          <Div rounded50 bgGray200 p6>
            <MessageCircle
              strokeWidth={2}
              color={'black'}
              fill={'black'}
              height={18}
              width={18}
            />
          </Div>
        </Col>
      </Row>
      {feedRes && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[1]}
          refreshControl={
            <RefreshControl refreshing={feedLoad} onRefresh={onRefresh} />
          }>
          <ScrollView horizontal pb10>
            <MyActiveCapsule />
          </ScrollView>
          <Div borderBottom={0.5} borderGray200></Div>
          {feedRes.feed.map(post => {
            return <Post key={post.id} post={post} />;
          })}
        </ScrollView>
      )}
    </Div>
  );
};

function MyActiveCapsule() {
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  return (
    <Div ml15 relative>
      <Img uri={currentNft.capsule.image_uri} w92 h132 rounded10 />
      <Img
        absolute
        top10
        left10
        w28
        h28
        rounded20
        border1
        borderWhite
        uri={getNftProfileImage(currentNft, 50, 50)}></Img>
    </Div>
  );
}

export default HomeScreen;
