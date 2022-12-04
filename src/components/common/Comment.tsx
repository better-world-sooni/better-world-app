import {Heart, Trash} from 'react-native-feather';
import {Colors, DEVICE_WIDTH} from 'src/modules/styles';
import useLike, {LikableType} from 'src/hooks/useLike';
import apis from 'src/modules/apis';
import React, {useRef, useState} from 'react';
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
import {usePromiseFnWithToken} from 'src/redux/asyncReducer';
import SideMenu from 'react-native-side-menu-updated';
import {Swipeable} from 'react-native-gesture-handler';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import Animated, {FadeIn, FadeOut, Layout} from 'react-native-reanimated';
import {Animated as DefaultAnimated} from 'react-native';

export default function Comment({
  comment,
  hot = false,
  nested = false,
  onPressReplyTo = comment => {},
  resetReplyTo = () => {},
  handleDeleteComment = id => {},
  key,
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
          resetReplyTo={resetReplyTo}
          handleDeleteComment={handleDeleteComment}
          key={key}
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
  key,
  nested = false,
  onPressReplyTo = comment => {},
  resetReplyTo = () => {},
  handleDeleteComment = id => {},
}) {
  const [liked, likesCount, handlePressLike] = useLike(
    is_liked,
    likes_count,
    LikableType.Comment,
    id,
  );
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const isCurrentNft =
    currentNft.contract_address == nftContractAddress &&
    currentNft.token_id == nftTokenId;
  const [loading, setLoading] = useState(false);
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
  const ref = useRef(null);
  const promiseFnWithToken = usePromiseFnWithToken();
  const handleRemoveComment = async () => {
    if (loading) return;
    setLoading(true);
    resetReplyTo();
    try {
      const {data} = await promiseFnWithToken({
        url: apis.comment._(id).url,
        method: 'DELETE',
      });
      if (!data?.success) {
        setLoading(false);
        ref.current?.close();
        return;
      }
    } catch (e) {
      setLoading(false);
      ref.current?.close();
      return;
    }
    setLoading(false);
    handleDeleteComment(id);
    return;
  };
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
    <Animated.View entering={FadeIn} exiting={FadeOut} layout={Layout}>
      {isCurrentNft ? (
        <Swipeable
          ref={ref}
          renderRightActions={RightSwipeActions}
          onSwipeableRightOpen={handleRemoveComment}>
          <Row
            py8={!nested}
            py6={nested}
            pr15
            pl16={!nested}
            pl56={nested}
            borderGray200
            bgWhite>
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
                  <Row mt8={!nested || likesCount > 0} ml3 auto>
                    {!nested && (
                      <Col auto onPress={handlePressReplyTo} pr10>
                        <Span fontSize={12} gray600>
                          답글 달기
                        </Span>
                      </Col>
                    )}
                    {likesCount > 0 && (
                      <Col auto onPress={gotoLikeList}>
                        <Span fontSize={12} gray600>
                          {'좋아요 ' + likesCount + '개'}
                        </Span>
                      </Col>
                    )}
                  </Row>
                </Col>
                <Col auto onPress={handlePressLike} mt4>
                  <Heart {...heartProps}></Heart>
                </Col>
              </Row>
            </Col>
          </Row>
        </Swipeable>
      ) : (
        <Row
          py8={!nested}
          py6={nested}
          pr15
          pl16={!nested}
          pl56={nested}
          borderGray200
          bgWhite>
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
                <Row mt8={!nested || likesCount > 0} ml3 auto>
                  {!nested && (
                    <Col auto onPress={handlePressReplyTo} pr10>
                      <Span fontSize={12} gray600>
                        답글 달기
                      </Span>
                    </Col>
                  )}
                  {likesCount > 0 && (
                    <Col auto onPress={gotoLikeList}>
                      <Span fontSize={12} gray600>
                        {'좋아요 ' + likesCount + '개'}
                      </Span>
                    </Col>
                  )}
                </Row>
              </Col>
              <Col auto onPress={handlePressLike} mt4>
                <Heart {...heartProps}></Heart>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
      {cachedComments.map(nestedComment => {
        return (
          <Comment
            nested
            key={nestedComment.id}
            comment={nestedComment}
            resetReplyTo={resetReplyTo}
            handleDeleteComment={handleDeleteComment}
          />
        );
      })}
    </Animated.View>
  );
}

const RightSwipeActions = progress => {
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -DEVICE_WIDTH * 0.5],
  });
  const scale = progress.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 1, 1],
  });
  const trashIconContainerStyle = {
    width: 20,
    height: 20,
    marginRight: -10,
    transform: [
      {
        translateX: translateX,
      },
    ],
  };
  const trashIconScaleStyle = {
    width: 20,
    height: 20,
    transform: [
      {
        scale: scale,
      },
    ],
  };
  return (
    <Div flex={1} bg={Colors.danger.DEFAULT} justifyCenter itemsEnd>
      <DefaultAnimated.View style={trashIconContainerStyle}>
        <DefaultAnimated.View style={trashIconScaleStyle}>
          <Trash
            width={20}
            height={20}
            color={Colors.white}
            strokeWidth={2}
            style={{marginRight: 10}}
          />
        </DefaultAnimated.View>
      </DefaultAnimated.View>
    </Div>
  );
};
