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
import { setUserSearchDestination, setUserSearchOrigin } from 'src/redux/pathReducer';
import { shortenAddress } from 'src/modules/utils';
import { RootState } from 'src/redux/rootReducer';
import TopHeader from 'src/components/TopHeader';
import { useNavigation } from '@react-navigation/core';
import EmojiSelector, { Categories } from 'react-native-emoji-selector'
import { NAV_NAMES } from 'src/modules/navNames';
import {launchImageLibrary} from 'react-native-image-picker';
  
const SelectScreen = (props) => {
    const {data: defaultTo, isLoading} = useApiSelector(APIS.route.default);
    const { origin, destination} = useSelector(
        (root: RootState) => (root.path.userSearch), shallowEqual
    );
    const apiGET = useReloadGET();
    const dispatch = useDispatch()
    const navigation = useNavigation()
  
    const setOrigin = (origin) => {
      dispatch(setUserSearchOrigin(origin))
    }
  
    const setDestination = (destination) => {
      dispatch(setUserSearchDestination(destination))
    }
  
    const pullToRefresh = () => {
      apiGET(APIS.route.default())
    };

    const goToPost = () => navigation.navigate(NAV_NAMES.Post)

    useEffect(() => {
      pullToRefresh();
    }, []);

    useEffect(() => {
      if(defaultTo){
        setOrigin(shortenAddress(defaultTo.default_route.route.legs[0].start_address))
        setDestination(shortenAddress(defaultTo.default_route.route.legs[0].end_address))
      };
    }, [isLoading]);
  
    const [selected, setSelected] = useState({
        type: "emoji",
        object: "🚆"
    })

    const SelectedMedia = () => {
        if(selected.type){
            if(selected.type == 'emoji'){
                return(
                    <Span fontSize={150}>{selected.object}</Span>
                )
            }
            else if(selected.type == 'picture'){
                return(
                    <Img src={selected.object}></Img>
                )
            }
            else{
                return(
                    null
                )
            }
            
        }
        else{
            return(
                <Span fontSize={100}>🚆</Span>
            )
        }
    }

    const options = () => {
        return {
            mediaType: 'photo',
            quality: 1,
            cameraType: 'back',
        }
    }
    const callBack = () => {
        return (response) => console.log(response)
    }
   
    return (
        <Div flex>
            <Div flex
            relative
            borderTopRightRadius={20}
            borderTopLeftRadius={20}
            >
                <TopHeader headerBlack route={useNavigation} title={"새 게시물"} nextText={"다음"} onPressNext={goToPost}></TopHeader>
                <Div px20 flex={1}>
                    <Row justifyCenter py10 auto>
                        <Col px10 py5 rounded20 bgWhite auto mx10 onPress={() => setSelected({type: 'emoji', object: "🚆"})}>
                            <Span color={"gray"} bold {...(selected.type == "emoji" && {color: "black"})}>이모지</Span>
                        </Col>
                        <Col px10 py5 rounded20 bgWhite auto mx10 
                        //@ts-ignore
                        onPress={() => {setSelected({type: 'image', object: "🚆"}); launchImageLibrary(options(), callBack());}}>
                            <Span color={"gray"} bold {...(selected.type == "image" && {color: "black"})}>사진</Span>
                        </Col>
                        <Col px10 py5 rounded20 bgWhite auto mx10>
                            <Span color={"gray"} bold {...(selected.type == "video" && {color: "black"})}>동영상</Span>
                        </Col>
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
                        onEmojiSelected={emoji => setSelected({type: 'emoji', object: emoji})}
                        columns={8}
                        ></EmojiSelector>
                </Div>
            </Div>
        </Div>
    ) 
  }
          
  export default SelectScreen;
  