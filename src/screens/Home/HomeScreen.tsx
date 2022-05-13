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
import {FlatList, ScrollView} from 'src/modules/viewComponents';
import {Img} from 'src/components/common/Img';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {getNftProfileImage} from 'src/modules/nftUtils';
import {IMAGES} from 'src/modules/images';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {useGotoCapsule} from 'src/hooks/useGoto';

const HomeScreen = () => {
  const {data: feedRes, isLoading: feedLoad} = useApiSelector(apis.feed._);
  const reloadGetWithToken = useReloadGETWithToken();
  const onRefresh = () => {
    reloadGetWithToken(apis.feed._());
  };
  return (
    <Div flex bgWhite>
      <Div h={HAS_NOTCH ? 44 : 20} bgWhite />
      <FlatList
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
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
          </>
        }
        refreshControl={
          <RefreshControl refreshing={feedLoad} onRefresh={onRefresh} />
        }
        stickyHeaderIndices={[0]}
        data={feedRes ? feedRes.feed : []}
        renderItem={({item, index}) => {
          if (index == 0)
            return (
              <ScrollView horizontal pb8>
                <MyActiveCapsule />
              </ScrollView>
            );
          return <Post key={item.id} post={item} />;
        }}></FlatList>
    </Div>
  );
};

function MyActiveCapsule() {
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const goToCapsule = useGotoCapsule({nft: currentNft});
  return (
    <Div ml15 relative onPress={goToCapsule}>
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
