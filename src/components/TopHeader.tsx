import React from 'react';
import {ICONS} from 'src/modules/icons';
import {varStyle} from 'src/modules/styles';
import {Col} from './common/Col';
import {Div} from './common/Div';
import {Img} from './common/Img';
import {Row} from './common/Row';
import {Span} from './common/Span';
import {GO_COLOR, HAS_NOTCH} from 'src/modules/constants';
import {useGoBack} from 'src/modules/useCustomHooks';
import { StatusBar } from 'native-base';

const TopHeader = props => {
  const { route, title, headerColor, nextText, onPressNext } = props;

  const {params = {}} = route;
  const {headerTitle, onGoBack} = params;
  const borderBottomProp = {
    borderBottomColor: 'rgb(199,199,204)',
    borderBottomWidth: 1,
  };

  const onPressGoBack = useGoBack(onGoBack);
  return (
    <Div>
      <StatusBar
        animated={true}
        barStyle={headerColor === 'white' ? 'dark-content' : 'light-content'}
      />
      <Div h={HAS_NOTCH ? 44 : 20} bg={headerColor} />
      <Row w="100%" h54 bg={headerColor}>
        <Col w50 auto pl20 justifyCenter onPress={onPressGoBack}>
          {headerColor == 'black' ? (
            <Img w7 h12 source={ICONS.icChveronLeftWhite100} />
          ) : (
            <Img w7 h12 source={ICONS.iconChevronLeftBold} />
          )}
        </Col>
        <Col itemsCenter justifyCenter>
          <Span
            header3
            numberOfLines={1}
            bold
            fontSize={14}
            color={headerColor == 'black' ? varStyle.white : varStyle.black}>
            {title ? title : headerTitle}
          </Span>
        </Col>
        <Col pr20 w50 auto onPress={onPressNext} justifyCenter itemsCenter>
          <Span medium color={GO_COLOR}>
            {nextText}
          </Span>
        </Col>
      </Row>
    </Div>
  );
};

export default TopHeader;
