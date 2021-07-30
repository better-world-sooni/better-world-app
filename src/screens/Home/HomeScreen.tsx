import {
  useNavigation
} from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import '@react-native-firebase/auth';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { shallowEqual, useSelector } from 'react-redux';
import { Col } from 'src/components/common/Col';
import { Div } from 'src/components/common/Div';
import { Img } from 'src/components/common/Img';
import { Row } from 'src/components/common/Row';
import { Span } from 'src/components/common/Span';
import { s_common } from 'src/i18n/text/s_common';
import { s_home } from 'src/i18n/text/s_home';
import { s_mypage } from 'src/i18n/text/s_mypage';
import { useLocale } from 'src/i18n/useLocale';
import APIS from 'src/modules/apis';
import {
  CHALLENGE,
  GEN_FREE_LESSON,
  INVITE,
  MOVE_WEBVIEW,
  PURCHASE_PROMOTION,
  TUTOR_SCHEDULE_UPLOAD
} from 'src/modules/contants';
import { ICONS } from 'src/modules/icons';
import { IMAGES } from 'src/modules/images';
import { NAV_NAMES } from 'src/modules/navNames';
import { DEVICE_WIDTH, PADDINGED_WIDTH, varStyle } from 'src/modules/styles';
import { ScrollView } from 'src/modules/viewComponents';
import { WEBVIEW_URL } from 'src/modules/webviewUrl';
import { useApiPOST, useApiSelector, useReloadGET } from 'src/redux/asyncReducer';
import CreditPackages from 'src/components/CreditPackages';
import { RootState } from 'src/redux/rootReducer';
import HomeTopBanner from './HomeTopBanner';


