import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {ActivityIndicator, Platform} from 'react-native';
import {Trash, Upload, X} from 'react-native-feather';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
} from 'src/components/common/ViewComponents';
import useName, {NameOwnerType} from 'src/hooks/useName';
import useStory, {StoryOwnerType} from 'src/hooks/useStory';
import useUploadImageUriKey from 'src/hooks/useUploadImageUriKey';
import apis from 'src/modules/apis';
import {Colors, DEVICE_WIDTH} from 'src/modules/styles';
import {
  useApiSelector,
  usePutPromiseFnWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import {getKeyFromUri} from 'src/utils/uriUtils';

export default function NftCollectionProfileEditScreen() {
  const {data: profileData, isLoading: refreshing} = useApiSelector(
    apis.nft_collection._(),
  );
  const nftCollection = profileData.nft_collection;
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
    image: profileImage,
    imageHasChanged: profileImageHasChanged,
    uploading: profileUploading,
    handleAddImage: handleAddProfileImage,
    handleRemoveImage: handleRemoveProfileImage,
    getImageUriKey: getProfileImageUriKey,
  } = useUploadImageUriKey({
    attachedRecord: 'nft_collection',
    uri: nftCollection.image_uri,
  });
  const {
    image,
    imageHasChanged,
    uploading,
    handleAddImage,
    handleRemoveImage,
    getImageUriKey,
  } = useUploadImageUriKey({
    attachedRecord: 'nft_collection',
    uri: nftCollection.background_image_uri,
  });
  const {goBack} = useNavigation();
  const reloadGetWithToken = useReloadGETWithToken();
  const putPromiseFnWithToken = usePutPromiseFnWithToken();
  const [loading, setLoading] = useState(false);
  const save = async () => {
    if (!isSaveable) return;
    setLoading(true);
    const backgroundImageUriKey = imageHasChanged
      ? await getImageUriKey()
      : getKeyFromUri(image.uri);
    const imageUriKey = profileImageHasChanged
      ? await getProfileImageUriKey()
      : getKeyFromUri(profileImage.uri);
    const body = {
      name,
      about: story,
      image_uri_key: imageUriKey,
      background_image_uri_key: backgroundImageUriKey,
    };
    const {data} = await putPromiseFnWithToken({
      url: apis.nft_collection._().url,
      body,
    });
    setLoading(false);
    reloadGetWithToken(apis.nft_collection._());
  };
  const isSaveable =
    nameHasChanged ||
    storyHasChanged ||
    imageHasChanged ||
    profileImageHasChanged;
  return (
    <>
      <Div bgWhite px15 h={50} justifyCenter borderBottom={0.5} borderGray200>
        <Row itemsCenter zIndex={100}>
          <Col itemsStart onPress={goBack}>
            <X width={30} height={30} color={Colors.black} strokeWidth={2} />
          </Col>
          <Col auto>
            <Span bold fontSize={19}>
              프로필 수정
            </Span>
          </Col>
          <Col itemsEnd>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Span
                info={isSaveable}
                gray500={!isSaveable}
                fontSize={16}
                onPress={save}
                bold>
                저장
              </Span>
            )}
          </Col>
        </Row>
      </Div>
      <ScrollView bgWhite bounces={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Div h120 relative onPress={handleAddImage}>
            {image?.uri ? (
              <Img uri={image.uri} top0 absolute w={DEVICE_WIDTH} h120></Img>
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
            {image?.uri ? (
              <Div
                absolute
                top12
                right12
                zIndex={1000}
                onPress={handleRemoveImage}
                rounded100
                bgBlack
                p8>
                {uploading ? (
                  <ActivityIndicator />
                ) : (
                  <Trash
                    strokeWidth={2}
                    color={Colors.white}
                    height={18}
                    width={18}
                  />
                )}
              </Div>
            ) : null}
          </Div>
          <Row zIndex={100} px15 mt={-25} relative mb8 itemsEnd>
            <Div h45 absolute w={DEVICE_WIDTH} bgWhite bottom0></Div>
            <Div
              rounded100
              borderWhite
              bgGray200
              h70
              w70
              overflowHidden
              onPress={handleAddProfileImage}>
              {profileImage?.uri ? (
                <Img
                  uri={profileImage.uri}
                  border4
                  borderWhite
                  h70
                  w70
                  rounded100></Img>
              ) : (
                <Div flex={1} itemsCenter justifyCenter bgGray400 rounded100>
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
          </Row>
          {nameError ? (
            <Div px15 mb15>
              <Span danger>{nameError}</Span>
            </Div>
          ) : null}
          <Row px15 py15 borderTop={0.5} borderGray200>
            <Col auto w50 m5 mt3>
              <Span fontSize={16} bold>
                정보
              </Span>
            </Col>
            <Col pr10>
              <TextInput
                value={story}
                placeholder={'컬렉션 정보를 입력해주세요.'}
                fontSize={16}
                multiline
                mt={-4}
                bold
                onChangeText={handleChangeStory}></TextInput>
            </Col>
          </Row>
          {storyError ? (
            <Div px15 mb15>
              <Span danger>{storyError}</Span>
            </Div>
          ) : null}
        </KeyboardAvoidingView>
      </ScrollView>
    </>
  );
}
