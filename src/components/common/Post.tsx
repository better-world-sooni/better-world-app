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

export enum PostEventTypes {
  Delete = 'DELETE',
  Report = 'REPORT',
}

function PostContent({
  post,
  selectableFn = null,
  displayLabel = false,
  full = false,
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
      titleColor: '#46F289',
      image: Platform.select({
        ios: 'flag',
        android: 'stat_sys_warning',
      }),
    },
    (isCurrentNft || (!post.nft.token_id && isAdmin)) && {
      id: PostEventTypes.Delete,
      title: '게시물 삭제',
      image: Platform.select({
        ios: 'trash',
        android: 'ic_menu_delete',
      }),
    },
  ].filter(option => option);

  const actionIconDefaultProps = {
    width: 18,
    height: 18,
    color: Colors.black,
    strokeWidth: 2,
  };
  const heartProps = liked
    ? {
        fill: Colors.danger.DEFAULT,
        width: 18,
        height: 18,
        color: Colors.danger.DEFAULT,
        strokeWidth: 2,
      }
    : actionIconDefaultProps;
  const forVoteProps = hasVotedFor
    ? {
        fill: Colors.info.DEFAULT,
        width: 18,
        height: 18,
        color: Colors.info.DEFAULT,
        strokeWidth: 2,
      }
    : actionIconDefaultProps;
  const againstVoteProps = hasVotedAgainst
    ? {
        fill: Colors.danger.DEFAULT,
        width: 18,
        height: 18,
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

  const itemWidth = DEVICE_WIDTH - 30 - 62;

  if (deleted) return null;

  return (
    <>
      <Div py5 borderBottom={0.5} borderGray200 bgWhite>
        <Row px15 pt5>
          <Col auto mr8>
            {displayLabel && (
              <Div itemsEnd mb5>
                {post.type == PostType.Proposal ? (
                  <Img source={ICONS.lightBulbGray} h16 w16 />
                ) : (
                  <Heart height={16} width={16} color={Colors.gray.DEFAULT} />
                )}
              </Div>
            )}
            <Div onPress={goToProfile}>
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
          <Col>
            {selectableFn ? (
              <Div mt1 mb4>
                <Span
                  bold
                  info
                  fontSize={12}
                  onPress={() => selectableFn(post.id)}>
                  선택하기
                </Span>
              </Div>
            ) : (
              displayLabel && (
                <Div mt1 mb4>
                  <Span bold gray fontSize={12}>
                    {post.type == PostType.Proposal ? '제안' : '게시물'}
                  </Span>
                </Div>
              )
            )}
            <Row>
              <Col auto>
                <Span>
                  <Span fontSize={15} bold onPress={goToProfile}>
                    {getNftName(post.nft)}{' '}
                  </Span>
                  {post.nft.token_id ? (
                    post.nft.nft_metadatum.name != getNftName(post.nft) && (
                      <Span fontSize={12} bold gray700 onPress={goToProfile}>
                        {' '}
                        {post.nft.nft_metadatum.name}
                      </Span>
                    )
                  ) : (
                    <Img source={ICONS.sealCheck} h15 w15></Img>
                  )}
                  <Span fontSize={12} gray700>
                    {' · '}
                    {createdAtText(post.updated_at)}
                  </Span>
                </Span>
              </Col>
              <Col />
              <Col auto>
                <MenuView onPressAction={handlePressMenu} actions={menuOptions}>
                  <Div>
                    {loading ? (
                      <ActivityIndicator />
                    ) : (
                      <MoreHorizontal
                        color={Colors.gray[200]}
                        width={22}
                        height={18}
                      />
                    )}
                  </Div>
                </MenuView>
              </Col>
            </Row>
            {post.content ? (
              <Div>
                {full ? (
                  <Span fontSize={14}>{post.content}</Span>
                ) : (
                  <TruncatedText
                    text={post.content}
                    maxLength={300}
                    spanProps={{fontSize: 14}}
                    onPressTruncated={gotoPost}
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
                  {likesCount > 0 && (
                    <Col auto mr12>
                      <Span
                        fontSize={12}
                        style={{fontWeight: '600'}}
                        onPress={gotoLikeList}>
                        좋아요 <Span black>{likesCount}</Span>개
                      </Span>
                    </Col>
                  )}
                  {post.repost_count > 0 && (
                    <Col auto mr12>
                      <Span
                        fontSize={12}
                        style={{fontWeight: '600'}}
                        onPress={gotoRepostList}>
                        리포스트 <Span black>{post.repost_count}</Span>번
                      </Span>
                    </Col>
                  )}
                  <Col />
                  <Col auto mr16 onPress={handlePressLike}>
                    {<Heart {...heartProps}></Heart>}
                  </Col>
                </>
              ) : post.type == 'Proposal' ? (
                <>
                  <Col auto mr12>
                    <Span
                      fontSize={12}
                      style={{fontWeight: '600'}}
                      onPress={() => gotoVoteList(VoteCategory.Against)}>
                      반대 <Span>{againstVotesCount}</Span>표 (
                      {Math.round(
                        (againstVotesCount + forVotesCount > 0
                          ? againstVotesCount /
                            (againstVotesCount + forVotesCount)
                          : 0) * 100,
                      )}
                      %)
                    </Span>
                  </Col>
                  <Col auto mr12>
                    <Span
                      fontSize={12}
                      style={{fontWeight: '600'}}
                      onPress={() => gotoVoteList(VoteCategory.For)}>
                      찬성 <Span black>{forVotesCount}</Span>표 (
                      {Math.round(
                        (againstVotesCount + forVotesCount > 0
                          ? forVotesCount / (againstVotesCount + forVotesCount)
                          : 0) * 100,
                      )}
                      %)
                    </Span>
                  </Col>
                  <Col />
                  {isCurrentCollection && !votingStatus && (
                    <>
                      <Col auto pr12 onPress={handlePressVoteAgainst}>
                        {<ThumbsDown {...againstVoteProps}></ThumbsDown>}
                      </Col>
                      <Col auto pr12={!full} onPress={handlePressVoteFor}>
                        {<ThumbsUp {...forVoteProps}></ThumbsUp>}
                      </Col>
                    </>
                  )}
                </>
              ) : null}
              {!post.type && (
                <Col auto onPress={() => gotoNewPost(post)} pr16={!full}>
                  <Repeat {...actionIconDefaultProps} />
                </Col>
              )}
              {votingStatus == VotingStatus.Approved ? (
                <>
                  <Col auto rounded100 p2 bgSuccess mr4>
                    <Check
                      strokeWidth={2}
                      height={14}
                      width={14}
                      color={Colors.white}
                    />
                  </Col>
                  <Col auto>
                    <Span bold fontSize={12}>
                      통과됨
                    </Span>
                  </Col>
                </>
              ) : votingStatus == VotingStatus.Rejected ? (
                <>
                  <Col auto>
                    <X
                      strokeWidth={2}
                      height={22}
                      width={22}
                      color={Colors.danger.DEFAULT}
                    />
                  </Col>
                  <Col auto>
                    <Span bold fontSize={12}>
                      거절됨
                    </Span>
                  </Col>
                </>
              ) : (
                votingStatus == VotingStatus.Error && (
                  <>
                    <Col auto>
                      <AlertTriangle
                        strokeWidth={2}
                        height={22}
                        width={22}
                        color={Colors.warning.DEFAULT}
                      />
                    </Col>
                    <Col auto>
                      <Span bold fontSize={12}>
                        리로드 필요
                      </Span>
                    </Col>
                  </>
                )
              )}
              {!votingStatus && !full && (
                <Col auto onPress={() => gotoPost(true)}>
                  <MessageCircle {...actionIconDefaultProps} />
                </Col>
              )}
            </Row>
          </Col>
        </Row>
        {post.comment && !full && (
          <Div onPress={gotoPost}>
            <Comment hot key={post.comment.id} comment={post.comment}></Comment>
          </Div>
        )}
      </Div>
    </>
  );
}

const Post = memo(PostContent);

export default Post;
