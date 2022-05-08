import React, {useState} from 'react';
import {Div} from 'src/components/common/Div';
import {HAS_NOTCH} from 'src/modules/constants';
import {RefreshControl, StatusBar} from 'react-native';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {PlusSquare, Edit} from 'react-native-feather';
import {Span} from 'src/components/common/Span';
import apis from 'src/modules/apis';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
import Post from 'src/components/common/Post';
import {ScrollView} from 'src/modules/viewComponents';
import {Img} from 'src/components/common/Img';
import {getNftName, getNftProfileImage} from 'src/modules/nftUtils';
import NftProfile from 'src/components/common/NftProfile';

const ProfileScreen = ({route: {params}}) => {
  const {data: profileData, isLoading: loading} = useApiSelector(apis.nft._);
  const reloadGetWithToken = useReloadGETWithToken();
  const onRefresh = () => {
    reloadGetWithToken(apis.nft._());
  };
  const content = profileData.nft;
  return (
    <Div flex bgPrimary>
      <StatusBar animated={true} barStyle={'dark-content'} />
      <Div h={HAS_NOTCH ? 44 : 20} bgPrimary />
      <Row itemsCenter py8>
        <Col ml15>
          <Span fontSize={24} bold white fontFamily={'UniSans'}>
            BetterWorld
          </Span>
        </Col>
        <Col auto mr15>
          <Div>
            <PlusSquare
              strokeWidth={2}
              color={'white'}
              height={22}
              width={22}
            />
          </Div>
        </Col>
      </Row>
      <Div></Div>
      {content && (
        <ScrollView
          bgWhite
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }>
          <NftProfile nft={content} />
        </ScrollView>
      )}
    </Div>
  );
};

function ProfileDataTabs({posts}) {
  enum DataTabType {
    Feed,
    Capsule,
    Story,
  }
  const [currentTab, setCurrentTab] = useState(DataTabType.Feed);
  const tabProps = tab => {
    if (tab === currentTab)
      return {
        itemsCenter: true,
        py10: true,
        borderBottom1: true,
        borderPrimary: true,
        onPress: () => setCurrentTab(tab),
      };
    return {
      itemsCenter: true,
      py10: true,
      borderBottom1: true,
      borderGray200: true,
      onPress: () => setCurrentTab(tab),
    };
  };
  return (
    <Div>
      <Row bgWhite>
        <Col {...tabProps(DataTabType.Feed)}>
          <Span medium>피드</Span>
        </Col>
        <Col {...tabProps(DataTabType.Capsule)}>
          <Span medium>캡술</Span>
        </Col>
        <Col {...tabProps(DataTabType.Story)}>
          <Span medium>스토리</Span>
        </Col>
      </Row>
      {
        {
          [DataTabType.Feed]: <Feed feed={posts} />,
          [DataTabType.Capsule]: posts.map(post => {
            return <Post key={post.id} post={post} />;
          }),
          [DataTabType.Story]: posts.map(post => {
            return <Post key={post.id} post={post} />;
          }),
        }[currentTab]
      }
    </Div>
  );
}

function Feed({feed}) {
  return feed.map(post => {
    return <Post key={post.id} post={post} />;
  });
}

export default ProfileScreen;
