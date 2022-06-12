import React from 'react';
import {Div} from 'src/components/common/Div';
import {HAS_NOTCH} from 'src/modules/constants';
import {Row} from './Row';
import {Col} from './Col';
import {Img} from './Img';
import {resizeImageUri} from 'src/modules/uriUtils';
import {Span} from './Span';
import {FollowOwnerType, FollowType} from 'src/screens/FollowListScreen';
import {
  useGotoAffinity,
  useGotoCollectionEventList,
  useGotoCollectionFeed,
  useGotoFollowList,
  useGotoNftCollectionProfile,
} from 'src/hooks/useGoto';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {Calendar, Layers, PieChart} from 'react-native-feather';
import {ICONS} from 'src/modules/icons';

const MyNftCollectionMenu = ({nftCollection}) => {
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const textColor = 'black';
  const backgroundColor = 'white';
  const gotoFollowList = useGotoFollowList({
    followOwnerType: FollowOwnerType.NftCollection,
    contractAddress: nftCollection?.contract_address,
  });
  const gotoNftCollectionProfile = useGotoNftCollectionProfile({
    nftCollection,
  });
  const gotoCollectionFeed = useGotoCollectionFeed({
    contractAddress: currentNft.contract_address,
  });
  const gotoCollectionEventList = useGotoCollectionEventList({
    nftCollection,
  });
  const gotoAffinity = useGotoAffinity({
    nftCollection,
  });
  const notchHeight = HAS_NOTCH ? 44 : 0;
  const headerHeight = notchHeight + 18;

  return (
    <Div flex={1} bg={backgroundColor} relative borderRight={0.5} borderGray200>
      <Div h={headerHeight} />
      {nftCollection && (
        <Div px30>
          <Row zIndex={100} relative>
            <Col auto mr10 relative onPress={gotoNftCollectionProfile}>
              <Img
                rounded100
                borderWhite
                bgGray200
                h60
                w60
                uri={resizeImageUri(nftCollection.image_uri, 200, 200)}></Img>
            </Col>
          </Row>
          <Div py10>
            <Row itemsCenter>
              <Col auto mr10 onPress={gotoNftCollectionProfile}>
                <Span>
                  <Span fontSize={20} bold color={textColor}>
                    {nftCollection.name}
                  </Span>
                </Span>
              </Col>
            </Row>
            <Row mt12 itemsEnd>
              <Col
                auto
                mr20
                onPress={() => gotoFollowList(FollowType.Followers)}>
                <Span bold fontSize={13}>
                  <Span gray700 regular fontSize={13}>
                    팔로워
                  </Span>{' '}
                  {nftCollection.follower_count}
                </Span>
              </Col>
              <Col />
            </Row>
            <Row mt10 itemsEnd>
              <Col auto mr20 onPress={gotoAffinity}>
                <Span bold fontSize={13}>
                  <Span gray700 regular fontSize={13}>
                    멤버 친목도
                  </Span>{' '}
                  {nftCollection.affinity.total_possible_follows
                    ? Math.ceil(
                        (nftCollection.affinity.follows_among_members /
                          nftCollection.affinity.total_possible_follows) *
                          100,
                      )
                    : 0}
                  % ({nftCollection.affinity.follows_among_members} /{' '}
                  {nftCollection.affinity.total_possible_follows})
                </Span>
              </Col>
              <Col />
            </Row>
          </Div>
          <Row itemsCenter py16 onPress={gotoCollectionEventList}>
            <Col auto mr16>
              <Calendar
                strokeWidth={1.3}
                color={'black'}
                height={24}
                width={24}
              />
            </Col>
            <Col>
              <Span fontSize={16}>일정</Span>
            </Col>
          </Row>
          <Row
            itemsCenter
            py16
            onPress={() =>
              gotoCollectionFeed(`${nftCollection.name} 멤버 피드`)
            }>
            <Col auto mr16>
              <Layers
                strokeWidth={1.3}
                color={textColor}
                height={24}
                width={24}
              />
            </Col>
            <Col>
              <Span fontSize={16} color={textColor}>
                모든 멤버들의 게시물
              </Span>
            </Col>
          </Row>
          <Row
            itemsCenter
            py16
            onPress={() =>
              gotoCollectionFeed(`${nftCollection.name} 진행중인 포럼`, 'Forum')
            }>
            <Col auto mr16>
              <PieChart
                strokeWidth={1.3}
                color={textColor}
                height={24}
                width={24}
              />
            </Col>
            <Col>
              <Span fontSize={16} color={textColor}>
                진행중인 포럼
              </Span>
            </Col>
          </Row>
        </Div>
      )}
    </Div>
  );
};

export default MyNftCollectionMenu;
