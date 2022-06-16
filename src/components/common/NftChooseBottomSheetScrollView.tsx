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
import {NftIdentity} from '../NftIdentity';
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
            return (
              <NftIdentity
                key={index}
                nft={nft}
                setCloseDisable={setCloseDisable}
                onSuccess={onSuccess}
              />
            );
          })}
        </Div>
      </Div>
    </BottomSheetScrollView>
  );
}

