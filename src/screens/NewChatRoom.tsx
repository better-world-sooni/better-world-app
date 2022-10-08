import React, {memo, useState} from 'react';
import {Div} from 'src/components/common/Div';
import {ActivityIndicator, FlatList, RefreshControl} from 'react-native';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {Search, ChevronLeft, Check, X} from 'react-native-feather';
import {TextInput} from 'src/components/common/ViewComponents';
import {Colors, DEVICE_HEIGHT} from 'src/modules/styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ListEmptyComponent from 'src/components/common/ListEmptyComponent';
import {useNavigation} from '@react-navigation/native';
import {Span} from 'src/components/common/Span';
import {resizeImageUri} from 'src/utils/uriUtils';
import {Img} from 'src/components/common/Img';
import useMakeNewChat from 'src/hooks/useMakeNewChat';

const NewChatRoom = () => {
  const {
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
    addSelectedNft,
    removeSelectedNft,
    nftEnabled,
  } = useMakeNewChat();
  const {goBack} = useNavigation();
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
  return (
    <Div flex={1} bgWhite>
      <Div h={notchHeight}></Div>
      <Div bgWhite px8 h={180} justifyCenter borderBottom={0.5} borderGray200>
        <Col itemsCenter py5 h40>
          <Row itemsCenter>
            <Col itemsStart rounded100 onPress={goBack}>
              <ChevronLeft
                width={30}
                height={30}
                color={Colors.black}
                strokeWidth={2}
              />
            </Col>
            <Col auto>
              <Span bold fontSize={17}>
                새로운 채팅 시작
              </Span>
            </Col>
            <Col />
          </Row>
          <Row itemsStart h={70} mt20 px10>
            <FlatList
              horizontal={true}
              data={selectedNft}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item =>
                `${(item as any)?.contract_address}-${(item as any)?.token_id}`
              }
              ListFooterComponent={
                <Col mt3 w50 h50 rounded100 bgGray600 itemsCenter justifyCenter>
                  <Row>
                    <Div w={6} h={6} rounded={12} bgWhite mr4 />
                    <Div w={6} h={6} rounded={12} bgWhite mr4 />
                    <Div w={6} h={6} rounded={12} bgWhite />
                  </Row>
                </Col>
              }
              renderItem={({item, index}) => {
                return (
                  <Div mr10>
                    <NftProfile
                      contract_address={item?.contract_address}
                      token_id={item?.token_id}
                      image_uri={item?.image_uri}
                      removeNft={() =>
                        removeSelectedNft(
                          item?.contract_address,
                          item?.token_id,
                        )
                      }
                      enabled={nftEnabled(
                        item?.contract_address,
                        item?.token_id,
                      )}
                    />
                  </Div>
                );
              }}></FlatList>
          </Row>
          <Row itemsCenter px10>
            <Col mr10>
              <TextInput
                innerRef={searchRef}
                value={text}
                placeholder="NFT를 검색하여 찾기"
                fontSize={16}
                bgGray200
                rounded100
                m0
                p0
                px8
                h32
                bold
                onChangeText={handleChangeQuery}
              />
            </Col>
            <Col auto rounded100 onPress={onPressSearch} pr7>
              <Search
                strokeWidth={2}
                color={Colors.black}
                height={22}
                width={22}
              />
            </Col>
          </Row>
        </Col>
      </Div>
      <FlatList
        ListEmptyComponent={
          !nftsLoad && (
            <ListEmptyComponent h={DEVICE_HEIGHT - headerHeight * 2} />
          )
        }
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        refreshControl={
          <RefreshControl
            refreshing={nftsLoad && !textHasChanged}
            onRefresh={handleRefresh}
          />
        }
        data={nftsRes ? nftsRes.new_chat_members : []}
        keyExtractor={item =>
          `${(item as any)?.contract_address}-${(item as any)?.token_id}`
        }
        ListFooterComponent={
          <>
            {nftsPaginating && (
              <Div itemsCenter py15>
                <ActivityIndicator />
              </Div>
            )}
            {isNotPaginatable && (
              <Div itemsCenter py15>
                <Span textCenter bold>
                  모두 확인했습니다.
                </Span>
              </Div>
            )}
            <Div h={50}></Div>
            <Div h={27} />
          </>
        }
        renderItem={({item, index}) => {
          return (
            <BriefNftContent
              nftsItem={item}
              addNft={() => addSelectedNft(item)}
              removeNft={() =>
                removeSelectedNft(item?.contract_address, item?.token_id)
              }
              enabled={nftEnabled(item?.contract_address, item?.token_id)}
            />
          );
        }}></FlatList>
    </Div>
  );
};

function BriefNftContent({nftsItem, addNft, removeNft, enabled}) {
  return (
    <NftContentMemo
      {...nftsItem}
      addNft={addNft}
      removeNft={removeNft}
      enabled={enabled}
    />
  );
}

const NftContentMemo = memo(NftContent);

function NftContent({
  nft_metadatum,
  name,
  image_uri,
  addNft,
  removeNft,
  enabled,
}) {
  const [checked, setChecked] = useState(!enabled);
  const toggleChecked = () => {
    if (checked) removeNft();
    else addNft();
    setChecked(!checked);
  };
  return (
    <Row itemsCenter h64 onPress={enabled && toggleChecked} px15 relative>
      <Img
        w50
        h50
        rounded100
        uri={
          image_uri
            ? resizeImageUri(image_uri, 200, 200)
            : nft_metadatum?.image_uri
        }
      />
      <Col mx15>
        <Div>
          <Span medium fontSize={16} bold>
            {name || nft_metadatum?.name}
          </Span>
        </Div>
        {name && (
          <Div mt3>
            <Span gray700 fontSize={12} bold>
              {nft_metadatum?.name}
            </Span>
          </Div>
        )}
      </Col>
      <Col auto mr10 itemsCenter justifyCenter>
        {checked && (
          <Div auto rounded100 p3 bgSuccess>
            <Check
              strokeWidth={2}
              height={18}
              width={18}
              color={Colors.white}
            />
          </Div>
        )}
      </Col>
    </Row>
  );
}

function NftProfile({
  contract_address,
  token_id,
  image_uri,
  removeNft,
  enabled,
}) {
  return (
    <Div onPress={enabled && removeNft}>
      <Img mt3 w50 h50 rounded100 uri={image_uri} />
      {enabled && (
        <Div absolute left={35} opacity={0.7}>
          <Col bgBlack w20 h20 rounded={40} itemsCenter justifyCenter>
            <X
              strokeWidth={4}
              height={12}
              width={12}
              color={Colors.white}
              style={{marginBottom: 1}}
            />
          </Col>
        </Div>
      )}
    </Div>
  );
}

export default NewChatRoom;
