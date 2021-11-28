import React from 'react';
import {ICONS} from 'src/modules/icons';
import {varStyle} from 'src/modules/styles';
import {Col} from './common/Col';
import {Div} from './common/Div';
import {Img} from './common/Img';
import {Row} from './common/Row';
import {Span} from './common/Span';
import {GO_COLOR, GRAY_COLOR, HAS_NOTCH} from 'src/modules/constants';
import {useGoBack} from 'src/modules/useCustomHooks';
import {StatusBar} from 'native-base';
import {Header} from './Header';

const TopHeader = props => {
  const {title, nextText, onPressNext} = props;
  return (
    <Div>
      <Div h={HAS_NOTCH ? 44 : 20} />
      <Header
        bg={'rgba(255,255,255,0)'}
        headerTitle={title}
        noButtons
        hasGoBack
        onFinish={onPressNext}
        onFinishText={nextText}
      />
    </Div>
  );
};

export default TopHeader;
