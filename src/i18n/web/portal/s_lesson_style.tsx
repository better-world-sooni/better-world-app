import React from 'react'
export const s_lesson_style = {
  you_can_modify_in_prep_page: [
    `수업 시작 전 예습 페이지에서 변경할 수 있습니다. (수업 페이지에서는 변경이 불가능합니다)`,
    `You can modify in the Prep page before the lesson starts. (You cannot modify this setting on the Lesson page.)`,
  ],
  title_settings: [
    '수업 방식 설정',
    'Set Lesson Style',
  ],
  change_title_settings: [
    '수업 방식 변경',
    'Change Style',
  ],
  record: {
    title: [
      '수업 녹음',
      'Lesson Audio-Recording',
    ],
    note: [
      `수업 녹음 MP3파일은 수업 종료 후 파일 제작이 완료되면 “복습" 메뉴에서 확인하실 수 있습니다. `,
      `Your audio file (.MP3) will be available in the “Review” menu after the file is generated post-lesson.`,
    ],
    noteTrial: [
      `수업 후, 복습을 위한 녹음파일과 Beta 서비스로 운영하는 스크립트 자료 제공를 위해 수업 내용은 녹음됩니다.`,
      `We audio-record your lessons and provide you with the recordings for free (currently in beta stage). You can find your audio file (MP3) in the 'Review' section after the lesson.`,
    ],
    yes: [
      `녹음을 원합니다`,
      `Record the Lesson.`,
    ],
    no: [
      '녹음을 원하지 않습니다',
      `Do Not Record.`,
    ],
  },
  intro: {
    title: [
      '자기 소개',
      'Self-Introduction',
    ],
    placeholder: [
      `소개 없이 바로 수업할 경우 미리 튜터가 알 수 있도록 자신을 소개하는 글을 적어주세요.
      E.g. My name is Kildong Hong and I am a business developer at Ringle, a startup providing 1:1 online English education services. `,
      `If you want to start the lesson without a self-introduction, please write a brief self-introduction to share with your tutor in advance.
      E.g. My name is Kildong Hong and I am a business developer at Ringle, a startup providing 1:1 online English education services.`,
    ],
    skip: [
      '소개 없이 바로 시작',
      `Start lesson without self-introduction`,
    ],
    do: [
      '서로 소개 3분 후 시작',
      `Start lesson after 3 mins of self-introduction between me and my tutor`,
    ],
  },
  lesson_mode: {
    title: [
      '수업 모드',
      'Lesson mode',
    ],
    note: [
      '20분 수업은 15분 대화 후 5분 피드백 방식으로 진행합니다.',
      `20-min lessons consist of 15-mins of conversation and 5-mins of feedback.`,
    ],
    note_short: [
      '15분 대화 - 5분 피드백',
      `15m conversation - 5m feedback`,
    ],
    correction: [
      '교정 중심',
      'Correction-Focused',
    ],
    discussion: [
      '토론 중심',
      'Discussion-Focused',
    ],
  },
  mode_detail: {
    title: [
      '수업 설정 내용',
      `Correction mode`,
    ],
    correction: {
      instant: [
        '상시교정(틀린 영어 표현을 할 때마다 교정 받음)',
        `Instant correction mode (Your tutor will correct you right after you make a mistake.)`,
      ],
      instant_short: [
        '상시교정',
        `Instant correction mode`,
      ],
      instant_desc: [
        '틀린 영어 표현을 할 때마다 교정 받음',
        `Your tutor will correct you right after you make a mistake.`,
      ],
      intermittent: [
        '대화 교정모드(각 질문에 대한 대화가 끝난 후 교정 받음)',
        `Intermittent correction mode (Your tutor will correct you after discussion on each question.)`,
      ],
      intermittent_short: [
        '대화 교정모드',
        `Intermittent correction mode`,
      ],
      intermittent_desc: [
        '각 질문에 대한 대화가 끝난 후 교정 받음',
        `Your tutor will correct you after discussion on each question.`,
      ],
    },
    discussion: {
      mode55: [
        '5:5 토론(튜터와 내가 절반씩 이야기를 주고 받음)',
        '5:5 Discussion (Your tutor and you will speak for similar amount of time.)',
      ],
      mode55_desc: [
        '튜터와 내가 절반씩 이야기를 주고 받음',
        'Your tutor and you will speak for similar amount of time.',
      ],
      mode55_short: [
        '5:5 토론',
        '5:5 Discussion',
      ],
      mode82: [
        '8:2 토론(튜터는 듣고 학생이 주로 이야기함)',
        `8:2 Discussion (Your tutor will mostly listen and you will speak more.)`
      ],
      mode82_desc: [
        '튜터는 듣고 학생이 주로 이야기함',
        `Your tutor will mostly listen and you will speak more.`
      ],
      mode82_short: [
        '8:2 토론',
        `8:2 Discussion`
      ],
    },
  },
  intensive_focus: {
    title: (index) => [
      `집중 교정 영역 (다중 선택 가능)`,
      `Focus Correction Areas (Multi-selectable)`,
    ],
    detail: [
      `집중 교정 영역`,
      `Focus Correction Areas`,
    ]
  },
  additional_request: {
    title: (index) => [
      `상세 요청 사항 (다중 선택 가능)`,
      `In-Detail Requests (Multi-selectable)`
    ],
    detail: [
      '상세 요청',
      'Addition requests'
    ],
    placeholder: [
      '추가 요청 사항(자유롭게 입력해주세요.)',
      `Additional Requests(Feel free to enter your additional requests.)`,
    ],
    other_request: [
      '추가 요청',
      'Other request'
    ],
  }
}
