import React from 'react';
import {useGotoPost} from 'src/hooks/useGoto';
import {getNftName, getNftProfileImage} from 'src/modules/nftUtils';
import {createdAtText} from 'src/modules/timeUtils';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';
import TruncatedText from './TruncatedText';

export default function RepostedPost({repostedPost, enablePress = false}) {
  const gotoRePost = useGotoPost({postId: repostedPost.id});
  const handlePressRepost = () => {
    if (enablePress) gotoRePost();
  };
  return (
    <Div
      mt5
      border={0.5}
      borderGray200
      rounded10
      p15
      onPress={handlePressRepost}>
      <Row itemsCenter>
        <Col auto mr7>
          <Div>
            <Img
              w20
              h20
              rounded100
              uri={getNftProfileImage(repostedPost.nft, 100, 100)}
            />
          </Div>
        </Col>
        <Col auto>
          <Span>
            <Span fontSize={14} bold>
              {getNftName(repostedPost.nft)}
            </Span>{' '}
            {repostedPost.nft.token_id &&
              repostedPost.nft.nft_metadatum.name !=
                getNftName(repostedPost.nft) && (
                <Span fontSize={14} gray700>
                  {' '}
                  {repostedPost.nft.nft_metadatum?.name}
                </Span>
              )}
            <Span fontSize={14} gray700>
              {' · '}
              {createdAtText(repostedPost.updated_at)}
            </Span>
          </Span>
        </Col>
        <Col />
      </Row>
      {repostedPost.content ? (
        <Div mt5>
          <TruncatedText
            spanProps={{fontSize: 14}}
            text={repostedPost.content}
            maxLength={500}
          />
        </Div>
      ) : null}
    </Div>
  );
}
