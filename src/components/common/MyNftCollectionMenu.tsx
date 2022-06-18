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
  useGotoCollectionFeed,
  useGotoFollowList,
  useGotoMyCollectionEventList,
  useGotoMyCommunityWalletList,
  useGotoNewCollectionEvent,
  useGotoNewCommunityWallet,
  useGotoNewPost,
  useGotoNftCollectionProfile,
} from 'src/hooks/useGoto';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {
  Calendar,
  CreditCard,
  Layers,
  PieChart,
  ThumbsUp,
} from 'react-native-feather';
import {useApiSelector} from 'src/redux/asyncReducer';
import apis from 'src/modules/apis';
import {getSiPrefixedNumber} from 'src/modules/numberUtils';
import {useIsAdmin} from 'src/modules/nftUtils';
import Colors from 'src/constants/Colors';
import {PostOwnerType, PostType} from 'src/screens/NewPostScreen';

const MyNftCollectionMenu = ({nftCollection}) => {
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const {data: feedCountRes, isLoading: feedCountLoading} = useApiSelector(
    apis.feed.count(),
  );
  const allPostCount = feedCountRes?.all_post_count;
  const activeForumCount = feedCountRes?.active_forum_count;
  const activeProposalCount = feedCountRes?.active_proposal_count;
  const upcomingEventCount = feedCountRes?.upcoming_event_count;
  const communityWalletCount = feedCountRes?.community_wallet_count;
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
  const gotoCommunityWalletList = useGotoMyCommunityWalletList();
  const gotoCollectionEventList = useGotoMyCollectionEventList();
  const gotoNewCollectionEvent = useGotoNewCollectionEvent();
  const gotoNewCommunityWallet = useGotoNewCommunityWallet();
  const gotoNewPost = useGotoNewPost({
    postOwnerType: PostOwnerType.NftCollection,
  });
  const gotoAffinity = useGotoAffinity({
    nftCollection,
  });
  const notchHeight = HAS_NOTCH ? 44 : 0;
  const headerHeight = notchHeight + 18;
  const isAdmin = useIsAdmin();
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
                <Span fontSize={20} bold color={textColor}>
                  {nftCollection.name}
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
          {communityWalletCount ? (
            <Row itemsCenter py16 onPress={gotoCommunityWalletList}>
              <Col auto mr16>
                <CreditCard
                  strokeWidth={1.3}
                  color={'black'}
                  height={24}
                  width={24}
                />
              </Col>
              <Col>
                <Span fontSize={16}>커뮤니티 지갑</Span>
              </Col>

              <Col auto>
                <Span gray700 fontSize={14}>
                  {getSiPrefixedNumber(communityWalletCount)}개
                </Span>
              </Col>
            </Row>
          ) : (
            isAdmin && (
              <Row itemsCenter py16 onPress={gotoNewCommunityWallet}>
                <Col auto mr16>
                  <CreditCard
                    strokeWidth={1.3}
                    color={Colors.primary.DEFAULT}
                    height={24}
                    width={24}
                  />
                </Col>
                <Col>
                  <Span fontSize={16} primary>
                    커뮤니티 지갑 추가
                  </Span>
                </Col>
              </Row>
            )
          )}
          {allPostCount ? (
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

              <Col auto>
                <Span gray700 fontSize={14}>
                  {getSiPrefixedNumber(allPostCount)}개
                </Span>
              </Col>
            </Row>
          ) : null}
          {upcomingEventCount ? (
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
                <Span fontSize={16}>예정된 일정</Span>
              </Col>

              <Col auto>
                <Span gray700 fontSize={14}>
                  {getSiPrefixedNumber(upcomingEventCount)}개
                </Span>
              </Col>
            </Row>
          ) : (
            isAdmin && (
              <Row itemsCenter py16 onPress={gotoNewCollectionEvent}>
                <Col auto mr16>
                  <Calendar
                    strokeWidth={1.3}
                    color={Colors.primary.DEFAULT}
                    height={24}
                    width={24}
                  />
                </Col>
                <Col>
                  <Span fontSize={16} primary>
                    일정 추가
                  </Span>
                </Col>
              </Row>
            )
          )}
          {activeForumCount ? (
            <Row
              itemsCenter
              py16
              onPress={() =>
                gotoCollectionFeed(
                  `${nftCollection.name} 진행중인 포럼`,
                  'Forum',
                )
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
              <Col auto>
                <Span gray700 fontSize={14}>
                  {getSiPrefixedNumber(activeForumCount)}개
                </Span>
              </Col>
            </Row>
          ) : (
            isAdmin && (
              <Row
                itemsCenter
                py16
                onPress={() => gotoNewPost(null, null, PostType.Forum)}>
                <Col auto mr16>
                  <PieChart
                    strokeWidth={1.3}
                    color={Colors.primary.DEFAULT}
                    height={24}
                    width={24}
                  />
                </Col>
                <Col>
                  <Span fontSize={16} primary>
                    포럼 추가
                  </Span>
                </Col>
              </Row>
            )
          )}
          {activeProposalCount ? (
            <Row
              itemsCenter
              py16
              onPress={() =>
                gotoCollectionFeed(
                  `${nftCollection.name} 진행중인 투표`,
                  'Proposal',
                )
              }>
              <Col auto mr16>
                <ThumbsUp
                  strokeWidth={1.3}
                  color={textColor}
                  height={24}
                  width={24}
                />
              </Col>
              <Col>
                <Span fontSize={16} color={textColor}>
                  진행중인 투표
                </Span>
              </Col>

              <Col auto>
                <Span gray700 fontSize={14}>
                  {getSiPrefixedNumber(activeProposalCount)}개
                </Span>
              </Col>
            </Row>
          ) : (
            isAdmin && (
              <Row
                itemsCenter
                py16
                onPress={() => gotoNewPost(null, null, PostType.Proposal)}>
                <Col auto mr16>
                  <ThumbsUp
                    strokeWidth={1.3}
                    color={Colors.primary.DEFAULT}
                    height={24}
                    width={24}
                  />
                </Col>
                <Col>
                  <Span fontSize={16} primary>
                    투표 추가
                  </Span>
                </Col>
              </Row>
            )
          )}
        </Div>
      )}
    </Div>
  );
};

export default MyNftCollectionMenu;
