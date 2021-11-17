import React, {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  Component,
} from 'react';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import TopHeader from 'src/components/TopHeader';
import {useNavigation} from '@react-navigation/core';
import {Input, NativeBaseProvider, TextArea} from 'native-base';
import {
  Direction,
  GO_COLOR,
  GRAY_COLOR,
  HAS_NOTCH,
} from 'src/modules/constants';
import {Alert, ScrollView} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {postPromiseFn} from 'src/redux/asyncReducer';
import APIS from 'src/modules/apis';
import {stationArr} from 'src/modules/utils';
import EmojiSelector, {Categories} from 'react-native-emoji-selector';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

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

const channelNameToChannelId = {
  음악: 1,
  이슈: 2,
  일상: 3,
};

const PostScreen = props => {
  const {
    selectedTrain,
    route: {origin, stations},
  } = useSelector((root: RootState) => root.route, shallowEqual);
  const {currentUser, token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const [sungan, setSungan] = useState({
    emoji: '🚆',
    stationName: null,
    channelId: null,
    place: null,
    text: null,
    userName: currentUser.username,
    userProfileImgUrl: currentUser.avatar,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [editting, setEditting] = useState(false);
  const isValidTextOrPlace = str => {
    if (str === null) {
      return Validity.NULL;
    }
    if (str.length === 0) {
      return Validity.INVALID;
    }
    return Validity.VALID;
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
  const setEmoji = sunganEmoji => {
    setEditting(false);
    const {emoji, ...other} = sungan;
    setSungan({emoji: sunganEmoji, ...other});
  };
  const setChannelId = sunganChannelId => {
    const {channelId, ...other} = sungan;
    setSungan({channelId: sunganChannelId, ...other});
  };
  const setPlace = sunganPlace => {
    const {place, ...other} = sungan;
    setSungan({place: sunganPlace, ...other});
  };
  const setStationName = sunganStationName => {
    const {stationName, ...other} = sungan;
    setSungan({stationName: sunganStationName, ...other});
  };
  const setText = sunganText => {
    const {text, ...other} = sungan;
    setSungan({text: sunganText, ...other});
  };

  const postSungan = async () => {
    setIsLoading(true);
    if (sungan.channelId && isValidTextOrPlace(sungan.text)) {
      try {
        const {channelId, ...other} = sungan;
        const correctedSungan = {
          channelId: channelNameToChannelId[channelId],
          ...other,
        };
        const response = await postPromiseFn({
          url: APIS.post.sungan.main().url,
          body: correctedSungan,
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
    } else if (!sungan.channelId) {
      Alert.alert('채널을 선택해 주세요');
    } else if (!isValidTextOrPlace(sungan.text)) {
      Alert.alert('내용을 적어주세요.');
    }
    setIsLoading(false);
  };

  const postPlace = async () => {
    if (
      sungan.stationName &&
      sungan.channelId &&
      isValidTextOrPlace(sungan.place) &&
      isValidTextOrPlace(sungan.text)
    ) {
      try {
        const {channelId, ...other} = sungan;
        const correctedSungan = {
          channelId: channelNameToChannelId[channelId],
          ...other,
        };
        const response = await postPromiseFn({
          url: APIS.post.place.main().url,
          body: correctedSungan,
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
    } else if (!isValidTextOrPlace(sungan.place)) {
      Alert.alert('핫플의 이름을 적어주세요.');
    } else if (!sungan.channelId) {
      Alert.alert('채널을 선택해 주세요');
    } else if (!isValidTextOrPlace(sungan.text)) {
      Alert.alert('내용을 적어주세요.');
    }
  };

  const channels = ['핫플', '일상', '이슈', '음악'];
  return (
    <Div flex bgWhite>
      <Div flex={3}>
        <NativeBaseProvider>
          <TopHeader
            route={useNavigation}
            title={'새 게시물'}
            headerColor={'white'}
            nextText={isLoading ? '게시중...' : '게시'}
            onPressNext={() => {
              if (isLoading) {
                return;
              }
              if (sungan.channelId === '핫플') {
                postPlace();
              } else {
                postSungan();
              }
            }}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{backgroundColor: 'rgba(255,255,255,.9)'}}>
            <Div>
              <Div py20 borderGray300>
                <Row justifyCenter>
                  <Span fontSize={100}>{sungan.emoji}</Span>
                </Row>
                <Row justifyCenter onPress={() => setEditting(true)}>
                  <Span medium color={GO_COLOR} fontSize={10}>
                    {'첨부파일 변경'}
                  </Span>
                </Row>
              </Div>
              <Div px20>
                <Row mb10 mt15>
                  <Span medium fontSize={15}>
                    채널
                  </Span>
                </Row>
                <Row mb20>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {[...channels].map((item, index) => {
                      return (
                        <Div
                          mr10
                          rounded
                          key={index}
                          {...borderProp(sungan.channelId === item)}>
                          <Div
                            onPress={() => setChannelId(item)}
                            px20
                            py10
                            w={'100%'}
                            itemsCenter
                            justifyCenter>
                            <Span {...colorProp(sungan.channelId === item)}>
                              {item}
                            </Span>
                          </Div>
                        </Div>
                      );
                    })}
                  </ScrollView>
                </Row>
                {sungan.channelId === '핫플' && (
                  <>
                    <Row mb10 mt15>
                      <Span medium fontSize={15}>
                        핫플 이름
                      </Span>
                    </Row>
                    <Row mb20>
                      <Div
                        mr10
                        rounded
                        {...borderProp(isValidTextOrPlace(sungan.place))}>
                        <Div px20 py10 w={'100%'}>
                          <Input
                            w={'100%'}
                            padding={0}
                            fontSize={13}
                            onChangeText={change => setPlace(change)}
                            variant="unstyled"
                            textContentType={'none'}
                            numberOfLines={1}
                            placeholder={'직접입력'}></Input>
                        </Div>
                      </Div>
                    </Row>
                  </>
                )}
                <Row mb10 mt15>
                  <Span medium fontSize={15}>
                    역
                  </Span>
                </Row>
                <Row mb20>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Div mr10 rounded {...borderProp(!sungan.stationName)}>
                      <Div
                        onPress={() => setStationName(null)}
                        px20
                        py10
                        w={'100%'}
                        itemsCenter
                        justifyCenter>
                        <Span {...colorProp(!sungan.stationName)}>
                          {'전체'}
                        </Span>
                      </Div>
                    </Div>
                    {(stations?.length === 0
                      ? stationArr(
                          [],
                          '시청',
                          '충정로(경기대입구)',
                          Direction.INNER,
                        )
                      : [...stations]
                    ).map((item, index) => {
                      return (
                        <Div
                          mr10
                          rounded
                          key={index}
                          {...borderProp(sungan.stationName === item)}>
                          <Div
                            onPress={() => setStationName(item)}
                            px20
                            py10
                            w={'100%'}
                            itemsCenter
                            justifyCenter>
                            <Span {...colorProp(sungan.stationName === item)}>
                              {item}
                            </Span>
                          </Div>
                        </Div>
                      );
                    })}
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
                    {...borderProp(isValidTextOrPlace(sungan.text))}
                    w={'100%'}>
                    <Div px20 py10 w={'100%'}>
                      <TextArea
                        w={'100%'}
                        onChangeText={setText}
                        padding={0}
                        fontSize={13}
                        variant="unstyled"
                        textContentType={'none'}
                        numberOfLines={20}
                        placeholder={'순간을 공유해보세요!'}></TextArea>
                    </Div>
                  </Div>
                </Row>
              </Div>
              <Div h300 />
            </Div>
          </ScrollView>
        </NativeBaseProvider>
      </Div>
      {editting && (
        <Div flex={2} borderTopColor={GRAY_COLOR} borderTopWidth={0.5}>
          <EmojiSelector
            category={Categories.all}
            showSearchBar={true}
            showTabs={false}
            showHistory={true}
            showSectionTitles={true}
            onEmojiSelected={emoji => setEmoji(emoji)}
            columns={8}></EmojiSelector>
        </Div>
      )}
    </Div>
  );
};

export default PostScreen;
