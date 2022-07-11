import {MenuView} from '@react-native-menu/menu';
import React, {memo, useState} from 'react';
import {ActivityIndicator, Clipboard, Linking, Platform} from 'react-native';
import {ChevronRight, Copy, MoreHorizontal} from 'react-native-feather';
import {Colors} from 'src/modules/styles';
import {useGotoCommunityWalletProfile, useGotoHome} from 'src/hooks/useGoto';
import apis from 'src/modules/apis';
import {truncateAddress} from 'src/utils/blockchainUtils';
import {smallBump} from 'src/utils/hapticFeedBackUtils';
import {ICONS} from 'src/modules/icons';
import {useIsAdmin} from 'src/utils/nftUtils';
import {resizeImageUri} from 'src/utils/uriUtils';
import {
  useDeletePromiseFnWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';

enum CommunityWalletEventTypes {
  Klaytnfinder = 'Klaytnfinder',
  Delete = 'Delete',
}

function CommunityWallet({communityWallet, width, verticalList = false}) {
  const [loading, setLoading] = useState(false);
  const gotoCommunityWalletProfile = useGotoCommunityWalletProfile({
    communityWallet,
  });
  const actionIconDefaultProps = {
    width: 12,
    height: 12,
    color: Colors.gray[500],
    strokeWidth: 1.7,
  };
  const copyToClipboard = () => {
    smallBump();
    Clipboard.setString(communityWallet.address);
  };
  const isAdmin = useIsAdmin(communityWallet?.nft_collection);
  const deletePromiseFnWithToken = useDeletePromiseFnWithToken();
  const reloadGETWithToken = useReloadGETWithToken();
  const gotoHome = useGotoHome();
  const menuOptions = [
    {
      id: CommunityWalletEventTypes.Klaytnfinder,
      title: 'Klaytnfinder에서 확인',
      titleColor: '#46F289',
      image: Platform.select({
        ios: 'magnifyingglass',
        android: 'ic_search_category_default',
      }),
    },
    isAdmin && {
      id: CommunityWalletEventTypes.Delete,
      title: '커뮤니티 지갑 제거',
      image: Platform.select({
        ios: 'trash',
        android: 'ic_menu_delete',
      }),
    },
  ].filter(option => option);
  const deletePost = async () => {
    setLoading(true);
    const {data} = await deletePromiseFnWithToken({
      url: apis.community_wallet.address._(communityWallet.address).url,
    });
    setLoading(false);
    if (data.success) {
      reloadGETWithToken(apis.nft_collection.communityWallet.list());
      gotoHome();
    }
  };
  const searchKlaytnfinder = () => {
    Linking.openURL(
      `https://www.klaytnfinder.io/account/${communityWallet.address}`,
    );
  };
  const handlePressMenu = ({nativeEvent: {event}}) => {
    if (event == CommunityWalletEventTypes.Delete) deletePost();
    if (event == CommunityWalletEventTypes.Klaytnfinder) searchKlaytnfinder();
  };
  return (
    <Div w={width} px15 py8>
      <Row itemsCenter>
        <Col auto mr8 onPress={gotoCommunityWalletProfile}>
          <Div>
            <Img
              w54
              h54
              border={0.5}
              borderGray200
              rounded100
              uri={resizeImageUri(communityWallet.image_uri, 200, 200)}
            />
          </Div>
        </Col>
        <Col>
          <Row itemsCenter onPress={copyToClipboard}>
            <Col auto mr8>
              <Span fontSize={14} bold>
                {communityWallet.name}
              </Span>
            </Col>
            {/* <Col auto mr8>
              <Span gray700 fontSize={14} onPress={copyToClipboard}>
                {truncateAddress(communityWallet.address)}
              </Span>
            </Col> */}
            <Col>
              <Copy {...actionIconDefaultProps} />
            </Col>
          </Row>
          <Row itemsCenter onPress={gotoCommunityWalletProfile}>
            <Col auto mr2>
              <Span fontSize={24} bold>
                {communityWallet.balance}
              </Span>
            </Col>
            <Col auto ml2>
              <Img h20 w20 source={ICONS.klayIcon}></Img>
            </Col>
            <Col auto ml2>
              <ChevronRight color={Colors.gray[200]} width={20} height={20} />
            </Col>
          </Row>
        </Col>
        <Col auto>
          <MenuView onPressAction={handlePressMenu} actions={menuOptions}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <MoreHorizontal color={Colors.gray[200]} width={18} height={18} />
            )}
          </MenuView>
        </Col>
      </Row>
    </Div>
  );
}

export default memo(CommunityWallet);
