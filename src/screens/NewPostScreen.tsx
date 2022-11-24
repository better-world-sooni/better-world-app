import React from 'react';
import {Div} from 'src/components/common/Div';
import {HAS_NOTCH} from 'src/modules/constants';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Feather,
  Film,
  Image,
  Upload,
  Zap,
} from 'react-native-feather';
import apis from 'src/modules/apis';
import {Img} from 'src/components/common/Img';
import {useNavigation} from '@react-navigation/native';
import {getNftName, getNftProfileImage} from 'src/utils/nftUtils';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {Span} from 'src/components/common/Span';
import {createdAtText} from 'src/utils/timeUtils';
import useUploadPost from 'src/hooks/useUploadPost';
import UploadImageSlideShow from 'src/components/common/UploadImageSlideShow';
import {
  KeyboardAvoidingView,
  TextInput,
} from 'src/components/common/ViewComponents';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
import {ActivityIndicator, Platform} from 'react-native';
import {MenuView} from '@react-native-menu/menu';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {CustomBlurView} from 'src/components/common/CustomBlurView';
import {Colors} from 'src/modules/styles';
import useAutoFocusRef from 'src/hooks/useAutoFocusRef';
import RepostedPost from 'src/components/common/RepostedPost';
import CollectionEvent from 'src/components/common/CollectionEvent';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import RepostedTransaction from 'src/components/common/RepostedTransaction';
import {ICONS} from 'src/modules/icons';
import Video from 'react-native-video';
import RepostedDrawEvent from 'src/components/common/RepostedDrawEvent';

const postTypes = [
  {
    id: '',
    title: '게시물',
  },
  {
    id: 'Proposal',
    title: '제안',
  },
];

export enum PostOwnerType {
  Nft,
  NftCollection,
}

export enum PostType {
  Default = '',
  Proposal = 'Proposal',
}

