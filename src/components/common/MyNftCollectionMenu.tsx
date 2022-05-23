import React, {useRef} from 'react';
import {Div} from 'src/components/common/Div';
import apis from 'src/modules/apis';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {getNftName, getNftProfileImage, useIsAdmin} from 'src/modules/nftUtils';
import {HAS_NOTCH} from 'src/modules/constants';
import {Row} from './Row';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {Col} from './Col';
import {Img} from './Img';
import {resizeImageUri} from 'src/modules/uriUtils';
import {Span} from './Span';
import TruncatedMarkdown from './TruncatedMarkdown';
import {FollowOwnerType, FollowType} from 'src/screens/FollowListScreen';
import {
  useGotoCollectionFeed,
  useGotoFollowList,
  useGotoNftCollectionProfile,
  useGotoProfile,
} from 'src/hooks/useGoto';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {Award, Layers, List, Map, ThumbsUp} from 'react-native-feather';
import {ICONS} from 'src/modules/icons';
import Colors from 'src/constants/Colors';

const MyNftCollectionMenu = ({}) => {
  const {data: profileData, isLoading: loading} = useApiSelector(
    apis.nft_collection.profile(),
  );
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const textColor = 'black';
  const backgroundColor = 'white';
  const bottomPopupRef = useRef<BottomSheetModal>(null);
  const nftCollection = profileData?.nft_collection;
  const gotoFollowList = useGotoFollowList({
    followOwnerType: FollowOwnerType.NftCollection,
    contractAddress: nftCollection?.contract_address,
  });
  const gotoNftCollectionProfile = useGotoNftCollectionProfile({
    contractAddress: nftCollection.contract_address,
  });
  const gotoCollectionFeed = useGotoCollectionFeed({
    contractAddress: currentNft.contract_address,
  });
  const notchHeight = HAS_NOTCH ? 44 : 20;
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
                uri={resizeImageUri(nftCollection.image_uri, 100, 100)}></Img>
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
            <Row mt10 itemsEnd>
              <Col
                auto
                mr20
                onPress={() => gotoFollowList(FollowType.Followers)}>
                <Span bold>
                  <Span gray700 regular>
                    팔로워
                  </Span>{' '}
                  {nftCollection.follower_count}
                </Span>
              </Col>
              <Col />
            </Row>
            <Row mt10 itemsEnd>
              <Col
                auto
                mr20
                onPress={() => gotoFollowList(FollowType.Followers)}>
                <Span bold>
                  <Span gray700 regular>
                    멤버 친목도
                  </Span>{' '}
                  {Math.ceil(
                    (nftCollection.affinity.follows_among_members /
                      nftCollection.affinity.total_possible_follows) *
                      100,
                  )}
                  % ({nftCollection.affinity.follows_among_members} /{' '}
                  {nftCollection.affinity.total_possible_follows})
                </Span>
              </Col>
              <Col />
            </Row>
          </Div>
          <Div h10 />
          <Row itemsCenter py15>
            <Col auto mr20>
              <Map
                strokeWidth={1.3}
                color={Colors.gray[400]}
                height={28}
                width={28}
              />
            </Col>
            <Col>
              <Span fontSize={18} gray400>
                로드맵
              </Span>
            </Col>
          </Row>
          <Row itemsCenter py15>
            <Col auto mr20>
              <Layers
                strokeWidth={1.3}
                color={textColor}
                height={28}
                width={28}
              />
            </Col>
            <Col>
              <Span
                fontSize={18}
                color={textColor}
                onPress={() =>
                  gotoCollectionFeed(`${nftCollection.name} 멤버 피드`)
                }>
                모든 멤버들의 게시물
              </Span>
            </Col>
          </Row>
          <Row itemsCenter py15>
            <Col auto mr20>
              <ThumbsUp
                strokeWidth={1.3}
                color={textColor}
                height={28}
                width={28}
              />
            </Col>
            <Col>
              <Span
                fontSize={18}
                color={textColor}
                onPress={() =>
                  gotoCollectionFeed(
                    `${nftCollection.name} 진행중인 투표`,
                    'Proposal',
                  )
                }>
                진행중인 투표
              </Span>
            </Col>
          </Row>
          <Row itemsCenter py15>
            <Col auto mr20>
              <Award
                strokeWidth={1.3}
                color={Colors.gray[400]}
                height={28}
                width={28}
              />
            </Col>
            <Col>
              <Span fontSize={18} gray400>
                파트너
              </Span>
            </Col>
          </Row>
          <Row itemsCenter py15>
            <Col auto mr20>
              <Img h28 w28 source={ICONS.discordIcon} opacity={0.5} />
            </Col>
            <Col>
              <Span fontSize={18} gray400>
                디스코드
              </Span>
            </Col>
          </Row>
          <Row itemsCenter py15>
            <Col auto mr20>
              <Img h28 w28 source={ICONS.openseaIcon} opacity={0.5} />
            </Col>
            <Col>
              <Span fontSize={18} gray400>
                오픈씨
              </Span>
            </Col>
          </Row>
        </Div>
      )}
    </Div>
  );
};

export default MyNftCollectionMenu;
