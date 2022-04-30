  import React, { useState } from 'react';
  import { Col } from 'src/components/common/Col';
  import {Div} from 'src/components/common/Div';
  import {Row} from 'src/components/common/Row';
  import {Span} from 'src/components/common/Span';
  import {ScrollView} from 'src/modules/viewComponents';
  import {Input, NativeBaseProvider, TextArea} from 'native-base';
  import TopHeader from 'src/components/TopHeader';
  import {useNavigation} from '@react-navigation/core';
  import {shallowEqual, useSelector} from 'react-redux';
  import {RootState} from 'src/redux/rootReducer';
  import SendSMS from 'react-native-sms';
  import {GO_COLOR, GRAY_COLOR, iconSettings, SEOUL_METRO_PHONE_1TO8} from 'src/modules/constants';
  import {postPromiseFn} from 'src/redux/asyncReducer';
  import apis from 'src/modules/apis';
  import {Alert} from 'react-native';
  import {Info} from 'react-native-feather';
  import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
  import {Header} from 'src/components/Header';

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  enum Validity {
    NULL = null,
    ZERO = 0,
    VALID = 1,
    INVALID = 2,
  }

  const ReportScreen = props => {
    const {selectedTrain} = useSelector(
      (root: RootState) => root.route,
      shallowEqual,
    );
    const {currentUser, token} = useSelector(
      (root: RootState) => root.app.session,
      shallowEqual,
    );
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const [report, setReport] = useState({
      reportType: 0,
      label: null,
      vehicleIdNum: null,
      detail: null,
      userName: currentUser.username,
      userProfileImgUrl: currentUser.avatar,
      shouldBeUploaded: true,
    });
    const isValidVehicleId = str => {
      if (str === null) {
        return Validity.VALID;
      }
      // const num = +str;
      // if (isNaN(num)) {
      //   return Validity.INVALID;
      // }
      return Validity.VALID;
    };
    const isValidDetail = str => {
      if (str === null) {
        return Validity.NULL;
      }
      if (str.length === 0) {
        return Validity.INVALID;
      }
      return Validity.VALID;
    };
    const borderBottomProp = bool => {
      if (!bool || bool === Validity.NULL || bool === Validity.ZERO) {
        return {
          borderBottomColor: GRAY_COLOR,
          borderBottomWidth: 1,
        };
      } else {
        return {
          borderBottomColor: 'black',
          borderBottomWidth: 1,
        };
      }
    };
    const borderProp = bool => {
      if (!bool || bool === Validity.NULL || bool === Validity.ZERO) {
        return {
          borderColor: GRAY_COLOR,
          borderWidth: 1,
        };
      } else if (bool === Validity.INVALID) {
        return {
          borderColor: 'red',
          borderWidth: 1,
        };
      } else {
        return {
          borderColor: 'black',
          borderWidth: 1,
        };
      }
    };
    const colorProp = bool => {
      return bool
        ? {
            color: 'black',
          }
        : {
            color: GRAY_COLOR,
          };
    };
    const setType = type => {
      const {reportType, label, ...other} = report;
      setReport({reportType: type, label: null, ...other});
    };
    const setSubect = reportSubject => {
      const {label, ...other} = report;
      setReport({label: reportSubject, ...other});
    };
    const setVehicleIdNum = reportVehicleIdNum => {
      const {vehicleIdNum, ...other} = report;
      setReport({vehicleIdNum: reportVehicleIdNum, ...other});
    };
    const setDetail = reportDetail => {
      const {detail, ...other} = report;
      setReport({detail: reportDetail, ...other});
    };
    const setShouldBeUploaded = reportShouldBeUploaded => {
      const {shouldBeUploaded, ...other} = report;
      setReport({shouldBeUploaded: reportShouldBeUploaded, ...other});
    };
    const handleSendSMSCallback = async (completed, cancelled, error) => {
      setLoading(true);
      if (completed && report.shouldBeUploaded) {
        try {
          const response = await postPromiseFn({
            url: apis.post.report.main().url,
            body: report,
            token: token,
          });
          if (response.data.statusCode === 200) {
            Alert.alert(`업로드가 완료 되었습니다.`);
            navigation.goBack();
          } else {
            Alert.alert(`업로드중 문제가 발생하였습니다.`);
          }
        } catch (e) {
          Alert.alert(`피드에 업로드 중 에러가 발생하였습니다: ${e}`);
        }
      } else if (cancelled) {
        Alert.alert(`유저가 취소하였습니다.`);
      } else if (error) {
        Alert.alert(`에러가 발생하여 취소되었습니다.`);
      }
      setLoading(false);
    };
    const sendSMS = async () => {
      if (loading) return;
      ReactNativeHapticFeedback.trigger('impactMedium', options);
      if (
        report.label &&
        isValidVehicleId(report.vehicleIdNum) &&
        isValidDetail(report.detail)
      ) {
        const textObject = {
          body: `[${report.reportType == 0 ? '요청' : '신고'}: ${
            report.label
          }]\n2호선 ${
            report.vehicleIdNum
              ? `${report.vehicleIdNum}번 차량`
              : `${selectedTrain.statnTnm}행 현재 ${selectedTrain.statnNm}역 (열차번호: ${selectedTrain.trainNo})`
          }\n ${report.detail}`,
          recipients: [SEOUL_METRO_PHONE_1TO8],
          successTypes: ['sent'],
          allowAndroidSendWithoutReadPermission: true,
        };
        // @ts-ignore
        SendSMS.send(textObject, handleSendSMSCallback);
      } else if (!report.label) {
        Alert.alert('주제를 선택해 주세요.');
      } else if (!isValidVehicleId(report.vehicleIdNum)) {
        Alert.alert(
          '차량번호가 유효하지 않습니다. 2호선 차량번호는 2000번대 숫자입니다.',
        );
      } else if (!isValidDetail(report.detail)) {
        Alert.alert('민원 내용을 적어주세요.');
      }
    };
    const handleChangeText = change => {
      if (change.length == 0) return setVehicleIdNum(change);
      return setVehicleIdNum(change);
    };
    const handlePressInfo = () => {
      Alert.alert(
        '열차 출입문 상단 또는 통로 상단을 보면 4~6자리 차량번호가 적혀있어요! 차량번호를 입력할 경우 훨씬 더 빠른 대처가 가능합니다.',
      );
    };
    return (
      <Div flex>
        <NativeBaseProvider>
          <Header
            bg={'white'}
            headerTitle={'새 민원'}
            noButtons
            hasGoBack
            onFinish={sendSMS}
            onFinishText={loading ? '게시중...' : '전송'}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{backgroundColor: 'rgba(255,255,255,.9)'}}>
            <Div>
              <Div py20 borderGray300>
                <Row justifyCenter>
                  <Span fontSize={100}>{'🚨'}</Span>
                </Row>
              </Div>
              <Div px20>
                <Row rounded20 mb10>
                  <Col py10 {...borderBottomProp(report.reportType === 0)}>
                    <Div onPress={() => setType(0)} w={'100%'} itemsCenter>
                      <Span
                        medium
                        fontSize={15}
                        {...colorProp(report.reportType === 0)}>
                        요청
                      </Span>
                    </Div>
                  </Col>
                  <Col py10 {...borderBottomProp(report.reportType === 1)}>
                    <Div onPress={() => setType(1)} w={'100%'} itemsCenter>
                      <Span
                        medium
                        fontSize={15}
                        {...colorProp(report.reportType === 1)}>
                        신고
                      </Span>
                    </Div>
                  </Col>
                </Row>
                <Row mb20>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {(report.reportType === 0
                      ? ['냉방/난방', '안내방송', '소음', '요청사항']
                      : ['취객', '추행', '몰카', '소란', '행상인', '신고사항']
                    ).map((item, index) => {
                      return (
                        <Div
                          mr10
                          rounded
                          key={index}
                          {...borderProp(report.label === item)}>
                          <Div
                            onPress={() => setSubect(item)}
                            px20
                            py10
                            w={'100%'}
                            itemsCenter
                            justifyCenter>
                            <Span {...colorProp(report.label === item)}>
                              {item}
                            </Span>
                          </Div>
                        </Div>
                      );
                    })}
                  </ScrollView>
                </Row>
                <Row mb10 mt15>
                  <Col auto mr5>
                    <Span medium fontSize={15}>
                      차량번호
                    </Span>
                  </Col>
                  <Col onPress={handlePressInfo}>
                    <Info color={'black'} height={15} width={15}></Info>
                  </Col>
                </Row>
                <Row mb20>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Div
                      rounded
                      {...borderProp(isValidVehicleId(report.vehicleIdNum))}>
                      <Div px20 py10 w={'100%'}>
                        <Input
                          w={'100%'}
                          color={'#000000'}
                          padding={0}
                          fontSize={13}
                          value={report.vehicleIdNum}
                          onChangeText={handleChangeText}
                          variant="unstyled"
                          textContentType={'none'}
                          numberOfLines={1}
                          placeholder={'입력 권장'}></Input>
                      </Div>
                    </Div>
                  </ScrollView>
                </Row>
                <Row mb10 mt15>
                  <Span medium fontSize={15}>
                    내용
                  </Span>
                </Row>
                <Row mb20 itemsCenter>
                  <Div
                    rounded
                    {...borderProp(isValidDetail(report.detail))}
                    w={'100%'}>
                    <Div px20 py10 w={'100%'}>
                      <TextArea
                        w={'100%'}
                        onChangeText={setDetail}
                        padding={0}
                        fontSize={13}
                        variant="unstyled"
                        textContentType={'none'}
                        numberOfLines={20}
                        placeholder={'너무 추워요'}></TextArea>
                    </Div>
                  </Div>
                </Row>
                <Row mb10 mt15>
                  <Span medium fontSize={15}>
                    신고 옵션
                  </Span>
                </Row>
                <Row mb20>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Div mr10 rounded {...borderProp(report.shouldBeUploaded)}>
                      <Div
                        px20
                        py10
                        w={'100%'}
                        onPress={() => setShouldBeUploaded(true)}>
                        <Span {...colorProp(report.shouldBeUploaded)}>
                          피드에도 공유
                        </Span>
                      </Div>
                    </Div>
                    <Div mr10 rounded {...borderProp(!report.shouldBeUploaded)}>
                      <Div
                        px20
                        py10
                        w={'100%'}
                        onPress={() => setShouldBeUploaded(false)}>
                        <Span {...colorProp(!report.shouldBeUploaded)}>
                          민원만
                        </Span>
                      </Div>
                    </Div>
                  </ScrollView>
                </Row>
              </Div>
              <Div h300 />
            </Div>
          </ScrollView>
        </NativeBaseProvider>
      </Div>
    );
  };
          
  export default ReportScreen;
  