import {BlurView} from '@react-native-community/blur';
import {CustomBlurView} from 'src/components/common/CustomBlurView';
import {MenuView} from '@react-native-menu/menu';
import React, {useState} from 'react';
import {ActivityIndicator, Linking, Platform} from 'react-native';
import {MoreHorizontal, Repeat} from 'react-native-feather';
import {shallowEqual, useSelector} from 'react-redux';
import {Colors} from 'src/modules/styles';
import useAttendance, {AttendanceCategory} from 'src/hooks/useAttendance';
import {
  useGotoAttendanceList,
  useGotoCollectionEvent,
  useGotoCollectionFeedTagSelect,
  useGotoNewPost,
} from 'src/hooks/useGoto';
import apis from 'src/modules/apis';
import {kmoment} from 'src/utils/timeUtils';
import {getAdjustedHeightFromDimensions} from 'src/utils/imageUtils';
import {getNftProfileImage} from 'src/utils/nftUtils';
import {useDeletePromiseFnWithToken} from 'src/redux/asyncReducer';
import {RootState} from 'src/redux/rootReducer';
import {PostOwnerType, PostType} from 'src/screens/NewPostScreen';
import {Col} from './Col';
import {Div} from './Div';
import ImageSlideShow from './ImageSlideShow';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';
import TruncatedText from './TruncatedText';

enum CollectionEventActionTypes {
  Delete = 'Delete',
  AdminShare = 'AdminShare',
  Tag = 'Tag',
}

