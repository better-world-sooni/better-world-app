import React from 'react'
import { Span } from 'src/components/common/Span'

export const s_portal_webinar = {
  viewAll: [
    '전체보기',
    'View All'
  ],
  clips: [
    '영상 목록',
    'Clips'
  ],
  currentApply: (count) => [
    <>
      현재 신청 {count}명
    </>,
    <>
      {count} already registered
    </>
  ],
  totalAttendee: (total) => [
    <>
      전체 정원 {total}명
    </>,
    <>
      Up to {total} attendees
    </>,

  ],
  submit_my_sample: [
    <>
      교정이 필요한{'\n'}
      <Span primary>나의 샘플</Span>을{'\n'}
      제출해 주세요
    </>,
    <>
      <Span primary>Submit</Span>{'\n'}
      your written sample{'\n'}
      and receive feedback!
    </>
  ],
  // my_sample_desc: [
  //   <>
  //     <Span block bold mb3>보내주실 자료</Span>
  //     <ul className="text-left">
  //       <li>업무상 교정이 필요한 이메일 전문</li>
  //       <li>전달력 향상이 필요한 영문 프레젠테이션 스크립트</li>
  //       <li>발표 노하우 코칭이 필요한 각종 그래프/데이터 자료</li>
  //       <li>그 외 참여하고 싶은 라이브 웨비나 주제에 대한 질문</li>
  //     </ul>
  //   </>,
  //   <>
  //     <Span block bold mb3>You can send us in:</Span>
  //     <ul className="text-left">
  //       <li>a business email</li>
  //       <li>a presentation or interview script</li>
  //       <li>a draft of admission essay</li>
  //       <li>a data sample for presentation practice</li>
  //     </ul>
  //   </>,
  // ],
  send_to: [
    '보내 주실 곳',
    'Email to:',
  ],
  after_upload: [
    '영상 및 수업 자료 업로드 완료 후 열람 가능합니다.',
    `The class recording/material will be available shortly!`
  ],
  doc: {
    btn: {
      enter: {
        label: [
          '바로입장',
          `JOIN NOW`
        ]
      },
      detail: {
        label: [
          '자세히 보기',
          `More about this class`
        ]
      }
    },
    search: {
      placeholder: [
        '튜터명과 주제등을 검색하세요',
        `Search Classes by entering keywords (of your desried webinar)`
      ],
      label: [
        '검색하기',
        'Search'
      ]
    }
  },
  see_more: [
    '더보기',
    'See more',
  ],
  empty_page: [
    '추가한 웨비나가 없어요, 웨비나를 신청해보세요!',
    `There is no Webinar you've added. Sign up for a Webinar!`,
  ],
  empty_result: [
    '검색 결과가 없습니다.',
    'There is no search result.',
  ],
  header: {
    contribute: [
      '기여하기',
      `Submit a writing sample`,
    ]
  },
  new_normal: [
    '#뉴노멀챌린지',
    `#newnormalchallenge`,
  ],
  subscribe_in_10sec: [
    '10초만에 링글 웨비나 뉴스레터 구독하기',
    `Sign up for Ringle's Webinar newsletter. Only takes 10 seconds!`,
  ],
  subscribe: [
    '구독하기',
    `Subscribe`,
  ],
  register: [
    '신청하러 가기',
    `Register Now`,
  ],
}

export const s_webinar = {
  apply_description: {
    li_1: [
      '내 구글 캘린더에 자동으로 일정이 추가됩니다.',
      `The Webinar schedule will be automatically added to your Google Calendar.`,
    ],
    li_2: [
      '웨비나 당일 시작 10분전 자동 알림 설정됩니다.',
      `An automatic notification will be set 10 minutes before the Webinar starts.`,
    ],
    li_3: [
      '수업 자료와 녹화 영상은 세션 종료 후 7일 이내로 링글 홈페이지에서 확인하실 수 있습니다.',
      `Material and recording will be available on the Ringle Webinar webpage within 7 days of the live webinar completion.`,
    ],
    li_4: [
      '수업 자료는 세션 종료 후 최종 검토를 거쳐 녹화 영상과 함께 링글 홈페이지에 업로드 해드리고 있습니다.',
      `Material will be distributed after its final review and will be available on the Ringle Webinar webpage along with its recording.`,
    ],
    li_5: [
      '세션 종료 후 복습 자료가 필요하신 분들께서는 webinar@ringleplus.com 또는 세션 중 Zoom Chat으로 개별 문의 주시면 수업 자료를 먼저 받아보실 수 있도록 다운로드 링크를 이메일로 보내드립니다.',
      'Please feel free to let us know if you need earlier access to materials to study. Send us your email address along with your request. We can provide a downloadable link shortly after the session’s completion. Ringle staff can be reached either via email at webinar@ringleplus.com or just simply through the Zoom chat during the session.',
    ],
    sign_up_now: [
      '웨비나 라이브에 대한 가이드',
      `Register now!`,
    ],
  },

  apply_float: {
    your_notification_has_been_set: [
      '알림이 정상 신청되었습니다.',
      `Your notification has been set.`,
    ],
    download: [
      '자료 받기',
      `Download Material`
    ],
    headcount: (n) => [
      <>인원: {n}명</>,
      <>Number of participants: {n}</>,
    ],
    register: [
      '신청하기',
      `Register`,
    ],
    completed: [
      '신청완료',
      'Registered',
    ],
    enter: [
      '입장하기',
      'Enter',
    ],
    set_notification: [
      '알림 신청하기',
      `Set notification`,
    ],
    style: [
      '방식',
      `Style`,
    ],
    submit_my_sample: [
      '나의 샘플 제출하기',
      `Submit my sample`,
    ],
    duration: [
      '소요 시간',
      `Duration`,
    ],
    _60_minutes: [
      `60 분`,
      `60 minutes`,
    ],
    session_type: [
      '세션 형태',
      `Session Type`,
    ],
  },
  a_tutor_will_be_added_soon: [
    '튜터가 곧 추가될 예정입니다.',
    `A tutor will be added soon.`,
  ],
  feedback: {
    leave_a_comment: [
      <>맘에 드셨던 점과 개선이 필요한 부분에 대해 남겨주세요!{'\n'}
        다음 웨비나에 소중한 의견을 담아 반영하도록 하겠습니다.</>,
      <>Please leave a comment on what you liked and what can be improved!{'\n'}
        We will try to reflect your comments on our next Webinar.</>,
    ],
    give_feedback: [
      '피드백 작성하기',
      `Give Feedback`,
    ]
  },
  tab_summary: [
    '개요',
    `Overview`,
  ],
  tab_tutor: (name) => [
    `${name}의 다른 영상`,
    `More webinars by ${name}`,
  ],
  introduce_of_out_tutor: [
    'Tutor',
    `Tutor`,
  ],
}
