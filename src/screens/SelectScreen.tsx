import React, { useEffect, useState} from 'react';
import { Col } from 'src/components/common/Col';
import { Div } from 'src/components/common/Div';
import { Img } from 'src/components/common/Img';
import { Row } from 'src/components/common/Row';
import { Span } from 'src/components/common/Span';
import APIS from 'src/modules/apis';
import { ScrollView } from 'src/modules/viewComponents';
import { useApiSelector, useReloadGET } from 'src/redux/asyncReducer';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  setUserSearchDestination,
  setUserSearchOrigin,
} from 'src/redux/routeReducer';
import {shortenAddress} from 'src/modules/utils';
import {RootState} from 'src/redux/rootReducer';
import TopHeader from 'src/components/TopHeader';
import {useNavigation} from '@react-navigation/core';
import EmojiSelector, {Categories} from 'react-native-emoji-selector';
import {NAV_NAMES} from 'src/modules/navNames';
import {launchImageLibrary} from 'react-native-image-picker';
import {setCachedPreup} from 'src/redux/feedReducer';

const SelectScreen = props => {
  const {origin, destination} = useSelector(
    (root: RootState) => root.route.userSearch,
    shallowEqual,
  );
  const {cachedPreup} = useSelector(
    (root: RootState) => root.feed,
    shallowEqual,
  );
  const navigation = useNavigation();

  const goToPost = () => navigation.navigate(NAV_NAMES.Post);
  const dispatch = useDispatch();

  const setSelected = payload => {
    dispatch(setCachedPreup(payload));
  };

  const SelectedMedia = () => {
    if (cachedPreup && cachedPreup.type) {
      if (cachedPreup.type == 'emoji') {
        return <Span fontSize={150}>{cachedPreup.object}</Span>;
      } else if (cachedPreup.type == 'image') {
        return <Img src={cachedPreup.object} h={400} w={400}></Img>;
      } else {
        return null;
      }
    } else {
      return <Span fontSize={100}>🚆</Span>;
    }
  };

  const options = () => {
    return {
      mediaType: 'photo',
      quality: 1,
      cameraType: 'back',
    };
  };
  const callBack = () => {
    return response => console.log(response);
  };

  return (
    <Div flex>
      <Div flex relative borderTopRightRadius={20} borderTopLeftRadius={20}>
        <TopHeader
          route={useNavigation}
          title={'새 게시물'}
          nextText={'다음'}
          onPressNext={goToPost}></TopHeader>
        <Div px20 flex={1}>
          <Row justifyCenter py10 auto>
            <Col
              px10
              py5
              rounded20
              bgWhite
              auto
              mx10
              onPress={() => setSelected({type: 'emoji', object: '🚆'})}>
              <Span
                color={'gray'}
                bold
                {...((!cachedPreup || cachedPreup.type == 'emoji') && {
                  color: 'black',
                })}>
                이모지
              </Span>
            </Col>
            {/* <Col px10 py5 rounded20 bgWhite auto mx10 
                        //@ts-ignore
                        onPress={() => {launchImageLibrary(options(), (callbackProps) => setSelected({type: 'image', object: callbackProps.assets[0].uri}));}}>
                            <Span color={"gray"} bold {...(cachedPreup && cachedPreup.type == "image" && {color: "black"})}>사진</Span>
                        </Col>
                        <Col px10 py5 rounded20 bgWhite auto mx10>
                            <Span color={"gray"} bold {...(cachedPreup && cachedPreup.type == "video" && {color: "black"})}>동영상</Span>
                        </Col> */}
            <Col></Col>
          </Row>
          <Row py10 itemsCenter justifyCenter flex={1}>
            <SelectedMedia></SelectedMedia>
          </Row>
        </Div>
        <Div flex={1}>
          <EmojiSelector
            category={Categories.all}
            showSearchBar={true}
            showTabs={false}
            showHistory={true}
            showSectionTitles={true}
            onEmojiSelected={emoji =>
              setSelected({type: 'emoji', object: emoji})
            }
            columns={8}></EmojiSelector>
        </Div>
      </Div>
    </Div>
  );
};
          
  export default SelectScreen;
  