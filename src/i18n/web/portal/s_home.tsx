import React from 'react'
import {Span} from 'src/components/common/Span'

export const s_home = {
  more_tutor: [
    '튜터 더 알아보기',
    'Learn more about tutor',
  ],
  more_packet: [
    '교재 읽어보기',
    'Read packet'
  ],
  more_webinar: [
    '웨비나 확인하기',
    'Check webinar'
  ],
  hello: (name) => [
    <>
      안녕하세요 {name}님!
    </>,
    <>
      Hello {name}!
    </>
  ],
  schedule: [
    '예약하기',
    'Schedule'
  ],
  trial_card: [
    <>
      지금 바로 <Span info>20분 체험 수업</Span>을 경험하세요
    </>,
    <>
      Experience a 20-min trial lesson right now.
    </>
  ],
  no_coupons: [
    '수업을 예약할 수 있는 수업권이 없습니다.',
    'You have no coupons to schedule lessons.'
  ],
  purchase: [
    '구매하기',
    'Purchase'
  ],
  upcoming: [
    '예정된 수업',
    'Upcoming Lessons'
  ],
  go_prep: [
    '예습하러 가기',
    'Go to prep for lessons'
  ],
  go_schedule: [
    '예약하러 가기',
    'Go to schedule lessons'
  ],
  reviewed_yet: [
    '복습을 완료하지 않은 수업',
    'Lessons you haven’t reviewed yet'
  ],
  go_review: [
    '복습하러 가기',
    'Go to review lessons'
  ],
  available_coupons: [
    '사용 가능한 수업권',
    'Available Lesson Coupons',
  ],
  myCoupons: [
    '내수업권',
    'My Coupons'
  ],
  min: [
    '분',
    'm'
  ],
  liveWebinar: [
    '웨비나 LIVE',
    'Webinar LIVE'
  ],
  viewDetail: [
    '자세히 보기',
    'View detail'
  ],
  tutor: [
    '튜터',
    'Tutors'
  ],
  packets: [
    '교재',
    'Packets'
  ],
  prepared: (rate) => [
    <>
      예습률 {rate}%
    </>,
    <>
      {rate}% Prepared
    </>,
  ],
  stat_empty_title: [
    <>
      본 페이지는 2월에 계획되어 있는{'\n'}
      업데이트를 통해 릴리즈 될 예정입니다.{'\n'}
      {'\n'}
      <Span bold>수업통계</Span> 페이지에서는 고객님이 완료한{'\n'}
      <Span bold>1:1 수업 내역</Span>을 기반으로 유용한 <Span bold>통계</Span>{'\n'}
      <Span bold>데이터</Span>를 확인하실 수 있습니다.
    </>,
    <>
      This page will be released through an update planned in February.{'\n'}
      {'\n'}
      In the Stats page, you will be able to check{'\n'}
      useful statistical data based on the 1:1{'\n'}
      lessons you have completed.
    </>
  ],
  history_empty_title: [
    <>
      본 페이지는 2월에 계획되어 있는{'\n'}
      업데이트를 통해 릴리즈 될 예정입니다.{'\n'}
      {'\n'}
      <Span bold>학습내역</Span> 페이지에서는 고객님이 링글에서{'\n'}
      지금까지 <Span bold>학습한 모든 내역</Span>을 체계적으로 <Span bold>관리 및 복습</Span>{'\n'}
      하실 수 있습니다.
    </>,
    <>
      This page will be released through an update planned in February.{'\n'}
      {'\n'}
      In the Log page, you will be able to manage{'\n'}
      systematically and review all the details you{'\n'}
      have studied in Ringle.
    </>
  ],
  view_more_details: [
    '자세히 보러가기',
    'View More Details'
  ]


}
