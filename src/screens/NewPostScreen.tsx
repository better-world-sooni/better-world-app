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
import {ActivityIndicator} from 'react-native';
import {MenuView} from '@react-native-menu/menu';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {DEVICE_HEIGHT, DEVICE_WIDTH} from 'src/modules/styles';
import {BlurView} from '@react-native-community/blur';
import Colors from 'src/constants/Colors';
import useAutoFocusRef from 'src/hooks/useAutoFocusRef';

const postTypes = [
  {
    id: '',
    title: '기본',
  },
  {
    id: 'Proposal',
    title: '투표',
  },
];

export enum PostOwnerType {
  Nft,
  NftCollection,
}

const NewPostScreen = ({
  route: {
    params: {postOwnerType},
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
        ? apis.nft_collection.contractAddress.profile(
            currentNft.contract_address,
          )
        : apis.nft._(),
    );
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
  } = useUploadPost();

  const handlePressUpload = () => {
    uploadPost({
      admin: postOwnerIsCollection,
      uploadSuccessCallback,
    });
  };

  const handlePressMenu = ({nativeEvent: {event}}) => {
    setPostType(event);
  };

  const postOwner = postOwnerIsCollection
    ? nftCollectionData?.nft_collection
    : currentNft;

  const translationY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translationY.value = event.contentOffset.y;
  });
  const headerHeight = HAS_NOTCH ? 94 : 70;
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
      <KeyboardAvoidingView behavior="padding" flex={1} bgWhite relative>
        <Div h={headerHeight} zIndex={100} borderBottom={0.5} borderGray200>
          <Animated.View style={headerStyles}>
            <BlurView
              blurType="xlight"
              blurAmount={30}
              blurRadius={20}
              style={{
                width: DEVICE_WIDTH,
                height: '100%',
                position: 'absolute',
              }}
              reducedTransparencyFallbackColor="white"></BlurView>
          </Animated.View>
          <Div zIndex={100} absolute w={DEVICE_WIDTH} top={HAS_NOTCH ? 49 : 25}>
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
                  uri={getNftProfileImage(currentNft, 100, 100)}
                />
              </Div>
            </Col>
            <Col>
              <Row>
                <Col auto>
                  <Span>
                    <Span fontSize={14} bold>
                      {getNftName(currentNft)}{' '}
                    </Span>{' '}
                    {currentNft.token_id &&
                      currentNft.nft_metadatum.name !=
                        getNftName(currentNft) && (
                        <Span fontSize={12} gray700>
                          {currentNft.nft_metadatum.name}
                          {' · '}
                        </Span>
                      )}
                    <Span fontSize={12} gray700>
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
                  placeholder={'마크다운을 사용하실 수 있습니다.'}
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
