import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ActivityIndicator} from 'react-native';
import {ChevronLeft} from 'react-native-feather';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import apis from 'src/modules/apis';
import {Colors, DEVICE_WIDTH} from 'src/modules/styles';
import {useApiSelector} from 'src/redux/asyncReducer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Transaction from 'src/components/common/Transaction';

export default function TransactionScreen({
  route: {
    params: {transactionHash},
  },
}) {
  const {data: transactionRes, isLoading: transactionLoading} = useApiSelector(
    apis.blockchain_transaction._,
  );
  const transaction = transactionRes?.transaction;
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
  const {goBack} = useNavigation();
  return (
    <Div flex={1} justifyCenter bgWhite>
      <Div h={headerHeight} zIndex={100} absolute top0 bgWhite>
        <Row
          itemsCenter
          py5
          h40
          px8
          zIndex={100}
          absolute
          w={DEVICE_WIDTH}
          top={notchHeight + 5}>
          <Col justifyStart>
            <Div auto rounded100 onPress={goBack}>
              <ChevronLeft
                width={30}
                height={30}
                color={Colors.black}
                strokeWidth={2}
              />
            </Div>
          </Col>
          <Col auto>
            <Span bold fontSize={17}>
              전송내역
            </Span>
          </Col>
          <Col />
        </Row>
      </Div>
      <Div>
        {transactionLoading || !transaction ? (
          <ActivityIndicator size={'large'} />
        ) : (
          <Transaction transaction={transaction} enablePress />
        )}
      </Div>
    </Div>
  );
}