const NewPostScreen = ({
  route: {
    params: {
      postOwnerType,
      repostable,
      collectionEvent,
      transaction,
      postType,
      repostDrawEvent,
    },
  },
}) => {
  const autoFocusRef = useAutoFocusRef();
  const {goBack} = useNavigation();
  const reloadGetWithToken = useReloadGETWithToken();
  const {currentNft} = useSelector(
    (root: RootState) => ({
      currentNft: root.app.session.currentNft,
      admin: postOwnerIsCollection,
    }),
    shallowEqual,
  );
  const {data: nftCollectionData, isLoading: nftCollectionLoading} =
    useApiSelector(apis.nft_collection._());
  const postOwnerIsCollection = postOwnerType == PostOwnerType.NftCollection;
  const uploadSuccessCallback = () => {
    reloadGetWithToken(
      postOwnerIsCollection
        ? apis.post.list.nftCollection(currentNft.contract_address)
        : apis.post.list._(),
    );
    reloadGetWithToken(apis.feed.forum());
    reloadGetWithToken(apis.feed.social());
    goBack();
  };
  const {
    error,
    loading,
    addImages,
    setAddImages,
    currentPostType,
    setPostType,
    votingDeadline,
    setVotingDeadline,
    content,
    handleContentChange,
    images,
    video,
    handleAddImages,
    handleAddVideo,
    handleRemoveImage,
    handleRemoveVideo,
    uploadPost,
  } = useUploadPost({
    initialPostType: postType,
  });

  const handlePressUpload = () => {
    uploadPost({
      admin: postOwnerIsCollection,
      uploadSuccessCallback,
      repostId: repostable?.id,
      repostDrawEventId: repostDrawEvent?.id,
      collectionEventId: collectionEvent?.id,
      transactionHash: transaction?.transaction_hash,
    });
  };

  const handlePressMenu = ({nativeEvent: {event}}) => {
    setPostType(event);
  };

  const postOwner = postOwnerIsCollection
    ? nftCollectionData?.nft_collection
    : currentNft;

  const textInputPlaceholder = postOwnerIsCollection
    ? `${getNftName(postOwner)} 멤버들에게...`
    : currentPostType == 'Proposal'
    ? `${getNftName(postOwner)} 생각에는...`
    : `${getNftName(postOwner)}은(는) 지금...`;

  const translationY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translationY.value = event.contentOffset.y;
  });
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
  const headerStyles = useAnimatedStyle(() => {
    return {
      width: DEVICE_WIDTH,
      height: headerHeight,
      opacity: Math.min(translationY.value / 50, 1),
    };
  });
  const sliderWidth = DEVICE_WIDTH - 47 - 30;
  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        flex={1}
        bgWhite
        relative>
        <Div h={headerHeight} zIndex={100} borderBottom={0.5} borderGray200>
          <Animated.View style={headerStyles}>
            <CustomBlurView
              blurType="xlight"
              blurAmount={30}
              blurRadius={20}
              overlayColor=""
              style={{
                width: DEVICE_WIDTH,
                height: '100%',
                position: 'absolute',
              }}></CustomBlurView>
          </Animated.View>
          <Div zIndex={100} absolute w={DEVICE_WIDTH} top={notchHeight + 5}>
            <Row itemsCenter py5 h40 px15>
              <Col itemsStart>
                <Div auto rounded100 onPress={goBack}>
                  <ChevronLeft
                    width={22}
                    height={22}
                    color={Colors.black}
                    strokeWidth={2}
                  />
                </Div>
              </Col>
              <Col></Col>
              <Col itemsEnd onPress={handlePressUpload}>
                {loading ? (
                  <ActivityIndicator />
                ) : (
                  <Span bold info fontSize={16}>
                    {'게시'}
                  </Span>
                )}
              </Col>
            </Row>
          </Div>
        </Div>
        <Animated.ScrollView
          onScroll={scrollHandler}
          keyboardShouldPersistTaps="always">
          {error ? (
            <Div px15 mt10>
              <Span notice danger>
                {error}
              </Span>
            </Div>
          ) : null}
          <Row px15 p13>
            <Col auto mr10>
              <Div>
                <Img
                  w47
                  h47
                  rounded100
                  uri={getNftProfileImage(postOwner, 100, 100)}
                />
              </Div>
            </Col>
            <Col>
              <Row>
                <Col auto>
                  <Span>
                    <Span fontSize={15} bold>
                      {getNftName(postOwner)}{' '}
                    </Span>
                    {!postOwnerIsCollection ? (
                      currentNft.token_id &&
                      currentNft.nft_metadatum.name !=
                        getNftName(currentNft) && (
                        <Span fontSize={12} gray700 bold>
                          {' '}
                          {currentNft.nft_metadatum.name}
                        </Span>
                      )
                    ) : (
                      <Img source={ICONS.sealCheck} h15 w15></Img>
                    )}
                    <Span fontSize={12} gray700>
                      {' · '}
                      {createdAtText(new Date())}
                    </Span>
                  </Span>
                </Col>
                <Col />
              </Row>
              <Row>
                <TextInput
                  innerRef={autoFocusRef}
                  value={content}
                  placeholder={textInputPlaceholder}
                  fontSize={16}
                  w={'100%'}
                  h={'100%'}
                  multiline
                  bold
                  onChangeText={handleContentChange}></TextInput>
              </Row>
              {transaction && <RepostedTransaction transaction={transaction} />}
              {repostable && <RepostedPost repostedPost={repostable} />}
              {repostDrawEvent && (
                <RepostedDrawEvent repostedDrawEvent={repostDrawEvent} />
              )}
              {addImages && (
                <Div mt8>
                  <UploadImageSlideShow
                    sliderWidth={sliderWidth}
                    images={[...images, {uri: null}]}
                    onPressAdd={handleAddImages}
                    onPressRemove={handleRemoveImage}
                  />
                </Div>
              )}
              {video && (
                <Div mt8 rounded10 borderGray200 border={0.5}>
                  <Video
                    source={video}
                    style={{
                      width: sliderWidth,
                      height: (sliderWidth * video.height) / video.width,
                    }}
                    repeat
                  />
                </Div>
              )}
              {collectionEvent && (
                <Div mt8>
                  <CollectionEvent
                    collectionEvent={collectionEvent}
                    reposted
                    itemWidth={sliderWidth}
                  />
                </Div>
              )}
            </Col>
          </Row>
        </Animated.ScrollView>
        <Row px15 py8 borderTop={0.5} borderGray200>
          <Col />
          <Col auto>
            <Row
              itemsCenter
              onPress={() => (video ? handleRemoveVideo() : handleAddVideo())}
              border={0.5}
              rounded10
              borderGray200
              p9>
              <Col auto mr10>
                <Film
                  strokeWidth={2}
                  color={addImages ? Colors.gray[400] : Colors.black}
                  height={22}
                  width={22}></Film>
              </Col>
              <Col auto>
                <Span color={addImages ? Colors.gray[400] : Colors.black} bold>
                  비디오 {video ? '제거' : '추가'}
                </Span>
              </Col>
            </Row>
          </Col>
          <Col auto ml10>
            <Row
              itemsCenter
              onPress={() => setAddImages(prev => !prev)}
              border={0.5}
              rounded10
              borderGray200
              p9>
              <Col auto mr10>
                <Image
                  strokeWidth={2}
                  color={video ? Colors.gray[400] : Colors.black}
                  height={22}
                  width={22}></Image>
              </Col>
              <Col auto>
                <Span color={video ? Colors.gray[400] : Colors.black} bold>
                  이미지 {addImages ? '제거' : '추가'}
                </Span>
              </Col>
            </Row>
          </Col>
        </Row>
      </KeyboardAvoidingView>
      <Div h={HAS_NOTCH ? 27 : 0} bgWhite />
    </>
  );
};

export default NewPostScreen;
