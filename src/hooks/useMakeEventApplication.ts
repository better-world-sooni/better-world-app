import {useState} from 'react';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePostPromiseFnWithToken,
} from 'src/redux/asyncReducer';
import {chain} from 'lodash';
import getDrawEventStatus from './getDrawEventStatus';
import {EventApplicationInputType} from 'src/components/NewEventApplicationOptions';

export type OrderOption = {
  name: string;
  id: number;
  merchandise_id: number;
  category: string;
  selected: boolean;
  value?: string;
};
export type SelectableOrderCategory = {
  name: string;
  inputType: EventApplicationInputType;
  selectedOption: OrderOption;
  options: OrderOption[];
};

export enum OrderableType {
  HOLDER_ONLY = 0,
  ALL = 1,
}

export default function useMakeEventApplication({drawEvent}) {
  const {data} = useApiSelector(apis.nft._());
  const nft = data?.nft;
  const eventApplicationOptions = drawEvent?.event_application_options;

  const isSelectedOption = (targetOptionId, optionIds) => {
    for (const optionId of optionIds) {
      if (targetOptionId == optionId) {
        return true;
      }
    }
    return false;
  };

  const findSelectedCategory = options => {
    const optionIds = options.map(value => value.id);
    for (const eventApplicationoption of eventApplicationOptions) {
      if (
        isSelectedOption(
          eventApplicationoption?.draw_event_option?.id,
          optionIds,
        )
      ) {
        return eventApplicationoption?.draw_event_option;
      }
    }
    return null;
  };

  const findWritedCategory = (
    options,
    inputType = EventApplicationInputType.CUSTOM_INPUT,
  ) => {
    if (!options || options.length == 0) return null;
    const option = options[0];
    const optionId = option.id;
    if (eventApplicationOptions != null) {
      for (const eventApplicationoption of eventApplicationOptions) {
        if (eventApplicationoption?.draw_event_option?.id == optionId) {
          return (inputType = EventApplicationInputType.CUSTOM_INPUT
            ? {
                ...eventApplicationoption?.draw_event_option,
                value: eventApplicationoption?.value,
              }
            : eventApplicationoption?.draw_event_option);
        }
      }
    }
    if (inputType == EventApplicationInputType.DISCORD_ID && nft?.discord_id)
      return {...option, value: nft?.discord_id};
    if (inputType == EventApplicationInputType.TWITTER_ID && nft?.twitter_id)
      return {...option, value: nft?.twitter_id};
    return null;
  };

  const getOrderCategories = orderOptions => {
    return chain(orderOptions)
      .groupBy('category')
      .map((value, key) => {
        const options = value;
        if (
          options.length == 1 &&
          options[0].input_type == EventApplicationInputType.LINK
        )
          return {
            name: key,
            inputType: EventApplicationInputType.LINK,
            selectedOption: findWritedCategory(
              options,
              EventApplicationInputType.LINK,
            ),
            id: options[0].id,
            options,
          };
        if (
          options.length == 1 &&
          options[0].input_type == EventApplicationInputType.CUSTOM_INPUT
        )
          return {
            name: key,
            inputType: EventApplicationInputType.CUSTOM_INPUT,
            selectedOption: findWritedCategory(
              options,
              EventApplicationInputType.CUSTOM_INPUT,
            ),
            id: options[0].id,
            options,
          };
        if (
          options.length == 1 &&
          options[0].input_type == EventApplicationInputType.DISCORD_ID
        )
          return {
            name: key,
            inputType: EventApplicationInputType.DISCORD_ID,
            selectedOption: findWritedCategory(
              options,
              EventApplicationInputType.DISCORD_ID,
            ),
            id: options[0].id,
            options,
          };
        if (
          options.length == 1 &&
          options[0].input_type == EventApplicationInputType.TWITTER_ID
        )
          return {
            name: key,
            inputType: EventApplicationInputType.TWITTER_ID,
            selectedOption: findWritedCategory(
              options,
              EventApplicationInputType.TWITTER_ID,
            ),
            id: options[0].id,
            options,
          };
        if (options[0].input_type == EventApplicationInputType.SELECT)
          return {
            name: key,
            inputType: EventApplicationInputType.SELECT,
            selectedOption: findSelectedCategory(options),
            id: options[0].id,
            options,
          };
      })
      .value();
  };

  const orderableType = drawEvent?.orderable_type;
  const orderable =
    orderableType == OrderableType.ALL
      ? true
      : orderableType == OrderableType.HOLDER_ONLY &&
        drawEvent?.nft_collection?.contract_address == nft?.contract_address
      ? true
      : false;
  //   const [loading, setLoading] = useState(false);
  //   const [error, setError] = useState('');
  const orderOptions = drawEvent.draw_event_options
    ? getOrderCategories(drawEvent.draw_event_options)
    : [];
  //   const postPromiseFnWithToken = usePostPromiseFnWithToken();
  const drawEventStatus = getDrawEventStatus({drawEvent});

  //   const uploadEventApplication = async () => {
  //     if (loading) {
  //       return;
  //     }
  //     if (!orderable) {
  //       return;
  //     }
  //     const selectedOptions = {};
  //     for (const orderCategory of orderOptions) {
  //       if (orderCategory.selectedOption)
  //         selectedOptions[orderCategory.selectedOption.category] =
  //           orderCategory.selectedOption;
  //       else {
  //         setError('옵션을 선택해 주세요.');
  //       }
  //     }
  //     setLoading(true);
  //     const body = {
  //       draw_event_id: drawEvent.id,
  //       draw_event_options: selectedOptions,
  //     };
  //     const {data} = await postPromiseFnWithToken({
  //       url: apis.event_application._().url,
  //       body,
  //     });
  //     if (!data.success) {
  //       setLoading(false);
  //       return;
  //     }
  //     uploadSuccessCallback();
  //     setLoading(false);
  //   };

  //   const handleSelectOption = (categoryIndex, optionIndex) => {
  //     setError('');
  //     const newOrderOptions = [...orderOptions];
  //     const categoryToChange = orderOptions[categoryIndex];
  //     const changedOptions = categoryToChange.options.map((option, index) => {
  //       const selected = index == optionIndex;
  //       return {...option, selected};
  //     });
  //     const changedSelectedCategory = {
  //       ...categoryToChange,
  //       selectedOption: changedOptions[optionIndex],
  //       options: changedOptions,
  //     };
  //     newOrderOptions[categoryIndex] = changedSelectedCategory;
  //     setOrderOptions(newOrderOptions);
  //   };

  //   const handleWriteOption = (categoryIndex, optionValue) => {
  //     setError('');
  //     const newOrderOptions = [...orderOptions];
  //     const categoryToChange = orderOptions[categoryIndex];
  //     const changedOptions = {...categoryToChange.options[0], value: optionValue};
  //     const changedSelectedCategory = {
  //       ...categoryToChange,
  //       selectedOption: optionValue ? changedOptions : null,
  //       value: optionValue,
  //     };
  //     newOrderOptions[categoryIndex] = changedSelectedCategory;
  //     setOrderOptions(newOrderOptions);
  //   };

  return {
    orderable,
    orderableType,
    orderOptions,
    drawEventStatus,
  };
}
