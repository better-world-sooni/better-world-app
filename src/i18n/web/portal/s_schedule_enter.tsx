import React, {Fragment} from 'react'
import {Span} from 'src/components/common/Span'

export const s_schedule_enter = {
  go: [
    '예약하기',
    'Go'
  ],
  purchase: [
    '구매하기',
    'Purchase'
  ],
  used_challenge: (used) => [
    `${used}회 달성`,
    `${used} times achieved`,
  ],
  used: (used) => [
    `${used}회 사용`,
    `${used} times used`,
  ],
  heading_schedule_lesson: [
    '수강 신청',
    'Schedule Lesson',
  ],
  minutes: [
    '분',
    'm',
  ],
  available: [
    '남은 횟수',
    'Available',
  ],
  select: [
    '선택하기',
    'Select',
  ],
  select_registration_method: [
    '신청 방법 선택',
    `Select a registration method`,
  ],

  expired: [
    '수강 기간',
    'Expired'
  ],
  expiredIn: (days) => [
    <>
      {days}일 남음
    </>,
    <>
      in {days} days
    </>,
  ],
  select_time_first: {
    heading: [
      '시간 먼저 선택',
      'Select time first',
    ],
    i_will_choose_a_time_slot_first: [
      '원하는 수업 시간을 먼저 선택하겠습니다',
      'I will select the time slot that I want first',
    ],
  },
  select_tutor_first: {
    heading: [
      '튜터 먼저 선택',
      'Select tutor first',
    ],
    i_will_choose_a_tutor_first: [
      '원하는 튜터를 먼저 선택하겠습니다',
      'I will select the tutor that I want first',
    ],
  },
  bonus_credit_image: [
    'https://d2mkevusy1mb28.cloudfront.net/web/portal/combined-shape-ko.png',
    'https://d2mkevusy1mb28.cloudfront.net/web/portal/combined-shape-en.png',
  ],
  bonus_credit_title: [
    <>
      돌아온 링글러에게{'\n'}
      <Span primary>수업권 1회</Span>가 발급되었습니다.
    </>,
    <>
      Welcome back!{'\n'}
      You've earned <Span primary>one lesson coupon.</Span>
    </>,
  ],
  bonus_credit_btn_title: [
    '수강 신청 하러가기',
    'Schedule Lesson'
  ],
  invite_title: [
    '친구를 초대할수록 커지는 혜택',
    <>The more <Span bold>you</Span> share, the more <Span bold>you</Span> earn!</>,
  ],
  invite_subtitle: [
    '최대 100만 포인트에 도전하세요!',
    'Refer and earn up to 869 USD',
  ],
  btn_invite: [
    '친구 초대하기',
    'Invite friends'
  ],
  my_coupons: [
    '내수업권',
    'My Coupons'
  ],
  no_coupons: [
    '수업을 예약할 수 있는 수업권이 없습니다.',
    'You have no coupons to schedule lessons.'
  ],
  min: [
    '분',
    'm'
  ],
  free: [
    '무료',
    'Free'
  ],

}

