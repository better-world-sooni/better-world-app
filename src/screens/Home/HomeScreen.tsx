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


const TutorsSection = ({title, tutors}) => {
  const navigation = useNavigation();
  const {t} = useLocale();
  return (
    <Div mb49>
      <Span header5 black mt32 ml20>
        TUTOR
      </Span>
      <Span header1 black mt32 mb48 mx20>
        {title}
      </Span>
      <Row w="100%">
        <Col w="10%" auto bgWhite />
        <Col>
          <Img w="100%" h252 uri={tutors[0].image_url} />
          <Div
            pt32
            px20
            shadowColor="rgba(22, 28, 45, 0.06)"
            shadowOffset={{width: 0, height: 2}}
            shadowRadius={10}
            shadowOpacity={1}
            border
            borderGray300>
            <Span header2 black>
              {"Hello"}
            </Span>
            <Span sectionBody gray600 mt8>
              {tutors[0].school}
            </Span>
            <Span sectionBody gray600 mt8>
              {tutors[0].major}
            </Span>
            <Span sectionBody black mt20>
              {tutors[0].description}
            </Span>
            <Div
              pt32
              pb20
              itemsEnd
              onPress={() =>
                console.log()
              }>
              <Span header5 primary>
                {t(s_home.learn_more_about_tutor)}
              </Span>
            </Div>
          </Div>
        </Col>
      </Row>
      <Row w="100%" mt48>
        <Col>
          <Img w="100%" h252 uri={tutors[1].image_url} />
          <Div
            pt32
            px20
            shadowColor="rgba(22, 28, 45, 0.06)"
            shadowOffset={{width: 0, height: 2}}
            shadowRadius={10}
            shadowOpacity={1}
            border
            borderGray300>
            <Span header2 black>
              {tutors[1].name.toUpperCase()}
            </Span>
            <Span sectionBody gray600 mt8>
              {tutors[1].school}
            </Span>
            <Span sectionBody gray600 mt8>
              {tutors[1].major}
            </Span>
            <Span sectionBody black mt20>
              {tutors[1].description}
            </Span>
            <Div
              pt32
              pb20
              itemsEnd
              onPress={() =>
                console.log()
              }>
              <Span header5 primary>
                {t(s_home.learn_more_about_tutor)}
              </Span>
            </Div>
          </Div>
        </Col>
        <Col w="10%" auto bgWhite />
      </Row>
    </Div>
  );
};

const CoursesSection = ({title, courses}) => {
  const navigation = useNavigation();
  const {t} = useLocale();
  return (
    <Div pb49 bgGray100>
      <Span header5 black mt32 alignCenter>
        PACKET
      </Span>
      <Span header1 black mt32 mb48 mx20>
        {title}
      </Span>
      <Div px20>
        <Img w="100%" h185 uri={courses[0].image_url} />
        <Div
          pt20
          px20
          shadowColor="rgba(22, 28, 45, 0.06)"
          shadowOffset={{width: 0, height: 2}}
          shadowRadius={10}
          shadowOpacity={1}
          border
          borderGray300>
          <Span header5 black>
            {courses[0].category}
          </Span>
          <Span header2 black>
            {courses[0].title}
          </Span>
          <Span sectionBody black>
            {courses[0].description}
          </Span>
          <Div
            pt32
            pb20
            itemsEnd
            onPress={() =>
              console.log()
            }>
            <Span header5 primary>
              {t(s_home.read_packet)}
            </Span>
          </Div>
        </Div>
      </Div>
      <Div px20 mt48>
        <Img w="100%" h185 uri={courses[1].image_url} />
        <Div
          pt20
          px20
          shadowColor="rgba(22, 28, 45, 0.06)"
          shadowOffset={{width: 0, height: 2}}
          shadowRadius={10}
          shadowOpacity={1}
          border
          borderGray300>
          <Span header5 black>
            {courses[1].category}
          </Span>
          <Span header2 black>
            {courses[1].title}
          </Span>
          <Span sectionBody black>
            {courses[1].description}
          </Span>
          <Div
            pt32
            pb20
            itemsEnd
            onPress={() =>
              console.log()
            }>
            <Span header5 primary>
              {t(s_home.read_packet)}
            </Span>
          </Div>
        </Div>
      </Div>
    </Div>
  );
};

const HomeContents = ({homeContents}) => {
  const navigation = useNavigation();
  const [carouselRef, setCarouselRef] = useState(null);
  const {t} = useLocale();

  return (
    <Carousel
      useScrollView={true}
      ref={(value) => {
        setCarouselRef(value);
      }}
      data={["hello"]}
      renderItem={({item, index}) => (
        <Div>
          <Row
            bgWhite
            pl21
            py12
            shadowColor="rgba(22, 28, 45, 0.06)"
            shadowOffset={{width: 0, height: 4}}
            shadowRadius={20}
            shadowOpacity={1}
            borderBottom
            borderBottomGray300>
            <Col>
              <Row itemsCenter>
                <Span sectionBody gray600>
                  ISSUE NO.{item}
                </Span>
                <Div w1 h="50%" mt3 bgGray500 mx8 />
                <Span sectionBody gray600>
                  {item}
                </Span>
              </Row>

              <Span header5 black mt4>
                {item}
              </Span>
              <Span header5 black light mt2>
                {item}
              </Span>
            </Col>
            <Col
              w50
              auto
              itemsCenter
              justifyCenter
              onPress={() => carouselRef.snapToPrev()}>
              <Img
                w7
                h12
                isActive={index === 0}
                a_source={ICONS.iconChevronLeftGray}
                source={ICONS.iconChevronLeftBlack}
              />
            </Col>
            <Col
              w50
              auto
              itemsCenter
              justifyCenter
              onPress={() => carouselRef.snapToNext()}>
              <Img
                w7
                h12
                isActive={homeContents.length - 1 === index}
                a_source={ICONS.icChveronRightGray600}
                source={ICONS.iconChevronRightBlack}
              />
            </Col>
          </Row>
          <Div h12 bgGray200 />
        </Div>
      )}
      sliderWidth={DEVICE_WIDTH}
      itemWidth={DEVICE_WIDTH}
      scrollEnabled={false}
    />
  );
};

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
    apiGET(APIS.notifications.get(1));
    apiGET(APIS.lessons.upcomings());
    apiGET(APIS.credit.creditList());
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

  // const onPressEventBanner = (item) => {
  //   switch (item.action) {
  //     case 'invite':
  //       navigation.navigate(NAV_NAMES.Home);
  //       return;
  //     case 'webinar':
  //       navigation.navigate(NAV_NAMES.MainTab_Original, {
  //         screen: NAV_NAMES.Home,
  //       });
  //       return;
  //     case 'purchase':
  //       let editedUrl = item.url_link + `?user_id=${userId}&app=true`;
  //       navigation.navigate(NAV_NAMES.Home, {url: editedUrl});
  //       return;
  //     case 'ringle':
  //       let editedRingleUrl = item.url_link + `?user_id=${userId}&app=true`;
  //       navigation.navigate(NAV_NAMES.Home, {url: editedRingleUrl});
  //       return;
  //     case 'other':
  //       navigation.navigate(NAV_NAMES.Home, {
  //         url: item.url_link,
  //         headerTitle: 'Ringle',
  //       });
  //       return;
  //     default:
  //       return;
  //   }
  // };

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
