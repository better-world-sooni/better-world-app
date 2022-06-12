import {Heart} from 'react-native-feather';
import Colors from 'src/constants/Colors';
import useLike, {LikableType} from 'src/hooks/useLike';
import apis from 'src/modules/apis';
import React from 'react';
import {getNftName, getNftProfileImage} from 'src/modules/nftUtils';
import {createdAtText} from 'src/modules/timeUtils';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';
import {
  useGotoLikeList,
  useGotoNftProfile,
  useGotoPost,
  useGotoProfile,
} from 'src/hooks/useGoto';
import {LikeListType} from 'src/screens/LikeListScreen';

export default function Comment({
  comment,
  hot = false,
  nested = false,
  onPressReplyTo = comment => {},
}) {
  return (
    <CommentMemo
      {...comment}
      nftContractAddress={comment.nft.contract_address}
      nftTokenId={comment.nft.token_id}
      nftName={comment.nft.name}
      nftMetadatumName={comment.nft.nft_metadatum.name}
      hot={hot}
      nftImageUri={getNftProfileImage(comment.nft, 50, 50)}
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
  nftContractAddress,
  nftTokenId,
  nftImageUri,
  nftName,
  nftMetadatumName,
  updated_at,
  hot,
  nested = false,
  onPressReplyTo = comment => {},
}) {
  const [liked, likesCount, handlePressLike] = useLike(
    is_liked,
    likes_count,
    LikableType.Comment,
    id,
  );
  const cachedComments = comments || [];
  const profileImageSize = nested ? 25 : 30;
  const heartSize = hot ? 15 : 15;
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
    onPressReplyTo({id, is_liked, comments, nft: {name: nftName}});
  };
  const goToProfile = useGotoNftProfile({
    nft: {
      contract_address: nftContractAddress,
      token_id: nftTokenId,
      name: nftName,
      image_uri: nftImageUri,
      nft_metadatum: {
        name: nftMetadatumName,
      },
    },
  });
  const gotoLikeList = useGotoLikeList({
    likableId: id,
    likableType: LikeListType.Comment,
  });
  return (
    <Div py3={!nested}>
      <Row py6 mr15 ml16 pl16 rounded10 borderGray200>
        <Col auto mr10 onPress={goToProfile}>
          <Img
            rounded={100}
            h={profileImageSize}
            w={profileImageSize}
            uri={nftImageUri}
          />
        </Col>
        <Col>
          <Row>
            <Col mr10>
              <Span>
                <Span bold fontSize={14} onPress={goToProfile}>
                  {nftName || nftMetadatumName}{' '}
                </Span>{' '}
                <Span fontSize={14}>{content}</Span>
              </Span>
            </Col>
            <Col auto onPress={handlePressLike} mt4={hot}>
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
                <Span fontSize={12} gray600 onPress={gotoLikeList}>
                  좋아요 {likesCount}개
                </Span>
              </Col>
            ) : null}
            {!nested && !hot ? (
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
