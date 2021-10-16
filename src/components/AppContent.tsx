import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import TopHeader from 'src/components/TopHeader';
import React, { useCallback, useEffect, useState } from 'react';
import BottomTabBar from 'src/components/BottomTabBar';
import {Div} from 'src/components/common/Div';
import {NAV_NAMES} from 'src/modules/navNames';
import HomeScreen from 'src/screens/Home/HomeScreen';
import MapScreen from 'src/screens/Home/MapScreen';
import SearchScreen from 'src/screens/SearchScreen';
import { Grid, Home, Map, MessageCircle, User } from 'react-native-feather';
import CameraScreen from 'src/screens/CameraScreen';
import ProfileScreen from 'src/screens/Home/ProfileScreen';
import SplashScreen from 'src/screens/Common/SplashScreen';
import SignInScreen from 'src/screens/Auth/SignInScreen';
import PostScreen from 'src/screens/PostScreen';
import SelectScreen from 'src/screens/SelectScreen';
import MetaSunganScreen from 'src/screens/Home/MetaverseScreen';
import ReportScreen from 'src/screens/ReportScreen';
import Draggable from 'react-native-draggable';
import { Dimensions, Modal } from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/rootReducer';
import { GiftedChat } from 'react-native-gifted-chat';
import { setChatHeadEnabled } from 'src/redux/chatReducer';
import { HAS_NOTCH } from 'src/modules/constants';

const RootStack = createStackNavigator();

const Tab = createBottomTabNavigator();

const tabBarFunc = props => <BottomTabBar {...props} />;

const MainBottomTabs = () => {
  return (
    <Tab.Navigator
      tabBar={tabBarFunc}
      initialRouteName={NAV_NAMES.Home}>
      <Tab.Screen
        name={NAV_NAMES.Home}
        component={HomeScreen}
        options={{
          tabBarIcon: (props) => <Home color={props.focused ? "black" : "gray"} strokeWidth={1.5}></Home>
        }}
      />
      <Tab.Screen
        name={NAV_NAMES.Metaverse}
        component={MetaSunganScreen}
        options={{
          tabBarIcon: (props) => <Grid color={props.focused ? "black" : "gray"} strokeWidth={1.5}></Grid>
        }}
      />
      <Tab.Screen
        name={NAV_NAMES.Map}
        component={MapScreen}
        options={{
          tabBarIcon: (props) => <Map color={props.focused ? "black" : "gray"} strokeWidth={1.5}></Map>
        }}
      />
      <Tab.Screen
        name={NAV_NAMES.Profile}
        component={ProfileScreen}
        options={{
          tabBarIcon: (props) => <User color={props.focused ? "black" : "gray"} strokeWidth={1.5}></User>
        }}
      />
    </Tab.Navigator>
  );
};

const topHeader = props => {
  return () => <TopHeader {...props} />;
};

export const AppContent = () => {
  const Navs = [
    {
      name: NAV_NAMES.Splash,
      component: SplashScreen,
      options: props => ({
        header: topHeader({...props, headerShown: false}),
        
      }),
    },
    {
      name: NAV_NAMES.SignIn,
      component: SignInScreen,
      options: props => ({
        header: topHeader({...props, headerShown: false}),
      }),
    } as any,
    {
      name: NAV_NAMES.Home,
      component: MainBottomTabs,
      options: props => ({
        header: topHeader({...props, headerShown: false}),
        cardStyle: { backgroundColor: 'white', presentation: 'screen'},
      }),
    },
    {
      name: NAV_NAMES.Map,
      component: MapScreen,
      options: props => ({
        header: topHeader({...props, headerShown: false}),
        cardStyle: { backgroundColor: 'white', presentation: 'screen' },
      }),
    },
    {
      name: NAV_NAMES.Camera,
      component: CameraScreen,
      options: props => ({
        header: topHeader({...props, headerShown: false}),
        cardStyle: { backgroundColor: 'white', presentation: 'modal' },
      }),
    },
    {
      name: NAV_NAMES.Search,
      component: SearchScreen,
      options: props => ({
        header: topHeader({...props, headerShown: false}),
        cardStyle: { backgroundColor: 'white', presentation: 'screen' },
      }),
    },
    {
      name: NAV_NAMES.Profile,
      component: ProfileScreen,
      options: props => ({
        header: topHeader({...props, headerShown: false}),
        cardStyle: { backgroundColor: 'transparent' }, 
      }),
    },
    {
      name: NAV_NAMES.Post,
      component: PostScreen,
      options: props => ({
        header: topHeader({...props,  title: "새 게시물"}),
        // cardStyle: { backgroundColor: 'white', presentation: 'modal' },
        headerShown: true,
      }),
    },
    {
      name: NAV_NAMES.Report,
      component: ReportScreen,
      options: props => ({
      }),
    },
    {
      name: NAV_NAMES.Select,
      component: SelectScreen,
      options: props => ({
        // header: topHeader({...props, title: "새 게시물", headerBlack: "true"}),
        cardStyle: { backgroundColor: 'black', presentation: 'screen' },
        // headerShown: true,
      }),
    },
    {
      name: NAV_NAMES.Metaverse,
      component: MetaSunganScreen,
      options: props => ({
        cardStyle: { backgroundColor: 'black', presentation: 'screen' },
      }),
    },
  ];

  return (
    <>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {Navs.map((item, i) => (
            <RootStack.Screen
              key={i}
              name={item.name}
              component={item.component}
              options={item.options}
            />
          ))}
        </RootStack.Navigator>
      </NavigationContainer>
      <ChatManager></ChatManager>
    </>
  );
};

