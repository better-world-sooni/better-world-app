import React, {useEffect, useState} from 'react';
import {Div} from 'src/components/common/Div';
import apis from 'src/modules/apis';
import {KeyboardAvoidingView} from 'src/components/common/ViewComponents';
import {useApiSelector} from 'src/redux/asyncReducer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MerchandiseLoading from 'src/components/loading/MerchandiseLoading';
import {EventApplicationStatus} from 'src/hooks/getDrawEventStatus';
import {Platform} from 'react-native';
import FullDrawEvent from 'src/components/common/FullDrawEvent';
import NotFound from 'src/components/error/NotFound';

export default function DrawEventScreen({
  route: {
    params: {
      onlyComments = false,
      autoFocus = false,
      image_uri,
      hasApplication = false,
    },
  },
}) {
  const {
    data: drawEventRes,
    isLoading: drawEventLoading,
    error,
  } = useApiSelector(apis.draw_event.drawEventId._);
  const drawEvent = drawEventRes?.draw_event;
  const shadowProps = {
    style: {
      shadowOffset: {
        width: 3,
        height: 3,
      },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 2,
    },
  };
  const notchHeight = useSafeAreaInsets().bottom;
  const [congratsOn, setCongratsOn] = useState(false);
  useEffect(() => {
    setCongratsOn(
      drawEvent?.event_application?.status == EventApplicationStatus.SELECTED,
    );
  }, [drawEvent]);
  if (drawEventLoading)
    return (
      <MerchandiseLoading
        isEvent={hasApplication}
        hasImage={image_uri ? true : false}
      />
    );
  if (!drawEventRes && error)
    return <NotFound text={'해당 이벤트는 지워졌습니다.'} />;
  return (
    <>
      <KeyboardAvoidingView
        flex={1}
        bgWhite
        relative
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {drawEventRes?.draw_event ? (
          <FullDrawEvent drawEvent={drawEventRes?.draw_event} />
        ) : null}
      </KeyboardAvoidingView>
      <Div h={notchHeight} bgWhite />
      {/* {congratsOn && (
        <Div
          w={'100%'}
          h={'100%'}
          itemsCenter
          justifyCenter
          absolute
          bg={'rgba(0,0,0,0.4)'}
          onPress={() => setCongratsOn(false)}>
          <Div
            w={(DEVICE_WIDTH * 2) / 3}
            h={(DEVICE_WIDTH * 2) / 3}
            {...shadowProps}
            rounded10
            bgWhite
            relative
            itemsCenter
            justifyCenter>
            <Div top8 right8 absolute onPress={() => setCongratsOn(false)}>
              <X height={34} color={Colors.gray[600]} strokeWidth={2} />
            </Div>
            <Div itemsCenter justifyCenter>
              <Div mt30>
                <Img
                  source={ICONS.partyPopper}
                  h={(559 / 512) * 100}
                  w100></Img>
              </Div>
              <Div mt20 itemsCenter justifyCenter>
                <GradientText
                  text={'축하합니다!'}
                  height={30}
                  width={100}
                  fontSize={20}
                />
                <GradientText
                  text={'당첨되었습니다!'}
                  height={30}
                  width={140}
                  fontSize={20}
                />
              </Div>
            </Div>
          </Div>
        </Div>
      )} */}
    </>
  );
}
