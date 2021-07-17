import React from 'react'
import { Span } from 'src/components/common/Span'

export const s_lesson_review = {
  title_lesson_review: [
    '1:1 회화 복습',
    '1:1 Lesson Review',
  ],
  lesson: [
    '1:1 수업',
    '1:1 Lesson',
  ],
  script_issue_title: [
    '스크립트 제공 기능 일시 점검 안내',
    'Script Feature Undergoing Maintenance'
  ],
  script_issue_content: [
    <>
      안녕하세요, 링글팀입니다.{'\n'}
      현재 베타 서비스로 제공 중인 복습 스크립트 기능에{'\n'}
      {'\n'}
      일시적인 장애로 스크립트 제공이 어려운 점 안내 드립니다.{'\n'}
      현재 협업사 Zoom과 위 문제를 해결하고자 작업 중에 있습니다.{'\n'}
      {'\n'}
      <Span bold>‘21년 1월 11일</Span> 까지 최대한 다시 기능을 제공할 수 있도록 조치 예정이오니,{'\n'}
      그 전까지 너른 양해를 부탁드립니다.{'\n'}
      {'\n'}
      서비스 이용에 불편을 드려 대단히 죄송합니다.{'\n'}
      보다 안정적인 서비스로 개편할 수 있도록 최선을 다하겠습니다.{'\n'}
      {'\n'}
      감사합니다.{'\n'}
      링글팀 드림
    </>,
    <>
      Hi, This is the Ringle Team—we hope you are well.{'\n'}
      Right now, Ringle’s beta “Script” feature has a temporary technical issue.{'\n'}
      {'\n'}
      We are currently working on resolving this issue. We are going to resume the “Script” feature by 01/11/2021 at the
      latest.{'\n'}
      {'\n'}
      We thank you for your understanding and apologize for any inconvenience this may have caused.{'\n'}
      {'\n'}
      Thank you,{'\n'}
      Ringle Team
    </>
  ],
  review: [
    '복습',
    'Review'
  ],
  review_your_lesson_using_script: [
    '스크립트와 AI 분석 자료로 지난 수업을 복습해보세요.',
    `Review your past lesson using the script and AI analysis. `,
  ],
  after_evaluation_you_can_see_tutors_feedback: [
    '수업평가 완료 후, 복습자료와 피드백을 확인하실 수 있습니다.',
    `After completing an evaluation, you can see the review materials and your tutor's feedback.`,
  ],
  reviewed_yet: [
    '복습을 완료하지 않은 수업',
    'Lessons you haven’t reviewed yet',
  ],
  reviews_lesson: [
    '복습을 완료한 수업',
    'Lessons you have reviewed'
  ],
  rate_lesson: [
    '수업 평가하기',
    'Rate Lesson'
  ],
  to_do_list: [
    '복습 목록',
    'To-Do List'
  ],
  preparing: [
    '준비중',
    'Preparing'
  ],
  noLessons: [
    <>
      “복습” 메뉴에서는 완료한 수업을 확인하고, 복습할 수 있습니다.
    </>,
    <>
      In the “Review” menu, you can check and review completed lessons.
    </>,
  ],
  options: {
    study: {
      title: [
        '예습 내역',
        'My Lesson Prep',
      ],
    },
    record: {
      title: [
        '수업 녹음 ',
        'Lesson Recording',
      ]
    },
    analysis: {
      title: [
        '수업 분석',
        'Lesson Analysis',
      ],
    },
    feedback: {
      title: [
        '튜터 피드백',
        'Tutor’s Feedback',
      ],
    },
    note: {
      title: [
        '수업 노트',
        'Lesson Notes',
      ],
    },
    speakingAnalysis: {
      title: [
        '스피킹 분석 차트',
        'Speaking Analysis Charts'
      ]
    },
    suggestion: {
      title: [
        '스피킹 분석 & 제안',
        'Patterns & Suggestions'
      ],
    }
  },
  completeMp3: [
    '수업 다시 듣기를 완료하셨습니다.',
    'You’ve done listening to lesson recording.'
  ],
  voca_range: [
    '사용 단어 범위',
    'Vocabulary Range'
  ],
  wpm: [
    '말하기 속도',
    'Words per Min'
  ],
  me: [
    '나',
    'Me'
  ],
  tutor: [
    '튜터',
    'Tutor',
  ],
  ringler: [
    '링글러 평균',
    'Avg. Ringler'
  ],
  fillerWord: [
    '필러워드 사용 빈도',
    'Patterns & Suggestions'
  ],
  speaking_pattern: [
    '수업 중 사용한 단어 관련',
    'Speaking Pattern & Suggestions'
  ],
  completeAnalysis: [
    '수업 분석 확인을 완료하셨습니다!',
    'You’ve done checking the lesson analysis.'
  ],
  completeFeedback: [
    '튜터 피드백 확인을 완료하였습니다!',
    'You’ve done checking and evaluating feedback.'
  ],
  completeAnalysisButton: [
    '수업 분석 확인 완료',
    'Done checking lesson analysis'
  ],
  completeFeedbackButton: [
    '튜터 피드백 확인 완료',
    'Done checking and evaluating feedback'
  ],
  preparing_feedback: [
    '튜터가 피드백을 작성하고 있어요! 수업 후, 최대 24시간 정도 소요될 수 있습니다. 조금만 기다려 주시면 감사하겠습니다.',
    'The tutor is currently writing feedback! After class, it may take up to 24 hours to receive feedback. Thank you for your patience.'
  ],
  not_provide_feedback: [
    <>자유교재로 수업을 진행하셨습니다.{'\n'} 자유교재로 진행한 수업은 튜터 피드백 리포트를 제공하지 않습니다.</>,
    <>You had this lesson for Free Speaking.{'\n'} For the lessons on mock interviews or editing a written piece, we do
      not provide the tutor's feedback report.</>
  ],
  you_can_review_after_lesson: [
    <>
      수업을 완료하면{'\n'}
      이곳에서 완료한 수업을 확인하고,{'\n'}
      복습할 수 있어요.
    </>,
    <>
      In the “Review” menu, {'\n'}
      you can check and review completed lessons.
    </>
  ],
  complete_lesson: [
    <>
      모든 수업의 복습을 완료하셨습니다!
    </>,
    'You have reviewed all the lessons.'
  ],
  after_rating_the_lesson: [
    <>
      수업 평가 완료 후에{'\n'}
      복습 하실 수 있습니다.
    </>,
    <>
      You can review a lesson{'\n'}
      after rating the lesson.
    </>
  ],
  btn_enter_review: [
    `복습 입장하기`,
    `Enter Review`
  ],
  btn_my_answer: [
    '나의 답 확인',
    `View my answers`,
  ],
  btn_evaluate_your_lesson: [
    `수업 평가하기`,
    `Evaluate your lesson`,
  ],
  do_you_want_delete_uploaded_file: [
    `한 번 자료를 삭제 하시면 복원이 불가능합니다. 삭제하시겠습니까?`,
    `This action cannot be undone. Are you sure you want to delete this document?`
  ],
  delete_uploaded_file_btn: [
    `내 자료 지우기`,
    `Delete my materials`
  ],
  review_after_your_lesson: [
    '수업을 들으신 후 복습해보세요!',
    `Review after your lesson!`,
  ],
  go_to_register_for_lessons: [
    `수강 신청하러 가기`,
    `Go to schedule lessons`,
  ]
}