const ChatManager = () => {
  const ChatHead = () => {
    const { chatHead, rooms } = useSelector(
      (root: RootState) => (root.chat),
      shallowEqual,
    );
    const dispatch = useDispatch();
  
    const screenSize = Dimensions.get('screen')
    const inset = 60;
    const screenHeight = screenSize.height;
    const screenWidth = screenSize.width;
    const initialDraggablePosition = {x: screenWidth-inset, y: inset}
    const [draggablePosition, setDraggablePosition] = useState(initialDraggablePosition);
  
    const onRelease = (_event, gestureState, _bounds) => {
      console.log(gestureState)
      const moveX = gestureState.moveX;
      const moveY = gestureState.moveY;
      const closestEdgeX = Math.round(moveX/screenWidth) * screenWidth;
      const closestEdgeY = Math.round(moveY/screenHeight) * screenHeight;
      const withInsetX = (value) => {
        return value ? value - inset : value + 10;
      }
      const withInsetY = (value) => {
        return value ? value - inset : value + inset;
      }
      let finalPosition;
      if (Math.abs(closestEdgeX - moveX) > Math.abs(closestEdgeY - moveY)){
        finalPosition = {
          x: withInsetX(moveX),
          y: withInsetY(closestEdgeY),
        }
      }
      else{
        finalPosition = {
          x: withInsetX(closestEdgeX),
          y: withInsetY(moveY),
        }
      }
      console.log(finalPosition);
      setDraggablePosition(finalPosition);
      setModalVisible(false)
    }
  
    const onDraggablePress = () => {
      setModalVisible(true)
      setDraggablePosition(initialDraggablePosition);
    }
  
    return(
      <Draggable 
        isCircle
        renderSize={80} 
        x={draggablePosition.x}
        y={draggablePosition.y}
        onShortPressRelease={onDraggablePress}
        onDragRelease={onRelease}
        shouldReverse
        >
        <Div p10 bgBlack rounded100 {...shadowProp} >
          <MessageCircle height={30} width={30} ></MessageCircle>
        </Div>
      </Draggable>
    )
  }

  const shadowProp = {shadowOffset: {height: 1, width: 1}, shadowColor: "gray", shadowOpacity: 0.5, shadowRadius: 3}
  const [modalVisible, setModalVisible] = useState(false);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])


  return(
    <>
      {true && <ChatHead></ChatHead>}
      <Modal 
        // presentationStyle="pageSheet" 
        visible={modalVisible} 
        animationType={'slide'}
        transparent={true} 
        style={{ display: 'flex'}}
        >
          <Div h={HAS_NOTCH ? 44 : 20}/>
          <Div h80>
          </Div>
          <Div rounded20 bgWhite flex={1} {...shadowProp}>
            <GiftedChat
              messages={messages}
              onSend={messages => onSend(messages)}
              user={{
                _id: 1,
              }}
            />
          </Div>
          <ChatHead></ChatHead>
        </Modal>
      </>
  )
}