export default function CollectionEvent({
  collectionEvent,
  itemWidth,
  full = false,
  reposted = false,
}) {
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const isAdmin =
    collectionEvent.contract_address == currentNft.contract_address;
  const deletePromiseFnWithToken = useDeletePromiseFnWithToken();
  const gotoNewCollectionFeedTagSelect = useGotoCollectionFeedTagSelect();
  const gotoNewPostAsAdmin = useGotoNewPost({
    postOwnerType: PostOwnerType.NftCollection,
  });
  const menuOptions = [
    {
      id: CollectionEventActionTypes.Delete,
      title: '이벤트 삭제',
      image: Platform.select({
        ios: 'trash',
        android: 'ic_menu_delete',
      }),
    },
    {
      id: CollectionEventActionTypes.Tag,
      title: '통과된 제안에 참조',
      image: Platform.select({
        ios: 'tag',
        android: 'ic_input_get',
      }),
    },
    {
      id: CollectionEventActionTypes.AdminShare,
      title: '커뮤니티 계정으로 리포스트',
      image: Platform.select({
        ios: 'square.and.arrow.up',
        android: 'ic_menu_set_as',
      }),
    },
  ];
  const deleteCollectionEvent = async () => {
    setLoading(true);
    const {data} = await deletePromiseFnWithToken({
      url: apis.collectionEvent.collectionEventId(collectionEvent.id).url,
    });
    setLoading(false);
    if (data.success) {
      setDeleted(true);
    }
  };
  const handlePressMenu = ({nativeEvent: {event}}) => {
    if (event == CollectionEventActionTypes.Delete) deleteCollectionEvent();
    if (event == CollectionEventActionTypes.AdminShare)
      gotoNewPostAsAdmin(null, collectionEvent, null, PostType.Default);
    if (event == CollectionEventActionTypes.Tag)
      gotoNewCollectionFeedTagSelect(collectionEvent.id, 'collection_event_id');
  };
  const {
    willAttendCount,
    maybeAttendCount,
    willAttend,
    maybeAttend,
    handlePressWillAttend,
    handlePressMaybeAttend,
  } = useAttendance({
    initialAttendance: collectionEvent.attendance_category,
    initialWillAttendCount: collectionEvent.will_attend_count,
    initialMaybeAttendCount: collectionEvent.maybe_attend_count,
    collectionEventId: collectionEvent.id,
  });
  const gotoAttendanceList = useGotoAttendanceList({
    collectionEventId: collectionEvent.id,
  });
  const gotoCollectionEvent = useGotoCollectionEvent({
    collectionEvent,
  });
  const gotoNewPost = useGotoNewPost({
    postOwnerType: PostOwnerType.Nft,
  });
  const handlePressCollectionEvent = () => {
    if (full) return;
    gotoCollectionEvent(reposted);
  };
  const handlePressLocationLink = () => {
    Linking.openURL(collectionEvent.location_link);
  };
  const attendable =
    !collectionEvent.holder_only ||
    collectionEvent.contract_address == currentNft.contract_address;

  if (deleted) return null;
  return (
    <>
      <Div
        mt16={!reposted || full}
        mx15={!reposted}
        overflowHidden
        rounded10
        border={0.5}
        borderGray200>
        <Div relative>
          <ImageSlideShow
            roundedTopOnly
            enablePagination={false}
            imageUris={collectionEvent.image_uris}
            sliderHeight={
              collectionEvent.image_width && collectionEvent.image_height
                ? getAdjustedHeightFromDimensions({
                    width: collectionEvent.image_width,
                    height: collectionEvent.image_height,
                    frameWidth: itemWidth,
                  })
                : itemWidth * 0.7
            }
            sliderWidth={itemWidth}
          />
          {isAdmin && !reposted && (
            <Div m8 p8 bgBlack rounded100 absolute top0 right0>
              <MenuView onPressAction={handlePressMenu} actions={menuOptions}>
                {loading ? (
                  <ActivityIndicator />
                ) : (
                  <MoreHorizontal
                    strokeWidth={2}
                    color={Colors.white}
                    height={16}
                    width={16}
                  />
                )}
              </MenuView>
            </Div>
          )}
          <Row
            bottom0
            absolute
            w={'100%'}
            onPress={handlePressCollectionEvent}
            itemsEnd>
            <Div
              bottom0
              absolute
              w={'100%'}
              h={reposted ? 78 : 70}
              bgWhite
              itemsEnd></Div>
            <Col auto ml15 mb8={reposted}>
              <Img
                border3
                borderWhite
                rounded100
                h100
                w100
                uri={getNftProfileImage(collectionEvent.nft_collection)}></Img>
            </Col>
            <Col relative ml8 mr15 mb={reposted ? 16 : 8}>
              <Div>
                <Div zIndex={100}>
                  <Span
                    fontSize={16}
                    bold
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {collectionEvent.title}
                  </Span>
                </Div>
                <Div mt4 zIndex={100}>
                  <Span
                    fontSize={12}
                    bold
                    gray700
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {collectionEvent.location_string}
                  </Span>
                </Div>
                <Div mt4>
                  <Span numberOfLines={1} ellipsizeMode="tail" gray700>
                    <Span bold fontSize={reposted ? 10 : 12}>
                      {kmoment(collectionEvent.start_time).format(
                        'YY.M.D a h:mm',
                      )}
                    </Span>{' '}
                    <Span bold fontSize={reposted ? 10 : 12}>
                      ~
                    </Span>{' '}
                    <Span bold fontSize={reposted ? 10 : 12}>
                      {kmoment(collectionEvent.end_time).format(
                        'YY.M.D a h:mm',
                      )}
                    </Span>
                  </Span>
                </Div>
              </Div>
            </Col>
          </Row>
        </Div>
        {!reposted && (
          <Div px15 py8 bgWhite>
            {collectionEvent.location_link ? (
              <Row itemsCenter mb8>
                <Span fontSize={14} info onPress={handlePressLocationLink}>
                  {collectionEvent.location_link}
                </Span>
              </Row>
            ) : null}
            <Row mb8>
              {full ? (
                <Span fontSize={14}>{collectionEvent.description}</Span>
              ) : (
                <TruncatedText
                  text={collectionEvent.description}
                  onPressTruncated={gotoCollectionEvent}
                  maxLength={300}
                  spanProps={{fontSize: 14}}
                />
              )}
            </Row>
            <Row>
              <Span fontSize={14}>
                {collectionEvent.holder_only
                  ? '홀더에게 오픈'
                  : '모두에게 오픈'}
              </Span>
            </Row>
            <Row mt8 itemsCenter>
              <Col
                auto
                py8
                mr16
                onPress={() => gotoNewPost(null, collectionEvent)}>
                <Repeat
                  strokeWidth={2}
                  color={Colors.gray[700]}
                  height={18}
                  width={18}
                />
              </Col>
              <Col
                auto
                mr16
                py8
                onPress={() => gotoAttendanceList(AttendanceCategory.Maybe)}>
                <Span fontSize={12} gray700>
                  Maybe{' '}
                  <Span black bold>
                    {maybeAttendCount}
                  </Span>
                </Span>
              </Col>
              <Col
                auto
                py8
                onPress={() => gotoAttendanceList(AttendanceCategory.Yes)}>
                <Span fontSize={12} gray700>
                  Yes{' '}
                  <Span black bold>
                    {willAttendCount}
                  </Span>
                </Span>
              </Col>
              <Col />
              {attendable && (
                <>
                  <Col
                    bgBlack={!maybeAttend}
                    p8
                    rounded100
                    border1={maybeAttend}
                    borderGray400={maybeAttend}
                    itemsCenter
                    onPress={handlePressMaybeAttend}
                    mr8>
                    <Span bold white={!maybeAttend} fontSize={12}>
                      Maybe
                    </Span>
                  </Col>
                  <Col
                    bgBlack={!willAttend}
                    p8
                    rounded100
                    border1={willAttend}
                    borderGray400={willAttend}
                    onPress={handlePressWillAttend}
                    itemsCenter>
                    <Span bold white={!willAttend} fontSize={12}>
                      Yes
                    </Span>
                  </Col>
                </>
              )}
            </Row>
          </Div>
        )}
      </Div>
    </>
  );
}
