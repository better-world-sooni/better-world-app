import {MenuView} from '@react-native-menu/menu';
import React from 'react';
import {ActivityIndicator} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useGotoMerchandise} from 'src/hooks/useGoto';
import useUpdateOrder from 'src/hooks/useUpdateOrder';
import PolymorphicOwner from '../PolymorphicOwner';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';

enum OrderStatus {
  CREATED = 0,
  PAID = 1,
  COMPLETED = 2,
  CANCELED = 3,
}
const airdropTypes = [
  {
    id: `${OrderStatus.CREATED}`,
    title: '주문 생성',
  },
  {
    id: `${OrderStatus.PAID}`,
    title: '구매 완료',
  },
  {
    id: `${OrderStatus.COMPLETED}`,
    title: '구매 확정',
  },
  {
    id: `${OrderStatus.CANCELED}`,
    title: '주문 취소',
  },
];

export default function OrderMerchandise({order, admin = false}) {
  const {
    order: cachedOrder,
    loading,
    updateOrderStatus,
  } = useUpdateOrder({initialOrder: order});
  const handlePressStatus = ({nativeEvent: {event}}) => {
    updateOrderStatus(parseInt(event));
  };
  const merchandise = cachedOrder.merchandise;
  const gotoMerchandise = useGotoMerchandise({merchandiseId: merchandise.id});
  const status =
    cachedOrder.status == OrderStatus.CREATED
      ? '주문 생성'
      : cachedOrder.status == OrderStatus.PAID
      ? '구매 완료'
      : cachedOrder.status == OrderStatus.COMPLETED
      ? '구매 확정'
      : '주문 취소';
  return (
    <Div px15 py8>
      <Row mb8>
        <Col auto>
          {admin ? (
            <MenuView onPressAction={handlePressStatus} actions={airdropTypes}>
              <Span fontSize={16} info bold>
                {loading ? <ActivityIndicator /> : status}
              </Span>
            </MenuView>
          ) : (
            <Span info bold fontSize={16}>
              {status}
            </Span>
          )}
        </Col>
      </Row>
      {admin && (
        <Div rounded10 overflowHidden border={0.5} borderGray200 mb8>
          <PolymorphicOwner showFollowing={false} nft={cachedOrder.nft} />
        </Div>
      )}
      <Row>
        <Col auto relative mr12 onPress={gotoMerchandise}>
          <Img uri={merchandise.image_uri} h100 w100 rounded10 />
        </Col>
        <Col>
          <Div>
            <Span>{merchandise.nft_collection.name}</Span>
            <Span bold fontSize={16} py4>
              {merchandise.name}
            </Span>
          </Div>
          {cachedOrder.order_options.map(order_option => {
            return (
              <Row itemsCenter>
                <Col auto borderRight={1} pr8 borderGray600>
                  <Span gray600 bold>
                    {order_option.category}
                  </Span>
                </Col>
                <Col pl8>
                  <Span gray600 bold>
                    {order_option.name}
                  </Span>
                </Col>
              </Row>
            );
          })}
          <Row mt8 itemsCenter>
            <Col auto>
              <Span bold fontSize={19}>
                {cachedOrder.paid_price} 원
              </Span>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row mt12>
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
            {merchandise.is_airdrop_only ? '드랍 전용' : '홀더 전용'}
          </Span>
        </Col>
        <Col
          auto
          h35
          justifyCenter
          px16
          border={0.5}
          borderGray200
          rounded10
          mr8>
          <Span fontSize={14} bold color={Colors.black}>
            {merchandise.is_deliverable ? '배송' : '미배송'}
          </Span>
        </Col>
        {cachedOrder.coupon && (
          <Col
            h35
            justifyCenter
            px16
            border={0.5}
            borderGray200
            rounded10
            itemsCenter>
            <Span fontSize={14} bold color={Colors.black} numberOfLines={1}>
              쿠폰: {cachedOrder.coupon.label}
            </Span>
          </Col>
        )}
      </Row>
    </Div>
  );
}
