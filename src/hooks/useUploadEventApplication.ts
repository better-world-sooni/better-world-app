import {useState} from 'react';
import {Linking} from 'react-native';
import {EventApplicationInputType} from 'src/components/NewEventApplicationOptions';
import {isDiscordIdError} from './useDiscordId';
import {isTwitterIdError} from './useTwitterId';

export default function useUploadEventApplication({orderOption}) {
  const [cachedOrderOption, setCachedOrderOption] = useState(orderOption);
  const [showDetail, setShowDetail] = useState(false);
  const inputType = cachedOrderOption?.inputType;
  const [selectedOption, setSelectedOption] = useState(
    orderOption?.selectedOption,
  );

  const uploadEventApplication = async (SelectedOption = selectedOption) => {
    console.log('upload');
    setSelectedOption(SelectedOption);
    setCachedOrderOption({
      ...cachedOrderOption,
      selectedOption: SelectedOption,
    });
  };
  const onPressShowDetail = () => {
    if (inputType != EventApplicationInputType.LINK) {
      setShowDetail(prev => !prev);
      return;
    }
    if (inputType == EventApplicationInputType.LINK) {
      if (!cachedOrderOption.options || cachedOrderOption.options.length == 0)
        return;
      Linking.openURL(cachedOrderOption.options[0].name);
      selectedOption == null &&
        uploadEventApplication(cachedOrderOption.options[0]);
      return;
    }
  };
  const isApplied = cachedOrderOption.selectedOption != null;
  const isChanged =
    inputType == EventApplicationInputType.SELECT
      ? cachedOrderOption.selectedOption?.name !== selectedOption?.name
      : cachedOrderOption.selectedOption?.value !== selectedOption?.value;
  const loading = false;
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
  const handleSelectOption = ({nativeEvent: {event}}) => {
    const selectedOption = cachedOrderOption.options[Number(event)];
    if (selectedOption?.name != cachedOrderOption.selectedOption?.name)
      uploadEventApplication(selectedOption);
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

  const handleSubmitWritableOption = () => {
    if (!error() && isChanged) uploadEventApplication(selectedOption);
  };

  return {
    inputType,
    cachedOrderOption,
    uploadEventApplication,
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
    error: error(),
  };
}
