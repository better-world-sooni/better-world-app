import React from 'react';
import {Div} from 'src/components/common/Div';
import {HAS_NOTCH} from 'src/modules/constants';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {ChevronLeft, Upload} from 'react-native-feather';
import apis from 'src/modules/apis';
import {Img} from 'src/components/common/Img';
import {useNavigation} from '@react-navigation/native';
import {Span} from 'src/components/common/Span';
import {
  KeyboardAvoidingView,
  TextInput,
} from 'src/components/common/ViewComponents';
import {useReloadGETWithToken} from 'src/redux/asyncReducer';
import {ActivityIndicator, Platform} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {Colors, DEVICE_WIDTH} from 'src/modules/styles';
import {CustomBlurView} from 'src/components/common/CustomBlurView';
import useAutoFocusRef from 'src/hooks/useAutoFocusRef';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useCreateCommunityWallet from 'src/hooks/useCreateCommunityWallet';

export default function NewCommunityWalletScreen() {
  const autoFocusRef = useAutoFocusRef();
  const {goBack} = useNavigation();
  const reloadGetWithToken = useReloadGETWithToken();
  const uploadSuccessCallback = () => {
    reloadGetWithToken(apis.nft_collection.communityWallet.list());
    goBack();
  };
  const {
    error,
    loading,
    name,
    handleNameChange,
    about,
    handleAboutChange,
    address,
    handleAddressChange,
    image,
    handleAddImage,
    handleRemoveImage,
    uploading,
    createCommunityWallet,
  } = useCreateCommunityWallet();

  const handlePressUpload = () => {
    createCommunityWallet({
      uploadSuccessCallback,
    });
  };
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
  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        flex={1}
        bgWhite
        relative>
        <Div h={headerHeight} zIndex={100} borderBottom={0.5} borderGray200>
          <Div zIndex={100} absolute w={DEVICE_WIDTH} top={notchHeight + 5}>
            <Row itemsCenter py5 h40 px15>
              <Col itemsStart>
                <Div auto rounded100 onPress={goBack}>
                  <ChevronLeft
                    height={30}
                    color={Colors.black}
                    strokeWidth={2}
                  />
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
          <Div>
            <Div mt15>
              <Row itemsEnd>
                <Div h70 bgWhite itemsEnd></Div>
                <Col auto ml15>
                  <Div
                    rounded100
                    borderWhite
                    bgGray200
                    h75
                    w75
                    overflowHidden
                    onPress={handleAddImage}>
                    {image?.uri ? (
                      <Img
                        uri={image.uri}
                        top0
                        absolute
                        w={'100%'}
                        border3
                        borderWhite
                        h75
                        w75
                        rounded100></Img>
                    ) : (
                      <Div
                        flex={1}
                        itemsCenter
                        justifyCenter
                        bgGray200
                        rounded100>
                        <Div bgBlack p8 rounded100>
                          <Upload
                            strokeWidth={2}
                            color={Colors.white}
                            height={20}
                            width={20}
                          />
                        </Div>
                      </Div>
                    )}
                  </Div>
                </Col>
                <Col ml8 mr15>
                  <Div zIndex={100}>
                    <TextInput
                      innerRef={autoFocusRef}
                      value={name}
                      placeholder={'지갑 이름'}
                      fontSize={18}
                      w={'100%'}
                      style={{fontWeight: 'bold'}}
                      onChangeText={handleNameChange}></TextInput>
                  </Div>
                </Col>
              </Row>
            </Div>
            <Div px15 py8>
              <Div itemsCenter>
                <TextInput
                  value={address}
                  placeholder={'지갑 주소'}
                  fontSize={16}
                  w={'100%'}
                  onChangeText={handleAddressChange}></TextInput>
              </Div>
              <Row my8>
                <TextInput
                  value={about}
                  placeholder={'추가 정보'}
                  fontSize={14}
                  w={'100%'}
                  bold
                  onChangeText={handleAboutChange}></TextInput>
              </Row>
            </Div>
          </Div>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
      <Div h={HAS_NOTCH ? 27 : 12} bgWhite />
    </>
  );
}