export const s_unassigned_lessons = {
  n_left: (n) => [
    <>{n}개</>,
    <>{n} left</>
  ],
  credit_choice: [
    '크레딧 선택',
    "Select coupon"
  ],
  credits: {
    regular_credit: [
      '정규 크레딧',
      "Regular Coupon"
    ],
    makeup_credit: [
      '보충 크레딧',
      "Makeup Coupon"
    ],
    urgent_credit: [
      '긴급편성 크레딧',
      "Within 2-Hour Coupon"
    ],
    no_credits_available: [
      '사용할 수 있는 크레딧이 없습니다.',
      "No coupon available"
    ]
  },
  expires_in_n_days: (n) => [
    <>유효기간: {n}일</>,
    <>Expires in: {n} days</>
  ],
  info: {
    title: [
      '안내',
      'Info'
    ],
    what_is_makeup_lesson: [
      '24시간 이내 수업이란?',
      "What is a makeup lesson?"
    ],
    makeup_lesson_desc: [
      '타 수강생이 취소한, 수업 시작까지 24시간 이내 수업을 의미합니다.',
      'A makeup lesson is a lesson starting in 24 hours which another student has canceled.'
    ],
    label_info: [
      '라벨 설명',
      'Label info'
    ],
    makeup_lesson_info: [
      '보충 크레딧으로 신청 가능한 24시간 이내 수업을 뜻합니다.',
      "A lesson starting in 24 hours available with a makeup coupon"
    ],
    n_minute_lesson: (min) => [
      <>{min}분 수업입니다.</>,
      <>{min} minutes lesson.</>
    ],
    urgent_lesson_info: [
      '긴급편성 크레딧으로 신청 가능한 2시간 이내 수업을 뜻합니다.',
      "A lesson starting in 2 hours that can be purchased with a Within 2-Hour coupon"
    ],
  },
  inform: {
    topic_of_this_lesson_will_be: (topic) => [
      <><Span bold>{topic}</Span> 교재로 진행됩니다.</>,
      <>Topic of this lesson will be <strong>{topic}</strong>.</>,
    ],
    regular_credit: (credit) => [
      <>정규 크레딧으로 수업 신청 시, <Span bold>+{credit} 포인트</Span>가 제공됩니다.</>,
      <>If you use a regular coupon, you will get <Span bold>+{credit} points</Span>.</>
    ],
    available_lessons: [
      '신청 가능한 수업',
      'Available lessons'
    ],
  },
  makeup_lesson: [
    '보충수업',
    'Makeup Lesson',
  ],
  noti: {
    title_notifications: [
      '알림 설정',
      'Notifications'
    ],
    get_noti_all: [
      '보충수업 알림 모두 받기',
      "Get notifications for all makeup lessons"
    ],
    get_noti_of_my_tutors_only: [
      `보충수업 알림 골라 받기 ('나의 튜터'만)`,
      `Get notifications of 'my tutors' only`
    ],
    set_off: [
      '알림 받지 않기',
      `Set notification off`,
    ]
  },
  lesson_in_24_hours: [
    '24시간 이내 수업',
    'Lessons in 24 hours',
  ],

  lesson_in_24_description: [
    '현재부터 24시간 이내 시작하는 수업을 예약합니다. 정규/보충/긴급편성 수업권으로 예약할 수 있습니다.',
    'Schedule a lesson starting within 24 hour using regular/within 24-hour/within 2-hour coupons'
  ],
  register: [
    '신청하기',
    'Schedule',
  ],

  urgent_lesson: [
    '긴급편성',
    "Within 2-Hour Lesson"
  ],
  credit_to_use: [
    '사용 크레딧',
    "Coupon to use"
  ],
  tutor: [
    '튜터',
    'Tutor'
  ],
  confirm: {
    title_register_for_lessons: [
      '수업 신청',
      'Send request to schedule',
    ],
    registration_has_been_successful: [
      '수업이 신청되었습니다.',
      'Your request has been submitted'
    ],
    has_failed: [
      '수업 신청에 실패하였습니다.',
      `Your reservation has failed.`,
    ],
    no_available_credit: [
      '사용 가능한 크레딧이 없습니다.',
      `I'm sorry. Your request didn't go through. Please try again. `
    ],
    ok: [
      '확인',
      'Ok',
    ],
  },
  warning: {
    check_if_you_agree: [
      '유의 사항에 동의 후 확인 버튼을 눌러주세요.',
      'Check if you agree.'
    ],
    not_restore_if_you_cancel: [
      '해당 수업은 학생이 수업 취소/노쇼 시 크레딧 복구가 불가합니다.',
      "Your coupon is not restored if you cancel or don't show up"
    ],
    cannot_change_tutor_or_time: [
      '해당 수업은 튜터 변경 및 시간 변경이 불가합니다.',
      `You can't change tutor or time for this lesson.`,
    ],
    auto_matching_after_tutor_canceled: [
      '해당 수업의 튜터는 상황에 따라 변경될 수 있습니다.',
      `The tutor for the lesson is subject to change depending on the situation.`,
    ],
    use_a_regular_credit: (credit) => [
      <>해당 수업은 정규 크레딧으로 신청됩니다. (+{credit} 포인트가 추가됩니다.)</>,
      <>This lesson will use a regular coupon. +{credit} points will be added.</>
    ]
  }
}

export const s_challenge_book = {
  btn_start_challenge_book: [
    '챌린지북 시작하기',
    'Start Challenge Book',
  ],
  status_not_yet_started: [
    '아직 시작하지 않음',
    'Not started yet',
  ],
  challenge_period: (duration) => [
    `도전 기간: ${duration}`,
    `Challenge period: ${duration}`,
  ],
  do_you_want_to_start_the_challenge_book: [
    '챌린지북을 시작하시겠습니까?',
    'Do you want to start the challenge book?',
  ],
  receive: [
    '크레딧 받기',
    "Receive coupons"
  ],
  apply_past_lessons: [
    '소급 적용 받기',
    `Apply past lessons to challenge`,
  ],
  youve_completed_n_classes: (n) => [
    <>현재 <Span primary>{n}회</Span> 달성</>,
    <Fragment>So far, you've completed <Span primary>{n}</Span> classes</Fragment>,
  ],
  you_will_receive_n_credits: (goal, bonus) => [
    <>{goal}회 수업을 수강 완료하면 크레딧 {bonus}개가 발급됩니다.</>,
    <>If you complete {goal} lessons, you will receive {bonus} Coupons.</>,
  ],
  directions: [
    <Fragment>
      <div className="text-bold">유의 사항</div>
      - 도전기간은 ‘챌린지북 시작하기’를 눌러야 시작됩니다.{'\n'}
      - 보충 수업, 도전 달성 보너스 수업을 수강한 경우에도 스탬프가 발급됩니다.{'\n'}
      - 취소 수업, 노쇼 수업은 카운트 되지 않습니다.{'\n'}
      - 달성하여 얻은 크레딧의 유효기간은 365일 입니다.{'\n'}
      - 도전기간은 연장이 불가합니다.
  </Fragment>,
    <Fragment>
      <div className="text-bold">Directions</div>
      - The challenge will start when you click on "Start Challenge Book" button..{'\n'}
      - You will receive stamps if you complete makeup lessons or bonus lessons. .{'\n'}
      - Cancelled lessons or no-show lessons will not count.{'\n'}
      - Coupons you receive for completing the challenge will be valid for 365 days.{'\n'}
      - You cannot extend the period of challenge.
  </Fragment>,
  ],
}
