import React, {useEffect, useState} from 'react';
import {Div} from 'src/components/common/Div';
import {HAS_NOTCH} from 'src/modules/constants';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {ChevronLeft, Minus, Plus, Upload} from 'react-native-feather';
import apis from 'src/modules/apis';
import {Img} from 'src/components/common/Img';
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
import {getNftCollectionProfileImage, getNftName} from 'src/utils/nftUtils';
import ImageColors from 'react-native-image-colors';
import useUploadMerchandise, {
  OrderCategory,
} from 'src/hooks/useUploadMerchandise';
import UploadImageSlideShow from 'src/components/common/UploadImageSlideShow';
import {MenuView} from '@react-native-menu/menu';
import Accordion from 'react-native-collapsible/Accordion';
import DatePicker from 'react-native-date-picker';
import {kmoment} from 'src/utils/timeUtils';
import NumberPlease from 'react-native-number-please';

const airdropTypes = [
  {
    id: 'airdrop_only',
    title: '재응모 불가능',
  },
  {
    id: '',
    title: '재응모 가능',
  },
];

const deliverTypes = [
  {
    id: '',
    title: '미배송',
  },
  {
    id: 'deliverable',
    title: '배송',
  },
];

export default function NewMerchandiseScreen() {
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
    price,
    maxPerAmountPerOrderPickerOptions,
    maxPerAmountPerOrder,
    setMaxAmountPerOrder,
    orderCategories,
    handleAddOrderCategory,
    handleRemoveOrderCategory,
    handleAddOrderOption,
    handleRemoveOrderOption,
    handlePriceChange,
    expiresAt,
    setExpiresAt,
    name,
    handleNameChange,
    isDeliverable,
    setIsDeliverable,
    isAirdropOnly,
    setIsAirdropOnly,
    description,
    handleDescriptionChange,
    images,
    handleAddImages,
    handleRemoveImage,
    uploadMerchandise,
  } = useUploadMerchandise();

  const handlePressUpload = () => {
    uploadMerchandise({
      uploadSuccessCallback,
    });
  };
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;

  const handlePressAirdropMenu = ({nativeEvent: {event}}) => {
    if (event == '') setIsAirdropOnly(false);
    else setIsAirdropOnly(true);
  };
  const handlePressDeliverMenu = ({nativeEvent: {event}}) => {
    if (event == '') setIsDeliverable(false);
    else setIsDeliverable(true);
  };
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
                placeholder={'이름'}
                fontSize={22}
                w={'100%'}
                style={{fontWeight: 'bold'}}
                onChangeText={handleNameChange}></TextInput>
            </Div>
            <Div mt16 border={0.5} borderGray200 rounded10 overflowHidden>
              <Row py12 px16 itemsCenter>
                <Col>
                  {expiresAt ? (
                    <Span onPress={handlePressExpiresAt}>
                      {kmoment(expiresAt).format('YY.M.D a h:mm')}
                    </Span>
                  ) : (
                    <Span>이벤트 마감 시간 추가</Span>
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
            <Div my16>
              <OrderCategories
                orderCategories={orderCategories}
                addOrderCategory={handleAddOrderCategory}
                removeOrderCategory={handleRemoveOrderCategory}
                addOrderOption={handleAddOrderOption}
                removeOrderOption={handleRemoveOrderOption}
              />
            </Div>
            <Row itemsCenter>
              <Col
                auto
                border={0.5}
                borderGray200
                h35
                justifyCenter
                px16
                rounded10
                mr8>
                <MenuView
                  onPressAction={handlePressAirdropMenu}
                  actions={airdropTypes}>
                  <Span fontSize={14} bold color={Colors.black}>
                    {isAirdropOnly ? '에어드랍 전용' : '재응모 가능'}
                  </Span>
                </MenuView>
              </Col>
              <Col
                auto
                h35
                justifyCenter
                px16
                border={0.5}
                borderGray200
                rounded10>
                <MenuView
                  onPressAction={handlePressDeliverMenu}
                  actions={deliverTypes}>
                  <Span fontSize={14} bold>
                    {isDeliverable ? '배송' : '미배송'}
                  </Span>
                </MenuView>
              </Col>
              <Col />
            </Row>
            <Div mt16>
              <TextInput
                value={description}
                placeholder={'상품 설명 (마크다운 사용 가능)'}
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

const addOptions = [
  {
    id: 'select',
    title: '선택 옵션 추가',
  },
  {
    id: 'input',
    title: '유저 입력 추가',
  },
];

function OrderCategories({
  orderCategories,
  addOrderCategory,
  removeOrderCategory,
  addOrderOption,
  removeOrderOption,
}) {
  const [activeSection, setActiveSection] = useState(null);
  const [categoryToAdd, setCategoryToAdd] = useState('');
  const handleChangeCategoryToAdd = text => {
    setCategoryToAdd(text);
  };
  const handlePressSection = index => {
    if (index == activeSection) setActiveSection(null);
    else setActiveSection(index);
  };
  const handlePressAddOrderCategory = event => {
    if (categoryToAdd) {
      if (event == 'select') {
        addOrderCategory(categoryToAdd, false);
        setCategoryToAdd('');
      } else {
        addOrderCategory(categoryToAdd, true);
        setCategoryToAdd('');
      }
    }
  };
  return (
    <Div border={0.5} borderGray200 rounded10 overflowHidden>
      <Accordion
        activeSections={[activeSection]}
        sections={orderCategories as OrderCategory[]}
        underlayColor={Colors.opacity[100]}
        renderHeader={(content, index) => (
          <Row
            wFull
            py12
            px16
            borderBottom={0.5}
            borderGray200
            itemsCenter
            onPress={() => handlePressSection(index)}>
            <Col>
              <Span bold fontSize={16} gray400={content.isInput}>
                {content.name}
              </Span>
            </Col>
            <Col auto onPress={() => removeOrderCategory(index)}>
              <Minus height={22} color={Colors.black} strokeWidth={2} />
            </Col>
          </Row>
        )}
        renderContent={(content, index) =>
          !content.isInput && (
            <OrderOptions
              orderCategory={content}
              categoryIndex={index}
              addOrderOption={addOrderOption}
              removeOrderOption={removeOrderOption}
            />
          )
        }
        onChange={() => {}}
      />
      <Row py12 px16 itemsCenter>
        <Col>
          <TextInput
            value={categoryToAdd}
            placeholder={'추가할 옵션 영역'}
            fontSize={14}
            w={'100%'}
            onChangeText={handleChangeCategoryToAdd}></TextInput>
        </Col>
        <Col auto>
          <MenuView
            onPressAction={handlePressAddOrderCategory}
            actions={addOptions}>
            <Plus
              height={22}
              color={!!categoryToAdd ? Colors.black : Colors.gray[400]}
              strokeWidth={2}
            />
          </MenuView>
        </Col>
      </Row>
    </Div>
  );
}

function OrderOptions({
  orderCategory,
  categoryIndex,
  addOrderOption,
  removeOrderOption,
}) {
  const [optionToAdd, setOptionToAdd] = useState('');
  const handleChangeOptionToAdd = text => {
    setOptionToAdd(text);
  };
  const handlePressAddOrderOption = () => {
    if (optionToAdd) {
      addOrderOption(categoryIndex, optionToAdd);
      setOptionToAdd('');
    }
  };
  return (
    <>
      {orderCategory.options.map((option, index) => (
        <Row wFull py12 px16 bgGray100 itemsCenter>
          <Col>
            <Span fontSize={14}>{option}</Span>
          </Col>
          <Col auto onPress={() => removeOrderOption(categoryIndex, index)}>
            <Minus height={19} color={Colors.black} strokeWidth={2} />
          </Col>
        </Row>
      ))}
      <Row py12 px16 itemsCenter bgGray100>
        <Col>
          <TextInput
            value={optionToAdd}
            placeholder={'추가할 옵션'}
            fontSize={12}
            w={'100%'}
            onChangeText={handleChangeOptionToAdd}></TextInput>
        </Col>
        <Col auto onPress={handlePressAddOrderOption}>
          <Plus
            height={19}
            color={!!optionToAdd ? Colors.black : Colors.gray[400]}
            strokeWidth={2}
          />
        </Col>
      </Row>
    </>
  );
}
