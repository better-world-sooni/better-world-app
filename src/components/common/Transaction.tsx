import {MenuView} from '@react-native-menu/menu';
import React, {memo} from 'react';
import {Linking, Platform} from 'react-native';
import {MoreHorizontal, Repeat, User} from 'react-native-feather';
import Colors from 'src/constants/Colors';
import {useGotoNewPost} from 'src/hooks/useGoto';
import {truncateAddress} from 'src/modules/blockchainUtils';
import {kmoment} from 'src/modules/constants';
import {ICONS} from 'src/modules/icons';
import {getNftName, getNftProfileImage, useIsAdmin} from 'src/modules/nftUtils';
import {resizeImageUri} from 'src/modules/uriUtils';
import {PostOwnerType, PostType} from 'src/screens/NewPostScreen';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';

enum TransactionEventTypes {
  Klaytnfinder = 'Klaytnfinder',
  Tag = 'Tag',
}

function Transaction({transaction}) {
  const ownerIsFrom = !!transaction.from_owner?.nft_collection;
  const communityWallet = ownerIsFrom
    ? transaction.from_owner
    : transaction.to_owner;
  const opponentAddress = ownerIsFrom ? transaction.to : transaction.from;
  const opponentObject = ownerIsFrom
    ? transaction.to_owner
    : transaction.from_owner;
  const isAdmin = useIsAdmin(communityWallet?.nft_collection);
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
      title: '커뮤니티 게시물에 참조',
      image: Platform.select({
        ios: 'tag',
        android: 'ic_input_get',
      }),
    },
  ].filter(option => option);
  const gotoNewPost = useGotoNewPost({postOwnerType: PostOwnerType.Nft});

  const searchKlaytnfinder = () => {
    Linking.openURL(
      `https://www.klaytnfinder.io/tx/${transaction.transaction_hash}`,
    );
  };
  const handlePressMenu = ({nativeEvent: {event}}) => {
    // if (event == CommunityWalletEventTypes.Delete) deletePost();
    if (event == TransactionEventTypes.Klaytnfinder) searchKlaytnfinder();
  };
  return (
    <Div borderBottom={0.5} borderGray200 py8 px15>
      <Row>
        <Col auto mr8>
          <Div itemsEnd mb5>
            <Row itemsCenter>
              {opponentObject ? (
                <HolderNfts nftRanks={opponentObject.nft_ranks} />
              ) : (
                <Div rounded100 border={0.5} borderGray200>
                  <User color={Colors.gray[500]} width={18} height={18} />
                </Div>
              )}
            </Row>
          </Div>
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
          <Div itemsEnd mb5>
            <Row itemsCenter>
              {opponentObject ? (
                <>
                  <Col auto mr4>
                    <AdminNames nftRanks={opponentObject.nft_ranks} />
                  </Col>
                  <Col>
                    <Span gray700 fontSize={13}>
                      (
                      {truncateAddress(
                        ownerIsFrom ? transaction.to : transaction.from,
                      )}
                      )
                    </Span>
                  </Col>
                </>
              ) : (
                <Col>
                  <Span gray700 bold fontSize={14}>
                    {truncateAddress(
                      ownerIsFrom ? transaction.to : transaction.from,
                    )}
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
              <Span normal danger={ownerIsFrom} info={!ownerIsFrom}>
                {ownerIsFrom ? '출금' : '입금'}
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
