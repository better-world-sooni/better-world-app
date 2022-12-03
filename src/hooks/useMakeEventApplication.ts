import {useState} from 'react';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePostPromiseFnWithToken,
} from 'src/redux/asyncReducer';
import {chain} from 'lodash';
import getDrawEventStatus, {
  DrawEventStatus,
  EventApplicationStatus,
} from './getDrawEventStatus';
import {EventApplicationInputType} from 'src/components/NewEventApplicationOptions';
import {getNowDifference} from 'src/utils/timeUtils';
import {Linking} from 'react-native';

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
    if (eventApplicationOptions != null) {
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
  const drawEventStatus =
    drawEvent?.status == DrawEventStatus.IN_PROGRESS &&
    drawEvent?.expires_at &&
    getNowDifference(drawEvent?.expires_at) < 0
      ? DrawEventStatus.FINISHED
      : drawEvent?.status;
  const canModify =
    !(
      drawEvent?.event_application &&
      (drawEvent.event_application.status == EventApplicationStatus.SELECTED ||
        drawEvent.event_application.status == EventApplicationStatus.RECEIVED)
    ) && drawEventStatus == DrawEventStatus.IN_PROGRESS;
  const canShow =
    (drawEventStatus != DrawEventStatus.IN_PROGRESS &&
      drawEvent?.event_application &&
      drawEvent.event_application.status !=
        EventApplicationStatus.IN_PROGRESS) ||
    (drawEventStatus == DrawEventStatus.IN_PROGRESS && orderable);
  const orderOptions = drawEvent.draw_event_options
    ? getOrderCategories(drawEvent.draw_event_options)
    : [];
  const [orderOptionsList, setOrderOptionsList] = useState(
    orderOptions.map(value => value?.selectedOption != null),
  );
  const setOrderOptionsListAtIndex = (index, value) => {
    if (index >= orderOptionsList.length) return;
    const changedArray = [...orderOptionsList];
    changedArray[index] = value;
    setOrderOptionsList(changedArray);
  };
  const selectIndex = orderOptionsList.reduce((acc, cur, idx) => {
    return (acc += acc == idx && cur == true ? 1 : 0);
  }, 0);
  const [cacheApplied, setCacheApplied] = useState(
    drawEvent.event_application ? true : false,
  );
  const isApplied =
    (orderOptionsList.length != 0 && selectIndex == orderOptionsList.length) ||
    (orderOptionsList.length == 0 && cacheApplied);
  const eventApplicationStatus =
    drawEvent?.event_application && drawEvent.event_application.status;
  const eventApplicationCount =
    (drawEvent?.event_application_count
      ? drawEvent?.event_application_count
      : 0) +
    (!(eventApplicationStatus != EventApplicationStatus.IN_PROGRESS)
      ? isApplied
        ? 1
        : 0
      : eventApplicationStatus == null && isApplied
      ? 1
      : 0);
  const applicationLink = drawEvent?.application_link;
  const postPromiseFnWithToken = usePostPromiseFnWithToken();
  const onPressApply = isApplied
    ? applicationLink && applicationLink != ''
      ? () => Linking.openURL(applicationLink)
      : null
    : async () => {
        if (applicationLink && applicationLink != '')
          Linking.openURL(applicationLink);
        if (!isApplied) {
          setCacheApplied(true);
          const body = {
            draw_event_id: drawEvent?.id,
            draw_event_options: {},
            all: true,
          };
          try {
            const {data} = await postPromiseFnWithToken({
              url: apis.event_application._().url,
              body,
            });
            if (!data.success) {
              setCacheApplied(false);
              return;
            }
          } catch (error) {
            console.log(error);
            setCacheApplied(false);
            return;
          }
        }
      };
  return {
    canShow,
    canModify,
    orderableType,
    orderOptions,
    drawEventStatus,
    setOrderOptionsListAtIndex,
    applicationLink,
    onPressApply,
    eventApplicationStatus,
    eventApplicationCount,
    isApplied,
    selectIndex,
  };
}
