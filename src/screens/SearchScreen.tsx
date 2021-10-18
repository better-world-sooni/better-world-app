import { useApiSelector, useReloadGET } from 'src/redux/asyncReducer';
import APIS from 'src/modules/apis';
import React, {useState, useEffect, useRef} from 'react';
import { NativeBaseProvider, Input } from 'native-base';
import { Div } from 'src/components/common/Div';
import { Row } from 'src/components/common/Row';
import { Col } from 'src/components/common/Col';
import { Span } from 'src/components/common/Span';
import {useDispatch} from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/rootReducer';
import { shallowEqual } from 'react-redux';
import {
  setUserSearchOrigin,
  setUserSearchDestination,
  setCurrentRoute,
} from 'src/redux/routeReducer';
import {Image} from 'react-native';
import {ScrollView} from 'src/modules/viewComponents';
import {RefreshControl} from 'react-native';
import {ICONS} from 'src/modules/icons';
import {Img} from 'src/components/common/Img';
import {ChevronLeft, Search, Shuffle, X} from 'react-native-feather';
import {useNavigation} from '@react-navigation/native';
import {NAV_NAMES} from 'src/modules/navNames';
import {GO_COLOR, HAS_NOTCH} from 'src/modules/constants';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

const AutoCompleteSuggestions = ({onPress, autoCompleteResults}) => {
  const iconifyResultType = types => {
    return (
      <Div
        rounded100
        backgroundColor={'silver'}
        h30
        w30
        itemsCenter
        justifyCenter>
        {types?.includes('establishment') ? (
          <Img
            tintColor={'white'}
            h25
            w20
            white
            source={ICONS.iconMapMarker}></Img>
        ) : (
          <Img tintColor={'white'} h20 w20 source={ICONS.iconSearch}></Img>
        )}
      </Div>
    );
  };

  return (
    <Div mt10 bgWhite flex={1}>
      <ScrollView flex={1} bgGray100 showsVerticalScrollIndicator={false}>
        <Div px20>
          {autoCompleteResults?.predictions?.map((result, index) => {
            return (
              <Row
                py20
                justifyCenter
                borderBottom
                borderGray200
                key={index}
                onPress={e => onPress(index)}>
                <Col justifyCenter mr10 auto>
                  {iconifyResultType(result.types)}
                </Col>
                <Col justifyCenter>
                  <Span>{result.terms[0].value}</Span>
                </Col>
              </Row>
            );
          })}
        </Div>
      </ScrollView>
    </Div>
  );
};

