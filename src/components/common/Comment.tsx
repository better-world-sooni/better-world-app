import {Heart} from 'react-native-feather';
import Colors from 'src/constants/Colors';
import useLike from 'src/hooks/useLike';
import apis from 'src/modules/apis';
import React from 'react';
import {getNftName, getNftProfileImage} from 'src/modules/nftUtils';
import {createdAtText} from 'src/modules/timeUtils';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';

export default function Comment({
  comment,
  nested = false,
  onPressReplyTo = comment => {},
}) {
  return (
    <CommentMemo
      {...comment}
      nftId={comment.nft.id}
      nftName={getNftName(comment.nft)}
      nftImageUri={getNftProfileImage(comment.nft)}
      nested={nested}
      onPressReplyTo={onPressReplyTo}
    />
  );
}

const CommentMemo = React.memo(CommentContent);

function CommentContent({
  id,
  is_liked,
  likes_count,
  comments,
  content,
  nftId,
  nftImageUri,
  nftName,
  updated_at,
  nested = false,
  onPressReplyTo = comment => {},
}) {
  const [liked, likesCount, handlePressLike] = useLike(
    is_liked,
    likes_count,
    apis.like.comment(id).url,
  );
  const cachedComments = comments || [];
  const profileImageSize = nested ? 22 : 30;
  const roundedSize = nested ? 8 : 10;
  const heartSize = 15;
  const heartProps = liked
    ? {
        fill: Colors.danger.DEFAULT,
        width: heartSize,
        height: heartSize,
        color: Colors.danger.DEFAULT,
        strokeWidth: 1.5,
      }
    : {width: heartSize, height: heartSize, color: 'black', strokeWidth: 1.5};
  const handlePressReplyTo = () => {
    onPressReplyTo({id, is_liked, comments, nft: {id: nftId, name: nftName}});
  };
  return (
    <Div>
      <Row py8 px15>
        <Col auto mr10>
          <Img
            rounded={roundedSize}
            h={profileImageSize}
            w={profileImageSize}
            uri={nftImageUri}
          />
        </Col>
        <Col>
          <Row>
            <Col mr10>
              <Span>
                <Span medium fontSize={14}>
                  {nftName}{' '}
                </Span>{' '}
                <Span fontSize={14}>{content}</Span>
              </Span>
            </Col>
            <Col auto onPress={handlePressLike}>
              <Heart {...heartProps}></Heart>
            </Col>
          </Row>
          <Row mt5>
            <Col auto mr10>
              <Span fontSize={12} gray600>
                {createdAtText(updated_at)}
              </Span>
            </Col>
            {likesCount > 0 ? (
              <Col auto mr10>
                <Span fontSize={12} gray600>
                  좋아요 {likesCount}개
                </Span>
              </Col>
            ) : null}
            {!nested ? (
              <Col auto onPress={handlePressReplyTo}>
                <Span fontSize={12} gray600>
                  답글 달기
                </Span>
              </Col>
            ) : null}
          </Row>
        </Col>
      </Row>
      <Div ml40>
        {cachedComments.map(nestedComment => {
          return (
            <Comment nested key={nestedComment.id} comment={nestedComment} />
          );
        })}
      </Div>
    </Div>
  );
}
