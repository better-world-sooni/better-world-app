import {MenuView} from '@react-native-menu/menu';
import React, {memo} from 'react';
import {MoreHorizontal, Repeat} from 'react-native-feather';
import Colors from 'src/constants/Colors';
import {truncateAddress} from 'src/modules/blockchainUtils';
import {kmoment} from 'src/modules/constants';
import {getNftName, getNftProfileImage} from 'src/modules/nftUtils';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';

function Transaction({transaction}) {
  const ownerIsFrom = !!transaction.from_owner?.nft_collection;
  const communityWallet = ownerIsFrom
    ? transaction.from_owner
    : transaction.to_owner;
  const opponentAddress = ownerIsFrom ? transaction.to : transaction.from;
  const opponentObject = ownerIsFrom
    ? transaction.to_owner
    : transaction.from_owner;
  return (
    <Div borderTop={0.5} borderGray200 py8 px15>
      <Row itemsCenter mb4>
        <Col>
          <Span gray700>
            {kmoment(transaction.created_at).format('YY.M.D a h:mm')}
            {' · '}
            Tx({truncateAddress(transaction.transaction_hash)})
          </Span>
        </Col>
        <Col auto>
          <MenuView onPressAction={null} actions={[]}>
            <MoreHorizontal color={Colors.gray[400]} width={20} height={20} />
          </MenuView>
        </Col>
      </Row>
      <Row itemsCenter py2>
        <Col auto>
          <Div>
            {opponentObject ? (
              <Div>
                <HolderNfts nftRanks={opponentObject.nft_ranks} />
                <AdminNames nftRanks={opponentObject.nft_ranks} />
                <Span bold fontSize={14}>
                  {truncateAddress(
                    ownerIsFrom ? transaction.to : transaction.from,
                  )}
                </Span>
              </Div>
            ) : (
              <Span bold fontSize={14}>
                {truncateAddress(
                  ownerIsFrom ? transaction.to : transaction.from,
                )}
              </Span>
            )}
          </Div>
        </Col>
        <Col />
        <Col auto>
          <Row>
            <Col />
            <Col auto>
              <Span danger={ownerIsFrom} info={!ownerIsFrom}>
                {ownerIsFrom ? '출금' : '입금'}
              </Span>
            </Col>
          </Row>
          <Row mt2>
            <Col />
            <Col auto>
              <Span bold danger={ownerIsFrom} info={!ownerIsFrom} fontSize={18}>
                {transaction.value} Klay
              </Span>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row mt4>
        <Col />
        <Col auto>
          <Repeat
            color={Colors.gray[700]}
            width={18}
            height={18}
            strokeWidth={1.7}
          />
        </Col>
      </Row>
    </Div>
  );
}

function HolderNfts({nftRanks}) {
  const firstCircleDiff = 20;
  const diff = 20;
  const firstCircleDiameter = 30;
  const circleDiameter = 30;
  return (
    <Div
      w={(nftRanks.slice(0, 3).length - 1) * diff + circleDiameter}
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
            border={4}
            borderWhite></Img>
        );
      })}
    </Div>
  );
}

function AdminNames({nftRanks}) {
  if (nftRanks.length == 0) return null;
  if (nftRanks.length == 1)
    return <Span bold>{getNftName(nftRanks[0].nft)} 의 홀더</Span>;
  return (
    <Span>
      <Span bold>{getNftName(nftRanks[0].nft)} </Span>외{' '}
      <Span bold>+{nftRanks.length - 1}</Span>의 홀더
    </Span>
  );
}

export default memo(Transaction);