const SearchScreen = () => {
  const {origin, destination} = useSelector(
    (root: RootState) => root.route.userSearch,
    shallowEqual,
  );
  const apiGET = useReloadGET();
  const {data: directionsResponse, isLoading: isSearchLoading} = useApiSelector(
    APIS.directions.get,
  );
  const {data: autocompleteResponse, isLoading: isAutocompleteLoading} =
    useApiSelector(APIS.autocomplete.get);
  const directions = directionsResponse?.data;
  const suggestions = autocompleteResponse?.data;

  const originRef = useRef(null);
  const destinationRef = useRef(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [tentativeOrigin, setTentativeOrigin] = useState(origin);
  const [tentativeDestination, setTentativeDestination] = useState(destination);
  const [NONE, ORIGIN, DESINTATION] = [0, 1, 2];
  const [RAIL, BUS] = ['rail', 'bus'];
  const [editFocus, setEditfocus] = useState(NONE);
  const [preferredTransit, setPreferredTransit] = useState(RAIL);
  const [uuid, setUuid] = useState(uuidv4());

  useEffect(() => {
    pullToRefresh();
  }, [origin, destination, preferredTransit]);

  const resetCurrentRoute = index => {
    dispatch(setCurrentRoute(directions.routes[index]));
    setEditfocus(NONE);
    navigation.goBack();
  };

  const setOrigin = origin => {
    dispatch(setUserSearchOrigin(origin));
  };

  const setDestination = destination => {
    dispatch(setUserSearchDestination(destination));
  };

  const onFocus = which => [setEditfocus(which)];

  const onChangeText = (text, which) => {
    if (which == 'origin') {
      setTentativeOrigin(text);
    } else {
      setTentativeDestination(text);
    }
    console.log('uuid');
    console.log(uuid);
    apiGET(
      APIS.autocomplete.get({
        language: 'ko',
        input: text,
        force: false,
        sessiontoken: uuid,
      }),
    );
  };

  const onAutoCompleteSelect = index => {
    const autocompleteDescription = suggestions?.predictions[index].description;
    const autocompleteTerm = suggestions?.predictions[index].terms[0].value;
    if (!autocompleteDescription || !autocompleteTerm) return;
    if (editFocus == 2) {
      setTentativeDestination(autocompleteTerm);
      setDestination(autocompleteTerm);
      setEditfocus(NONE);
      destinationRef.current.blur();
    } else {
      setTentativeOrigin(autocompleteTerm);
      setOrigin(autocompleteTerm);
      setEditfocus(NONE);
      originRef.current.blur();
    }
  };

  const onPressExit = () => {
    navigation.navigate(NAV_NAMES.Home);
  };

  const onPressBack = () => {
    setEditfocus(previousFocus => {
      if (previousFocus == ORIGIN) {
        setTentativeOrigin(origin);
        originRef.current.blur();
      } else if (previousFocus == DESINTATION) {
        setTentativeDestination(destination);
        destinationRef.current.blur();
      }
      return NONE;
    });
  };

  const onPressSubmit = () => {
    if (editFocus == DESINTATION) {
      setDestination(tentativeDestination);
      setEditfocus(NONE);
      destinationRef.current.blur();
    } else {
      setOrigin(tentativeOrigin);
      setEditfocus(NONE);
      originRef.current.blur();
    }
  };

  const onPressSwitch = () => {
    const d = destination;
    const o = origin;
    setTentativeOrigin(d);
    setTentativeDestination(o);
    setOrigin(d);
    setDestination(o);
  };

  const pullToRefresh = async () => {
    let props = {
      origin: origin,
      destination: destination,
      mode: 'transit',
      language: 'ko',
      region: 'kr',
      alternatives: true,
      transitMode: preferredTransit,
      force: false,
      sessiontoken: uuid,
    };
    if (!origin || !destination) {
      console.log('missing origin or destination');
      return;
    }
    const direction = await apiGET(APIS.directions.get(props));
  };

  return (
    <Div flex={1}>
      <Div h={HAS_NOTCH ? 44 : 20} />
      <NativeBaseProvider>
        <Div bgWhite px20 activeOpacity={1.0} auto>
          {(!editFocus || editFocus == ORIGIN) && (
            <Row bgWhite py5>
              <Col>
                <Input
                  ref={originRef}
                  textContentType={'fullStreetAddress'}
                  numberOfLines={1}
                  placeholder={'출발지'}
                  onSubmitEditing={onPressSubmit}
                  value={tentativeOrigin}
                  InputLeftElement={
                    editFocus == ORIGIN && (
                      <Div pl10 onPress={onPressBack}>
                        <ChevronLeft
                          stroke="#2e2e2e"
                          fill="#fff"
                          height={25}></ChevronLeft>
                      </Div>
                    )
                  }
                  onFocus={() => onFocus(ORIGIN)}
                  onChangeText={text => onChangeText(text, 'origin')}
                  placeholderTextColor={'#DCDCDC'}
                  returnKeyType="search"
                />
              </Col>
              {!editFocus && (
                <Col auto ml20 justifyCenter onPress={e => onPressExit()}>
                  <X stroke="#2e2e2e" fill="#fff" width={18}></X>
                </Col>
              )}
            </Row>
          )}
          {(!editFocus || editFocus == DESINTATION) && (
            <Row bgWhite py5>
              <Col relative>
                <Input
                  ref={destinationRef}
                  placeholder={'도착지'}
                  onSubmitEditing={onPressSubmit}
                  numberOfLines={1}
                  InputLeftElement={
                    editFocus == DESINTATION && (
                      <Div pl10 onPress={onPressBack}>
                        <ChevronLeft
                          stroke="#2e2e2e"
                          fill="#fff"
                          height={25}></ChevronLeft>
                      </Div>
                    )
                  }
                  value={tentativeDestination}
                  onFocus={() => onFocus(DESINTATION)}
                  onChangeText={text => onChangeText(text, 'destination')}
                  placeholderTextColor="#DCDCDC"
                  returnKeyType="search"
                />
              </Col>
              {!editFocus && (
                <Col auto justifyCenter ml20 onPress={e => onPressSwitch()}>
                  <Shuffle stroke="#2e2e2e" fill="#fff" width={18}></Shuffle>
                </Col>
              )}
            </Row>
          )}
          {!editFocus && (
            <Row py5>
              <Col></Col>
              <Col
                onPress={() => setPreferredTransit(RAIL)}
                px10
                auto
                rounded20
                py5
                mx10
                bg={preferredTransit == RAIL && GO_COLOR}>
                <Span color={preferredTransit == RAIL && 'white'} medium>
                  지하철 선호
                </Span>
              </Col>
              <Col
                onPress={() => setPreferredTransit(BUS)}
                px10
                auto
                rounded20
                py5
                mx10
                bg={preferredTransit == BUS && GO_COLOR}>
                <Span color={preferredTransit == BUS && 'white'} medium>
                  버스 선호
                </Span>
              </Col>
            </Row>
          )}
        </Div>
        {editFocus ? (
          <AutoCompleteSuggestions
            onPress={onAutoCompleteSelect}
            autoCompleteResults={suggestions}
          />
        ) : (
          <Div mt10 bgWhite flex={1}>
            <ScrollView
              flex={1}
              bgGray100
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isSearchLoading}
                  onRefresh={pullToRefresh}
                />
              }>
              {directions &&
                directions.routes.map((result, i) => {
                  return (
                    <Div
                      borderBottom
                      borderGray200
                      py20
                      px20
                      key={i}
                      onPress={() => resetCurrentRoute(i)}>
                      <Row my10>
                        <Col auto justifyCenter mr10>
                          <Span fontSize={23}>
                            {result.legs[0].duration.text}
                          </Span>
                        </Col>
                        <Col justifyCenter>
                          <Span>{`${result.legs[0].departure_time.text} ~ ${result.legs[0].arrival_time.text}`}</Span>
                        </Col>
                      </Row>
                      <Row mt2 mb10>
                        <Div flex={3}>
                          <Row>
                            {result.legs[0].steps.map((step, ind) => {
                              return (
                                <Div
                                  key={ind}
                                  mx1
                                  flexDirection={'column'}
                                  flex={
                                    step.distance.value /
                                    result.legs[0].distance.value
                                  }
                                  justifyCenter>
                                  <Div
                                    h3
                                    borderRadius={1}
                                    backgroundColor={
                                      step.transit_details?.line?.color ||
                                      'silver'
                                    }></Div>
                                </Div>
                              );
                            })}
                          </Row>
                        </Div>
                        <Div flex={1}></Div>
                      </Row>
                      {result.legs[0].steps
                        .filter(step => step.transit_details)
                        .map((step, index, arr) => {
                          return (
                            <React.Fragment key={index}>
                              <Row my5 fontSize={15} justifyCenter>
                                <Col w25 auto mr5 itemsCenter justifyCenter>
                                  <Div
                                    h25
                                    w25
                                    itemsCenter
                                    justifyCenter
                                    backgroundColor={
                                      step.transit_details.line.color
                                    }
                                    borderRadius={50}>
                                    {step.transit_details?.line?.vehicle
                                      ?.name !== '버스' ? (
                                      <Span white bold>
                                        {step.transit_details?.line?.short_name?.slice(
                                          0,
                                          -2,
                                        )}
                                      </Span>
                                    ) : (
                                      <Image
                                        style={{
                                          width: 15,
                                          height: 15,
                                          tintColor: 'white',
                                        }}
                                        source={{
                                          uri: `https:${step.transit_details.line.vehicle.icon}`,
                                        }}></Image>
                                    )}
                                  </Div>
                                </Col>
                                <Col justifyCenter>
                                  <Span>
                                    {step.transit_details.departure_stop.name}
                                  </Span>
                                </Col>
                              </Row>
                              {step.transit_details?.line?.vehicle?.name ==
                                '버스' && (
                                <Row mb5 justifyCenter>
                                  <Col
                                    w25
                                    auto
                                    mr5
                                    itemsCenter
                                    justifyCenter></Col>
                                  <Col justifyCenter mr5 auto>
                                    <Div
                                      itemsCenter
                                      justifyCenter
                                      backgroundColor={
                                        step.transit_details.line.color
                                      }
                                      borderRadius={5}
                                      px5>
                                      <Span fontSize={10} white>
                                        {step.transit_details.line.name
                                          .split(' ')
                                          .pop()
                                          .slice(0, 2)}
                                      </Span>
                                    </Div>
                                  </Col>
                                  <Col justifyCenter auto>
                                    <Span>
                                      {step.transit_details.line.short_name}
                                    </Span>
                                  </Col>
                                  <Col></Col>
                                </Row>
                              )}
                              {arr.length && arr.length - 1 == index && (
                                <Row my5 fontSize={15} justifyCenter>
                                  <Col w25 auto mr5 itemsCenter justifyCenter>
                                    <Div
                                      h15
                                      w15
                                      itemsCenter
                                      justifyCenter
                                      backgroundColor={
                                        step.transit_details.line.color
                                      }
                                      borderRadius={50}>
                                      <Div
                                        h5
                                        w5
                                        backgroundColor={'white'}
                                        borderRadius={10}></Div>
                                    </Div>
                                  </Col>
                                  <Col justifyCenter>
                                    <Span>
                                      {step.transit_details.arrival_stop.name}
                                    </Span>
                                  </Col>
                                </Row>
                              )}
                            </React.Fragment>
                          );
                        })}
                    </Div>
                  );
                })}
            </ScrollView>
          </Div>
        )}
      </NativeBaseProvider>
    </Div>
  );
};

export default SearchScreen;