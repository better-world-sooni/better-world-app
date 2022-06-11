import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {
  AlertTriangle,
  Check,
  CheckCircle,
  Lock,
  RefreshCw,
} from 'react-native-feather';
import Colors from 'src/constants/Colors';
import {useGotoHome, useGotoSignIn} from 'src/hooks/useGoto';
import {
  getNftName,
  getNftProfileImage,
  useIsCurrentNft,
} from 'src/modules/nftUtils';
import {useLogout, useChangeAccount} from 'src/redux/appReducer';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';

export default function NftChooseBottomSheetScrollView({
  nfts,
  title,
  setCloseDisable = null,
  onSuccess = null,
}) {
  const gotoSignIn = useGotoSignIn();
  const logout = useLogout(gotoSignIn);
  return (
    <BottomSheetScrollView>
      <Row px20 itemsCenter>
        <Col />
        <Col auto onPress={logout}>
          <Span info bold>
            로그아웃
          </Span>
        </Col>
      </Row>
      <Div px20>
        <Div>
          {nfts?.map((nft, index) => {
            return <NftIdentity key={index} nft={nft} setCloseDisable={setCloseDisable} onSuccess={onSuccess} />;
          })}
        </Div>
      </Div>
    </BottomSheetScrollView>
  );
}

function NftIdentity({nft, setCloseDisable, onSuccess}) {
  const isCurrentNft = useIsCurrentNft(nft);
  enum StateType {
    None,
    Loading,
    Error,
    Success,
  }
  const {contract_address, token_id} = nft;
  const [stateType, setStateType] = useState(
    isCurrentNft ? StateType.Success : StateType.None,
  );
  const changeAccount = useChangeAccount();
  const handlePressIdentity = async () => {
    setStateType(StateType.Loading);
    if (setCloseDisable) setCloseDisable(true);
    await changeAccount(
      contract_address,
      token_id,
      props => {
        setStateType(StateType.Success);
        if (setCloseDisable) setCloseDisable(false);
        if (onSuccess) onSuccess();
      },
      props => {
        setStateType(StateType.Error);
        if (setCloseDisable) setCloseDisable(false);
      },
    );
  };
  useEffect(() => {
    if (isCurrentNft) {
      setStateType(StateType.Success);
    } else {
      setStateType(StateType.None);
    }
  }, [isCurrentNft]);

  return (
    <Row itemsCenter rounded10 py10 onPress={handlePressIdentity}>
      <Img w50 h50 rounded100 uri={getNftProfileImage(nft, 200, 200)} />
      <Col mx15 auto>
        <Div>
          <Span medium fontSize={15} bold>
            {getNftName(nft)}
          </Span>
        </Div>
        {getNftName(nft) !== nft.nft_metadatum.name && (
          <Div mt3>
            <Span gray700 fontSize={12}>
              {nft.nft_metadatum.name}
            </Span>
          </Div>
        )}
      </Col>
      {isCurrentNft && (
        <Col auto>
          <RefreshCw strokeWidth={2} height={18} width={18} color={'black'} />
        </Col>
      )}
      <Col></Col>
      {stateType !== StateType.None && (
        <Col auto>
          {stateType === StateType.Loading ? (
            <ActivityIndicator />
          ) : stateType === StateType.Success ? (
            <Div auto rounded100 bgRealBlack p3 bgInfo>
              <Check strokeWidth={2} height={18} width={18} color={'white'} />
            </Div>
          ) : (
            <AlertTriangle
              strokeWidth={2}
              height={18}
              width={18}
              color={Colors.danger.DEFAULT}
            />
          )}
        </Col>
      )}
    </Row>
  );
}
