import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {AlertTriangle, CheckCircle} from 'react-native-feather';
import Colors from 'src/constants/Colors';
import {iconSettings} from 'src/modules/constants';
import {
  getNftName,
  getNftProfileImage,
  useIsCurrentNft,
} from 'src/modules/nftUtils';
import {useChangeAccount} from 'src/redux/appReducer';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';

export default function NftChooseBottomSheetScrollView({
  nfts,
  title,
  onSuccess = null,
}) {
  return (
    <BottomSheetScrollView>
      <Div px15>
        <Div itemsCenter mt15>
          <Span fontSize={12} bold>
            {title}
          </Span>
        </Div>
        <Div mt15>
          {nfts?.map((nft, index) => {
            return <NftIdentity key={index} nft={nft} onSuccess={onSuccess} />;
          })}
        </Div>
      </Div>
    </BottomSheetScrollView>
  );
}

function NftIdentity({nft, onSuccess}) {
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
    if (isCurrentNft) {
      return;
    }
    setStateType(StateType.Loading);
    await changeAccount(
      contract_address,
      token_id,
      props => {
        setStateType(StateType.Success);
        if (onSuccess) onSuccess();
      },
      props => {
        setStateType(StateType.Error);
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
    <Row
      itemsCenter
      bgGray200
      rounded10
      px10
      py10
      onPress={handlePressIdentity}>
      <Img w50 h50 rounded10 uri={getNftProfileImage(nft, 200, 200)} />
      <Col mx15>
        <Div>
          <Span medium fontSize={20}>
            {getNftName(nft)}
          </Span>
        </Div>
        {getNftName(nft) !== nft.nft_metadatum.name && (
          <Div mt5>
            <Span>{nft.nft_metadatum.name}</Span>
          </Div>
        )}
      </Col>
      {stateType !== StateType.None && (
        <Col auto px10>
          {stateType === StateType.Loading ? (
            <ActivityIndicator />
          ) : stateType === StateType.Success ? (
            <CheckCircle {...iconSettings} color={Colors.success.DEFAULT} />
          ) : (
            <AlertTriangle {...iconSettings} color={Colors.danger.DEFAULT} />
          )}
        </Col>
      )}
    </Row>
  );
}
