import React from 'react';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {ChevronLeft, Eye} from 'react-native-feather';
import apis from 'src/modules/apis';
import {useNavigation} from '@react-navigation/native';
import {Span} from 'src/components/common/Span';
import {
  KeyboardAvoidingView,
  ScrollView,
} from 'src/components/common/ViewComponents';
import {useApiSelector} from 'src/redux/asyncReducer';
import {Colors, DEVICE_WIDTH} from 'src/modules/styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {kmoment} from 'src/utils/timeUtils';
import DefaultMarkdown from 'src/components/common/DefaultMarkdown';
import {Img} from 'src/components/common/Img';
import MerchandiseLoading from 'src/components/loading/MerchandiseLoading';
import ImageCarousel from 'src/components/common/ImageCarousel';
import getDrawEventStatus from 'src/hooks/getDrawEventStatus';
import NewEventApplication from 'src/components/common/NewEventApplication';
import {Platform} from 'react-native';
import {HAS_NOTCH} from 'src/modules/constants';
import CountdownText from 'src/components/common/CountdownText';
import AutolinkTextWrapper from 'src/components/common/AutolinkTextWrapper';
import ImageSlideShow from 'src/components/common/ImageSlideShow';

export default function DrawEventScreen() {
  const {data: drawEventRes, isLoading: drawEventLoading} = useApiSelector(
    apis.draw_event.drawEventId,
  );
  const drawEvent = drawEventRes?.draw_event;

  const {goBack} = useNavigation();
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
  const drawEventStatus = getDrawEventStatus({drawEvent});
  return (
    <>
      <KeyboardAvoidingView
        flex={1}
        bgWhite
        relative
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Div relative bgWhite flex={1}>
          <Div h={headerHeight}>
            <Div absolute w={DEVICE_WIDTH} top={notchHeight + 5}>
              <Row itemsCenter py5 h40 px8>
                <Col auto onPress={goBack}>
                  <ChevronLeft
                    height={30}
                    color={Colors.black}
                    strokeWidth={2}
                  />
                </Col>
                <Col itemsEnd></Col>
              </Row>
            </Div>
          </Div>
          <ScrollView keyboardShouldPersistTaps="always">
            {!drawEvent ? (
              <MerchandiseLoading />
            ) : (
              <>
                <Div relative>
                  <Div absolute top0 m16 zIndex={1}>
                    <Img
                      uri={drawEvent.nft_collection.image_uri}
                      h30
                      w30
                      rounded50
                    />
                  </Div>
                  <ImageSlideShow
                    borderRadius={0}
                    imageUris={drawEvent.image_uris}
                    sliderWidth={DEVICE_WIDTH}
                    sliderHeight={DEVICE_WIDTH}
                  />
                  {drawEvent.expires_at && drawEvent.expires_at > new Date() ? (
                    <Div absolute top8 right8 bgDanger py6 px8 rounded10>
                      <CountdownText dueDate={drawEvent.expires_at} />
                    </Div>
                  ) : null}
                  <Div>
                    <Row
                      absolute
                      bottom8
                      right8
                      bg={'rgba(0,0,0,0.5)'}
                      px10
                      py7
                      rounded7
                      itemsCenter>
                      <Col auto mr4>
                        <Eye color={Colors.white} width={12} height={12} />
                      </Col>
                      <Col auto>
                        <Span
                          white
                          bold
                          fontSize={10}>{`${drawEvent.read_count}`}</Span>
                      </Col>
                    </Row>
                  </Div>
                </Div>
                <Div px15>
                  <Row mt16>
                    <Col
                      auto
                      zIndex={1}
                      px12
                      py6
                      rounded12
                      backgroundColor={drawEventStatus.color}>
                      <Span bold white>
                        {drawEventStatus.string}
                      </Span>
                    </Col>
                  </Row>
                  <Div mt16>
                    <Span bold fontSize={22}>
                      {drawEvent.name}
                    </Span>
                  </Div>
                  {drawEvent?.has_application && (
                    <Row py12 itemsCenter borderBottom={0.5} borderGray200>
                      <Col auto mr4>
                        <Span bold fontSize={16}>
                          {drawEvent.giveaway_merchandise}
                        </Span>
                      </Col>
                    </Row>
                  )}
                  <Div mt16>
                    <DefaultMarkdown children={drawEvent.description} />
                  </Div>
                  <Div h50 />
                </Div>
              </>
            )}
          </ScrollView>
          {drawEvent?.has_application && (
            <NewEventApplication drawEvent={drawEvent} />
          )}
        </Div>
      </KeyboardAvoidingView>
      <Div h={HAS_NOTCH ? 27 : 12} bgWhite />
    </>
  );
}
