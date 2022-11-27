import React from 'react';
import {useGotoDrawEvent, useGotoPost} from 'src/hooks/useGoto';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {
  getNftCollectionProfileImage,
  getNftName,
  getNftProfileImage,
} from 'src/utils/nftUtils';
import {createdAtText} from 'src/utils/timeUtils';
import {Col} from './Col';
import {Div} from './Div';
import {DrawEventMemo} from './DrawEvent';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';
import TruncatedText from './TruncatedText';

export default function RepostedDrawEvent({
  repostedDrawEvent,
  enablePress = false,
  itemWidth = null,
}) {
  const gotoDrawEvent = useGotoDrawEvent({
    drawEventId: repostedDrawEvent.id,
    image_uri: repostedDrawEvent?.image_uri
      ? repostedDrawEvent.image_uri
      : repostedDrawEvent?.image_uris &&
        repostedDrawEvent.image_uris.length != 0
      ? repostedDrawEvent.image_uris[0]
      : null,
    hasApplication: repostedDrawEvent?.has_application,
  });
  const handlePressRepost = () => {
    if (enablePress) gotoDrawEvent();
  };
  const contentWidth = itemWidth
    ? itemWidth - 12 * 2
    : DEVICE_WIDTH - (15 + 13 * 4 + 12 * 4);
  const isEvent = repostedDrawEvent?.has_application == true;
  const mx = contentWidth / 8;
  return (
    <Div
      mt5
      border={0.5}
      borderGray200
      rounded10
      p12
      onPress={enablePress && handlePressRepost}>
      <Row pb10 itemsCenter>
        <Row itemsCenter>
          <Col auto pr5>
            <Img
              uri={getNftCollectionProfileImage(
                repostedDrawEvent.nft_collection,
                100,
                100,
              )}
              h20
              w20
              rounded10
            />
          </Col>
          <Div>
            <Span bold fontSize={12} numberOfLines={1} mr10>
              {repostedDrawEvent.nft_collection?.name}
            </Span>
          </Div>
        </Row>
        <Div>
          <Span fontSize={10} numberOfLines={1} gray500>
            {createdAtText(repostedDrawEvent?.created_at)}
          </Span>
        </Div>
      </Row>
      <DrawEventMemo
        drawEvent={repostedDrawEvent}
        width={isEvent ? contentWidth - 2 * mx : contentWidth}
        mx={isEvent ? mx : 0}
        my={0}
        summary={isEvent}
        repost={true}
      />
    </Div>
  );
}
