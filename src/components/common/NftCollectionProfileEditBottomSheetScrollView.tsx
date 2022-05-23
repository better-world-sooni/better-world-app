import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import React from 'react';
import {ActivityIndicator} from 'react-native';
import useName, {NameOwnerType} from 'src/hooks/useName';
import useStory, {StoryOwnerType} from 'src/hooks/useStory';
import {getNftCollectionProfileImage} from 'src/modules/nftUtils';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {KeyboardAvoidingView, TextInput} from 'src/modules/viewComponents';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';
import {Check, Tool, Trash, Upload} from 'react-native-feather';
import useUploadImage from 'src/hooks/useUploadImage';
import apis from 'src/modules/apis';
import Colors from 'src/constants/Colors';

export default function NftCollectionProfileEditBottomSheetScrollView({
  nftCollection,
}) {
  const {
    name,
    nameHasChanged,
    nameLoading,
    nameError,
    handleChangeName,
    handleSaveName,
  } = useName(nftCollection, NameOwnerType.NftCollection);
  const {
    story,
    storyHasChanged,
    storyLoading,
    storyError,
    handleChangeStory,
    handleSaveStory,
  } = useStory(nftCollection, StoryOwnerType.NftCollection);
  const {
    image,
    imageHasChanged,
    uploading,
    handleAddImage,
    handleRemoveImage,
    handleSaveImage,
  } = useUploadImage({
    uri: nftCollection.background_image_uri,
    attachedRecord: 'nft_collection',
    url: apis.nft_collection.contractAddress._(nftCollection.contract_address)
      .url,
    property: 'background_image_uri',
    successReloadKey: apis.nft_collection.contractAddress.profile(
      nftCollection.contract_address,
    ),
  });
  const {
    image: profileImage,
    imageHasChanged: profileImageHasChanged,
    uploading: profileUploading,
    handleAddImage: handleAddProfileImage,
    handleRemoveImage: handleRemoveProfileImage,
    handleSaveImage: hangeSaveProfileImage,
  } = useUploadImage({
    uri: nftCollection.image_uri,
    attachedRecord: 'nft_collection',
    url: apis.nft_collection.contractAddress._(nftCollection.contract_address)
      .url,
    property: 'image_uri',
    successReloadKey: apis.nft_collection.contractAddress.profile(
      nftCollection.contract_address,
    ),
  });
  return (
    <BottomSheetScrollView>
      <KeyboardAvoidingView behavior="padding">
        <Div h150 relative onPress={handleAddImage}>
          {image?.uri ? (
            <>
              <Img uri={image.uri} top0 absolute w={'100%'} h150></Img>
              <Div flex={1} itemsEnd justifyEnd px15 zIndex={100} py15></Div>
            </>
          ) : (
            <Div flex={1} itemsCenter justifyCenter bgGray400>
              <Div bgRealBlack p8 rounded100>
                <Upload
                  strokeWidth={2}
                  color={'white'}
                  height={20}
                  width={20}
                />
              </Div>
            </Div>
          )}
        </Div>
        <Row zIndex={100} px15 mt={-50} relative mb20 itemsEnd>
          <Div h30 absolute w={'100%'} bgWhite bottom0></Div>
          <Col auto mr10 relative>
            <Div
              rounded100
              border3
              borderWhite
              bgGray200
              h110
              w110
              overflowHidden
              onPress={handleAddProfileImage}>
              {profileImage?.uri ? (
                <Img
                  uri={profileImage.uri}
                  top0
                  absolute
                  w={'100%'}
                  h110
                  rounded100
                  w110></Img>
              ) : (
                <Div flex={1} itemsCenter justifyCenter bgGray400 rounded100>
                  <Div bgRealBlack p8 rounded100>
                    <Upload
                      strokeWidth={2}
                      color={'white'}
                      height={20}
                      width={20}
                    />
                  </Div>
                </Div>
              )}
            </Div>
          </Col>
          <Col>
            <Row mb20>
              <Col />
              <Col />
              {image?.uri ? (
                <Col
                  auto
                  mr10
                  onPress={handleRemoveImage}
                  rounded100
                  bgRealBlack
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
                <Col
                  auto
                  mr10
                  rounded100
                  bgRealBlack
                  p8
                  onPress={handleAddImage}>
                  <Tool
                    strokeWidth={2}
                    color={Colors.info.DEFAULT}
                    height={18}
                    width={18}
                  />
                </Col>
              ) : null}
              {image?.uri || imageHasChanged ? (
                <Col auto rounded100 bgRealBlack p8 onPress={handleSaveImage}>
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
            <Row h50 itemsEnd pb5>
              {profileImage?.uri ? (
                <Col
                  auto
                  mr10
                  onPress={handleRemoveProfileImage}
                  rounded100
                  bgRealBlack
                  p8>
                  <Trash
                    strokeWidth={2}
                    color={Colors.danger.DEFAULT}
                    height={18}
                    width={18}
                  />
                </Col>
              ) : null}
              {profileImage?.uri ? (
                <Col
                  auto
                  mr10
                  rounded100
                  bgRealBlack
                  p8
                  onPress={handleAddProfileImage}>
                  <Tool
                    strokeWidth={2}
                    color={Colors.info.DEFAULT}
                    height={18}
                    width={18}
                  />
                </Col>
              ) : null}
              {profileImage?.uri || profileImageHasChanged ? (
                <Col
                  auto
                  rounded100
                  bgRealBlack
                  p8
                  onPress={hangeSaveProfileImage}>
                  {profileUploading ? (
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
              <Col></Col>
            </Row>
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
          <Col auto w50 mt3 m5>
            <Span fontSize={16} bold>
              스토리
            </Span>
          </Col>
          <Col>
            <TextInput
              value={story}
              placeholder={'마크다운을 사용하실 수 있습니다.'}
              fontSize={16}
              multiline
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
