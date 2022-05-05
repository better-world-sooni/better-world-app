import React, {useRef} from 'react';
import {Div} from 'src/components/common/Div';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {HAS_NOTCH, iconSettings, iconSettingsSm} from 'src/modules/constants';
import {RootState} from 'src/redux/rootReducer';
import CustomHeaderWebView from 'src/components/CustomHeaderWebView';
import {urls} from 'src/modules/urls';
import {useChangeAccount} from 'src/redux/appReducer';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {NAV_NAMES} from 'src/modules/navNames';
import {StatusBar} from 'react-native';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {Img} from 'src/components/common/Img';
import {IMAGES} from 'src/modules/images';
import {ICONS} from 'src/modules/icons';
import {X, MessageCircle, Bell} from 'react-native-feather';
import Colors from 'src/constants/Colors';
import {Span} from 'src/components/common/Span';
import apis from 'src/modules/apis';
import {useApiSelector} from 'src/redux/asyncReducer';
import Post from 'src/components/common/Post';
import {ScrollView} from 'src/modules/viewComponents';

const HomeScreen = () => {
  const {data: feedRes, isLoading: feedLoad} = useApiSelector(apis.feed._);

  return (
    <Div flex backgroundColor={'white'}>
      <StatusBar animated={true} barStyle={'dark-content'} />
      <Div h={HAS_NOTCH ? 44 : 20} />
      <Row itemsCenter py10>
        <Col ml15>
          <Span fontSize={24} bold primary>
            BetterWorld
          </Span>
        </Col>
        <Col auto mr15>
          <Div rounded50 bgGray200 p6>
            <Bell
              strokeWidth={2}
              color={'black'}
              fill={'black'}
              height={20}
              width={20}
            />
          </Div>
        </Col>
        <Col auto mr15>
          <Div rounded50 bgGray200 p6>
            <MessageCircle
              strokeWidth={2}
              color={'black'}
              fill={'black'}
              height={20}
              width={20}
            />
          </Div>
        </Col>
      </Row>
      <ScrollView showsVerticalScrollIndicator={false}>
        {feedRes?.feed?.map(post => {
          return <Post post={post} />;
        })}
      </ScrollView>
    </Div>
  );
};

export default HomeScreen;
