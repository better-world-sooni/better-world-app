import React, {memo, useState} from 'react';
import {ActivityIndicator, Platform} from 'react-native';
import {
  AlertTriangle,
  Check,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat,
  ThumbsDown,
  ThumbsUp,
  X,
  Zap,
} from 'react-native-feather';
import {Colors} from 'src/modules/styles';
import {
  useGotoLikeList,
  useGotoNewPost,
  useGotoNftCollectionProfile,
  useGotoNftProfile,
  useGotoPost,
  useGotoReport,
  useGotoRepostList,
  useGotoVoteList,
} from 'src/hooks/useGoto';
import useLike, {LikableType} from 'src/hooks/useLike';
import apis from 'src/modules/apis';
import {
  getNftName,
  getNftProfileImage,
  useIsAdmin,
  useIsCurrentCollection,
  useIsCurrentNft,
} from 'src/utils/nftUtils';
import {createdAtText} from 'src/utils/timeUtils';
import {Col} from './Col';
import Comment from './Comment';
import {Div} from './Div';
import ImageSlideShow from './ImageSlideShow';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';
import {MenuView} from '@react-native-menu/menu';
import {
  useDeletePromiseFnWithToken,
  usePutPromiseFnWithToken,
} from 'src/redux/asyncReducer';
import {ReportTypes} from 'src/screens/ReportScreen';
import useVote, {VoteCategory, VotingStatus} from 'src/hooks/useVote';
import {LikeListType} from 'src/screens/LikeListScreen';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {PostOwnerType, PostType} from 'src/screens/NewPostScreen';
import TruncatedText from './TruncatedText';
import RepostedPost from './RepostedPost';
import CollectionEvent from './CollectionEvent';
import {getAdjustedHeightFromDimensions} from 'src/utils/imageUtils';
import RepostedTransaction from './RepostedTransaction';
import {ICONS} from 'src/modules/icons';
import useDelete from 'src/hooks/useDelete';
import AutolinkTextWrapper from './AutolinkTextWrapper';
import ExpandableVideo from './ExpandableVideo';

export enum PostEventTypes {
  Delete = 'DELETE',
  Report = 'REPORT',
}

