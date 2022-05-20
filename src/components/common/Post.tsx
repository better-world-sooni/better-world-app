import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useRef, useState} from 'react';
import {ActivityIndicator, Platform, RefreshControl} from 'react-native';
import {
  ChevronLeft,
  Coffee,
  Heart,
  MessageCircle,
  MoreHorizontal,
  ThumbsDown,
  ThumbsUp,
} from 'react-native-feather';
import {State, TapGestureHandler} from 'react-native-gesture-handler';
import Colors from 'src/constants/Colors';
import {
  useGotoLikeList,
  useGotoNftCollectionProfile,
  useGotoNftProfile,
  useGotoPost,
  useGotoReport,
  useGotoVoteList,
} from 'src/hooks/useGoto';
import useLike from 'src/hooks/useLike';
import apis from 'src/modules/apis';
import {
  getNftName,
  getNftProfileImage,
  useIsAdmin,
  useIsCurrentNft,
} from 'src/modules/nftUtils';
import {createdAtText} from 'src/modules/timeUtils';
import {ScrollView} from 'src/modules/viewComponents';
import {Col} from './Col';
import Comment from './Comment';
import DefaultMarkdown from './DefaultMarkdown';
import {Div} from './Div';
import ImageSlideShow from './ImageSlideShow';
import {Img} from './Img';
import NewComment, {ReplyToType} from './NewComment';
import {Row} from './Row';
import {Span} from './Span';
import TruncatedMarkdown from './TruncatedMarkdown';
import {MenuView} from '@react-native-menu/menu';
import {
  deletePromiseFn,
  useDeletePromiseFnWithToken,
} from 'src/redux/asyncReducer';
import {ReportTypes} from 'src/screens/ReportScreen';
import useVote, {VoteCategory} from 'src/hooks/useVote';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {LikeListType} from 'src/screens/LikeListScreen';

enum PostEventTypes {
  Delete = 'DELETE',
  Report = 'REPORT',
}

