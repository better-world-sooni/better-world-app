import React from 'react';
import {
  ChevronsDown,
  ChevronsUp,
  Edit,
  Heart,
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
  UserCheck,
} from 'react-native-feather';
import {createdAtText} from 'src/modules/timeUtils';
import {Col} from './common/Col';
import {Row} from './common/Row';
import {Span} from './common/Span';

enum RankDeltumEventType {
  Follow = 'follow',
  Post = 'post',
  Comment = 'comment',
  LikePost = 'like_post',
  VotePost = 'vote_post',
  LikeComment = 'like_comment',
  Hug = 'hug',
}

export default function RankDeltum({rankDeltum}) {
  const event = rankDeltum.event;
  const point = rankDeltum.point;
  const actionIconDefaultProps = {
    width: 18,
    height: 18,
    color: 'black',
    strokeWidth: 1.7,
  };
  const getNotificationIcon = () => {
    if (event == RankDeltumEventType.Comment) {
      return <MessageCircle {...actionIconDefaultProps} />;
    }
    if (event == RankDeltumEventType.Post) {
      return <Edit {...actionIconDefaultProps} />;
    }
    if (event == RankDeltumEventType.LikePost) {
      return <Heart {...actionIconDefaultProps} />;
    }
    if (event == RankDeltumEventType.VotePost) {
      return point > 0 ? (
        <ThumbsUp {...actionIconDefaultProps} />
      ) : (
        <ThumbsDown {...actionIconDefaultProps} />
      );
    }
    if (event == RankDeltumEventType.LikeComment) {
      return <Heart {...actionIconDefaultProps} />;
    }
    if (event == RankDeltumEventType.Follow) {
      return <UserCheck {...actionIconDefaultProps} />;
    }
    if (event == RankDeltumEventType.Hug) {
      return <Heart {...actionIconDefaultProps} />;
    }
  };
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
    if (event == RankDeltumEventType.VotePost) {
      return (
        <Span fontSize={14}>
          제안에 {point < 0 ? '동의 받음' : '반대 받음'}
        </Span>
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
      <Col auto mr16>
        {getNotificationIcon()}
      </Col>
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
        {point > 0 ? (
          <ChevronsUp {...actionIconDefaultProps} />
        ) : (
          <ChevronsDown {...actionIconDefaultProps} />
        )}
      </Col>
    </Row>
  );
}
