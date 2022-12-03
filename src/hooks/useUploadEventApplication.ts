import {useState} from 'react';
import {Linking} from 'react-native';
import {EventApplicationInputType} from 'src/components/NewEventApplicationOptions';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePostPromiseFnWithToken,
} from 'src/redux/asyncReducer';
import {isDiscordIdError} from './useDiscordId';
import {isTwitterIdError} from './useTwitterId';

export default function useUploadEventApplication({
  orderOption,
  drawEventId,
  setOrderOptionsList,
}) {
  const {data} = useApiSelector(apis.nft._());
  const nft = data?.nft;
  const [loading, setLoading] = useState(false);

  const [cachedOrderOption, setCachedOrderOption] = useState(orderOption);
  const [showDetail, setShowDetail] = useState(false);
  const inputType = cachedOrderOption?.inputType;
  const [selectedOption, setSelectedOption] = useState(
    orderOption?.selectedOption,
  );
  const postPromiseFnWithToken = usePostPromiseFnWithToken();
  const uploadEventApplication = async (SelectedOption = selectedOption) => {
    setOrderOptionsList(true);
    setShowDetail(false);
    setLoading(true);
    const body = {
      draw_event_id: drawEventId,
      draw_event_options: {selected: SelectedOption},
      all: false,
    };
    try {
      const {data} = await postPromiseFnWithToken({
        url: apis.event_application._().url,
        body,
      });
      if (!data.success) {
        setLoading(false);
        setShowDetail(true);
        return;
      }
    } catch (error) {
      setLoading(false);
      setShowDetail(true);
      return;
    }
    setLoading(false);
    setSelectedOption(SelectedOption);
    setCachedOrderOption({
      ...cachedOrderOption,
      selectedOption: SelectedOption,
    });
  };
  const restoreSelectedOption = () => {
    setSelectedOption(cachedOrderOption.selectedOption);
  };
  const onPressShowDetail = async () => {
    if (inputType != EventApplicationInputType.LINK) {
      if (showDetail == true) restoreSelectedOption();
      setShowDetail(prev => !prev);
      return;
    }
    if (inputType == EventApplicationInputType.LINK) {
      if (!cachedOrderOption.options || cachedOrderOption.options.length == 0)
        return;
      Linking.openURL(cachedOrderOption.options[0].name);
      selectedOption == null &&
        (await uploadEventApplication(cachedOrderOption.options[0]));
      return;
    }
  };
  const isApplied = cachedOrderOption.selectedOption != null;
  const isChanged =
    inputType == EventApplicationInputType.SELECT
      ? cachedOrderOption.selectedOption?.name !== selectedOption?.name
      : cachedOrderOption.selectedOption?.value !== selectedOption?.value;
  const detailText =
    selectedOption == null || selectedOption.value == ''
      ? inputType == EventApplicationInputType.CUSTOM_INPUT
        ? '눌러서 작성'
        : inputType == EventApplicationInputType.DISCORD_ID
        ? '눌러서 디스코드 아이디 작성'
        : inputType == EventApplicationInputType.TWITTER_ID
        ? '눌러서 트위터 아이디 작성'
        : inputType == EventApplicationInputType.SELECT
        ? '눌러서 옵션 선택'
        : ''
      : inputType == EventApplicationInputType.SELECT
      ? selectedOption.name
      : selectedOption.value;

  const optionTypes = cachedOrderOption.options.map((value, index) => {
    return {id: String(index), title: value.name};
  });
  const handleSelectOption = async ({nativeEvent: {event}}) => {
    const selectedOption = cachedOrderOption.options[Number(event)];
    if (selectedOption?.name != cachedOrderOption.selectedOption?.name)
      await uploadEventApplication(selectedOption);
  };

  const editableText = selectedOption?.value ? selectedOption?.value : '';

  const handleWriteEditableOption = value => {
    if (
      value != '' ||
      (value == '' && cachedOrderOption.selectedOption != null)
    ) {
      setSelectedOption({...cachedOrderOption.options[0], value});
    } else setSelectedOption(null);
  };

  const error = () => {
    if (
      inputType == EventApplicationInputType.SELECT ||
      inputType == EventApplicationInputType.LINK
    )
      return null;
    if (editableText == '' && cachedOrderOption.selectedOption != null)
      return '값을 입력해주세요.';
    if (
      inputType == EventApplicationInputType.TWITTER_ID &&
      editableText != '' &&
      isTwitterIdError(editableText)
    )
      return '유효한 트위터 아이디가 아닙니다.';
    if (
      inputType == EventApplicationInputType.DISCORD_ID &&
      editableText != '' &&
      isDiscordIdError(editableText)
    )
      return '유효한 디스코드 아이디가 아닙니다.';
    return null;
  };

  const handleSubmitWritableOption = async () => {
    if (!error() && isChanged) await uploadEventApplication(selectedOption);
  };
  const autoId = () => {
    if (cachedOrderOption.selectedOption == null) {
      if (
        inputType == EventApplicationInputType.TWITTER_ID &&
        nft?.twitter_id &&
        nft?.twitter_id != ''
      )
        return nft?.twitter_id;
      if (
        inputType == EventApplicationInputType.DISCORD_ID &&
        nft?.discord_id &&
        nft?.discord_id != ''
      )
        return nft?.discord_id;
    }
    return null;
  };
  const setFocus = isFocus => {
    if (isFocus == true && inputType != EventApplicationInputType.LINK)
      setShowDetail(true);
  };

  return {
    inputType,
    cachedOrderOption,
    onPressShowDetail,
    showDetail,
    isApplied,
    isChanged,
    loading,
    detailText,
    optionTypes,
    handleSelectOption,
    editableText,
    handleWriteEditableOption,
    handleSubmitWritableOption,
    setFocus,
    error: error(),
    autoId: autoId(),
  };
}
