import React, {useState} from 'react';
import {Div} from 'src/components/common/Div';
import {HAS_NOTCH} from 'src/modules/constants';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {ChevronLeft, Minus, Plus} from 'react-native-feather';
import apis from 'src/modules/apis';
import {useNavigation} from '@react-navigation/native';
import {Span} from 'src/components/common/Span';
import {
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
} from 'src/components/common/ViewComponents';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
import {ActivityIndicator, Platform, Switch} from 'react-native';
import {Colors, DEVICE_WIDTH} from 'src/modules/styles';
import useAutoFocusRef from 'src/hooks/useAutoFocusRef';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import UploadImageSlideShow from 'src/components/common/UploadImageSlideShow';
import DatePicker from 'react-native-date-picker';
import {kmoment} from 'src/utils/timeUtils';
import useUploadDrawEvent from 'src/hooks/useUploadDrawEvent';
import NewEventApplicationOptions from 'src/components/NewEventApplicationOptions';

export default function NewAnnouncementScreen() {
  const autoFocusRef = useAutoFocusRef();
  const {goBack} = useNavigation();
  const reloadGetWithToken = useReloadGETWithToken();
  const uploadSuccessCallback = () => {
    reloadGetWithToken(apis.nft_collection.eventApplication.list());
    goBack();
  };
  const [datetimePickerOpen, setDatetimePickerOpen] = useState(false);
  const {
    error,
    loading,
    giveawayMerchandise,
    handleGiveawayMerchandiseChange,
    applicationCategories,
    handleAddApplicationCategory,
    handleRemoveApplicationCategory,
    handleAddApplicationOption,
    handleRemoveApplicationOption,
    enableApplicationLink,
    toggleEnableApplicationLink,
    applicationLink,
    handleApplicationLinkChange,
    expiresAt,
    setExpiresAt,
    name,
    handleNameChange,
    description,
    handleDescriptionChange,
    images,
    handleAddImages,
    handleRemoveImage,
    uploadDrawEvent,
  } = useUploadDrawEvent({initialHasApplication: false});
  const handlePressUpload = () => {
    uploadDrawEvent({
      uploadSuccessCallback,
    });
  };
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
  const handlePressAddExpiresAt = () => {
    setExpiresAt(new Date());
    setDatetimePickerOpen(true);
  };
  const handlePressRemoveExpiresAt = () => {
    setExpiresAt(null);
    setDatetimePickerOpen(false);
  };
  const handlePressExpiresAt = () => {
    setDatetimePickerOpen(true);
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        flex={1}
        bgWhite
        relative>
        <Div h={headerHeight} zIndex={100}>
          <Div zIndex={100} absolute w={DEVICE_WIDTH} top={notchHeight + 5}>
            <Row itemsCenter py5 h40 px8>
              <Col auto onPress={goBack}>
                <ChevronLeft height={30} color={Colors.black} strokeWidth={2} />
              </Col>
              <Col itemsEnd>
                <Div onPress={handlePressUpload} pr7>
                  <Span info bold fontSize={16}>
                    {loading ? <ActivityIndicator /> : '게시'}
                  </Span>
                </Div>
              </Col>
            </Row>
          </Div>
        </Div>
        <ScrollView keyboardShouldPersistTaps="always">
          {error ? (
            <Div px15 py8>
              <Span bold danger>
                {error}
              </Span>
            </Div>
          ) : null}
          <Div>
            <UploadImageSlideShow
              borderRadius={0}
              images={[...images, {uri: null}]}
              onPressAdd={handleAddImages}
              onPressRemove={handleRemoveImage}
              sliderWidth={DEVICE_WIDTH}
              sliderHeight={DEVICE_WIDTH}
              disablePagination
            />
          </Div>
          <Div px15>
            <Div mt16>
              <TextInput
                innerRef={autoFocusRef}
                value={name}
                placeholder={'제목'}
                fontSize={24}
                w={'100%'}
                style={{fontWeight: 'bold'}}
                onChangeText={handleNameChange}></TextInput>
            </Div>
            <Div mt16>
              <TextInput
                value={description}
                placeholder={'공지 내용 (마크다운 사용 가능)'}
                fontSize={16}
                multiline
                w={'100%'}
                onChangeText={handleDescriptionChange}></TextInput>
            </Div>
            <Div h100 />
          </Div>
        </ScrollView>
      </KeyboardAvoidingView>
      {expiresAt && (
        <DatePicker
          modal
          title={'상품 마감 시간 선택'}
          open={datetimePickerOpen}
          mode="datetime"
          minuteInterval={15}
          androidVariant="iosClone"
          date={expiresAt}
          onConfirm={date => {
            setDatetimePickerOpen(false);
            setExpiresAt(date);
          }}
          onCancel={() => {
            setDatetimePickerOpen(false);
          }}
        />
      )}
      <Div h={HAS_NOTCH ? 27 : 12} bgWhite />
    </>
  );
}