function PostContent({
  post,
  selectableFn = null,
  displayLabel = false,
  full = false,
  isProfile = false,
}) {
  const [liked, likesCount, handlePressLike] = useLike(
    post.is_liked,
    post.likes_count,
    LikableType.Post,
    post.id,
  );
  const {
    votingStatus,
    forVotesCount,
    againstVotesCount,
    hasVotedFor,
    hasVotedAgainst,
    handleSetVotable,
    handlePressVoteFor,
    handlePressVoteAgainst,
  } = useVote({
    initialVote: post.vote_category,
    initialForVotesCount: post.for_votes_count,
    initialAgainstVotesCount: post.against_votes_count,
    postId: post.id,
    initialVotingStatus: post.voting_status,
  });
  const isCurrentNft = useIsCurrentNft(post.nft);
  const isCurrentCollection = useIsCurrentCollection(post.nft);
  const isAdmin = useIsAdmin(post.nft);
  const {loading, deleted, deleteObject} = useDelete({
    url: apis.post.postId._(post.id).url,
  });
  const menuOptions = [
    {
      id: PostEventTypes.Report,
      title: '게시물 신고',
      image: Platform.select({
        ios: 'flag',
      }),
    },
    (isCurrentNft || (!post.nft.token_id && isAdmin)) && {
      id: PostEventTypes.Delete,
      title: '게시물 삭제',
      image: Platform.select({
        ios: 'trash',
      }),
    },
  ].filter(option => option);

  const actionIconDefaultProps = {
    width: 16,
    height: 16,
    color: Colors.gray[600],
    strokeWidth: 1.6,
  };
  const heartProps = liked
    ? {
        fill: Colors.danger.DEFAULT,
        width: 16,
        height: 16,
        color: Colors.danger.DEFAULT,
        strokeWidth: 2,
      }
    : actionIconDefaultProps;
  const forVoteProps = hasVotedFor
    ? {
        fill: Colors.info.DEFAULT,
        width: 16,
        height: 16,
        color: Colors.info.DEFAULT,
        strokeWidth: 2,
      }
    : actionIconDefaultProps;
  const againstVoteProps = hasVotedAgainst
    ? {
        fill: Colors.danger.DEFAULT,
        width: 16,
        height: 16,
        color: Colors.danger.DEFAULT,
        strokeWidth: 2,
      }
    : actionIconDefaultProps;
  const gotoPost = useGotoPost({postId: post.id});

  const gotoNftProfile = useGotoNftProfile({
    nft: post.nft,
  });
  const gotoNftCollectionProfile = useGotoNftCollectionProfile({
    nftCollection: post.nft,
  });
  const goToProfile = () => {
    if (post.nft.token_id) {
      gotoNftProfile();
    } else {
      gotoNftCollectionProfile();
    }
  };

  const gotoReport = useGotoReport({
    id: post.id,
    reportType: ReportTypes.Post,
  });

  const handlePressMenu = ({nativeEvent: {event}}) => {
    if (event == PostEventTypes.Delete) deleteObject();
    if (event == PostEventTypes.Report) gotoReport();
  };

  const gotoLikeList = useGotoLikeList({
    likableId: post.id,
    likableType: LikeListType.Post,
  });

  const gotoVoteList = useGotoVoteList({
    postId: post.id,
  });

  const gotoNewPost = useGotoNewPost({
    postOwnerType: PostOwnerType.Nft,
  });

  const gotoRepostList = useGotoRepostList({
    postId: post.id,
  });

  const itemWidth = DEVICE_WIDTH - 30 - (full ? 3 : 62);

  if (deleted) return null;

  return (
    <>
      <Div py5 borderBottom={0.5} borderGray200 bgWhite>
        <Row px={full ? 18 : 15} pt5>
          {!full && (
            <Col auto mr10 {...(!full && {onPress: () => gotoPost()})}>
              <Div
                onPress={() => {
                  !isProfile && goToProfile();
                }}>
                <Img
                  w54
                  h54
                  border={0.5}
                  borderGray200
                  rounded100
                  uri={getNftProfileImage(post.nft, 200, 200)}
                />
              </Div>
            </Col>
          )}
          <Col>
            {selectableFn && (
              <Div mt1 mb4>
                <Span
                  bold
                  info
                  fontSize={12}
                  onPress={() => selectableFn(post.id)}>
                  선택하기
                </Span>
              </Div>
            )}
            <Row itemsCenter>
              {full && (
                <Col auto mr10 {...(!full && {onPress: () => gotoPost()})}>
                  <Div
                    onPress={() => {
                      !isProfile && goToProfile();
                    }}>
                    <Img
                      w48
                      h48
                      border={0.5}
                      borderGray200
                      rounded100
                      uri={getNftProfileImage(post.nft, 200, 200)}
                    />
                  </Div>
                </Col>
              )}
              <Col auto>
                <Span>
                  <Span
                    fontSize={15}
                    bold
                    onPress={() => {
                      !isProfile && goToProfile();
                    }}>
                    {getNftName(post.nft)}
                    {!post.nft.token_id && ' '}
                  </Span>
                  {!post.nft.token_id && (
                    <Img source={ICONS.sealCheck} h15 w15></Img>
                  )}
                  {!full && (
                    <Span fontSize={12} gray700>
                      {' · '}
                      {createdAtText(post.updated_at)}
                    </Span>
                  )}
                </Span>
                {full && (
                  <Span>
                    <Span
                      fontSize={12}
                      bold
                      gray600
                      onPress={() => {
                        !isProfile && goToProfile();
                      }}>
                      {post.nft.nft_metadatum.name}
                    </Span>
                    <Span fontSize={12} gray700>
                      {' · '}
                      {createdAtText(post.updated_at)}
                    </Span>
                  </Span>
                )}
              </Col>
              <Col />
              <Col auto>
                <MenuView onPressAction={handlePressMenu} actions={menuOptions}>
                  <Div>
                    {loading ? (
                      <ActivityIndicator />
                    ) : (
                      <MoreHorizontal
                        color={Colors.gray[700]}
                        width={22}
                        height={18}
                      />
                    )}
                  </Div>
                </MenuView>
              </Col>
            </Row>
            {post.content ? (
              <Div onPress={() => gotoPost()}>
                {full ? (
                  <AutolinkTextWrapper>
                    <Span fontSize={15} py12>
                      {post.content}
                    </Span>
                  </AutolinkTextWrapper>
                ) : (
                  <TruncatedText
                    text={post.content}
                    maxLength={300}
                    spanProps={{fontSize: 14}}
                    onPressTruncated={() => gotoPost()}
                  />
                )}
              </Div>
            ) : null}
            {post.transaction && (
              <RepostedTransaction transaction={post.transaction} enablePress />
            )}
            {post.reposted_post && (
              <RepostedPost repostedPost={post.reposted_post} enablePress />
            )}
            {post.image_uris.length > 0 ? (
              <Div mt5>
                <ImageSlideShow
                  imageUris={post.image_uris}
                  sliderHeight={
                    post.image_width && post.image_height
                      ? getAdjustedHeightFromDimensions({
                          width: post.image_width,
                          height: post.image_height,
                          frameWidth: itemWidth,
                        })
                      : itemWidth * 0.7
                  }
                  sliderWidth={itemWidth}
                />
              </Div>
            ) : null}
            {post.video_uri ? (
              <Div mt5>
                <ExpandableVideo
                  url={post.video_uri}
                  height={
                    post.image_width && post.image_height
                      ? getAdjustedHeightFromDimensions({
                          width: post.image_width,
                          height: post.image_height,
                          frameWidth: itemWidth,
                        })
                      : itemWidth * 0.7
                  }
                  width={itemWidth}
                />
              </Div>
            ) : null}
            {post.collection_event && (
              <Div mt5>
                <CollectionEvent
                  collectionEvent={post.collection_event}
                  reposted
                  itemWidth={itemWidth}
                />
              </Div>
            )}
            <Row itemsCenter mb8 mt8>
              {!post.type ? (
                <>
                  <Col />
                  <Col auto onPress={() => gotoNewPost(post)} mr4>
                    <Repeat {...actionIconDefaultProps} />
                  </Col>
                  <Col auto mr12>
                    <Span
                      fontSize={12}
                      color={Colors.gray[600]}
                      style={{fontWeight: '600'}}
                      onPress={gotoRepostList}>
                      퍼가기 {post.repost_count}회
                    </Span>
                  </Col>
                  {votingStatus == null && !full && (
                    <>
                      <Col auto mr4 onPress={() => gotoPost(true)}>
                        <MessageCircle {...actionIconDefaultProps} />
                      </Col>
                      <Col auto mr12>
                        <Span
                          fontSize={12}
                          style={{fontWeight: '600'}}
                          color={Colors.gray[600]}
                          onPress={() => gotoPost(true)}>
                          댓글 {post.comments_count}개
                        </Span>
                      </Col>
                    </>
                  )}
                  {
                    <>
                      <Col auto mr4 onPress={handlePressLike}>
                        {<Heart {...heartProps}></Heart>}
                      </Col>
                      <Col auto>
                        <Span
                          fontSize={12}
                          style={{fontWeight: '600'}}
                          color={Colors.gray[600]}
                          onPress={gotoLikeList}>
                          좋아요 {likesCount}개
                        </Span>
                      </Col>
                    </>
                  }
                </>
              ) : null}
            </Row>
          </Col>
        </Row>
        {post.comment && !full && (
          <Div onPress={() => gotoPost(false, false, false, true)}>
            <Comment hot key={post.comment.id} comment={post.comment}></Comment>
          </Div>
        )}
      </Div>
    </>
  );
}

const Post = memo(PostContent);

export default Post;
