import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {ChevronLeft} from 'react-native-feather';
import {Colors} from 'src/modules/styles';
import {Col} from './Col';
import Comment from './Comment';
import {Div} from './Div';
import NewComment, {ReplyToType} from './NewComment';
import {Row} from './Row';
import {Span} from './Span';
import Animated from 'react-native-reanimated';
import useScrollToEndRef from 'src/hooks/useScrollToEndRef';
import Post from './Post';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function FullPost({
  onlyComments = false,
  post,
  autoFocus = false,
}) {
  const scrollToEndRef = useScrollToEndRef();
  const {goBack} = useNavigation();
  const [cachedComments, setCachedComments] = useState(post.comments || []);
  useEffect(() => {
    setCachedComments(post.comments || []);
  }, [post.comments?.length]);
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
  const notchHeight = useSafeAreaInsets().top;

  return (
    <>
      <Div h={notchHeight}></Div>
      <Div bgWhite h={50} justifyCenter borderBottom={0.5} borderGray200>
        <Row itemsCenter py5 h40 px8>
          <Col itemsStart>
            <Div auto rounded100 onPress={goBack}>
              <ChevronLeft
                width={30}
                height={30}
                color={Colors.black}
                strokeWidth={2}
              />
            </Div>
          </Col>
          <Col auto onPress={goBack}>
            <Span bold fontSize={19}>
              {onlyComments ? '댓글' : post.type ? '제안' : '게시물'}
            </Span>
          </Col>
          <Col itemsEnd></Col>
        </Row>
      </Div>
      <Div bgWhite flex={1}>
        <Animated.FlatList
          contentContainerStyle={{paddingBottom: 100}}
          ref={scrollToEndRef}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={!onlyComments && <Post post={post} full></Post>}
          data={cachedComments}
          renderItem={({item}) => {
            return (
              <Comment
                key={(item as any).id}
                comment={item}
                onPressReplyTo={handlePressReplyTo}></Comment>
            );
          }}></Animated.FlatList>
        <NewComment
          autoFocus={autoFocus}
          replyToObject={replyTo.object}
          replyToType={replyTo.type}
          onSuccess={handleNewCommentSuccess}
          onPressExitReplyToComment={resetReplyTo}
        />
      </Div>
    </>
  );
}
