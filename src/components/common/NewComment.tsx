import React, {useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {X} from 'react-native-feather';
import {shallowEqual, useSelector} from 'react-redux';
import apis from 'src/modules/apis';
import {HAS_NOTCH} from 'src/modules/constants';
import {getNftName, getNftProfileImage} from 'src/utils/nftUtils';
import {Colors, varStyle} from 'src/modules/styles';
import {usePostPromiseFnWithToken} from 'src/redux/asyncReducer';
import {RootState} from 'src/redux/rootReducer';
import {TextField} from '../TextField';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';

export enum ReplyToType {
  Comment = 'Comment',
  Post = 'Post',
  DrawEvent = 'DrawEvent',
}

export default function NewComment({
  replyToObject,
  replyToType,
  onSuccess,
  autoFocus = false,
  onPressExitReplyToComment,
}) {
  const {currentNft} = useSelector(
    (root: RootState) => ({currentNft: root.app.session.currentNft}),
    shallowEqual,
  );
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [commentHeight, setCommentHeight] = useState(33);

  const handleCommentChange = text => {
    setNewComment(text);
  };
  const postPromiseFnWithToken = usePostPromiseFnWithToken();
  const handlePostComment = async () => {
    if (!loading && newComment) {
      setLoading(true);
      const {url} =
        replyToType == ReplyToType.Comment
          ? apis.comment.comment(replyToObject.id)
          : replyToType == ReplyToType.Post
          ? apis.comment.post(replyToObject.id)
          : apis.comment.drawEvent(replyToObject.id);
      const {data} = await postPromiseFnWithToken({
        url,
        body: {
          content: newComment,
        },
      });
      if (data.success) {
        onSuccess(data.comment, replyToObject, replyToType);
        setNewComment('');
      }
      setLoading(false);
    }
  };
  return (
    <Div
      bottom0
      absolute
      zIndex={100}
      bgWhite
      w={'100%'}
      borderTop={0.5}
      borderColor={varStyle.gray200}>
      {replyToType == ReplyToType.Comment && (
        <Row itemsCenter bgGray200 py5 px15>
          <Col></Col>
          <Col itemsCenter auto>
            <Span>{getNftName(replyToObject.nft)} 에게 답변중</Span>
          </Col>
          <Col itemsEnd onPress={onPressExitReplyToComment}>
            <X width={20} height={20} color={Colors.black} />
          </Col>
        </Row>
      )}
      <Div px15 py10>
        <TextField
          w={'100%'}
          h={commentHeight}
          px8
          autoFocus={autoFocus == true ? autoFocus : null}
          placeholder={'댓글을 달아주세요'}
          value={newComment}
          onChangeText={handleCommentChange}
          onContentSizeChange={event => {
            if (event.nativeEvent.contentSize.height > 40)
              setCommentHeight(event.nativeEvent.contentSize.height);
            else setCommentHeight(33);
          }}
          newLineButton={true}
          onSubmitEditing={handlePostComment}
          leftComp={
            <Img
              mr10
              rounded100
              h={30}
              w={30}
              uri={getNftProfileImage(currentNft, 100, 100)}
            />
          }
          rightComp={
            <Div ml10 onPress={handlePostComment}>
              {loading ? (
                <Span>
                  <ActivityIndicator></ActivityIndicator>
                </Span>
              ) : (
                <Span
                  medium
                  fontSize={14}
                  primary={newComment}
                  gray400={!newComment}>
                  전송
                </Span>
              )}
            </Div>
          }
          autoCapitalize="none"
        />
      </Div>
    </Div>
  );
}
