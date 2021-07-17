import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import produce from 'immer';
import Button from 'src/components/Button';
import {Col} from 'src/components/common/Col';
import {Img} from 'src/components/common/Img';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {Style} from 'src/components/common/Style';
import LoadingDiv from 'src/components/LoadingDiv';
import APIS from 'src/modules/apis';
import {ICONS} from 'src/modules/icons';
import {FlatList} from 'src/modules/viewComponents';
import {useApiGET, useApiPOST, useApiSelector} from 'src/redux/asyncReducer';
import {Alert} from 'react-native';
import {Div} from 'src/components/common/Div';
import {NAV_NAMES} from 'src/modules/navNames';
import Toast from 'src/components/Toast';
import {useLocale} from 'src/i18n/useLocale';
import {s_common} from 'src/i18n/text/s_common';
import {s_home} from 'src/i18n/text/s_home';
import {s_mypage_noti} from 'src/i18n/web/mypage/s_mypage_noti';

const NotificationScreen = (props) => {
  const navigation = useNavigation();
  const apiGET = useApiGET();
  const apiPOST = useApiPOST();
  const [currentMode, setMode] = useState('normal');
  const [pushNotifications, setPushNotifications] = useState([]);
  const [notificationsPage, setNotificationsPage] = useState(0);
  const [isSelectAll, setSelectAllState] = useState(false);
  const [isShowToast, setToastVisibility] = useState(false);
  const {isLoading} = useApiSelector(APIS.notifications.get);
  const {t} = useLocale();
  useEffect(() => {
    apiGET(APIS.notifications.get(0), ({data}) => {
      let editedNotifications = data.pushNotifications.map((pn) => {
        return {
          ...pn,
          isSelected: false,
        };
      });
      setPushNotifications(editedNotifications);
    });
  }, []);
  return (
    <>
      <Row h54 justifyCenter itemsCenter bgGray100>
        <Col
          h54
          w50
          auto
          pl20
          justifyCenter
          zIndex5
          onPress={() => {
            if (currentMode === 'delete') {
              setMode('normal');
            } else {
              navigation.goBack();
            }
          }}>
          <Img w7 h12 source={ICONS.iconChevronLeftBold} />
        </Col>
        <Col itemsCenter justifyCenter>
          <Span header3 black>
            {t(s_home.notifications)}
          </Span>
        </Col>
        {pushNotifications.length === 0 ? (
          <Col
            pr45
            w35
            h54
            auto />
        ) : (
          <Col
            pr20
            w35
            h54
            auto
            itemsCenter
            justifyCenter
            onPress={() => navigation.navigate(NAV_NAMES.PNSettings)}>
            <Img w21 h21 source={ICONS.iconSettings} />
          </Col>
        )}
        {pushNotifications.length === 0 ? null : (
          <Col
            pr20
            w35
            h54
            auto
            itemsCenter
            justifyCenter
            onPress={() =>
              setMode(currentMode === 'normal' ? 'delete' : 'normal')
            }>
            <Img w={17} h={19} source={ICONS.iconTrashBlack} />
          </Col>
        )}
      </Row>
      {currentMode === 'delete' && (
        <Row px20 py8 gray200 itemsCenter justifyBetween>
          <Row
            itemsCenter
            onPress={() => {
              const updatedNotifications = pushNotifications.map((pn) => {
                return {...pn, isSelected: !isSelectAll};
              });
              setPushNotifications(updatedNotifications);
              setSelectAllState(!isSelectAll);
            }}>
            <Img
              w24
              h24
              mr16
              isActive={isSelectAll}
              a_source={ICONS.iconCheckboxActive}
              source={ICONS.iconCheckboxInactive}
            />
            <Span header5 black>
              {t(s_home.select_all)}
            </Span>
          </Row>
        </Row>
      )}
      {isLoading ? (
        <LoadingDiv isLoading={isLoading} styleComp={<Style flex bgWhite />} />
      ) : pushNotifications.length === 0 ? (
        <Div bgWhite flex itemsCenter justifyCenter>
          <Span header5 black>
            수신한 알림이 없습니다.
          </Span>
        </Div>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          bgWhite
          flex={1}
          data={pushNotifications}
          renderItem={({item, index}) => {
            return (
              <Row py16 px20 borderBottom borderBottomGray300>
                {currentMode === 'delete' && (
                  <Col
                    auto
                    onPress={() => {
                      const updatedPushNotifications = produce(
                        pushNotifications,
                        (draft) => {
                          draft[index].isSelected = !draft[index].isSelected;
                        },
                      );
                      setPushNotifications(updatedPushNotifications);
                    }}>
                    <Img
                      w24
                      h24
                      mr16
                      isActive={item.isSelected}
                      a_source={ICONS.iconCheckboxActive}
                      source={ICONS.iconCheckboxInactive}
                    />
                  </Col>
                )}
                {item.payload ? (
                  <Img mr16 w60 h60 rounded4 uri={item.payload.img_url} />
                ) : (
                  <Img mr16 w60 h60 rounded4 source={ICONS.iconLogoRLarge} />
                )}

                <Col>
                  <Span sectionBody black>
                    {item.content}
                  </Span>
                  <Span sectionBody2 gray500>
                    {item.created_at}
                  </Span>
                </Col>
              </Row>
            );
          }}
          keyExtractor={(item, index) => String(index)}
          ListFooterComponent={() =>
            currentMode === 'normal' ? (
              <Button
                label={t(s_common.see_more)}
                large
                outlined
                mx20
                mt16
                mb130
                onPress={() => {
                  const nextPage = notificationsPage + 1;
                  apiGET(APIS.notifications.get(nextPage), ({data}) => {
                    let newNotifications = data.pushNotifications;
                    setPushNotifications(
                      pushNotifications.concat(newNotifications),
                    );
                    setNotificationsPage(nextPage);
                  });
                }}
              />
            ) : (
              <Div h130 />
            )
          }
        />
      )}
      {isShowToast && <Toast label={t(s_home.successfully_deleted)} />}
      {currentMode === 'delete' && (
        <Row absolute bottom bgWhite>
          <Button
            label={t(s_common.cancel)}
            outlined
            large
            half
            isBottom
            onPress={() => setMode('normal')}
          />
          <Button
            label={t(s_common.delete)}
            primary
            large
            half
            isBottom
            styleComp={
              pushNotifications.some((pn) => pn.isSelected) ? (
                <Style bgPrimary />
              ) : (
                <Style bgGray200 />
              )
            }
            onPress={() => {
              const notificationIds = [];
              pushNotifications.forEach((pn) => {
                if (pn.isSelected) notificationIds.push(pn.id);
              });
              if (notificationIds.length > 0) {
                apiPOST(
                  APIS.notifications.delete(),
                  {
                    id_arr: notificationIds,
                  },
                  (props) => {
                    apiGET(
                      APIS.notifications.get(notificationsPage),
                      ({data}) => {
                        let editedNotifications = data.pushNotifications.map(
                          (pn) => {
                            return {
                              ...pn,
                              isSelected: false,
                            };
                          },
                        );
                        setToastVisibility(true);
                        setTimeout(() => {
                          setToastVisibility(false);
                        }, 3000);
                        setPushNotifications(editedNotifications);
                        setMode('normal');
                        setSelectAllState(false);
                      },
                    );
                  },
                );
              } else {
                Alert.alert(
                  'Message',
                  t(s_mypage_noti.select_notifications_you_want_to_delete),
                );
                return;
              }
            }}
          />
        </Row>
      )}
    </>
  );
};

export default NotificationScreen;
