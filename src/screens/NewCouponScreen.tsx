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
import {ActivityIndicator, Platform} from 'react-native';
import {Colors, DEVICE_WIDTH} from 'src/modules/styles';
import useAutoFocusRef from 'src/hooks/useAutoFocusRef';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MenuView} from '@react-native-menu/menu';
import DatePicker from 'react-native-date-picker';
import {kmoment} from 'src/utils/timeUtils';
import useUploadCoupon from 'src/hooks/useUploadCoupon';

const airdropTypes = [
  {
    id: 'airdrop_only',
    title: '에어드랍 쿠폰',
  },
  // {
  //   id: '',
  //   title: '홀더 전용',
  // },
];

export default function NewCouponScreen() {
  const autoFocusRef = useAutoFocusRef();
  const {data: nftCollectionRes, isLoading: nftCollectionLoading} =
    useApiSelector(apis.nft_collection._());
  const nftCollection = nftCollectionRes.nft_collection;
  const {goBack} = useNavigation();
  const reloadGetWithToken = useReloadGETWithToken();
  const uploadSuccessCallback = () => {
    reloadGetWithToken(apis.nft_collection.merchandise.list());
    goBack();
  };
  const [datetimePickerOpen, setDatetimePickerOpen] = useState(false);
  const {
    error,
    loading,
    expiresAt,
    setExpiresAt,
    label,
    handleLabelChange,
    merchandiseId,
    handlePressMerchandiseId,
    uploadCoupon,
  } = useUploadCoupon({uploadSuccessCallback});

  const handlePressUpload = () => {
    uploadCoupon();
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
                    {loading ? <ActivityIndicator /> : '뿌리기'}
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
          <Div px15>
            <Row itemsCenter mt8>
              <Col>
                <TextInput
                  innerRef={autoFocusRef}
                  value={label}
                  placeholder={'쿠폰 레이블'}
                  fontSize={19}
                  w={'100%'}
                  onChangeText={handleLabelChange}></TextInput>
              </Col>
              <Col
                auto
                border={0.5}
                borderGray200
                h35
                justifyCenter
                px16
                rounded10>
                <MenuView onPressAction={() => {}} actions={airdropTypes}>
                  <Span fontSize={14} bold color={Colors.black}>
                    에어드랍 쿠폰
                  </Span>
                </MenuView>
              </Col>
            </Row>
            <Div
              mt8
              border={0.5}
              borderGray200
              rounded10
              overflowHidden
              onPress={handlePressMerchandiseId}>
              <Row py12 px16 itemsCenter>
                <Col>
                  {merchandiseId ? (
                    <Span bold>굿즈 아이디: {merchandiseId}</Span>
                  ) : (
                    <Span bold>굿즈 선택하기</Span>
                  )}
                </Col>
              </Row>
            </Div>
            <Div mt8 border={0.5} borderGray200 rounded10 overflowHidden>
              <Row py12 px16 itemsCenter>
                <Col>
                  {expiresAt ? (
                    <Span onPress={handlePressExpiresAt} bold>
                      {kmoment(expiresAt).format('YY.M.D a h:mm')}
                    </Span>
                  ) : (
                    <Span bold>쿠폰 유효 기간 추가</Span>
                  )}
                </Col>
                <Col
                  auto
                  onPress={
                    expiresAt
                      ? handlePressRemoveExpiresAt
                      : handlePressAddExpiresAt
                  }>
                  {expiresAt ? (
                    <Minus height={22} color={Colors.black} strokeWidth={2} />
                  ) : (
                    <Plus height={22} color={Colors.black} strokeWidth={2} />
                  )}
                </Col>
              </Row>
            </Div>
            <Div h100 />
          </Div>
        </ScrollView>
      </KeyboardAvoidingView>
      {expiresAt && (
        <DatePicker
          modal
          title={'쿠폰 유효 기간 선택'}
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
