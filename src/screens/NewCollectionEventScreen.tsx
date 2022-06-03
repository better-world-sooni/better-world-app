import React, {useEffect, useRef, useState} from 'react';
import {Div} from 'src/components/common/Div';
import {HAS_NOTCH, kmoment} from 'src/modules/constants';
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
import TruncatedText from 'src/components/common/TruncatedText';
import RepostedPost from 'src/components/common/RepostedPost';
import useUploadCollectionEvent from 'src/hooks/useUploadCollectionEvent';
import DatePicker from 'react-native-date-picker';

const postTypes = [
  {
    id: '',
    title: '모두',
  },
  {
    id: '홀더',
    title: '홀더',
  },
];

const NewCollectionEventScreen = ({
  route: {
    params: {nftCollection},
  },
}) => {
  const autoFocusRef = useAutoFocusRef();
  const {goBack} = useNavigation();
  const reloadGetWithToken = useReloadGETWithToken();
  const [startTimeOpen, setStartTimeOpen] = useState(false);
  const [endTimeOpen, setEndTimeOpen] = useState(false);
  const {currentNft} = useSelector(
    (root: RootState) => ({
      currentNft: root.app.session.currentNft,
    }),
    shallowEqual,
  );
  const uploadSuccessCallback = () => {
    reloadGetWithToken(
      apis.collectionEvent.contractAddress.list(nftCollection.contract_address),
    );
    goBack();
  };
  const {
    error,
    loading,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    locationString,
    setLocationString,
    locationLink,
    setLocationLink,
    holderOnly,
    setHolderOnly,
    title,
    handleTitleChange,
    description,
    handleDescriptionChange,
    images,
    handleAddImages,
    handleRemoveImage,
    uploadCollectionEvent,
  } = useUploadCollectionEvent();

  const handlePressUpload = () => {
    uploadCollectionEvent({
      uploadSuccessCallback,
    });
  };

  const handlePressMenu = ({nativeEvent: {event}}) => {
    // setPostType(event);
    if (event == '') setHolderOnly(false);
    if (event == '홀더') setHolderOnly(true);
  };

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
          <Div mt8 mx15 overflowHidden rounded10 border={0.5} borderGray200>
            <Div relative>
              <UploadImageSlideShow
                sliderWidth={DEVICE_WIDTH - 30}
                images={[...images, {uri: null}]}
                onPressAdd={handleAddImages}
                onPressRemove={handleRemoveImage}
                disablePagination
              />
              <Row bottom0 absolute w={'100%'} itemsEnd>
                <Div bottom0 absolute w={'100%'} h70 bgWhite itemsEnd></Div>
                <Col auto ml15>
                  <Img
                    border3
                    borderWhite
                    rounded100
                    h100
                    w100
                    uri={getNftProfileImage(nftCollection)}></Img>
                </Col>
                <Col relative ml8 mr15 mb8nj>
                  <Div>
                    <Div zIndex={100}>
                      <TextInput
                        innerRef={autoFocusRef}
                        value={title}
                        placeholder={'제목'}
                        fontSize={16}
                        w={'100%'}
                        style={{fontWeight: 'bold'}}
                        onChangeText={handleTitleChange}></TextInput>
                    </Div>
                    <Div mt4 zIndex={100}>
                      <TextInput
                        value={locationString}
                        placeholder={'위치'}
                        fontSize={12}
                        w={'100%'}
                        style={{fontWeight: 'bold', color: Colors.gray[700]}}
                        onChangeText={setLocationString}></TextInput>
                    </Div>
                    <Div mt4>
                      <Span gray700 numberOfLines={1} ellipsizeMode="tail">
                        <Span
                          bold
                          fontSize={12}
                          onPress={() => setStartTimeOpen(true)}>
                          {kmoment(startTime).format('YY.M.D a h:mm')}
                        </Span>{' '}
                        <Span bold fontSize={12}>
                          ~
                        </Span>{' '}
                        <Span
                          bold
                          fontSize={12}
                          onPress={() => setEndTimeOpen(true)}>
                          {kmoment(endTime).format('YY.M.D a h:mm')}
                        </Span>
                      </Span>
                    </Div>
                  </Div>
                </Col>
              </Row>
            </Div>
            <Div px15 py8>
              <Row itemsCenter>
                <TextInput
                  value={locationLink}
                  placeholder={'위치 링크'}
                  fontSize={14}
                  w={'100%'}
                  style={{color: Colors.info.DEFAULT}}
                  onChangeText={setLocationLink}></TextInput>
              </Row>
              <Row my8>
                <TextInput
                  value={description}
                  placeholder={'설명'}
                  fontSize={14}
                  w={'100%'}
                  bold
                  onChangeText={handleDescriptionChange}></TextInput>
              </Row>
              <Row>
                <MenuView onPressAction={handlePressMenu} actions={postTypes}>
                  <Span fontSize={14}>
                    {holderOnly ? '홀더에게 오픈' : '모두에게 오픈'}
                  </Span>
                </MenuView>
              </Row>
            </Div>
          </Div>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
      <DatePicker
        modal
        title={'시작 시간 선택'}
        open={startTimeOpen}
        mode="datetime"
        minuteInterval={15}
        androidVariant="iosClone"
        date={startTime}
        onConfirm={date => {
          setStartTimeOpen(false);
          setStartTime(date);
        }}
        onCancel={() => {
          setStartTimeOpen(false);
        }}
      />
      <DatePicker
        modal
        title={'마감 시간 선택'}
        open={endTimeOpen}
        mode="datetime"
        minuteInterval={15}
        androidVariant="iosClone"
        date={endTime}
        onConfirm={date => {
          setEndTimeOpen(false);
          setEndTime(date);
        }}
        onCancel={() => {
          setEndTimeOpen(false);
        }}
      />
      <Div h={HAS_NOTCH ? 27 : 12} bgWhite />
    </>
  );
};

export default NewCollectionEventScreen;
