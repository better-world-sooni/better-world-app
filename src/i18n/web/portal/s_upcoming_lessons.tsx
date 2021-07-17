import React from 'react'
import { Span } from 'src/components/common/Span'

export const s_upcoming_lessons = {
  title: [
    `1:1 회화 예습`,
    `Prep for Conversation Lesson`,
  ],

  description_for_first_user: [
    `수업 전 화상 테스트 진행 및 메뉴얼을 읽어보세요!`,
    `Test the Zoom app and read manual before your lesson!`,
  ],
  description: [
    <>
      수업 전, 선택하신 교재를 예습해보세요.{'\n'}
      상세한 수업설정을 해주시면 맞춤수업의 효과를 낼 수 있습니다.
    </>,
    `Prep for your lesson and optimize your settings for the best learning outcomes.`,
  ],
  to_do_list: [
    '예습 목록',
    'To-Do List'
  ],
  not_confirmed: [
    '확정 대기중',
    'Not Confirmed',
  ],
  confirmed: [
    '확정',
    'Confirmed',
  ],
  compatible_tutor: [
    '고객님께 적합한 튜터를 매칭 중입니다.',
    'We are assigning the compatible tutor for you.'
  ],
  option_not_change: [
    '튜터가 확정되어 옵션 변경이 불가능합니다.',
    'Option cannot be changed since the lesson has a tutor assigned with confirmation.'
  ],
  option_not_change_auto: [
    '자동매칭은 옵션 변경이 불가능합니다.',
    'Option cannot be changed with auto-matching'
  ],
  matching_after: {
    other_time: [
      '이 튜터의 다른 수업 일정을 알려주세요',
      'Show me other times this tutor is available'
    ],
    auto: [
      '이 수업을 자동매칭된 다른 튜터와 할께요',
      'Auto-match me with a tutor for this lesson'
    ],
    credit: [
      '수업을 취소하고 수업권을 복구해주세요',
      'Cancel this lesson and refund my coupon.'
    ],
  },

  options: {
    option: {
      title: [
        '튜터 매칭 옵션 변경',
        'Change Option for Tutor Matching',
      ],
      description: [
        '선택한 튜터와 수업이 이뤄지지 않을 때 처리 방법을 설정합니다.',
        'Set what to do when the lesson with the selected tutor is unavailable',
      ],
    },
    time: {
      title: [
        '수업시간 변경',
        'Change Time',
      ],
      description: [
        '수업이 확정되기 전까지만 가능합니다.',
        'Lesson time can only be changed before the lesson is confirmed',
      ],
    },
    course: {
      title: [
        '교재 변경',
        'Change Packet',
      ],
      description: [
        '수업 시작 24시간 전까지만 가능합니다.',
        'Packets cannot be changed in the 24 hours before the lesson starts.',
      ],
    },
    setting: {
      title: [
        '수업 방식 설정',
        'Set Lesson Style',
      ],
      check_title: [
        '수업 방식 확인',
        'Review Lesson Style Settings'
      ],
      description: [
        '수업녹음, 수업모드 등에 대해 설정할 수 있습니다.',
        'Set lesson audio-recording, lesson mode, and other preferences',
      ],
    },
    cancel: {
      title: [
        '수업 취소',
        'Cancel Lesson',
      ],
      description: [
        '수업 시작 24시간 이내 취소하면 수업권이 복구되지 않습니다.',
        'Lessons are non-refundable if cancelled less than 24 hours before the start.',
      ],
    }
  },
  banner_zoom: {
    wait_have_you_tested: [
      '잠깐! 수업 전 테스트하셨나요?',
      `Wait! Have you tested before your lesson?`
    ],
    test_for_video_call: [
      '화상 앱 테스트',
      `Test for video call`,
    ],
    have_you_installed: [
      '잠깐! 화상 앱 설치하셨나요?',
      `Wait! Have you installed the video call app? `
    ],
    install_app: [
      '화상 앱 설치하기',
      `Install app`,
    ],
  },
  banner_manual: {
    before_lesson: [
      '체험수업 전 ',
      'Before Free Trial Lesson ',
    ],
    must_read: [
      '필독',
      'Must Read',
    ],
    ringle_guide: [
      '링글 체험수업 가이드',
      `Ringle Guide`,
    ],
  },
  mulcam_banner_manual: {
    before_lesson: [
      '1:1 화상수업 전 ',
      'Before Lesson ',
    ],
    ringle_guide: [
      '필수 진행 가이드',
      `Ringle Guide`,
    ],
  },
  btn_change_options: [
    `수업 취소 후 옵션 변경`,
    `Cancel lesson and change options`
  ],
  disabled_change_options: [
    '튜터가 확정되어 옵션 변경이 불가능합니다',
    `Your tutor has already confirmed. The option cannot be changed`,
  ],
  no_schedule_ahead: [
    `현재 예정되어 있는 수업이 없습니다.`,
    `No lessons are scheduled.`
  ],
  go_to_registration_page: [
    `수업 예약하러 가기`,
    `Schedule Lesson`,
  ],
  download_btn: [
    `교재 다운로드`,
    `Download`
  ],
  modify_btn: [
    `수업변경 / 취소`,
    `Change/Cancel`
  ],
  prep_btn: [
    `예습 하기`,
    `Prep`
  ],
  lesson_enter_modal_title: [
    '수업 입장',
    'Enter Lesson'
  ],
  self_selection: [
    '지정매칭',
    `Self-selection`,
  ],
  lesson_style_btn: [
    `수업 방식 설정`,
    `Set Lesson Style`
  ],
  change_style_btn: [
    `수업 방식 변경`,
    `Set Lesson Style`
  ],
  enter_btn: [
    `수업 입장`,
    `Enter Lesson`
  ],
  upload_btn: [
    `자료 제출`,
    `Submit File`
  ],
  participate: [
    `참여하기`,
    `Participate`
  ],
  mobile_lesson_enter_alert: [
    '모바일 웹 환경에서는 수업 환경이 지원되지 않습니다. 원활한 링글 수업 진행을 위해, 링글 앱 사용을 권장드립니다. 그래도 계속하시겠습니까?',
    'Mobile web does not properly support all the technologies required for the class. It is recommended to use Ringle app to have a better experience. Would you like to continue with the mobile web?',
  ],
  zoom_modal: {
    title: [
      '수업 전 프로그램 설치 확인',
      `Check for installation before your lesson`,
    ],
    wait: [
      '잠시만요!',
      `Wait!`,
    ],
    have_you_installed_zoom: [
      '수업에 꼭 필요한 Zoom 프로그램 설치하셨나요?',
      `Have you installed Zoom, which is necessary for your lesson?`,
    ],
    i_have_installed_zoom: [
      '이미 설치했습니다.',
      `I have installed Zoom.`,
    ],
    go_to_installation_page: [
      '설치 페이지 바로가기',
      `Go to installation page`,
    ]
  },
  after_tutor_cancel: {
    plz_select_one_of_options: [
      `튜터가 개인적 사정으로 수업이 불가할 경우, 아래 선택사항중 원하시는 처리 방법을 선택해주세요.`,
      `Please select one of the options available in case of cancellation by your tutor.`
    ],
    automatic_match_me: [
      `자동으로 매칭해주세요`,
      `Auto-match me with another tutor.`
    ],
    plz_let_me_know_available_times: [
      `해당 튜터의 가능 시간을 알려주세요`,
      `Please let me know available times of this tutor.`,
    ],
    cancel_and_restore_credit: [
      `취소 후 크레딧을 복구해주세요`,
      `Cancel and restore my coupon.`
    ],
    your_option_change_has_been_completed: [
      '변경한 내용이 저장되었습니다.',
      `Successfully Saved`,
    ]
  },
  matching_after_options: {
    view_tutors_schedule: [
      `튜터의 다른 시간 보기`,
      `View tutor's schedule`,
    ],
    change_to_automatic_matching: [
      `자동매칭으로 변경`,
      `Change to automatic matching`
    ],
    cancel_leeson: [
      `수업 취소하기`,
      `Cancel lesson`
    ],
  },
  notice: {
    title: [
      '[화상프로그램 (Zoom) 오디오 연결 가이드]',
      '[Zoom Audio Connection Guide]'
    ],
    content: [
      <>
        수업이 시작되고 오디오 연결이 원활하지 않을 경우,{'\n'}
        꼭 아래 이미지 위치에 있는 <Span bold>오디오 연결</Span> 버튼을 클릭해 주세요.
      </>,
      <>
        If you or the student can’t hear one another on the Zoom meeting,{'\n'}
        Please click on the <Span bold>"Join Audio"</Span> button as indicated on the image below.
      </>,
    ],
    footer: [
      <>
        문제가 해결되지 않을 경우,{'\n'}
        오른쪽 상단에 위치한 <Span bold>[실시간 Help]</Span> 버튼을 클릭하여 링글팀에 도움을 요청하세요.
      </>,
      <>
        If the problem persists,
        Click on the <Span bold>[Help button]</Span> on the upper-right corner for assistance from the Ringle team.
      </>
    ]
  }
}
