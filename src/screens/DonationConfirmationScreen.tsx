import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {CheckCircle, Info, Minus, Plus, X} from 'react-native-feather';
import {shallowEqual, useSelector} from 'react-redux';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import useKaikasExecuteContract from 'src/hooks/useKaikasExecuteContract';
import useKlipExecuteContract from 'src/hooks/useKlipExecuteContract';
import ABIS from 'src/modules/abis';
import CONTRACT_ADDRESSES from 'src/modules/contractAddresses';
import {ICONS} from 'src/modules/icons';
import {Colors, DEVICE_WIDTH} from 'src/modules/styles';
import {RootState} from 'src/redux/rootReducer';
import {getNftName} from 'src/utils/nftUtils';

export default function DonationConfirmationScreen({
  route: {
    params: {onConfirm = null, nft, postId},
  },
}) {
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const [loading, setLoading] = useState(false);
  const [checkResult, setCheckResult] = useState({
    donation_diff: 0,
    success: false,
    initial: true,
  });
  const [value, setValue] = useState(1);
  const {goBack} = useNavigation();
  const {requestExecuteContract} = useKaikasExecuteContract();
  const {requestExecuteContract: klipRequestExecuteContract} =
    useKlipExecuteContract();

  const handlePressKlip = async () => {
    await klipRequestExecuteContract({
      to: CONTRACT_ADDRESSES.donationRelay,
      value: `${value * 1000000000000000000}`,
      abi: JSON.stringify(ABIS.sendThroughDonationRelay),
      params: JSON.stringify([
        nft.user_address || '0x0000000000000000000000000000000000000000',
        currentNft.contract_address,
        `${currentNft.token_id}`,
        `${postId}`,
      ]),
    });
  };

  const handlePressKaikas = async () => {
    console.log(nft);
    await requestExecuteContract({
      to: CONTRACT_ADDRESSES.donationRelay,
      value: `${value * 1000000000000000000}`,
      abi: JSON.stringify(ABIS.sendThroughDonationRelay),
      params: JSON.stringify([
        nft.user_address || '0x0000000000000000000000000000000000000000',
        currentNft.contract_address,
        `${currentNft.token_id}`,
        `${postId}`,
      ]),
    });
  };
  const handleCancel = async () => {
    goBack();
  };
  const handleConfirm = async () => {
    if (loading) return;
    if (checkResult.success) {
      goBack();
      return;
    }
    if (onConfirm) {
      setLoading(true);
      const result = await onConfirm(value);
      setCheckResult(result);
      setLoading(false);
    }
  };
  const decrementValue = () => {
    if (value == 1) return;
    setValue(value => value - 1);
  };
  const incrementValue = () => {
    setValue(value => value + 1);
  };
  return (
    <Div flex={1} itemsCenter justifyCenter backgroundColor="rgba(0,0,0,0.2)">
      <Div
        bgWhite
        rounded10
        w={DEVICE_WIDTH - 60}
        px15
        py15
        border={0.5}
        borderGray200>
        <Row>
          <Col></Col>
          <Col
            auto
            rounded100
            p5
            border={0.5}
            borderGray200
            onPress={handleCancel}>
            <X strokeWidth={2} color={Colors.black} height={22} width={22} />
          </Col>
        </Row>
        <Div itemsCenter px12 py8>
          <Span fontSize={18} style={{textAlign: 'center'}} lineHeight={26}>
            <Span bold fontSize={18} lineHeight={26}>{`${getNftName(
              nft,
            )}`}</Span>
            {`의 활동을 응원해 보세요!`}
          </Span>
        </Div>
        <Row itemsCenter py10>
          <Col></Col>
          <Col
            auto
            rounded100
            p5
            border={0.5}
            borderGray200
            onPress={decrementValue}>
            <Minus
              strokeWidth={2}
              color={value == 1 ? Colors.gray[200] : Colors.black}
              height={28}
              width={28}
            />
          </Col>
          <Col auto px14>
            <Span fontSize={20} bold>
              {value} KLAY
            </Span>
          </Col>
          <Col
            auto
            rounded100
            p5
            border={0.5}
            borderGray200
            onPress={incrementValue}>
            <Plus strokeWidth={2} color={Colors.black} height={28} width={28} />
          </Col>
          <Col></Col>
        </Row>
        <Div h48 mt12>
          <Row
            bg={Colors.klip.DEFAULT}
            rounded={22}
            h64
            flex={1}
            itemsCenter
            onPress={handlePressKlip}>
            <Col />
            <Col auto mr11>
              <Img source={ICONS.klip} h15 w30></Img>
            </Col>
            <Col auto>
              <Div>
                <Span bold fontSize={14}>
                  클립으로 전송하기
                </Span>
              </Div>
            </Col>
            <Col />
          </Row>
        </Div>
        <Div h48 mt12>
          <Row
            rounded={22}
            bg={Colors.kaikas.DEFAULT}
            h64
            flex={1}
            itemsCenter
            onPress={handlePressKaikas}>
            <Col />
            <Col auto mr11>
              <Img source={ICONS.kaikasWhite} h15 w15></Img>
            </Col>
            <Col auto>
              <Div>
                <Span bold white fontSize={13}>
                  카이카스로 전송하기
                </Span>
              </Div>
            </Col>
            <Col />
          </Row>
        </Div>
        <Row
          h48
          mt12
          border={0.5}
          borderGray200
          p12
          itemsCenter
          justifyCenter
          rounded22
          ml4
          onPress={handleConfirm}>
          <Col></Col>
          {loading ? (
            <Col>
              <ActivityIndicator />
            </Col>
          ) : (
            <>
              {checkResult.success && (
                <Col auto mr6>
                  <CheckCircle
                    strokeWidth={1.5}
                    color={Colors.success.DEFAULT}
                    height={20}
                    width={20}
                  />
                </Col>
              )}
              <Col auto>
                <Span bold>
                  {checkResult.initial
                    ? '전송 확인하기'
                    : checkResult.success
                    ? `${checkResult.donation_diff} KLAY 응원을 추가했습니다!`
                    : '추가 응원이 확인되지 않았습니다.'}
                </Span>
              </Col>
            </>
          )}
          <Col></Col>
        </Row>
        <Row itemsCenter py10>
          <Col />
          <Col auto mr4>
            <Info color={Colors.gray[400]} width={16} height={16} />
          </Col>
          <Col auto>
            <Span gray400>transaction fee 1%</Span>
          </Col>
          <Col />
        </Row>
      </Div>
    </Div>
  );
}
