import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import apis from 'src/modules/apis';
import {NAV_NAMES} from 'src/modules/navNames';
import {getNftName, getNftProfileImage} from 'src/utils/nftUtils';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {FlatList} from 'src/components/common/ViewComponents';
import {useApiGETWithToken} from 'src/redux/asyncReducer';
import {Div} from './common/Div';
import {Img} from './common/Img';
import {Span} from './common/Span';

export default function NftCollectionMembers({members}) {
  return (
    <FlatList
      px10
      data={members}
      numColumns={3}
      renderItem={({item}) => <NftCollectionMember member={item} />}></FlatList>
  );
}

function NftCollectionMember({member}) {
  const navigation = useNavigation();
  const apiGETWithToken = useApiGETWithToken();
  const goToProfile = useCallback(() => {
    apiGETWithToken(
      apis.nft.contractAddressAndTokenId(
        member.contract_address,
        member.token_id,
      ),
    );
    navigation.navigate(
      NAV_NAMES.OtherProfile as never,
      {
        contractAddress: member.contract_address,
        tokenId: member.token_id,
      } as never,
    );
  }, []);
  return (
    <Div mx5 my5 rounded10 overflowHidden onPress={goToProfile}>
      <Img
        w={(DEVICE_WIDTH - 50) / 3}
        h={(DEVICE_WIDTH - 50) / 3}
        uri={getNftProfileImage(member, 200, 200)}></Img>
      <Div py5 itemsCenter bgGray200>
        <Span medium>{getNftName(member)}</Span>
      </Div>
    </Div>
  );
}
