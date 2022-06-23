import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import React from 'react';
import {useGotoSignIn} from 'src/hooks/useGoto';
import {useLogout} from 'src/redux/appReducer';
import {NftIdentity} from '../NftIdentity';
import {Col} from './Col';
import {Div} from './Div';
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