export default function Post({
  post,
  full = false,
  refreshing = false,
  onRefresh = null,
}) {
  const {goBack} = useNavigation();
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [liked, likesCount, handlePressLike] = useLike(
    post.is_liked,
    post.likes_count,
    apis.like.post(post.id).url,
  );
  const [cachedComments, setCachedComments] = useState(post.comments || []);
  const {
    forVotesCount,
    againstVotesCount,
    abstainVotesCount,
    hasVotedFor,
    hasVotedAgainst,
    hasVotedAbstain,
    handlePressVoteAbstain,
    handlePressVoteFor,
    handlePressVoteAgainst,
  } = useVote({
    initialVote: post.vote_category,
    initialAbstainVotesCount: post.abstain_votes_count,
    initialForVotesCount: post.for_votes_count,
    initialAgainstVotesCount: post.against_votes_count,
    postId: post.id,
  });
  const isCurrentNft = useIsCurrentNft(post.nft);
  const isAdmin = !post.nft.token_id && useIsAdmin(post.nft);
  const deletePromiseFnWithToken = useDeletePromiseFnWithToken();
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const menuOptions =
    isCurrentNft || isAdmin
      ? [
          {
            id: 'REPORT',
            title: 'Report Post',
            titleColor: '#46F289',
            subtitle: 'Share action on SNS',
            image: Platform.select({
              ios: 'flag',
              android: 'stat_sys_warning',
            }),
          },
          {
            id: PostEventTypes.Delete,
            title: 'Delete Post',
            image: Platform.select({
              ios: 'trash',
              android: 'ic_menu_delete',
            }),
          },
        ]
      : [
          {
            id: PostEventTypes.Report,
            title: 'Report Post',
            titleColor: '#46F289',
            subtitle: 'Share action on SNS',
            image: Platform.select({
              ios: 'flag',
              android: 'stat_sys_warning',
            }),
          },
        ];

  const actionIconDefaultProps = {
    width: 20,
    height: 20,
    color: Colors.gray[700],
    strokeWidth: 1.5,
  };
  const heartProps = liked
    ? {
        fill: Colors.danger.DEFAULT,
        width: 20,
        height: 20,
        color: Colors.danger.DEFAULT,
        strokeWidth: 1.5,
      }
    : actionIconDefaultProps;

  const forVoteProps = hasVotedFor
    ? {
        fill: Colors.primary.DEFAULT,
        width: 20,
        height: 20,
        color: Colors.primary.DEFAULT,
        strokeWidth: 1.5,
      }
    : actionIconDefaultProps;
  const abstainVoteProps = hasVotedAbstain
    ? {
        fill: Colors.primary.DEFAULT,
        width: 20,
        height: 20,
        color: Colors.primary.DEFAULT,
        strokeWidth: 1.5,
      }
    : actionIconDefaultProps;
  const againstVoteProps = hasVotedAgainst
    ? {
        fill: Colors.danger.DEFAULT,
        width: 20,
        height: 20,
        color: Colors.danger.DEFAULT,
        strokeWidth: 1.5,
      }
    : actionIconDefaultProps;
  const goToPost = useGotoPost({postId: post.id});
  const gotoNftProfile = useGotoNftProfile({
    contractAddress: post.nft.contract_address,
    tokenId: post.nft.token_id,
  });
  const gotoNftCollectionProfile = useGotoNftCollectionProfile({
    contractAddress: post.nft.contract_address,
  });
  const goToProfile = useCallback(() => {
    if (post.nft.token_id) {
      gotoNftProfile();
    } else {
      gotoNftCollectionProfile();
    }
  }, []);
  const defaultReplyTo = {
    object: post,
    type: ReplyToType.Post,
  };
  const [replyTo, setReplyTo] = useState(defaultReplyTo);
  const handleNewCommentSuccess = useCallback(
    (newComment, replyToObject, replyToType) => {
      if (replyToType == ReplyToType.Comment) {
        const updatedCommentIndex = cachedComments.findIndex(comment => {
          return comment.id == replyToObject.id;
        });
        const repliedComment = cachedComments[updatedCommentIndex];
        const commentsOfRepliedComment = repliedComment.comments || [];
        const newcommentsOfRepliedComment =
          commentsOfRepliedComment.concat(newComment);
        const newRepliedComment = {
          ...repliedComment,
          comments: newcommentsOfRepliedComment,
        };
        const newCachedComments = cachedComments
          .slice(0, updatedCommentIndex)
          .concat(
            newRepliedComment,
            cachedComments.slice(updatedCommentIndex + 1),
          );
        setCachedComments(newCachedComments);
        resetReplyTo();
        return;
      }
      setCachedComments([newComment, ...cachedComments]);
    },
    [cachedComments],
  );
  const resetReplyTo = () => {
    setReplyTo(defaultReplyTo);
  };
  const handlePressReplyTo = useCallback(comment => {
    setReplyTo({
      object: comment,
      type: ReplyToType.Comment,
    });
  }, []);
  const scrollviewProps = full
    ? {
        scrollEnabled: true,
      }
    : {};
  const deletePost = async () => {
    setLoading(true);
    const {data} = await deletePromiseFnWithToken({
      url: apis.post.postId._(post.id).url,
    });
    setLoading(false);
    if (data.success) {
      setDeleted(true);
    }
  };
  const gotoReport = useGotoReport({
    id: post.id,
    reportType: ReportTypes.Post,
  });
  const handlePressMenu = ({nativeEvent: {event}}) => {
    if (event == PostEventTypes.Delete) deletePost();
    if (event == PostEventTypes.Report) gotoReport();
  };

  const gotoLikeList = useGotoLikeList({
    likableId: post.id,
    likableType: LikeListType.Post,
  });

  const gotoVoteList = useGotoVoteList({
    postId: post.id,
  });
  if (deleted) return null;

  return (
    <Div
      py5
      borderBottom={full ? 0 : 0.5}
      borderGray200
      bgWhite
      {...(full && {flex: 1})}>
      <Row pl={full ? 10 : 15} pr15 itemsCenter pt8>
        {full ? (
          <Col auto mr5 onPress={goBack}>
            <ChevronLeft width={20} height={20} color="black" strokeWidth={3} />
          </Col>
        ) : null}
        <Col auto mr10 onPress={goToProfile}>
          <Img
            w35
            h35
            rounded100
            uri={getNftProfileImage(post.nft, 100, 100)}
          />
        </Col>
        <Col auto mr10>
          <Span fontSize={15} medium onPress={goToProfile}>
            {getNftName(post.nft)}
          </Span>
        </Col>
        {post.nft.token_id &&
          post.nft.nft_metadatum.name != getNftName(post.nft) && (
            <Col auto>
              <Span fontSize={13} gray700 onPress={goToProfile}>
                {post.nft.nft_metadatum.name}
                {' · '}
              </Span>
            </Col>
          )}
        <Col auto>
          <Span fontSize={13} gray700>
            {createdAtText(post.updated_at)}
          </Span>
        </Col>
        <Col />
        <Col auto>
          <MenuView onPressAction={handlePressMenu} actions={menuOptions}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <MoreHorizontal color={Colors.gray[500]} width={20} height={20} />
            )}
          </MenuView>
        </Col>
      </Row>
      <ScrollView
        {...scrollviewProps}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {post.content ? (
          <Div px15>
            {full ? (
              <DefaultMarkdown children={post.content}></DefaultMarkdown>
            ) : (
              <TruncatedMarkdown
                text={post.content}
                maxLength={500}
                onPressTruncated={goToPost}
              />
            )}
          </Div>
        ) : null}
        {post.type == 'Proposal' &&
          post.nft.contract_address == currentNft.contract_address && (
            <Row px15 pb10>
              <Col auto mr10>
                <Span fontSize={13} bold>
                  예{' '}
                  {(againstVotesCount + forVotesCount > 0
                    ? forVotesCount / (againstVotesCount + forVotesCount)
                    : 0) * 100}
                  %
                </Span>
              </Col>
              <Col auto>
                <Span fontSize={13} bold>
                  아니요{' '}
                  {(againstVotesCount + forVotesCount > 0
                    ? againstVotesCount / (againstVotesCount + forVotesCount)
                    : 0) * 100}
                  %
                </Span>
              </Col>
              <Col />
            </Row>
          )}
        {post.image_uris.length > 0 ? (
          <ImageSlideShow imageUris={post.image_uris} />
        ) : null}
        <Row px15 itemsCenter mb8 mt8 mb13={full}>
          {!post.type ? (
            <>
              {likesCount > 0 && (
                <Col auto mr12 gray800>
                  <Span fontSize={13} gray700 onPress={gotoLikeList}>
                    좋아요 <Span realBlack>{likesCount}</Span> 개
                  </Span>
                </Col>
              )}
              {cachedComments.length > 0 && (
                <Col auto mr12 gray800 onPress={!full && goToPost}>
                  <Span fontSize={13} gray700>
                    댓글 <Span realBlack>{cachedComments.length}</Span> 개
                  </Span>
                </Col>
              )}
              <Col />
              {!full && (
                <Col auto mr16 onPress={handlePressLike}>
                  {<Heart {...heartProps}></Heart>}
                </Col>
              )}
            </>
          ) : (
            <>
              <Col auto mr12 gray800>
                <Span
                  fontSize={13}
                  gray700
                  onPress={() => gotoVoteList(VoteCategory.Against)}>
                  반대 <Span realBlack>{againstVotesCount}</Span> 표
                </Span>
              </Col>
              <Col auto mr12 gray800>
                <Span
                  fontSize={13}
                  gray700
                  onPress={() => gotoVoteList(VoteCategory.For)}>
                  찬성 <Span realBlack>{forVotesCount}</Span> 표
                </Span>
              </Col>
              <Col />
              {!full && (
                <>
                  <Col auto mr16 onPress={handlePressVoteAgainst}>
                    {<ThumbsDown {...againstVoteProps}></ThumbsDown>}
                  </Col>
                  <Col auto mr16 onPress={handlePressVoteFor}>
                    {<ThumbsUp {...forVoteProps}></ThumbsUp>}
                  </Col>
                </>
              )}
            </>
          )}
          {!full && (
            <Col auto onPress={!full && goToPost}>
              <MessageCircle {...actionIconDefaultProps} />
            </Col>
          )}
        </Row>
        {full ? (
          <Div borderTop={0.5} borderGray200 pt5>
            {cachedComments.map(comment => {
              return (
                <Comment
                  key={comment.id}
                  comment={comment}
                  onPressReplyTo={handlePressReplyTo}></Comment>
              );
            })}
          </Div>
        ) : (
          cachedComments.length > 0 && (
            <Div onPress={goToPost}>
              <Comment
                hot
                key={cachedComments[0].id}
                comment={cachedComments[0]}
                onPressReplyTo={handlePressReplyTo}></Comment>
            </Div>
          )
        )}
        {full && <Div h100></Div>}
      </ScrollView>
      {full && (
        <NewComment
          replyToObject={replyTo.object}
          replyToType={replyTo.type}
          onSuccess={handleNewCommentSuccess}
          onPressExitReplyToComment={resetReplyTo}
        />
      )}
    </Div>
  );
}

function CommentNftExamples({comments}) {
  return (
    <Div w={(comments.slice(0, 3).length - 1) * 12 + 19} relative h22 mr5>
      {comments.slice(0, 3).map((comment, index) => {
        return (
          <Img
            key={comment.id}
            uri={comment.nft.nft_metadatum.image_uri}
            rounded100
            h22
            w22
            absolute
            top0
            left={index * 12}
            border={1.5}
            borderWhite></Img>
        );
      })}
    </Div>
  );
}