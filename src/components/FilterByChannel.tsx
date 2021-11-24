import React, {useCallback} from 'react';
import {ChannelFilter, GRAY_COLOR} from 'src/modules/constants';
import {ScrollView} from 'src/modules/viewComponents';
import {Div} from './common/Div';
import {Row} from './common/Row';
import {Span} from './common/Span';

const FilterPostsByChannel = ({
  channelFilter,
  handleSetChannelFilterAll,
  handleSetChannelFilterReport,
  setChannelFilter,
}) => {
  const blackBorderBottomProp = useCallback(bool => {
    if (bool) {
      return {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
      };
    } else {
      return {};
    }
  }, []);
  const redBorderBottomProp = useCallback(bool => {
    if (bool) {
      return {
        borderBottomColor: 'red',
        borderBottomWidth: 1,
      };
    } else {
      return {};
    }
  }, []);

  return (
    <Row borderBottomColor={GRAY_COLOR} borderBottomWidth={0.5}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Div
          auto
          pt10
          justifyCenter
          {...blackBorderBottomProp(channelFilter === ChannelFilter.ALL)}>
          <Div w={'100%'} py5 px20 onPress={handleSetChannelFilterAll}>
            <Span
              medium
              color={channelFilter === ChannelFilter.ALL ? 'black' : GRAY_COLOR}
              fontSize={15}>
              전체
            </Span>
          </Div>
        </Div>
        <Div
          auto
          pt10
          borderBottomColor={'rgb(255,69,58)'}
          justifyCenter
          {...redBorderBottomProp(channelFilter === ChannelFilter.REPORT)}>
          <Div w={'100%'} py5 px20 onPress={handleSetChannelFilterReport}>
            <Span
              medium
              color={
                channelFilter === ChannelFilter.REPORT
                  ? 'red'
                  : 'rgb(250, 196, 192)'
              }
              fontSize={15}>
              민원
            </Span>
          </Div>
        </Div>
        {[
          {name: '핫플', value: ChannelFilter.PLACE},
          {name: '일상', value: ChannelFilter.TALK},
          {name: '이슈', value: ChannelFilter.EVENTS},
          {name: '음악', value: ChannelFilter.MUSIC},
        ].map((item, index) => {
          return (
            <Div
              key={index}
              pt10
              auto
              justifyCenter
              {...blackBorderBottomProp(channelFilter === item.value)}>
              <Div
                w={'100%'}
                py5
                px20
                onPress={() => setChannelFilter(item.value)}>
                <Span
                  medium
                  color={channelFilter === item.value ? 'black' : GRAY_COLOR}
                  fontSize={15}>
                  {item.name}
                </Span>
              </Div>
            </Div>
          );
        })}
      </ScrollView>
    </Row>
  );
};
