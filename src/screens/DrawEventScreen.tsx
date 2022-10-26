import React, {useEffect, useState} from 'react';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {ChevronLeft, Eye, User, X} from 'react-native-feather';
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
import getDrawEventStatus, {
  EventApplicationStatus,
} from 'src/hooks/getDrawEventStatus';
import NewEventApplication from 'src/components/common/NewEventApplication';
import {Linking, Platform} from 'react-native';
import {HAS_NOTCH} from 'src/modules/constants';
import CountdownText from 'src/components/common/CountdownText';
import AutolinkTextWrapper from 'src/components/common/AutolinkTextWrapper';
import ImageSlideShow from 'src/components/common/ImageSlideShow';
import GradientText from 'src/components/common/GradientText';

export default function DrawEventScreen() {
  const {data: drawEventRes, isLoading: drawEventLoading} = useApiSelector(
    apis.draw_event.drawEventId,
  );

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

  const {goBack} = useNavigation();
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
  const drawEventStatus = getDrawEventStatus({drawEvent});
  const [congratsOn, setCongratsOn] = useState(false);
  useEffect(() => {
    setCongratsOn(
      drawEvent?.event_application?.status == EventApplicationStatus.SELECTED,
    );
  }, [drawEvent]);
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
              <Row itemsCenter h40 px8>
                <Col auto onPress={goBack}>
                  <ChevronLeft
                    width={30}
                    height={30}
                    color={Colors.black}
                    strokeWidth={1.4}
                  />
                </Col>
                <Col itemsCenter>
                  <Span bold fontSize={16} numberOfLines={1}>
                    {drawEvent?.name}
                  </Span>
                </Col>
                <Col auto>
                  <ChevronLeft
                    height={30}
                    color={Colors.white}
                    strokeWidth={2}
                  />
                </Col>
              </Row>
            </Div>
          </Div>
          <ScrollView keyboardShouldPersistTaps="always">
            {!drawEvent ? (
              <MerchandiseLoading />
            ) : (
              <>
                <Div relative>
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
                </Div>
                <Div>
                  <Row borderBottom={0.5} borderGray200 itemsCenter py10 px15>
                    {drawEvent?.has_application ? (
                      <Col auto mr8 px14 justifyCenter rounded10 bgBlue h23>
                        <Span bold white fontSize={12}>
                          이벤트
                        </Span>
                      </Col>
                    ) : (
                      <Col auto mr8 px14 justifyCenter rounded10 bgPrimary h23>
                        <Span bold white fontSize={12}>
                          공지사항
                        </Span>
                      </Col>
                    )}
                    {drawEvent?.has_application && (
                      <Col
                        auto
                        mr8
                        px6
                        justifyCenter
                        rounded10
                        bg={
                          drawEvent?.has_application
                            ? Colors.blue.light
                            : Colors.primary.light
                        }
                        h23>
                        <Span
                          bold
                          color={
                            drawEvent?.has_application
                              ? Colors.blue.DEFAULT
                              : Colors.primary.DEFAULT
                          }
                          fontSize={12}>
                          {drawEventStatus.string}
                        </Span>
                      </Col>
                    )}
                    <Col
                      auto
                      mr8
                      border={1}
                      borderColor={
                        drawEvent?.has_application
                          ? Colors.blue.DEFAULT
                          : Colors.primary.DEFAULT
                      }
                      justifyCenter
                      px6
                      rounded10
                      h23>
                      <Row itemsCenter>
                        <Col auto mr2>
                          <User
                            color={
                              drawEvent?.has_application
                                ? Colors.blue.DEFAULT
                                : Colors.primary.DEFAULT
                            }
                            height={12}
                            width={12}
                            strokeWidth={3}
                          />
                        </Col>
                        <Col auto>
                          <Span
                            color={
                              drawEvent?.has_application
                                ? Colors.blue.DEFAULT
                                : Colors.primary.DEFAULT
                            }
                            bold
                            fontSize={12}>{`${drawEvent.read_count}`}</Span>
                        </Col>
                      </Row>
                    </Col>
                    <Col auto></Col>
                  </Row>
                  {drawEvent?.discord_link ? (
                    <Row px15 py15>
                      <Col></Col>
                      <Col
                        auto
                        onPress={() =>
                          Linking.openURL(drawEvent?.discord_link)
                        }>
                        <Span bold gray600>
                          본문 바로가기
                        </Span>
                      </Col>
                    </Row>
                  ) : null}
                  <Div itemsCenter px15 py15>
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
      {congratsOn && (
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
                <Span fontSize={64}>🎉</Span>
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
      )}
    </>
  );
}
