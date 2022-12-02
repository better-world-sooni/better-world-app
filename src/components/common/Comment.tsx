import {Heart} from 'react-native-feather';
import {Colors} from 'src/modules/styles';
import useLike, {LikableType} from 'src/hooks/useLike';
import apis from 'src/modules/apis';
import React from 'react';
import {getNftName, getNftProfileImage} from 'src/utils/nftUtils';
import {createdAtText} from 'src/utils/timeUtils';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';
import {useGotoLikeList, useGotoNftProfile} from 'src/hooks/useGoto';
import {LikeListType} from 'src/screens/LikeListScreen';
import TruncatedText from './TruncatedText';

export default function Comment({
  comment,
  hot = false,
  nested = false,
  onPressReplyTo = comment => {},
}) {
  return (
    <>
      {comment.nft && (
        <CommentMemo
          {...comment}
          nftContractAddress={comment.nft.contract_address}
          nftTokenId={comment.nft.token_id}
          nftName={comment.nft.name}
          nftMetadatumName={comment.nft.nft_metadatum.name}
          hot={hot}
          nftImageUri={getNftProfileImage(comment.nft, 100, 100)}
          nested={nested}
          onPressReplyTo={onPressReplyTo}
        />
      )}
    </>
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
  const profileImageSize = nested ? 25 : 36;
  const heartSize = hot ? 15 : 15;
  const defaultProps = {
    width: heartSize,
    height: heartSize,
    color: Colors.gray[600],
    strokeWidth: 2,
  };
  const heartProps = liked
    ? {
        ...defaultProps,
        fill: Colors.danger.DEFAULT,
        color: Colors.danger.DEFAULT,
      }
    : defaultProps;
  const handlePressReplyTo = () => {
    onPressReplyTo({
      id,
      is_liked,
      comments,
      nft: {
        name: nftName,
        nft_metadatum: {
          name: nftMetadatumName,
        },
      },
    });
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
  return hot ? (
    <Div py2>
      <Row py6 mr15 ml16 rounded10 borderGray200>
        <Col auto ml1 mr12 onPress={() => goToProfile()}>
          <Div w={profileImageSize}></Div>
        </Col>
        <Col>
          <Row itemsCenter>
            <Col auto>
              <Div mr6>
                <Img rounded={100} h={20} w={20} uri={nftImageUri} />
              </Div>
            </Col>
            <Col mr10>
              <Span>
                <Span bold fontSize={13} onPress={() => goToProfile()}>
                  {nftName || nftMetadatumName}{' '}
                </Span>{' '}
                <Span
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  fontSize={13}
                  gray700>
                  {content}
                </Span>
              </Span>
            </Col>
          </Row>
        </Col>
      </Row>
    </Div>
  ) : (
    <Div py2={!nested}>
      <Row py6 mr15 ml16 rounded10 borderGray200>
        <Col auto mr12 onPress={() => goToProfile()}>
          <Img
            rounded={100}
            h={profileImageSize}
            w={profileImageSize}
            uri={nftImageUri}
          />
        </Col>
        <Col>
          <Row itemsCenter>
            <Col mr10>
              <Row itemsCenter>
                <Span bold fontSize={14} onPress={() => goToProfile()}>
                  {nftName || nftMetadatumName}{' '}
                </Span>
                <Row itemsCenter ml5>
                  <Col auto mr10>
                    <Span fontSize={12} gray600>
                      {createdAtText(updated_at)}
                    </Span>
                  </Col>
                </Row>
              </Row>
              <Col mt5 ml3>
                <Span fontSize={14} gray700>
                  {content}
                </Span>
              </Col>
              {!nested ? (
                <Row mt8 ml3 auto>
                  <Col auto onPress={handlePressReplyTo} pr10>
                    <Span fontSize={12} gray600>
                      답글 달기
                    </Span>
                  </Col>
                  {likesCount > 0 && (
                    <Col auto onPress={gotoLikeList}>
                      <Span fontSize={12} gray600>
                        {'좋아요 ' + likesCount + '개'}
                      </Span>
                    </Col>
                  )}
                </Row>
              ) : null}
            </Col>
            <Col auto onPress={handlePressLike} mt4>
              <Heart {...heartProps}></Heart>
            </Col>
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
