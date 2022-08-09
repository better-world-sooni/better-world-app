import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import React, {useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import {useGotoSignIn} from 'src/hooks/useGoto';
import {useChangeAccount, useLogout} from 'src/redux/appReducer';
import {RootState} from 'src/redux/rootReducer';
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
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const gotoSignIn = useGotoSignIn();
  const logout = useLogout(gotoSignIn);
  const [loading, setLoading] = useState(false);
  const changeAccount = useChangeAccount();
  const reload = async () => {
    setLoading(true);
    if (setCloseDisable) setCloseDisable(true);
    await changeAccount(
      currentNft.contract_address,
      currentNft.token_id,
      props => {
        setLoading(false);
        if (setCloseDisable) setCloseDisable(false);
        if (onSuccess) onSuccess();
      },
      props => {
        setLoading(false);
        if (setCloseDisable) setCloseDisable(false);
      },
    );
  };
  return (
    <BottomSheetScrollView>
      <Row px15 itemsCenter>
        <Col />
        <Col auto onPress={reload} mr12>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Span info bold>
              리로드
            </Span>
          )}
        </Col>
        <Col auto onPress={logout}>
          <Span info bold>
            로그아웃
          </Span>
        </Col>
      </Row>
      <Div px15>
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

