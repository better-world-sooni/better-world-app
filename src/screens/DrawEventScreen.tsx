import React from 'react';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {ChevronLeft} from 'react-native-feather';
import apis from 'src/modules/apis';
import {useNavigation} from '@react-navigation/native';
import {Span} from 'src/components/common/Span';
import {ScrollView} from 'src/components/common/ViewComponents';
import {useApiSelector} from 'src/redux/asyncReducer';
import {Colors, DEVICE_WIDTH} from 'src/modules/styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {kmoment} from 'src/utils/timeUtils';
import ImageSlideShow from 'src/components/common/ImageSlideShow';
import DefaultMarkdown from 'src/components/common/DefaultMarkdown';
import {getCommaSeparatedNumber} from 'src/utils/numberUtils';
import NewOrder from 'src/components/common/NewOrder';
import {Img} from 'src/components/common/Img';
import MerchandiseLoading from 'src/components/loading/MerchandiseLoading';
import ImageCarousel from 'src/components/common/ImageCarousel';
import useDrawEventStatus from 'src/hooks/useDrawEventStatus';
import NewEventApplication from 'src/components/common/NewEventApplication';

export default function DrawEventScreen() {
  const {data: drawEventRes, isLoading: drawEventLoading} = useApiSelector(
    apis.draw_event.drawEventId,
  );
  const drawEvent = drawEventRes?.draw_event;

  const {goBack} = useNavigation();
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
  const drawEventStatus = useDrawEventStatus({drawEvent});
  return (
    <Div relative bgWhite flex={1}>
      <Div h={headerHeight} zIndex={100}>
        <Div zIndex={100} absolute w={DEVICE_WIDTH} top={notchHeight + 5}>
          <Row itemsCenter py5 h40 px8>
            <Col auto onPress={goBack}>
              <ChevronLeft height={30} color={Colors.black} strokeWidth={2} />
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
              <ImageCarousel
                images={drawEvent.image_uris}
                sliderWidth={DEVICE_WIDTH}
                sliderHeight={DEVICE_WIDTH}
              />
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
              <Row py12 itemsCenter borderBottom={0.5} borderGray200>
                <Col auto mr4>
                  <Span bold fontSize={16}>
                    {drawEvent.giveaway_merchandise}
                  </Span>
                </Col>
              </Row>
              {drawEvent.expires_at && (
                <Div mt16 border={0.5} borderGray200 rounded10 overflowHidden>
                  <Row py12 px16 itemsCenter>
                    <Col>
                      <Span>
                        {kmoment(drawEvent.expires_at).format('YY.M.D a h:mm')}{' '}
                        까지 오픈
                      </Span>
                    </Col>
                  </Row>
                </Div>
              )}
              <Div mt16>
                <DefaultMarkdown children={drawEvent.description} />
              </Div>
              <Div h50 />
            </Div>
          </>
        )}
      </ScrollView>
      {drawEvent && <NewEventApplication drawEvent={drawEvent} />}
    </Div>
  );
}
