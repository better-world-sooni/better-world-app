import React from 'react';
import {Div} from 'src/components/common/Div';
import {HAS_NOTCH} from 'src/modules/constants';
import {StatusBar} from 'react-native';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {MessageCircle, Bell} from 'react-native-feather';
import {Span} from 'src/components/common/Span';
import apis from 'src/modules/apis';
import {useApiSelector} from 'src/redux/asyncReducer';
import Post from 'src/components/common/Post';
import {ScrollView} from 'src/modules/viewComponents';

const HomeScreen = () => {
  const {data: feedRes, isLoading: feedLoad} = useApiSelector(apis.feed._);

  return (
    <Div flex bgGray200>
      <StatusBar animated={true} barStyle={'dark-content'} />
      <Div h={HAS_NOTCH ? 44 : 20} bgWhite />
      <Row itemsCenter py8 bgWhite>
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
              height={18}
              width={18}
            />
          </Div>
        </Col>
        <Col auto mr15>
          <Div rounded50 bgGray200 p6>
            <MessageCircle
              strokeWidth={2}
              color={'black'}
              fill={'black'}
              height={18}
              width={18}
            />
          </Div>
        </Col>
      </Row>
      <ScrollView showsVerticalScrollIndicator={false}>
        {feedRes?.feed?.map(post => {
          return <Post key={post.id} post={post} />;
        })}
      </ScrollView>
    </Div>
  );
};

export default HomeScreen;
