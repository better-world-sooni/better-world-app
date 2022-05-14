import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useRef, useState} from 'react';
import {RefreshControl} from 'react-native';
import {ChevronLeft, Heart, MoreHorizontal} from 'react-native-feather';
import {State, TapGestureHandler} from 'react-native-gesture-handler';
import Colors from 'src/constants/Colors';
import {
  useGotoNftCollectionProfile,
  useGotoNftProfile,
  useGotoPost,
} from 'src/hooks/useGoto';
import useLike from 'src/hooks/useLike';
import apis from 'src/modules/apis';
import {getNftName, getNftProfileImage} from 'src/modules/nftUtils';
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
import TruncatedText from './TruncatedText';

export default function Post({
  post,
  full = false,
  refreshing = false,
  onRefresh = null,
}) {
  console.log(post);
  const {goBack} = useNavigation();
  const [liked, likesCount, handlePressLike] = useLike(
    post.is_liked,
    post.likes_count,
    apis.like.post(post.id).url,
  );
  const [cachedComments, setCachedComments] = useState(post.comments || []);
  const heartProps = liked
    ? {
        fill: Colors.danger.DEFAULT,
        width: 20,
        height: 20,
        color: Colors.danger.DEFAULT,
        strokeWidth: 1.5,
      }
    : {width: 20, height: 20, color: 'black', strokeWidth: 1.5};
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
    'yoyoyo';
    setReplyTo({
      object: comment,
      type: ReplyToType.Comment,
    });
  }, []);
  const doubleTapRef = useRef(null);
  const handleDoubleTap = event => {
    console.log(event, 'handleDoubleTap');
    if (event.nativeEvent.state === State.ACTIVE) {
      handlePressLike();
    }
  };

  const scrollviewProps = full
    ? {
        scrollEnabled: true,
      }
    : {};

  return (
    <Div py5 borderBottom={full ? 0 : 0.5} borderGray200 bgWhite flex={full}>
      <Row pl={full ? 10 : 15} pr15 itemsCenter py8>
        {full ? (
          <Col auto mr5 onPress={goBack}>
            <ChevronLeft width={20} height={20} color="black" strokeWidth={3} />
          </Col>
        ) : null}
        <Col auto mr10 onPress={goToProfile}>
          <Img w40 h40 rounded100 uri={getNftProfileImage(post.nft, 50, 50)} />
        </Col>
        <Col auto>
          <Span fontSize={15} medium onPress={goToProfile}>
            {getNftName(post.nft)}
          </Span>
          <Span fontSize={12} mt2 gray600>
            {createdAtText(post.updated_at)}
          </Span>
        </Col>
        <Col />
        <Col auto>
          <MoreHorizontal color={'black'} width={20} height={20} />
        </Col>
      </Row>
      <ScrollView
        {...scrollviewProps}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {post.image_uris.length > 0 ? (
          <ImageSlideShow imageUris={post.image_uris} />
        ) : null}
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
        <Row px15 itemsCenter py8>
          <Col auto mr5 onPress={handlePressLike}>
            {<Heart {...heartProps}></Heart>}
          </Col>
          <Col auto mr10>
            <Span fontSize={12}>{likesCount} likes</Span>
          </Col>
          {cachedComments.length > 0 ? (
            <Col auto onPress={!full && goToPost}>
              <CommentNftExamples comments={cachedComments} />
            </Col>
          ) : null}
          <Col auto mr10 onPress={!full && goToPost}>
            <Span fontSize={12}>
              {full ? cachedComments.length : post.comments_count} Replies
            </Span>
          </Col>
          <Col />
        </Row>
        {full && (
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
    <Div w={(comments.slice(0, 3).length - 1) * 12 + 22} relative h22 mr5>
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