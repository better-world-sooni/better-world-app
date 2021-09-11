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

const TopHeader = props => {
  const {navigation, route, headerShown, title, headerBlack} = props;

  const {params = {}} = route;
  const {headerTitle, onGoBack} = params;

  const onPressGoBack = useGoBack(onGoBack);
  return (
    <>
    {!headerShown ?
    (<Div h={HAS_NOTCH ? 44 : 20} />)
    :
     (
    <Div bg={headerBlack ? varStyle.realBlack : varStyle.gray100}>
      <Div h={HAS_NOTCH ? 44 : 20} />
        <Row
          w="100%"
          h54
          bg={headerBlack ? varStyle.realBlack : varStyle.gray100}>
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
              color={headerBlack ? varStyle.white : varStyle.black}>
              {title ? title : headerTitle}
            </Span>
          </Col>
          <Col w50 auto />
        </Row>
      
    </Div>
    )}
    </>
  );
};

export default TopHeader;
