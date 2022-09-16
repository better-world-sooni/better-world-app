import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  Switch,
} from 'react-native';
import {
  Check,
  Edit2,
  Pocket,
  Tool,
  Trash,
  Upload,
  X,
} from 'react-native-feather';
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
import useDiscordId from 'src/hooks/useDiscordId';
import useName, {NameOwnerType} from 'src/hooks/useName';
import useStory, {StoryOwnerType} from 'src/hooks/useStory';
import useTwitterId from 'src/hooks/useTwitterId';
import useUploadImage from 'src/hooks/useUploadImage';
import useUploadImageUriKey from 'src/hooks/useUploadImageUriKey';
import apis from 'src/modules/apis';
import {ICONS} from 'src/modules/icons';
import {Colors, DEVICE_WIDTH} from 'src/modules/styles';
import {
  useApiSelector,
  usePatchPromiseFnWithToken,
  usePutPromiseFnWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import {getNftProfileImage} from 'src/utils/nftUtils';
import {getKeyFromUri} from 'src/utils/uriUtils';

export default function NftProfileEditScreen() {
  const {data: profileData, isLoading: refreshing} = useApiSelector(
    apis.nft._(),
  );

  const nft = profileData?.nft;
  const {
    discordId,
    discordProfileLink,
    discordIdHasChanged,
    discordIdError,
    isDiscordIdEditting,
    isDiscordIdSavable,
    handlePressDiscordLink,
    toggleDiscordIdEdit,
    handleChangeDiscordId,
  } = useDiscordId(nft);
  const {
    twitterId,
    twitterProfileLink,
    twitterIdHasChanged,
    twitterIdError,
    isTwitterIdEditting,
    isTwitterIdSavable,
    toggleTwitterIdEdit,
    handlePressTwitterLink,
    handleChangeTwitterId,
  } = useTwitterId(nft);
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
    getImageUriKey,
  } = useUploadImageUriKey({
    attachedRecord: 'nft',
    uri: nft.background_image_uri,
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
    const body = {
      name,
      story,
      discord_id: discordId,
      twitter_id: twitterId,
      background_image_uri_key: backgroundImageUriKey,
    };
    const {data} = await putPromiseFnWithToken({url: apis.nft._().url, body});
    setLoading(false);
    reloadGetWithToken(apis.nft._());
  };
  const isSaveable =
    nameHasChanged ||
    storyHasChanged ||
    imageHasChanged ||
    discordIdHasChanged ||
    twitterIdHasChanged;
  return (
    <>
      <Div bgWhite px15 h={50} justifyCenter borderBottom={0.5} borderGray200>
        <Row itemsCenter zIndex={100}>
          <Col itemsStart onPress={goBack}>
            <X width={30} height={30} color={Colors.black} strokeWidth={2} />
          </Col>
          <Col auto>
            <Span bold fontSize={17}>
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
          <Div h120 relative onPress={!uploading && handleAddImage}>
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
                onPress={!uploading && handleRemoveImage}
                rounded100
                bgBlack
                p8>
                <Trash
                  strokeWidth={2}
                  color={Colors.white}
                  height={18}
                  width={18}
                />
              </Div>
            ) : null}
          </Div>
          <Row zIndex={100} px15 mt={-25} relative mb8 itemsEnd>
            <Div h45 absolute w={DEVICE_WIDTH} bgWhite bottom0></Div>
            <Img
              rounded100
              border4
              borderWhite
              bgGray200
              h70
              w70
              uri={getNftProfileImage(nft)}></Img>
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
          <Row px15 py15 itemsCenter borderTop={0.5} borderGray200>
            <Col auto w50 m5>
              <Img h={232 / 12} w={300 / 12} source={ICONS.discord} />
            </Col>
            <Col>
              {isDiscordIdEditting ? (
                <TextInput
                  value={discordId}
                  fontSize={16}
                  bold
                  onChangeText={handleChangeDiscordId}></TextInput>
              ) : discordProfileLink ? (
                <Span fontSize={16} onPress={handlePressDiscordLink}>
                  {discordId}
                </Span>
              ) : (
                <Span gray400 fontSize={16}>
                  Discord#8888
                </Span>
              )}
            </Col>
            <Col auto onPress={toggleDiscordIdEdit}>
              {isDiscordIdEditting ? (
                <Pocket
                  strokeWidth={2}
                  color={
                    isDiscordIdSavable ? Colors.info.DEFAULT : Colors.gray[400]
                  }
                  height={18}
                  width={18}
                />
              ) : (
                <Edit2
                  strokeWidth={2}
                  color={Colors.black}
                  height={18}
                  width={18}
                />
              )}
            </Col>
          </Row>
          {discordIdError ? (
            <Div px15 mb15>
              <Span danger>{discordIdError}</Span>
            </Div>
          ) : null}
          <Row px15 py15 itemsCenter borderTop={0.5} borderGray200>
            <Col auto w50 m5>
              <Img h={23} w={23} source={ICONS.twitter} />
            </Col>
            <Col>
              {isTwitterIdEditting ? (
                <TextInput
                  value={twitterId}
                  fontSize={16}
                  bold
                  onChangeText={handleChangeTwitterId}></TextInput>
              ) : twitterProfileLink ? (
                <Span fontSize={16} onPress={handlePressTwitterLink}>
                  {twitterId}
                </Span>
              ) : (
                <Span gray400 fontSize={16}>
                  irlyglo
                </Span>
              )}
            </Col>
            <Col auto onPress={toggleTwitterIdEdit}>
              {isTwitterIdEditting ? (
                <Pocket
                  strokeWidth={2}
                  color={
                    isTwitterIdSavable ? Colors.info.DEFAULT : Colors.gray[400]
                  }
                  height={18}
                  width={18}
                />
              ) : (
                <Edit2
                  strokeWidth={2}
                  color={Colors.black}
                  height={18}
                  width={18}
                />
              )}
            </Col>
          </Row>
          {twitterIdError ? (
            <Div px15 mb15>
              <Span danger>{twitterIdError}</Span>
            </Div>
          ) : null}
          <Row px15 py15 borderTop={0.5} borderGray200 flex={1}>
            <Col auto w50 m5 mt3>
              <Span fontSize={16} bold>
                스토리
              </Span>
            </Col>
            <Col pr10>
              <TextInput
                value={story}
                placeholder={'자신을 소개해주세요.'}
                fontSize={16}
                multiline
                mt={-4}
                bold
                onChangeText={handleChangeStory}
                maxLength={100}></TextInput>
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
