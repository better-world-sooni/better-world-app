import {useState} from 'react';
import {
  EventApplicationCategory,
  EventApplicationInputType,
} from 'src/components/NewEventApplicationOptions';
import apis from 'src/modules/apis';
import {usePostPromiseFnWithToken} from 'src/redux/asyncReducer';
import {OrderableType} from './useMakeEventApplication';
import useUploadImages from './useUploadImages';

export default function useUploadDrawEvent({initialHasApplication}) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [discordLink, setDiscordLink] = useState('');
  const [description, setDescription] = useState('');
  const [orderableType, setOrderableType] = useState(OrderableType.HOLDER_ONLY);
  const [expiresAt, setExpiresAt] = useState(null);
  const [applicationCategories, setApplicationCategories] = useState<
    EventApplicationCategory[]
  >([]);
  const {
    images,
    error,
    setError,
    handleAddImages,
    handleRemoveImage,
    uploadAllSelectedFiles,
  } = useUploadImages({attachedRecord: 'draw_event', fileLimit: 8});
  const postPromiseFnWithToken = usePostPromiseFnWithToken();
  const uploadDrawEvent = async ({uploadSuccessCallback}) => {
    if (loading) {
      return;
    }
    if (!name) {
      setError('이름을 작성해주세요.');
      return;
    }
    if (!description) {
      setError('설명을 작성해주세요.');
      return;
    }
    if (initialHasApplication && images.length == 0) {
      setError('이미지를 추가해주세요.');
      return;
    }
    setLoading(true);
    const signedIdArray = await uploadAllSelectedFiles();
    const applicationOptions = applicationCategories
      .map(applicationCategory => {
        if (applicationCategory.inputType !== EventApplicationInputType.SELECT)
          return {
            name: applicationCategory.name,
            category: applicationCategory.category,
            input_type: applicationCategory.inputType,
          };
        return applicationCategory.options.map(applicationOption => {
          return {
            name: applicationOption,
            category: applicationCategory.category,
            input_type: applicationCategory.inputType,
          };
        });
      })
      .flat();
    const body = {
      name,
      description,
      images: signedIdArray,
      expires_at: expiresAt,
      has_application: initialHasApplication,
      application_link: null,
      discord_link: discordLink ? discordLink : null,
      draw_event_options_attributes: applicationOptions,
      orderable_type: orderableType,
    };
    const {data} = await postPromiseFnWithToken({
      url: apis.draw_event._().url,
      body,
    });
    if (!data?.success) {
      setError('응모 이벤트 업로드중 문제가 발생하였습니다.');
      setLoading(false);
      return;
    }
    uploadSuccessCallback();
    setLoading(false);
    setError('');
  };
  const handleDiscordLinkChange = text => {
    setDiscordLink(text);
    setError('');
  };
  const toggleOrderableType = () => {
    if (orderableType == OrderableType.ALL) {
      setOrderableType(OrderableType.HOLDER_ONLY);
      return;
    }
    if (orderableType == OrderableType.HOLDER_ONLY) {
      setOrderableType(OrderableType.ALL);
      return;
    }
  };
  const handleDescriptionChange = text => {
    setDescription(text);
    setError('');
  };
  const handleNameChange = text => {
    setName(text);
    setError('');
  };
  const handleAddApplicationCategory = (name, inputType) => {
    const newApplicationCategory = {
      name: inputType == EventApplicationInputType.LINK ? '' : name,
      category:
        name +
        (inputType == EventApplicationInputType.DISCORD_ID ||
        inputType == EventApplicationInputType.TWITTER_ID
          ? ' 입력'
          : ''),

      options: [],
      inputType,
    };
    setApplicationCategories([
      ...applicationCategories,
      newApplicationCategory,
    ]);
  };

  const handleRemoveApplicationCategory = index => {
    const newApplicationCategories = applicationCategories
      .slice(0, index)
      .concat(applicationCategories.slice(index + 1));
    setApplicationCategories(newApplicationCategories);
  };

  const handleChangeApplicationName = (categoryIndex, value) => {
    const newApplicationCategories = [...applicationCategories];
    if (newApplicationCategories[categoryIndex]) {
      newApplicationCategories[categoryIndex] = {
        ...newApplicationCategories[categoryIndex],
        name: value,
      };
      setApplicationCategories(newApplicationCategories);
    }
  };

  const handleAddApplicationOption = (categoryIndex, optionName) => {
    const newApplicationCategories = [...applicationCategories];
    if (newApplicationCategories[categoryIndex]) {
      newApplicationCategories[categoryIndex].options = [
        ...newApplicationCategories[categoryIndex].options,
        optionName,
      ];
      setApplicationCategories(newApplicationCategories);
    }
  };

  const handleRemoveApplicationOption = (categoryIndex, optionIndex) => {
    const newApplicationCategories = [...applicationCategories];
    if (newApplicationCategories[categoryIndex]) {
      newApplicationCategories[categoryIndex].options =
        newApplicationCategories[categoryIndex].options
          .slice(0, optionIndex)
          .concat(
            newApplicationCategories[categoryIndex].options.slice(
              optionIndex + 1,
            ),
          );
      setApplicationCategories(newApplicationCategories);
    }
  };

  return {
    error,
    loading,
    discordLink,
    handleDiscordLinkChange,
    applicationCategories,
    handleAddApplicationCategory,
    handleRemoveApplicationCategory,
    handleChangeApplicationName,
    handleAddApplicationOption,
    handleRemoveApplicationOption,
    orderableType,
    toggleOrderableType,
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
  };
}
