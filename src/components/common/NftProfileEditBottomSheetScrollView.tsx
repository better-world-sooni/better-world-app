import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import React from 'react';
import {ActivityIndicator} from 'react-native';
import useName, {NameOwnerType} from 'src/hooks/useName';
import useStory, {StoryOwnerType} from 'src/hooks/useStory';
import {getNftProfileImage} from 'src/modules/nftUtils';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {KeyboardAvoidingView, TextInput} from 'src/modules/viewComponents';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';
import {Upload} from 'react-native-feather';
import useUploadImage from 'src/hooks/useUploadImage';
import apis from 'src/modules/apis';

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
    successReloadKey: apis.nft._(),
  });
  return (
    <BottomSheetScrollView>
      <KeyboardAvoidingView behavior="padding">
        <Div h150 relative onPress={handleAddImage}>
          {image?.uri ? (
            <>
              <Img uri={image.uri} top0 absolute w={DEVICE_WIDTH} h150></Img>
              <Div flex itemsEnd justifyEnd px15 zIndex={100} py15></Div>
            </>
          ) : (
            <Div flex itemsCenter justifyCenter bgGray400>
              <Div bgBlack p8 rounded100>
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
          <Div h30 absolute w={DEVICE_WIDTH} bgWhite bottom0></Div>
          <Col auto mr10 relative>
            <Img
              rounded100
              border3
              borderWhite
              h80
              w80
              uri={getNftProfileImage(nft, 200, 200)}></Img>
          </Col>
          <Col></Col>
          {image?.uri ? (
            <>
              <Col auto mr20 onPress={handleRemoveImage}>
                <Span fontSize={16} danger bold>
                  제거
                </Span>
              </Col>
              <Col
                auto
                onPress={imageHasChanged ? handleSaveImage : handleAddImage}>
                <Span fontSize={16} info bold>
                  {uploading ? (
                    <ActivityIndicator></ActivityIndicator>
                  ) : imageHasChanged ? (
                    '저장'
                  ) : (
                    '변경'
                  )}
                </Span>
              </Col>
            </>
          ) : null}
        </Row>
        <Row px15 py15 itemsCenter borderTop={0.5} borderGray200>
          <Col auto w80>
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
          <Col auto w80 mt3>
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
