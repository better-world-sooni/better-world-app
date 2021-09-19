import React from 'react';
import {ICONS} from 'src/modules/icons';
import {varStyle} from 'src/modules/styles';
import {Col} from './common/Col';
import {Div} from './common/Div';
import {Img} from './common/Img';
import {Row} from './common/Row';
import {Span} from './common/Span';
import {HAS_NOTCH} from 'src/modules/contants';
import {useGoBack} from 'src/modules/useCustomHooks';
import { StatusBar } from 'native-base';

const TopHeader = props => {
  const { route, title, headerBlack, nextText, onPressNext } = props;

  const {params = {}} = route;
  const {headerTitle, onGoBack} = params;

  const onPressGoBack = useGoBack(onGoBack);
  return (
    <Div >
      <StatusBar animated={true} barStyle='light-content'/>
      <Div h={HAS_NOTCH ? 44 : 20} bg={headerBlack ? varStyle.realBlack : "white"}/>
      <Row
        w="100%"
        h54
        bg={headerBlack ? varStyle.realBlack : "white"}>
        <Col w50 auto pl20 justifyCenter onPress={onPressGoBack}>
          {headerBlack ? (
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
            color={headerBlack ? varStyle.white : varStyle.black}>
            {title ? title : headerTitle}
          </Span>
        </Col>
        <Col pr20 w50 auto onPress={onPressNext} justifyCenter itemsCenter><Span color={headerBlack ? varStyle.white : varStyle.black}>{nextText}</Span></Col>
      </Row>
      
    </Div>
  );
};

export default TopHeader;
