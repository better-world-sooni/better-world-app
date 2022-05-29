import {BlurView} from '@react-native-community/blur';
import React from 'react';
import {Linking} from 'react-native';
import {MoreHorizontal} from 'react-native-feather';
import useAttendance from 'src/hooks/useAttendance';
import {kmoment} from 'src/modules/constants';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {Col} from './Col';
import {Div} from './Div';
import ImageSlideShow from './ImageSlideShow';
import {Row} from './Row';
import {Span} from './Span';
import TruncatedText from './TruncatedText';

export default function CollectionEvent({collectionEvent, itemWidth}) {
  const {
    willAttendCount,
    maybeAttendCount,
    willAttend,
    maybeAttend,
    handlePressWillAttend,
    handlePressMaybeAttend,
  } = useAttendance({
    initialAttendance: collectionEvent.attendance_category,
    initialWillAttendCount: collectionEvent.will_attend_count,
    initialMaybeAttendCount: collectionEvent.maybe_attend_count,
    collectionEventId: collectionEvent.id,
  });
  const handlePressLocationLink = () => {
    Linking.openURL(collectionEvent.location_link);
  };
  return (
    <>
      <Div mt16 mx15 overflowHidden rounded10 border={0.5} borderGray200>
        <Div relative>
          <ImageSlideShow
            roundedTopOnly
            enablePagination={false}
            imageUris={collectionEvent.image_uris}
            sliderHeight={
              collectionEvent.image_width && collectionEvent.image_height
                ? (collectionEvent.image_height / collectionEvent.image_width) *
                  itemWidth
                : itemWidth
            }
            sliderWidth={itemWidth}
          />
          <Div m8 p8 bgRealBlack rounded100 absolute top0 right0>
            <MoreHorizontal
              strokeWidth={2}
              color={'white'}
              height={16}
              width={16}
            />
          </Div>
          <Row bottom0 absolute w={'100%'}>
            <Col
              auto
              relative
              borderTopRightRadius={10}
              overflowHidden
              maxW={(itemWidth * 5) / 6}>
              <Div
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  overflow: 'hidden',
                }}>
                <BlurView
                  blurType="light"
                  blurAmount={5}
                  blurRadius={5}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  reducedTransparencyFallbackColor="white"></BlurView>
              </Div>
              <Div px15 py8>
                <Div zIndex={100}>
                  <Span fontSize={20} bold>
                    {collectionEvent.title}
                  </Span>
                </Div>
                <Div mt8 zIndex={100}>
                  <Span fontSize={14} bold>
                    {collectionEvent.location_string}
                  </Span>
                </Div>
                <Div mt8>
                  <Span>
                    <Span bold fontSize={12}>
                      {kmoment(collectionEvent.start_time).format(
                        'YY.M.D a h:mm',
                      )}
                    </Span>{' '}
                    <Span bold fontSize={12}>
                      ~
                    </Span>{' '}
                    <Span bold fontSize={12}>
                      {kmoment(collectionEvent.end_time).format(
                        'YY.M.D a h:mm',
                      )}
                    </Span>
                  </Span>
                </Div>
              </Div>
            </Col>
            <Col itemsEnd justifyEnd></Col>
          </Row>
        </Div>
        <Div px15 py8>
          {collectionEvent.location_link ? (
            <Row itemsCenter mb8>
              <Span fontSize={14} info onPress={handlePressLocationLink}>
                {collectionEvent.location_link}
              </Span>
            </Row>
          ) : null}
          <Row mb8>
            <TruncatedText
              text={collectionEvent.description}
              maxLength={300}
              spanProps={{fontSize: 14}}
            />
          </Row>
          <Row>
            <Span fontSize={14}>
              {collectionEvent.holder_only ? '홀더에게 오픈' : '모두에게 오픈'}
            </Span>
          </Row>
          <Row mt8 itemsCenter>
            <Col auto mr16>
              <Span fontSize={12} gray700>
                Maybe{' '}
                <Span realBlack bold>
                  {maybeAttendCount}
                </Span>
              </Span>
            </Col>
            <Col auto mr>
              <Span fontSize={12} gray700>
                Yes{' '}
                <Span realBlack bold>
                  {willAttendCount}
                </Span>
              </Span>
            </Col>
            <Col />
            <Col
              bgRealBlack={!maybeAttend}
              p8
              rounded100
              border1={maybeAttend}
              borderGray400={maybeAttend}
              itemsCenter
              onPress={handlePressMaybeAttend}
              mr8>
              <Span bold white={!maybeAttend} fontSize={12}>
                Maybe
              </Span>
            </Col>
            <Col
              bgRealBlack={!willAttend}
              p8
              rounded100
              border1={willAttend}
              borderGray400={willAttend}
              onPress={handlePressWillAttend}
              itemsCenter>
              <Span bold white={!willAttend} fontSize={12}>
                Yes
              </Span>
            </Col>
          </Row>
        </Div>
      </Div>
    </>
  );
}
