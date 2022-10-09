import {useMemo, useRef, useState} from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import {RootState} from 'src/redux/rootReducer';
import {resizeImageUri} from 'src/utils/uriUtils';
import useEdittableText from './useEdittableText';

export type SelectedNft = {
  contract_address: string;
  token_id: number;
  image_uri: string;
  name: string;
  nft_name: string;
};

export default function useMakeNewChat(uploadSuccessCallback = null) {
  const searchRef = useRef(null);
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const {
    data: nftsRes,
    isLoading: nftsLoad,
    isPaginating: nftsPaginating,
    page,
    isNotPaginatable,
  } = useApiSelector(apis.chat.nftList());
  const dataToNftValue = data =>
    data
      ? [
          {
            contract_address: data?.contract_address,
            token_id: data?.token_id,
            image_uri: data?.image_uri
              ? resizeImageUri(data.image_uri, 200, 200)
              : data?.nft_metadatum?.image_uri,
            name: data?.name,
            nft_name: data?.nft_metadatum?.name,
          },
        ]
      : [];
  const [selectedNft, setSelectedNft] = useState(dataToNftValue(currentNft));
  const nftSelected = (contract_address, token_id) =>
    selectedNft.find(
      e => e.contract_address == contract_address && e.token_id == token_id,
    ) != null
      ? true
      : false;
  const onPressNft = (contract_address, token_id, data, selected) => {
    if (selected) {
      removeSelectedNft(contract_address, token_id);
    } else {
      addSelectedNft(data);
    }
  };
  const nftEnabled = (contract_address, token_id) =>
    currentNft &&
    currentNft?.contract_address == contract_address &&
    currentNft?.token_id == token_id
      ? false
      : true;
  const removeSelectedNft = (contract_address, token_id) => {
    setSelectedNft(selectedNft =>
      selectedNft.filter(
        value =>
          !(
            value.contract_address == contract_address &&
            value.token_id == token_id
          ),
      ),
    );
  };

  const addSelectedNft = data => {
    setSelectedNft(selectedNft => [...selectedNft, ...dataToNftValue(data)]);
  };
  const reloadGetWithToken = useReloadGETWithToken();
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleRefresh = () => {
    if (nftsLoad) return;
    reloadGetWithToken(apis.chat.nftList(text));
  };
  const handleEndReached = () => {
    if (nftsPaginating || isNotPaginatable) return;
    paginateGetWithToken(apis.chat.nftList(text, page + 1), 'new_chat_members');
  };
  const [text, textHasChanged, handleChangeText] = useEdittableText('');
  const onPressSearch = () => {
    searchRef?.current?.focus();
  };
  const handleChangeQuery = text => {
    handleChangeText(text);
    if (nftsRes) {
      reloadGetWithToken(apis.chat.nftList(text));
    }
  };
  const canMakeNewChat = () => selectedNft.length >= 2;

  return {
    selectedNft,
    nftsRes,
    nftsLoad,
    nftsPaginating,
    isNotPaginatable,
    handleRefresh,
    handleEndReached,
    onPressSearch,
    handleChangeQuery,
    searchRef,
    text,
    textHasChanged,
    nftSelected,
    onPressNft,
    removeSelectedNft,
    nftEnabled,
    canMakeNewChat,
  };
}
