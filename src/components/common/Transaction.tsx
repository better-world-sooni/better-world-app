import {MenuView} from '@react-native-menu/menu';
import React, {memo} from 'react';
import {Linking, Platform} from 'react-native';
import {MoreHorizontal, Repeat, User} from 'react-native-feather';
import {Colors} from 'src/modules/styles';
import {
  useGotoCollectionFeedTagSelect,
  useGotoCommunityWalletProfile,
  useGotoNewPost,
} from 'src/hooks/useGoto';
import {truncateAddress} from 'src/utils/blockchainUtils';
import {ICONS} from 'src/modules/icons';
import {getNftName, getNftProfileImage, useIsAdmin} from 'src/utils/nftUtils';
import {resizeImageUri} from 'src/utils/uriUtils';
import {PostOwnerType, PostType} from 'src/screens/NewPostScreen';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';
import {kmoment} from 'src/utils/timeUtils';

enum TransactionEventTypes {
  Klaytnfinder = 'Klaytnfinder',
  Tag = 'Tag',
  AdminShare = 'AdminShare',
}

function Transaction({transaction, mainAddress = null, enablePress = false}) {
  const communityWallet =
    transaction.from_community_wallet && transaction.to_community_wallet
      ? transaction.to_community_wallet.address == mainAddress
        ? transaction.to_community_wallet
        : transaction.from_community_wallet
      : transaction.from_community_wallet || transaction.to_community_wallet;
  const sent =
    communityWallet.address == transaction.from_community_wallet?.address;
  const recipientOrSender = sent
    ? transaction.to_community_wallet || transaction.to_user
    : transaction.from_community_wallet || transaction.from_user;
  const isAdmin = useIsAdmin(communityWallet?.nft_collection);
  const gotoCommunityWalletProfile = useGotoCommunityWalletProfile({
    communityWallet,
  });

  const menuOptions = [
    {
      id: TransactionEventTypes.Klaytnfinder,
      title: 'Klaytnfinder에서 확인',
      titleColor: '#46F289',
      image: Platform.select({
        ios: 'magnifyingglass',
        android: 'ic_search_category_default',
      }),
    },
    isAdmin && {
      id: TransactionEventTypes.Tag,
      title: '완료된 제안에 참조',
      image: Platform.select({
        ios: 'tag',
        android: 'ic_input_get',
      }),
    },
    isAdmin && {
      id: TransactionEventTypes.AdminShare,
      title: '커뮤니티 계정으로 리포스트',
      image: Platform.select({
        ios: 'square.and.arrow.up',
        android: 'ic_menu_set_as',
      }),
    },
  ].filter(option => option);
  const gotoNewPost = useGotoNewPost({postOwnerType: PostOwnerType.Nft});
  const gotoNewPostAsAdmin = useGotoNewPost({
    postOwnerType: PostOwnerType.NftCollection,
  });
  const gotoNewCollectionFeedTagSelect = useGotoCollectionFeedTagSelect();

  const searchKlaytnfinder = () => {
    Linking.openURL(
      `https://www.klaytnfinder.io/tx/${transaction.transaction_hash}`,
    );
  };
  const handlePressMenu = ({nativeEvent: {event}}) => {
    if (event == TransactionEventTypes.Klaytnfinder) searchKlaytnfinder();
    if (event == TransactionEventTypes.AdminShare)
      gotoNewPostAsAdmin(null, null, transaction, PostType.Default);
    if (event == TransactionEventTypes.Tag)
      gotoNewCollectionFeedTagSelect(
        transaction.transaction_hash,
        'blockchain_transaction_hash',
      );
  };
  return (
    <Div rounded10 border={0.5} borderGray200 p12 mx15 mt8>
      <Row>
        <Col auto mr8>
          <Div itemsEnd mb5>
            <Row itemsCenter>
              {recipientOrSender ? (
                <HolderNfts nftRanks={recipientOrSender.nft_ranks} />
              ) : (
                <Div rounded100 border={0.5} borderGray200>
                  <User color={Colors.gray[500]} width={18} height={18} />
                </Div>
              )}
            </Row>
          </Div>
          <Div
            onPress={
              enablePress && communityWallet && gotoCommunityWalletProfile
            }>
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
          <Div itemsEnd mb5>
            <Row itemsCenter>
              {recipientOrSender ? (
                <>
                  <Col auto mr4>
                    <AdminNames nftRanks={recipientOrSender.nft_ranks} />
                  </Col>
                  <Col>
                    <Span gray700 fontSize={13}>
                      (
                      {truncateAddress(
                        sent ? transaction.to : transaction.from,
                      )}
                      )
                    </Span>
                  </Col>
                </>
              ) : (
                <Col>
                  <Span gray700 bold fontSize={14}>
                    {truncateAddress(sent ? transaction.to : transaction.from)}
                  </Span>
                </Col>
              )}
            </Row>
          </Div>
          <Row>
            <Col mr8>
              <Span>
                <Span fontSize={14} bold>
                  {communityWallet.name}
                </Span>
                <Span gray700>
                  {' · '}
                  {kmoment(transaction.created_at).format('YY.M.D a h:mm')}
                </Span>
              </Span>
            </Col>
            <Col auto>
              <MenuView onPressAction={handlePressMenu} actions={menuOptions}>
                <MoreHorizontal
                  color={Colors.gray[200]}
                  width={18}
                  height={18}
                />
              </MenuView>
            </Col>
          </Row>
          <Row itemsCenter>
            <Col auto mr8>
              <Span bold danger={sent} info={!sent}>
                {sent ? '출금' : '입금'}
              </Span>
            </Col>
            <Col auto mr2>
              <Span fontSize={24} bold>
                {transaction.value}
              </Span>
            </Col>
            <Col auto ml2>
              <Img h18 w18 source={ICONS.klayIcon}></Img>
            </Col>
          </Row>
          <Row mt4 itemsCenter>
            <Col />
            <Col
              auto
              onPress={() =>
                gotoNewPost(null, null, transaction, PostType.Default)
              }>
              <Repeat
                color={Colors.gray[700]}
                width={18}
                height={18}
                strokeWidth={1.7}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Div>
  );
}

function HolderNfts({nftRanks}) {
  const firstCircleDiff = 10;
  const diff = 10;
  const firstCircleDiameter = 20;
  const circleDiameter = 20;
  return (
    <Div
      w={(nftRanks.slice(0, 3).length - 1) * diff + circleDiameter - 8}
      relative
      h={firstCircleDiameter}
      mr5>
      {nftRanks.slice(0, 3).map((nftRank, index) => {
        return (
          <Img
            key={index}
            uri={getNftProfileImage(nftRank.nft)}
            rounded100
            h={index == 0 ? firstCircleDiameter : circleDiameter}
            w={index == 0 ? firstCircleDiameter : circleDiameter}
            absolute
            bottom0
            left={index * diff + (index > 0 ? firstCircleDiff - diff : 0)}
            border={2}
            borderWhite></Img>
        );
      })}
    </Div>
  );
}

function AdminNames({nftRanks}) {
  if (nftRanks.length == 0) return null;
  if (nftRanks.length == 1)
    return (
      <Span gray700 bold fontSize={13}>
        {getNftName(nftRanks[0].nft)}의 홀더
      </Span>
    );
  return (
    <Span gray700 bold fontSize={13}>
      {getNftName(nftRanks[0].nft)} 외 +{nftRanks.length - 1}의 홀더
    </Span>
  );
}

export default memo(Transaction);
