import { useNavigation } from "@react-navigation/native";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Col } from "src/components/common/Col";
import { Div } from "src/components/common/Div";
import { Row } from "src/components/common/Row";
import { Span } from "src/components/common/Span";
import { s_home } from "src/i18n/text/s_home";
import { s_mypage } from "src/i18n/text/s_mypage";
import { useLocale } from "src/i18n/useLocale";
import { s_trial } from 'src/i18n/web/portal/s_trial';
import { NAV_NAMES } from "src/modules/navNames";
import { WEBVIEW_URL } from "src/modules/webviewUrl";
import { RootState } from "src/redux/rootReducer";

const HomeTopBanner = ({ creditPackages, upcomingLessons, unassignedLessons }) => {
  const navigation = useNavigation();
  const {userId, isTrialCompleted} = useSelector(
    (root: RootState) => ({
      userId: root.app.session.user?.id,
      isTrialCompleted: root.app.session.user?.trial_completed,
    }),
    shallowEqual,
  );
  const { t, locale } = useLocale();
  return (
    <>
      {isTrialCompleted ?
        (creditPackages.length > 0 ?
          <Row
            w="100%"
            h50
            itemsCenter
            bgWhite
            px20
            borderTop={1}
            borderBottom={1}
            borderGray300
            onPress={() => {
              navigation.navigate(NAV_NAMES.MainTab_1_1_lesson, {
                screen:
                  upcomingLessons.length > 0
                    ? NAV_NAMES.LessonTab_Upcoming
                    : NAV_NAMES.LessonTab_Schedule,
              });
            }}>
            <Col auto mr12>
              <Div rounded4 w8 h16 bgGray700></Div>
            </Col>
            <Col>
              <Span header5 black>
                {upcomingLessons.length > 0
                  ? t(s_home.you_have_upcoming_lesson(
                    <Span info>{upcomingLessons.length}</Span>,
                  ))
                  : t(s_home.you_have_no_upcoming_lessons)}
              </Span>
            </Col>
            <Col auto>
              <Span header5 primary p5>
                {upcomingLessons.length > 0 ? t(s_home.prep) : t(s_home.schedule)}
              </Span>
            </Col>
          </Row>
          :
          <Row
            w="100%"
            h50
            itemsCenter
            bgWhite
            px20
            borderTop={1}
            borderBottom={1}
            borderGray300
            onPress={() => {
              const purchaseUrl = WEBVIEW_URL.purchaseUrl(userId, locale);
              navigation.navigate(NAV_NAMES.PaymentWebView, {
                url: purchaseUrl,
                headerTitle: t(s_mypage.purchase_lesson_coupons),
              });
            }}>
            <Col auto mr12>
              <Div rounded4 w8 h16 bgGray500></Div>
            </Col>
            <Col>
              <Span header5 black>
                {t(s_home.you_have_no_coupons)}
              </Span>
            </Col>
            <Col auto>
              <Span header5 primary p5>
                {t(s_home.purchase)}
              </Span>
            </Col>
          </Row>
        ) :
        <Row
          w="100%"
          h50
          itemsCenter
          bgWhite
          px20
          borderTop={1}
          borderBottom={1}
          borderGray300
          onPress={() => {
            navigation.navigate(NAV_NAMES.RingleWebView, {
              url: WEBVIEW_URL.trialUrl(userId, locale),
              headerTitle: t(s_trial.free_trial_lesson),
            });
          }}>
          <Col auto mr12>
            <Div rounded4 w8 h16 bgGray700></Div>
          </Col>
          <Col>
            <Span header5 black>
              {t(s_home.experience_a_20_min_trial_lesson_right_now)}
            </Span>
          </Col>
          <Col auto>
            <Span header5 primary p5>
              {t(s_home.schedule)}
            </Span>
          </Col>
        </Row>
      }
      {unassignedLessons.length > 0 &&
        <Row
          w="100%"
          h50
          itemsCenter
          bgWhite
          px20
          borderBottom={1}
          borderGray300
          onPress={() => {
            navigation.navigate(NAV_NAMES.UnassignedLessons)
          }}>
          <Col auto mr12>
            <Div rounded4 w8 h16 bgWarning></Div>
          </Col>
          <Col>
            <Span header5 black>
              {t(s_home.lessons_available_within_24_hours(
                <Span primary>
                  {unassignedLessons.length}
                </Span>
              ))}
            </Span>
          </Col>
          <Col auto>
            <Span header5 primary p5>
              {t(s_home.schedule)}
            </Span>
          </Col>
        </Row>
      }
    </>
  )
}

export default HomeTopBanner