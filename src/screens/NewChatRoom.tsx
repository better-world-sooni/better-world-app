import React, {memo, useMemo, useRef} from 'react';
import {Div} from 'src/components/common/Div';
import {ActivityIndicator, FlatList, RefreshControl} from 'react-native';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {
  Search,
  ChevronLeft,
  Check,
  X,
  Trash,
  User,
  Send,
} from 'react-native-feather';
import {TextInput} from 'src/components/common/ViewComponents';
import {Colors, DEVICE_HEIGHT} from 'src/modules/styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ListEmptyComponent from 'src/components/common/ListEmptyComponent';
import {useNavigation} from '@react-navigation/native';
import {Span} from 'src/components/common/Span';
import {resizeImageUri} from 'src/utils/uriUtils';
import {Img} from 'src/components/common/Img';
import useMakeNewChat from 'src/hooks/useMakeNewChat';
import BottomPopup from 'src/components/common/BottomPopup';
import {BottomSheetFlatList, BottomSheetModal} from '@gorhom/bottom-sheet';

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
    nftSelected,
    onPressNft,
    removeSelectedNft,
    nftEnabled,
    canMakeNewChat,
  } = useMakeNewChat();
  const {goBack} = useNavigation();
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
  const bottomPopupRef = useRef<BottomSheetModal>(null);
  const openModal = () => bottomPopupRef?.current?.expand();
  return (
    <>
      <Div flex={1} bgWhite>
        <Div h={notchHeight}></Div>
        <Div bgWhite px8 h={180} justifyCenter borderBottom={0.5} borderGray200>
          <Col itemsCenter py5 h40 px8>
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
              <Col itemsEnd>
                <Send
                  width={25}
                  height={25}
                  color={canMakeNewChat() ? Colors.black : Colors.gray[300]}
                  strokeWidth={2}
                />
              </Col>
            </Row>
            <Row itemsStart h={70} mt20>
              <FlatList
                horizontal={true}
                data={selectedNft}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item =>
                  `${(item as any)?.contract_address}-${
                    (item as any)?.token_id
                  }`
                }
                ListFooterComponent={
                  <Col
                    mt3
                    w50
                    h50
                    rounded100
                    bgGray600
                    itemsCenter
                    justifyCenter
                    onPress={openModal}>
                    <Row>
                      <Div w={6} h={6} rounded={12} bgWhite mr4 />
                      <Div w={6} h={6} rounded={12} bgWhite mr4 />
                      <Div w={6} h={6} rounded={12} bgWhite />
                    </Row>
                  </Col>
                }
                renderItem={({item}) => {
                  return (
                    <Div mr10>
                      <NftProfilememo
                        image_uri={item?.image_uri}
                        enabled={nftEnabled(
                          item?.contract_address,
                          item?.token_id,
                        )}
                        onPressNft={() =>
                          onPressNft(
                            item?.contract_address,
                            item?.token_id,
                            item,
                            true,
                          )
                        }
                      />
                    </Div>
                  );
                }}></FlatList>
            </Row>
            <Row itemsCenter>
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
          renderItem={({item}) => {
            return (
              <BriefNftContentMemo
                nftsItem={item}
                onPressNft={
                  nftEnabled(item?.contract_address, item?.token_id) &&
                  (selected =>
                    onPressNft(
                      item?.contract_address,
                      item?.token_id,
                      item,
                      selected,
                    ))
                }
                selected={nftSelected(item?.contract_address, item?.token_id)}
              />
            );
          }}></FlatList>
      </Div>
      <BottomPopupOptions
        bottomPopupRef={bottomPopupRef}
        selectedNft={selectedNft}
        removeSelectedNft={removeSelectedNft}
        nftEnabled={nftEnabled}
      />
    </>
  );
};

function BriefNftContent({nftsItem, onPressNft, selected}) {
  return (
    <NftContent
      nft_name={nftsItem?.nft_metadatum?.name}
      nft_image_uri={nftsItem?.nft_metadatum?.image_uri}
      name={nftsItem?.name}
      image_uri={nftsItem?.image_uri}
      onPressNft={onPressNft}
      selected={selected}
    />
  );
}

const BriefNftContentMemo = React.memo(BriefNftContent, (props, nextProps) =>
  props.selected === nextProps.selected ? true : false,
);

function NftContent({
  nft_name,
  nft_image_uri,
  name,
  image_uri,
  onPressNft,
  selected,
  removeNft = null,
}) {
  return (
    <Row
      itemsCenter
      h64
      onPress={!removeNft && onPressNft && (() => onPressNft(selected))}
      px15
      relative>
      <Img
        w50
        h50
        rounded100
        uri={image_uri ? resizeImageUri(image_uri, 200, 200) : nft_image_uri}
      />
      <Col mx15>
        <Div>
          <Span medium fontSize={16} bold>
            {name || nft_name}
          </Span>
        </Div>
        {name && (
          <Div mt3>
            <Span gray700 fontSize={12} bold>
              {nft_name}
            </Span>
          </Div>
        )}
      </Col>
      <Col auto mr10 itemsCenter justifyCenter>
        {removeNft ? (
          <Div auto rounded10 p3 bgDanger onPress={removeNft} px10 py5>
            <Trash
              strokeWidth={2}
              height={18}
              width={18}
              color={Colors.white}
            />
          </Div>
        ) : (
          selected && (
            <Div auto rounded100 p3 bgSuccess>
              <Check
                strokeWidth={2}
                height={18}
                width={18}
                color={Colors.white}
              />
            </Div>
          )
        )}
      </Col>
    </Row>
  );
}

const NftContentmemo = React.memo(NftContent, (props, nextProps) =>
  props.selected === nextProps.selected ? true : false,
);

function NftProfile({image_uri, onPressNft, enabled}) {
  return (
    <Div onPress={enabled && onPressNft}>
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

const NftProfilememo = React.memo(NftProfile, (props, nextProps) =>
  props.image_uri === nextProps.image_uri ? true : false,
);

const BottomPopupOptions = ({
  bottomPopupRef,
  selectedNft,
  removeSelectedNft,
  nftEnabled,
}) => {
  return (
    <BottomPopup
      ref={bottomPopupRef}
      snapPoints={useMemo(() => ['85%'], [])}
      enableContentPanningGesture={true}
      index={-1}>
      <Col>
        <Row justifyEnd>
          <User
            strokeWidth={4}
            height={20}
            width={20}
            color={Colors.gray[400]}
            style={{marginLeft: 20, marginTop: 2}}
          />
          <Span ml10 bold mr20 fontSize={20} style={{color: Colors.gray[400]}}>
            {selectedNft.length}
          </Span>
        </Row>
        <BottomSheetFlatList
          showsVerticalScrollIndicator={false}
          data={selectedNft}
          keyExtractor={item =>
            `${(item as any)?.contract_address}-${(item as any)?.token_id}`
          }
          ListFooterComponent={<Div h={50} />}
          renderItem={({item}) => {
            return (
              <NftContentmemo
                nft_name={(item as any)?.nft_name}
                nft_image_uri={null}
                name={(item as any)?.name}
                image_uri={(item as any)?.image_uri}
                selected={false}
                onPressNft={null}
                removeNft={
                  nftEnabled(
                    (item as any)?.contract_address,
                    (item as any)?.token_id,
                  ) &&
                  (() =>
                    removeSelectedNft(
                      (item as any)?.contract_address,
                      (item as any)?.token_id,
                    ))
                }
              />
            );
          }}
        />
      </Col>
    </BottomPopup>
  );
};

export default NewChatRoom;
