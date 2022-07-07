import React from 'react';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import ListFlatlist from 'src/components/ListFlatlist';
import {Div} from 'src/components/common/Div';
import {Span} from 'src/components/common/Span';
import {Col} from 'src/components/common/Col';
import {Img} from 'src/components/common/Img';
import {Row} from 'src/components/common/Row';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useGotoMerchandise} from 'src/hooks/useGoto';

export default function CouponListScreen() {
  const {data, isLoading, isPaginating, page, isNotPaginatable} =
    useApiSelector(apis.nft.coupon.list);
  const coupons = data?.coupons || [];
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleEndReached = () => {
    if (isPaginating || isNotPaginatable) return;
    paginateGetWithToken(apis.nft.coupon.list(page + 1), 'coupons');
  };
  const reloadGetWithToken = useReloadGETWithToken();
  const onRefresh = () => {
    if (isLoading) return;
    reloadGetWithToken(apis.nft.coupon.list());
  };
  return (
    <ListFlatlist
      onRefresh={onRefresh}
      data={coupons}
      refreshing={isLoading}
      onEndReached={handleEndReached}
      isPaginating={isPaginating}
      title={'쿠폰'}
      renderItem={({item}) => {
        return <CouponMerchandise coupon={item} />;
      }}
    />
  );
}

function CouponMerchandise({coupon}) {
  const merchandise = coupon.merchandise;
  const gotoMerchandise = useGotoMerchandise({merchandiseId: merchandise.id});
  return (
    <Div px15 py8 onPress={gotoMerchandise} borderBottom={0.5} borderGray200>
      <Row itemsCenter>
        <Col mr12>
          <Row itemsCenter>
            <Col auto>
              <Span>{coupon.label} 쿠폰</Span>
            </Col>
          </Row>
          <Div mt4>
            <Span bold fontSize={16} py4 gray700>
              {merchandise.name}
            </Span>
          </Div>
          <Row mt8>
            <Col
              auto
              border={0.5}
              borderGray200
              h35
              justifyCenter
              px16
              rounded10>
              <Span bold fontSize={16}>
                {coupon.discount_percent == 100
                  ? '드랍 쿠폰'
                  : `${coupon.discount_percent}% 할인`}
              </Span>
            </Col>
          </Row>
        </Col>
        <Col auto relative>
          <Img uri={merchandise.image_uri} h100 w100 rounded10 />
          <Div></Div>
        </Col>
      </Row>
    </Div>
  );
}
