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

export default function MerchandiseScreen() {
  const {data: nftCollectionRes, isLoading: nftCollectionLoading} =
    useApiSelector(apis.nft_collection._());
  const {data: merchandiseRes, isLoading: merchandiseLoading} = useApiSelector(
    apis.merchandise.merchandiseId,
  );
  const nftCollection = nftCollectionRes.nft_collection;
  const merchandise = merchandiseRes?.merchandise;

  const {goBack} = useNavigation();
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
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
        {!merchandise ? (
          <Span>Loading..</Span>
        ) : (
          <>
            <Div relative>
              <Div absolute top0 m16 zIndex={1}>
                <Img
                  uri={merchandise.nft_collection.image_uri}
                  h30
                  w30
                  rounded50
                />
              </Div>
              <ImageSlideShow
                borderRadius={0}
                imageUris={merchandise.image_uris}
                sliderWidth={DEVICE_WIDTH}
                sliderHeight={DEVICE_WIDTH}
              />
            </Div>
            <Div px15>
              <Div mt16>
                <Span bold fontSize={22}>
                  {merchandise.name}
                </Span>
              </Div>
              <Row py8 itemsCenter>
                <Col auto mr8 medium>
                  <Span gray700>
                    좋아요 <Span bold>{merchandise.likes_count}</Span>개
                  </Span>
                </Col>
              </Row>
              <Row py12 itemsCenter borderBottom={0.5} borderGray200>
                <Col auto mr4>
                  {!merchandise.is_airdrop_only ? (
                    <Span bold fontSize={16}>
                      {getCommaSeparatedNumber(merchandise.price)} 원
                    </Span>
                  ) : merchandise.coupon?.discount_percent == 100 ? (
                    <Span bold success fontSize={16}>
                      드랍 가능
                    </Span>
                  ) : (
                    <Span bold fontSize={16}>
                      주문불가
                    </Span>
                  )}
                </Col>
              </Row>
              {merchandise.expiresAt && (
                <Div mt16 border={0.5} borderGray200 rounded10 overflowHidden>
                  <Row py12 px16 itemsCenter>
                    <Col>
                      <Span>
                        {kmoment(merchandise.expiresA).format('YY.M.D a h:mm')}{' '}
                        까지 오픈
                      </Span>
                    </Col>
                  </Row>
                </Div>
              )}

              <Row mt16>
                <Col
                  auto
                  border={0.5}
                  borderGray200
                  h35
                  justifyCenter
                  px16
                  rounded10
                  mr8>
                  <Span fontSize={14} bold color={Colors.black}>
                    {merchandise.is_airdrop_only
                      ? '에어드랍 전용'
                      : '홀더 전용'}
                  </Span>
                </Col>
                <Col
                  auto
                  h35
                  justifyCenter
                  px16
                  border={0.5}
                  borderGray200
                  rounded10>
                  <Span fontSize={14} bold color={Colors.black}>
                    {merchandise.is_deliverable ? '배송' : '미배송'}
                  </Span>
                </Col>
              </Row>
              <Div mt16>
                <DefaultMarkdown children={merchandise.description} />
              </Div>
              <Div h50 />
            </Div>
          </>
        )}
      </ScrollView>
      {merchandise && <NewOrder merchandise={merchandise} />}
    </Div>
  );
}
