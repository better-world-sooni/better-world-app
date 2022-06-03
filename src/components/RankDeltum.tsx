import React from 'react';
import {createdAtText} from 'src/modules/timeUtils';
import {Col} from './common/Col';
import {Row} from './common/Row';
import {Span} from './common/Span';

enum RankDeltumEventType {
  Follow = 'follow',
  Post = 'post',
  Comment = 'comment',
  LikePost = 'like_post',
  LikeComment = 'like_comment',
  Hug = 'hug',
}

export default function RankDeltum({rankDeltum}) {
  const event = rankDeltum.event;
  const point = rankDeltum.point;
  const getNotificationContent = () => {
    if (event == RankDeltumEventType.Comment) {
      return (
        <Span fontSize={14}>게시물에 댓글 {point < 0 ? '삭제' : '받음'}</Span>
      );
    }
    if (event == RankDeltumEventType.Post) {
      return <Span fontSize={14}>게시물 {point < 0 ? '삭제' : '올림'}</Span>;
    }
    if (event == RankDeltumEventType.LikePost) {
      return (
        <Span fontSize={14}>게시물에 좋아요 {point < 0 ? '취소' : '받음'}</Span>
      );
    }
    if (event == RankDeltumEventType.LikeComment) {
      return (
        <Span fontSize={14}>댓글에 좋아요 {point < 0 ? ' 취소' : '받음'}</Span>
      );
    }
    if (event == RankDeltumEventType.Follow) {
      return <Span fontSize={14}>팔로우 {point < 0 ? '취소' : '시작'}</Span>;
    }
    if (event == RankDeltumEventType.Hug) {
      return <Span fontSize={14}>허그 받음</Span>;
    }
  };
  return (
    <Row itemsCenter py15 px15>
      <Col auto>
        <Span bold fontSize={16}>
          {getNotificationContent()}
        </Span>
        <Span gray700 fontSize={12} mt5>
          {createdAtText(rankDeltum.created_at)}
        </Span>
      </Col>
      <Col />
      <Col auto>
        <Span>{point} RP</Span>
      </Col>
    </Row>
  );
}
