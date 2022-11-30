import {useState} from 'react';
import {Linking} from 'react-native';
import {EventApplicationInputType} from 'src/components/NewEventApplicationOptions';

export default function useUploadEventApplication({orderOption}) {
  const [cachedOrderOption, setCachedOrderOption] = useState(orderOption);
  const [showDetail, setShowDetail] = useState(false);
  const inputType = cachedOrderOption?.inputType;
  const [selectedOption, setSelectedOption] = useState(
    orderOption?.selectedOption,
  );

  const uploadEventApplication = async (SelectedOption = selectedOption) => {
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
    selectedOption == null
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
  return {
    cachedOrderOption,
    uploadEventApplication,
    onPressShowDetail,
    showDetail,
    isApplied,
    isChanged,
    loading,
    detailText,
  };
}
