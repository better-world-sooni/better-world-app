import React, {useEffect, useState} from 'react';
import {Heart, MoreHorizontal} from 'react-native-feather';
import Colors from 'src/constants/Colors';
import useLike from 'src/hooks/useLike';
import {getNftName, getNftProfileImage} from 'src/modules/nftUtils';
import {createdAtText} from 'src/modules/timeUtils';
import {Col} from './Col';
import {Div} from './Div';
import ImageSlideShow from './ImageSlideShow';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';
import TruncatedMarkdown from './TruncatedMarkdown';
import TruncatedText from './TruncatedText';

export default function Post({post}) {
  const [liked, likesCount, setLiked] = useLike(
    post.is_liked,
    post.likes_count,
  );
  const [cachedComments, setCachedComments] = useState(post.comments || []);

  const heartProps = liked
    ? {
        fill: Colors.danger.DEFAULT,
        width: 20,
        height: 20,
        color: Colors.danger.DEFAULT,
        stokeWidth: 1.5,
      }
    : {width: 20, height: 20, color: 'black', stokeWidth: 1.5};
  return (
    <Div py5 borderBottom={0.5} borderGray200>
      <Row px15 itemsCenter py8>
        <Col auto mr5>
          <Img w40 h40 rounded10 uri={getNftProfileImage(post.nft, 100, 100)} />
        </Col>
        <Col auto>
          <Span medium fontSize={13}>
            {getNftName(post.nft)}
          </Span>
          <Span fontSize={12} mt2>
            {createdAtText(post.updated_at)}
          </Span>
        </Col>
        <Col />
        <Col auto>
          <MoreHorizontal color={'black'} width={20} height={20} />
        </Col>
      </Row>
      {post.image_uris.length > 0 ? (
        <ImageSlideShow imageUris={post.image_uris} />
      ) : null}
      {post.title ? (
        <Div px15 py8>
          <TruncatedText
            text={post.title}
            maxLength={50}
            spanProps={{bold: true, fontSize: 14}}
          />
        </Div>
      ) : null}
      {post.content ? (
        <Div px15 py8>
          <TruncatedMarkdown text={post.content} maxLength={300} />
        </Div>
      ) : null}
      <Row px15 itemsCenter py8>
        <Col auto mr5>
          {<Heart {...heartProps}></Heart>}
        </Col>
        <Col auto mr10>
          <Span fontSize={11}>{likesCount} likes</Span>
        </Col>
        {cachedComments.length > 0 ? (
          <Col auto>
            <CommentNftExamples comments={cachedComments} />
          </Col>
        ) : null}
        <Col auto mr10>
          <Span fontSize={11}>{cachedComments.length} Replies</Span>
        </Col>
        <Col />
      </Row>
    </Div>
  );
}

function CommentNftExamples({comments}) {
  return (
    <Div w={(comments.slice(0, 3).length - 1) * 15 + 22} relative h22 mr5>
      {comments.slice(0, 3).map((comment, index) => {
        return (
          <Img
            key={comment.id}
            uri={comment.nft.nft_metadatum.image_uri}
            rounded100
            h22
            w22
            absolute
            top0
            left={index * 15}
            border={1.5}
            borderWhite></Img>
        );
      })}
    </Div>
  );
}
