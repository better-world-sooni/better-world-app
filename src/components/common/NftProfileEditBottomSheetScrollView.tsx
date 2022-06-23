import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import React, {useState} from 'react';
import {ActivityIndicator, Platform, Switch} from 'react-native';
import useName, {NameOwnerType} from 'src/hooks/useName';
import useStory, {StoryOwnerType} from 'src/hooks/useStory';
import {getNftProfileImage} from 'src/utils/nftUtils';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {
  KeyboardAvoidingView,
  TextInput,
} from 'src/components/common/ViewComponents';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';
import {Check, Tool, Trash, Upload} from 'react-native-feather';
import useUploadImage from 'src/hooks/useUploadImage';
import apis from 'src/modules/apis';
import {Colors} from 'src/modules/styles';
import {
  usePutPromiseFnWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';

export default function NftProfileEditBottomSheetScrollView({nft}) {
  const {
    name,
    nameHasChanged,
    nameLoading,
    nameError,
    handleChangeName,
    handleSaveName,
  } = useName(nft, NameOwnerType.Nft);
  const {
    story,
    storyHasChanged,
    storyLoading,
    storyError,
    handleChangeStory,
    handleSaveStory,
  } = useStory(nft, StoryOwnerType.Nft);
  const {
    image,
    imageHasChanged,
    uploading,
    handleAddImage,
    handleRemoveImage,
    handleSaveImage,
  } = useUploadImage({
    uri: nft.background_image_uri,
    attachedRecord: 'nft',
    url: apis.nft._().url,
    property: 'background_image_uri',
    successReloadKey: apis.nft.contractAddressAndTokenId(
      nft.contract_address,
      nft.token_id,
    ),
  });
  const reloadGetWithToken = useReloadGETWithToken();
  const putPromiseFnWithToken = usePutPromiseFnWithToken();
  const [pushNotificationEnabled, setPushNotificationEnabled] = useState(
    !nft.is_push_notification_disabled,
  );
  const handleSwitchPushNotification = async bool => {
    setPushNotificationEnabled(bool);
    const body = {
      property: 'is_disabled_globally',
      value: !bool,
    };
    const {data} = await putPromiseFnWithToken({
      url: apis.pushNotificationSetting._().url,
      body,
    });
    reloadGetWithToken(
      apis.nft.contractAddressAndTokenId(nft.contract_address, nft.token_id),
    );
  };
  return (
    <BottomSheetScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Div h150 relative onPress={handleAddImage}>
          {image?.uri ? (
            <>
              <Img uri={image.uri} top0 absolute w={DEVICE_WIDTH} h150></Img>
              <Div flex={1} itemsEnd justifyEnd px15 zIndex={100} py15></Div>
            </>
          ) : (
            <Div flex={1} itemsCenter justifyCenter bgGray400>
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
        <Row zIndex={100} px15 mt={-50} relative mb20 itemsEnd>
          <Div h30 absolute w={DEVICE_WIDTH} bgWhite bottom0></Div>
          <Col auto mr10 relative>
            <Img
              rounded100
              border3
              borderWhite
              bgGray200
              h80
              w80
              uri={getNftProfileImage(nft, 200, 200)}></Img>
          </Col>
          <Col>
            <Row>
              <Col />
              {image?.uri ? (
                <Col
                  auto
                  mr10
                  onPress={handleRemoveImage}
                  rounded100
                  bgBlack
                  p8>
                  <Trash
                    strokeWidth={2}
                    color={Colors.danger.DEFAULT}
                    height={18}
                    width={18}
                  />
                </Col>
              ) : null}
              {image?.uri ? (
                <Col auto mr10 rounded100 bgBlack p8 onPress={handleAddImage}>
                  <Tool
                    strokeWidth={2}
                    color={Colors.info.DEFAULT}
                    height={18}
                    width={18}
                  />
                </Col>
              ) : null}
              {image?.uri || imageHasChanged ? (
                <Col auto rounded100 bgBlack p8 onPress={handleSaveImage}>
                  {uploading ? (
                    <ActivityIndicator></ActivityIndicator>
                  ) : (
                    <Check
                      strokeWidth={2}
                      color={Colors.success.DEFAULT}
                      height={18}
                      width={18}
                    />
                  )}
                </Col>
              ) : null}
            </Row>
            <Row h40></Row>
          </Col>
        </Row>
        <Row px15 py12 itemsCenter borderTop={0.5} borderGray200>
          <Col auto w50 m5>
            <Span fontSize={16} bold>
              알림
            </Span>
          </Col>
          <Col></Col>
          <Col auto>
            <Switch
              value={pushNotificationEnabled}
              onValueChange={handleSwitchPushNotification}
              style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}
            />
          </Col>
        </Row>
        <Row px15 py15 itemsCenter borderTop={0.5} borderGray200>
          <Col auto w50 m5>
            <Span fontSize={16} bold>
              이름
            </Span>
          </Col>
          <Col>
            <TextInput
              value={name}
              fontSize={16}
              bold
              onChangeText={handleChangeName}></TextInput>
          </Col>
          <Col auto onPress={nameHasChanged && handleSaveName}>
            <Span fontSize={16} gray400={!nameHasChanged}>
              {nameLoading ? <ActivityIndicator></ActivityIndicator> : '저장'}
            </Span>
          </Col>
        </Row>
        {nameError ? (
          <Div px15 mb15>
            <Span danger>{nameError}</Span>
          </Div>
        ) : null}
        <Row px15 py15 borderTop={0.5} borderGray200>
          <Col auto w50 m5 mt3>
            <Span fontSize={16} bold>
              스토리
            </Span>
          </Col>
          <Col pr10>
            <TextInput
              value={story}
              placeholder={'마크다운을 사용하실 수 있습니다.'}
              fontSize={16}
              multiline
              mt={-4}
              bold
              onChangeText={handleChangeStory}></TextInput>
          </Col>
          <Col auto onPress={handleSaveStory}>
            <Span fontSize={16} gray400={!storyHasChanged}>
              {storyLoading ? <ActivityIndicator></ActivityIndicator> : '저장'}
            </Span>
          </Col>
        </Row>
        {storyError ? (
          <Div px15 mb15>
            <Span danger>{storyError}</Span>
          </Div>
        ) : null}
      </KeyboardAvoidingView>
    </BottomSheetScrollView>
  );
}
