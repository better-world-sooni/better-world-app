import React, {useEffect, useRef} from 'react';
import {Div} from 'src/components/common/Div';
import {HAS_NOTCH} from 'src/modules/constants';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {
  ChevronDown,
  ChevronLeft,
  Image,
  MoreHorizontal,
} from 'react-native-feather';
import apis from 'src/modules/apis';
import {Img} from 'src/components/common/Img';
import {useNavigation} from '@react-navigation/native';
import {getNftName, getNftProfileImage} from 'src/modules/nftUtils';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {Span} from 'src/components/common/Span';
import {createdAtText} from 'src/modules/timeUtils';
import useUploadPost from 'src/hooks/useUploadPost';
import UploadImageSlideShow from 'src/components/common/UploadImageSlideShow';
import {
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
} from 'src/modules/viewComponents';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
import {ActivityIndicator, Platform} from 'react-native';
import {MenuView} from '@react-native-menu/menu';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {DEVICE_HEIGHT, DEVICE_WIDTH} from 'src/modules/styles';
import {BlurView} from '@react-native-community/blur';
import {CustomBlurView} from 'src/components/common/CustomBlurView';
import Colors from 'src/constants/Colors';
import useAutoFocusRef from 'src/hooks/useAutoFocusRef';
import TruncatedText from 'src/components/common/TruncatedText';
import RepostedPost from 'src/components/common/RepostedPost';
import CollectionEvent from 'src/components/common/CollectionEvent';

const postTypes = [
  {
    id: '',
    title: '기본',
  },
  {
    id: 'Proposal',
    title: '투표',
  },
  {
    id: 'Forum',
    title: '포럼',
  },
];

export enum PostOwnerType {
  Nft,
  NftCollection,
}

const NewPostScreen = ({
  route: {
    params: {postOwnerType, repostable, collectionEvent},
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
    useApiSelector(
      apis.nft_collection.contractAddress.profile(currentNft.contract_address),
    );
  const postOwnerIsCollection = postOwnerType == PostOwnerType.NftCollection;
  const uploadSuccessCallback = () => {
    reloadGetWithToken(
      postOwnerIsCollection
        ? apis.post.list.nftCollection(currentNft.contract_address)
        : apis.post.list._(),
    );
    reloadGetWithToken(apis.feed._());
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
    handleAddImages,
    handleRemoveImage,
    uploadPost,
  } = useUploadPost({
    initialPostType: repostable?.type == 'Forum' ? 'Proposal' : '',
  });

  const handlePressUpload = () => {
    uploadPost({
      admin: postOwnerIsCollection,
      uploadSuccessCallback,
      repostId: repostable?.id,
      collectionEventId: collectionEvent?.id,
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
  const notchHeight = HAS_NOTCH ? 44 : 0;
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
          <Div zIndex={100} absolute w={DEVICE_WIDTH} top={notchHeight+5}>
            <Row itemsCenter py5 h40 px15>
              <Col itemsStart>
                <Div auto rounded100 onPress={goBack}>
                  <ChevronLeft height={30} color="black" strokeWidth={2} />
                </Div>
              </Col>
              <Col auto></Col>
              <Col itemsEnd>
                <Div onPress={handlePressUpload}>
                  <Span info bold fontSize={16}>
                    {loading ? <ActivityIndicator /> : '게시'}
                  </Span>
                </Div>
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
                    <Span fontSize={14} bold>
                      {getNftName(postOwner)}{' '}
                    </Span>
                    {!postOwnerIsCollection &&
                      currentNft.token_id &&
                      currentNft.nft_metadatum.name !=
                        getNftName(currentNft) && (
                        <Span fontSize={14} gray700>
                          {' '}
                          {currentNft.nft_metadatum.name}
                        </Span>
                      )}
                    <Span fontSize={14} gray700>
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
              {repostable && <RepostedPost repostedPost={repostable} />}
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
        <Row px15 py15 borderTop={0.5} borderGray200>
          <Col />
          <Col auto>
            <Row itemsCenter onPress={() => setAddImages(prev => !prev)}>
              <Col auto mr10>
                <Image
                  strokeWidth={1.7}
                  color={addImages ? Colors.danger.DEFAULT : 'black'}
                  height={24}
                  width={24}></Image>
              </Col>
              <Col auto>
                <Span color={addImages ? Colors.danger.DEFAULT : 'black'}>
                  이미지 {addImages ? '제거' : '추가'}
                </Span>
              </Col>
            </Row>
          </Col>
          {postOwnerIsCollection && (
            <Col auto ml10>
              <MenuView onPressAction={handlePressMenu} actions={postTypes}>
                <Row itemsCenter>
                  <Col auto mr5>
                    <ChevronDown color={'black'} height={24} width={24} />
                  </Col>
                  <Col auto>
                    <Span>
                      {
                        postTypes.filter(
                          postType => postType.id == currentPostType,
                        )[0].title
                      }
                    </Span>
                  </Col>
                </Row>
              </MenuView>
            </Col>
          )}
        </Row>
      </KeyboardAvoidingView>
      <Div h={HAS_NOTCH ? 27 : 12} bgWhite />
    </>
  );
};

export default NewPostScreen;