const HomeScreen = (props) => {
  const navigation = useNavigation();
  const apiGET = useReloadGET();
  const apiPOST = useApiPOST();
  const {t, locale} = useLocale();
  const {data: curationData, isLoading} = useApiSelector(APIS.home.curation);
  // const events = curationData ? curationData.events : [];
  // const homeContents = curationData ? curationData.data : [];
  // const {data: upcomingData} = useApiSelector(APIS.lessons.upcomings);
  // const upcomingLessons = upcomingData ? upcomingData.upcoming_lessons : [];
  // const {data: notiData} = useApiSelector(APIS.notifications.get);
  // const {data: unassignedData} = useApiSelector(APIS.lessons.unassigned.get);
  // const unassignedLessons = unassignedData
  //   ? unassignedData.unassigned_lessons
  //   : [];
  // const hasUnreadNotification = notiData
  //   ? notiData.pushNotifications.some((notification) => !notification.has_read)
  //   : false;
  // const {data: creditData} = useApiSelector(APIS.credit.creditList);
  // const creditPackages = creditData
  //   ? creditData.packages.filter((e) => !e.is_free)
  //   : [];

  // const {userId} = useSelector(
  //   (root: RootState) => ({userId: root.app.session.user?.id}),
  //   shallowEqual,
  // );

  const reloadOnFocus = () => {
    apiGET(APIS.lessons.unassigned.get());
  };

  const pullToRefresh = () => {
    apiGET(APIS.home.curation());
    reloadOnFocus();
  };

  useEffect(() => {
    // fcmInitialize();
    reloadOnFocus();
    pullToRefresh();
  }, []);

  // const fcmInitialize = async () => {
  //   const channel = new firebase.notifications.Android.Channel(
  //     'ringle',
  //     'Ringle',
  //     firebase.notifications.Android.Importance.High,
  //   ).setDescription(
  //     t(
  //       s_common.we_will_send_you_news_special_offers_and_other_information_about_ringle,
  //     ),
  //   );
  //   firebase.notifications().android.createChannel(channel);
  //   checkPermission();
  //   createNotificationListeners();
  // };

  // const initBadgeNum = () => {
  //   new firebase.notifications().setBadge(0);
  //   firebase.notifications().removeAllDeliveredNotifications();
  //   apiPOST(APIS.notifications.read(), {}, ({data}) => {
  //     console.log(data);
  //   });
  // };

  // const checkPermission = async () => {
  //   const defaultAppMessaging = firebase.messaging();
  //   const enabled = await defaultAppMessaging.hasPermission();
  //   if (enabled) {
  //     getToken();
  //   } else {
  //     requestPermission();
  //   }
  // };

  // const requestPermission = async () => {
  //   try {
  //     await firebase.messaging().requestPermission();
  //     getToken();
  //   } catch (error) {
  //     console.log('permission rejected');
  //   }
  // };

  // const getToken = async () => {
  //   const fcmToken = await firebase.messaging().getToken();
  //   if (fcmToken) {
  //     apiPOST(
  //       APIS.auth.setRegistrationToken(),
  //       {
  //         registration_token: fcmToken,
  //       },
  //       ({data}) => {
  //         console.log(data);
  //       },
  //     );
  //   }
  // };

  // const createNotificationListeners = async () => {
  //   //앱이 foreground, background에서 실행 중일때, push 알림을 클릭하여 열 때,
  //   firebase.notifications().onNotificationOpened((notificationOpen) => {
  //     receiveNotification(notificationOpen.notification.data);
  //   });

  //   const notificationOpen = await firebase
  //     .notifications()
  //     .getInitialNotification();
  //   //앱이 종료된 상황에서 push 알림을 클릭하여 열 때
  //   if (notificationOpen) {
  //     receiveNotification(notificationOpen.notification.data);
  //   }
  // };

  // const receiveNotification = (data) => {
  //   const clickAction = data.click_action;
  //   const payload = JSON.parse(data.payload);
  //   switch (clickAction) {
  //     case INVITE:
  //       navigation.navigate(NAV_NAMES.Home);
  //       break;
  //     case MOVE_WEBVIEW:
  //       navigation.navigate(NAV_NAMES.Home, {url: payload.url});
  //       break;
  //     case CHALLENGE:
  //       navigation.navigate(NAV_NAMES.Home, {
  //         url: WEBVIEW_URL.memoUrl(userId),
  //       });
  //       break;
  //     case TUTOR_SCHEDULE_UPLOAD:
  //       navigation.navigate(NAV_NAMES.MainTab_1_1_lesson, {
  //         screen: NAV_NAMES.Home,
  //       });
  //       break;
  //     case GEN_FREE_LESSON:
  //       navigation.navigate(NAV_NAMES.Home);
  //       break;
  //     case PURCHASE_PROMOTION:
  //       const purchaseUrl = WEBVIEW_URL.purchaseUrl(userId, locale);
  //       navigation.navigate(NAV_NAMES.Home, {
  //         headerTitle: t(s_mypage.purchase_lesson_coupons),
  //         url: purchaseUrl,
  //       });

  //       break;
  //     default:
  //       break;
  //   }

  //   return;
  // };

  const onPressLogo = () => {
    // TODO:
  };
  const onPressPNList = () => {
    // initBadgeNum();
    navigation.navigate(NAV_NAMES.Home);
  };

  return (
    <Div px20 flex bgGray100>
      {/** ========= HEADER =========== */}
      <Row h50 itemsCenter bgGray100 my5>
        <Col bgDanger>
          <Div onPress={onPressLogo} >
            {/* <Span fontFamily={'Jua'} fontSize={15}>오늘의,</Span> */}
          </Div>
        </Col>
        <Col itemsCenter auto>
          <Div>
            <Span>역삼동 793-18 / 강남 WeWork</Span>
          </Div>
        </Col>
        <Col >
          <Row>
            <Col></Col>
            <Col auto>
              <Div relative onPress={onPressPNList} >
                {true && (
                  <Div absolute bgDanger w8 h8 rounded16 zIndex5 top={-4} right20 />
                )}
                <Img w21 h50 source={IMAGES.mainLogo} />
              </Div>
            </Col>
          </Row>
        </Col>
      </Row>

      {/** ========== BODY =========== */}
      <ScrollView
        flex={1}
        bgGray100
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={pullToRefresh} />
        }>
        <Row itemsCenter bgGray100 my5>
          <Col auto >
            <Div onPress={onPressLogo} >
              <Span fontFamily={'Jua'} fontSize={25}>뉴스</Span>
            </Div>
            <Div onPress={onPressLogo} my10>
              <CreditPackages/>
            </Div>
          </Col>
        </Row>
        <Row itemsCenter bgGray100 my5>
          <Col auto >
            <Div onPress={onPressLogo} >
              <Span fontFamily={'Jua'} fontSize={25}>Hot 순간</Span>
            </Div>
            <Div onPress={onPressLogo} my10 h100>
              {[0, 80, 160, 240].map((item, index) => {
                return (
                  <Div 
                    key={index}
                    absolute 
                    auto 
                    rounded100 
                    border 
                    border3 
                    borderWhite
                    shadowColor="rgba(22, 28, 45, 0.06)"
                    shadowOffset={{ width: 0, height: 2 }}
                    style={{left: item}}>
                    {/* <Div auto rounded100 my3 mx3> */}
                      <Img w100 h100 rounded100 source={IMAGES.example} />
                    {/* </Div> */}
                  </Div>
                );
              })}
            </Div>
          </Col>
        </Row>
        <Row itemsCenter bgGray100 my5>
          <Col>
            <Div onPress={onPressLogo} >
              <Span fontFamily={'Jua'} fontSize={25}>내 길</Span>
            </Div>
            <Col
              my10
              h200
              border
              borderGray300
              rounded6>
                <Row px10 py10>
                </Row>
            </Col>
          </Col>
        </Row>
        <Row itemsCenter bgGray100 my5>
          <Col>
            <Div onPress={onPressLogo} >
              <Span fontFamily={'Jua'} fontSize={25}>날씨</Span>
            </Div>
            <Col
              my10
              h200
              border
              borderGray300
              rounded6>
                <Row px10 py10>
                </Row>
            </Col>
          </Col>
        </Row>

      </ScrollView>
    </Div>
  );
};

export default HomeScreen;
