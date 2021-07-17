import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { shallowEqual, useSelector } from 'react-redux';
import { Row } from 'src/components/common/Row';
import { Span } from 'src/components/common/Span';
import { s_common } from 'src/i18n/text/s_common';
import { useLocale } from 'src/i18n/useLocale';
import { s_schedule_enter } from 'src/i18n/web/portal/s_schedule_enter';
import APIS from 'src/modules/apis';
import { ICONS } from 'src/modules/icons';
import { NAV_NAMES } from 'src/modules/navNames';
import { PADDINGED_WIDTH, varStyle } from 'src/modules/styles';
import { useBetterApiGET } from 'src/modules/useCustomHooks';
import { WEBVIEW_URL } from 'src/modules/webviewUrl';
import { RootState } from 'src/redux/rootReducer';
import { Col } from './common/Col';
import { Div } from './common/Div';
import { Img } from './common/Img';
import { useApiSelector } from 'src/redux/asyncReducer';

const CreditPackages = (props) => {
  const navigation = useNavigation();
  const apiGET = useBetterApiGET();
  const { userId } = useSelector((root: RootState) => ({ userId: root.app.session.user?.id }), shallowEqual)
  const { data } = useApiSelector(APIS.credit.creditList)
  const [bannerIndex, setBannerIndex] = useState(0);
  const { t } = useLocale()

  const dataFrom = (data) => {
    const packages = data ? data.packages : []
    let freeCreditNum = 0
    let fullCreditNum = 0
    let halfCreditNum = 0
    packages.forEach((creditPackage) => {
      if (creditPackage.is_free) {
        freeCreditNum = freeCreditNum + creditPackage.unused_coupons
      } else {
        if (creditPackage.duration === 40) {
          fullCreditNum = fullCreditNum + creditPackage.unused_coupons
        } else {
          halfCreditNum = halfCreditNum + creditPackage.unused_coupons
        }
      }
    });
    return {
      creditPackages: packages,
      freeCreditNum,
      fullCreditNum,
      halfCreditNum,
    }
  }
  const { creditPackages, freeCreditNum, fullCreditNum, halfCreditNum } = dataFrom(data)

  useFocusEffect(useCallback(() => {
    apiGET({
      api: APIS.credit.creditList(),
    })
  }, []))

  return (
    <>
      <Carousel
            data={creditPackages}
            renderItem={({ item }) => {
              return (
                <Div >
                  <Div
                    border
                    borderGray300
                    rounded6>
                      <Row px10 py10>
                        <Col auto>
                          <Span>[속보]</Span>
                        </Col>
                        <Col itemsCenter>
                          <Span>오늘 코로나 확진 0명!!</Span>
                        </Col>
                      </Row>
                  </Div>
                </Div>
              );
            }}
            onSnapToItem={(index) => setBannerIndex(index)}
            sliderWidth={PADDINGED_WIDTH}
            itemWidth={PADDINGED_WIDTH}
            removeClippedSubviews={false}
          />
    </>
  );
};

export default CreditPackages;
