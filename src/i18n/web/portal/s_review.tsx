import React from 'react'
import { Span } from 'src/components/common/Span'

export const s_review = {
  lesson_review: [
    '수업 후기',
    'Lesson Reviews'
  ],
  customer_review: [
    '고객 후기',
    'Customer Reviews'
  ],

  so_far_n_reviews_written: (n) => [
    <>
      현재까지
      <Span primary bold>{n}</Span>
      개의 수업 후기가 작성되었습니다.
    </>,
    <>
      So far, we have
      <Span ml2 primary bold>{n}</Span>
      lesson reviews
    </>,
  ],
  view_all: [
    '전체보기',
    'View all'
  ],
  company_using_english: [
    '영어 쓰는 회사',
    'Global companies'
  ],
  presentation_report_paper: [
    '발표/보고/논문',
    'Presentation/Report/Paper'
  ],
  interview_essay: [
    '인터뷰/에세이',
    'Interview/Essay'
  ],
  study_abroad_immigrant: [
    '유학/해외거주',
    'Study Abroad/Immigration'
  ],
  tutors_who_fit_me: [
    '핏이 맞는 튜터',
    'Tutors who fit me'
  ],
  free_schedule: [
    '자유로운 스케쥴',
    'Flexible schedule'
  ],
  overcome_fear: [
    '두려움 극복',
    'Overcome fear'
  ],
  frequency_list: [
    '다음은 자주 사용하시는 50개 단어 입니다.',
    'These are 50 words that you use most frequently.'
  ],
  most_frequency: [
    '자주 사용한 단어 표현 보기',
    'Most frequently used words'
  ],
  filler_word_desc: [
    '필러워드(문장 사이를 채워 주는 영어 추임새, ex)Hmm~, I mean~)',
    'Filler words(apparently meaningless words used to mark a pause or hesitation) ex. Hmm, I mean~'
  ],
  hide_list_of_synonyms: [
    '동의어 리스트 접기',
    'Hide list of synonyms'
  ],
  show_list_of_synonyms: [
    '동의어 리스트 확인',
    'See list of synonyms'
  ],
  filler_word_use: (percent, message) => [
    <>
      필러워드를 사용할 확률은 {(percent) ? (parseInt(percent)) : 0}% 입니다. {message}
    </>,
    <>
      You have {(percent) ? (parseInt(percent)) : 0}% chance of using filler words
    </>,
  ],
  recorded_script: () => [
    <>
      수강생 분들 중, 수업 mp3 와 함께 Full Script 가 함께 제공되면 좋겠다는 의견을 많이 주셨어서, 저희가 Zoom 의 API 를 사용하여 녹취록을 free-beta 로 제공해 드립니다.
      {'\n'}해당 기능은 저희도 Zoom 기능을 무료로 활용하고 있기에, Zoom API 이슈 발생 시 Script 제공이 지연/누락될 수 있음을 미리 안내 드립니다.
      {'\n'}Script 서비스에 대한 수강생 분들의 피드백을 참고하여, 단순 Script 지원을 넘어 다양한 부가 기능 제공이 가능한 Script & review 기능을 만드는 것이 링글 팀의 목표이며,
      일정 수준 이상 고도화 성공 시 해당 기능이 유료화 될 수 있음을 미리 공지 드립니다!
      {'\n'}감사합니다!
      {'\n'}
      {'\n'}주의사항
      {'\n'}- 튜터와 내가 동시에 말할 때, 화자가 잘못 분리되는 경우가 있습니다.
      {'\n'}- 원어민 관점에서 영어 발음이 분석되기에, 일부 스크립트가 정확하지 않을 수 있습니다. 튜터의 스크립트 변환 정도와 비교하여 나의 발음을 체크해보세요.
    </>,
    <>
      As many customers have requested the audio file and full script of their lessons, we're now providing the full
      script for free, using Zoom's API function. Please keep in mind that there may be some delays or problems if any
      issue occurs within the Zoom app.
      {'\n'}Ringle Team aims to create a full Script & Review function that provides various additional services to our
      customers. We welcome any feedback or comment. Please note that this function may become a paid service once it
      reaches certain level of completion.
      {'\n'}Thank you!
      {'\n'}
      {'\n'}Notice
      {'\n'}- When you and your tutor speak at the same time, the program may fail to recognize the speaker.
      {'\n'}- Some parts of the script may not be accurate, as the conversation is processed based on native speaker's
      pronuncation. We recommend you to check on your pronunciation by comparing your part of the script to your
      tutor's.
    </>
  ],
  suggestions: () => [
    <>
      내가 주로 말하는 단어에 대한 원어민 사용 빈도 수, 동의어 및 Filler Word 분석 데이터를 제공합니다. Filler Word는 like, um과 같이 의미 없이 문장에서 사용되는 단어들을
      말합니다.
      {'\n'}주로 사용한 단어의 동의어를 확인하고, 다음 수업에서 활용해보세요.
      {'\n'}Filler Word의 수치(%)는 한 문장을 발화할 때, Filler word를 한번 이상 사용할 확률을 의미합니다. 권장값은 약 30% 내 입니다.
      {'\n'}
    </>,
    <>
      In this part, you can view the analysis of your speech. You can check which vocabularies are most frequently used
      by native speakers, see synonyms, and spot filler words you've used. Filler words refer to words spoken in
      conversation without meaning, in order to signal a pause or hesitation.
      {'\n'}Also, check out synonyms of your most frequently used words, and use them in your next lesson.
      {'\n'}The percentage of filler word shows the probability of you using filler words more than once, for every
      sentence you speak. Appropriate rate for this category is about 30%.
    </>
  ],
  feedback: [
    '튜터가 남긴 나의 영어 실력에 대한 평가 점수, 피드백 및 교정결과를 확인할 수 있습니다. 평가 점수를 바탕으로 IELTS, TOEIC SPEAKING, TOEFL 예상 점수도 확인할 수 있습니다.',
    'You can view your tutor\'s evaluation, feedback, and correction result. You can also get expected scores for standardized English exams, such as IELTS, TOEIC SPEAKING, and TOEFL. '
  ],
  summary_graph: [
    '수업 시간 동안 사용한 단어의 종류, 분당 말하기 속도를 확인할 수 있습니다. 튜터와 비교하여, 원어민 대비 나의 실력이 어느 정도인지 체크해보세요.',
    'You can view types of vocabularies used in your lessons and your speech pace. Compare these information with native speakers\' and find out where you\'re at.'
  ],
  script_you_can_setting_record: [
    '수업 녹음 설정을 하시면, 녹음된 Script 를 확인하실 수 있습니다.',
    'If you choose your settings to record your lessons, you can view your lesson script.'
  ],
  script_you_can_setting_record_9: [
    '9월 9일 20시 수업 이후로 수업 녹음 설정을 하시면, 녹음된 Script 를 확인하실 수 있습니다.',
    'If you choose your settings to record your lessons after 8 PM lesson on September 9, you can view your lesson script.'
  ],
  suggestions_you_can_setting_record: [
    '수업때 녹음 설정을 하시면, 녹음된 Script에 대한 Ringle\'s Suggestion을 확인하실 수 있습니다.',
    'If you choose your settings during your lesson, you can view Ringle\'s suggestions on the recorded script.'
  ],
  suggestions_you_can_setting_record_9: [
    '9월 9일 20시 수업 이후로 수업 녹음 설정을 하시면, 녹음된 Script에 대한 Ringle\'s Suggestion 확인하실 수 있습니다.',
    'If you choose your settings to record your lessons after 8 PM lesson on September 9, you can view Ringle\'s suggestions on the recorded script.'
  ],
  wpm: [
    '1분당 말하는 단어수를 의미하며 학습자의 말하기 속도를 측정합니다.',
    'a measure of words processed in a minute, often used as a measurement of the speed of speaking or reading.'
  ],
  vocabulary_range: [
    '수업 중 학습자가 사용한 단어를 기반으로 현재 학습자가 구사할 수 있는 영어 구사력을 측정합니다.',
    'a measure of words that a speaker knows; typically measures a speaker\'s knowledge of the form of the word and the ability to link that form to a meaning.'
  ],
  recording_but_not_script: [
    <>
      수업 녹음 파일은 현재 이용 가능합니다.{'\n'}
      하지만 Zoom으로 부터 제공 받는 스크립트는 지연되고 있습니다. 양해 부탁드립니다.
    </>,
    <>
      The recording file is currently available.{'\n'}
      However, scripts received from Zoom are being delayed. Please excuse me.
    </>
  ],
  script_being_prepared: [
    <>
      현재 Zoom으로 부터 스크립트 제공을 받고 있습니다.{'\n'}
      스크립트 제공이 지연되는 점 양해부탁드립니다.
    </>,
    <>
      We are currently receiving a script from Zoom.{'\n'}
      Please understand the delay in providing the script.
    </>
  ],
  only_available_allowed_recording: [
    '녹음이 허용된 학습에만 이용할 수 있습니다.',
    'Only available for lessons that allowed recording'
  ],
  feedback_waiver: [
    <>
      해당 수업의 피드백은 아래의 사유 중 하나로 제공되지 않습니다.{'\n'}
      문의사항이 있으시면 홈페이지 내 [문의] 채널로 알려주세요!{'\n'}
      {'\n'}
      - 수강생의 요청{'\n'}
      - 작문 위주로 진행된 수업{'\n'}
      - 인터뷰 형식으로 진행된 수업{'\n'}
    </>,
    <>
      Feedback from this class is not available for one of the following reasons:{'\n'}
      If you have any questions, please let us know through the [Contact] channel on the website!{'\n'}
      {'\n'}
      - Student confirmation - no feedback required{'\n'}
      - Writing-oriented class{'\n'}
      - Interview-oriented class{'\n'}
    </>
  ],
  contact: [
    '문의하기',
    'Contact'
  ],
  alertMessage: [
    '정상적으로 제출되었습니다. 빠르게 확인 후 안내드리겠습니다.',
    'The request has been Submitted successfully. We\'ll check quickly and inform you.',
  ],
  worst: [
    '최악이었어요!',
    'Worst'
  ],
  bad: [
    '그냥 별로였어요',
    'Bad'
  ],
  dissatisfied: [
    '전반적으로 아쉬웠어요',
    'Dissatisfied'
  ],
  fine: [
    '좋았는데, 조금 아쉬웠어요',
    'Fine'
  ],
  great: [
    '좋았어요!',
    'Great'
  ],
  what_did_you_have_problem: [
    '어떤 점이 불만이셨나요?',
    'What did you have problems with?'
  ],
  what_small_improvements: [
    '어떤 점만 개선하면 좋을까요?',
    'What small improvements would you suggest?'
  ],
  what_did_you_like_the_most: [
    '특히 어떤 점이 좋으셨나요?',
    'What did you like the most?'
  ],
  placeholder_1: [
    '수업 이용에 불편을 드려 죄송합니다. 튜터와 진행한 수업에서 겪으셨던 불편 사항을 남겨주세요.',
    'We are sorry you had an unsatisfactory lesson. Please note what you found to be unsatisfactory.',
  ],
  placeholder_2: [
    '기대하셨던 것과는 달리 진행된 수업에서 튜터의 부족했던 부분을 남겨주세요.',
    'Please note how the lesson differed from your expectations and what areas needed improvement.',
  ],
  placeholder_3: [
    '만족도 높은 수업을 제공하지 못해 아쉽습니다. 튜터가 개선할 수 있는 부분을 남겨주세요.',
    'We are sorry that the lesson did not quite meet expectations. Please note areas where the tutor could improve.',
  ],
  placeholder_4: [
    '자세한 수업 후기는 다른 수강생 분들의 수업 선택에 큰 도움이 됩니다.',
    'Leaving feedback on how the lesson went helps students who are selecting lessons in the future.',
  ],
  submit: [
    '제출하기',
    'Submit'
  ],
  shareRingleTeam: [
    '링글팀과 튜터에게만 공유하기',
    'Viewed by the Ringle Team and Tutor only.'
  ],
  ringleTeamComment: [
    '링글팀에게 남길 의견이 있으신가요?',
    'Do you have any feedback for the Ringle Team?'
  ],
  submit_late: [
    '나중에 하기',
    'Skip for now',
  ],
  required_field: [
    '필수로 입력해야하는 항목을 입력해주세요',
    'Please enter the required fields'
  ],
  preparation: [
    '수업 준비도',
    'Preparation'
  ],
  tech_environment: [
    '수업 환경',
    'Teaching Environment'
  ],
  tech_quality: [
    '비디오/마이크 상태',
    'Tech Quality'
  ],
  punctuality: [
    '지각/조기종료',
    'Punctuality'
  ],
  correction_quality: [
    '교정 능력 ',
    'Correction Quality'
  ],
  tailoring: [
    '수업 설정 미반영',
    'Tailoring to Lesson Requests'
  ],
  lesson_direction: [
    '수업 진행 능력',
    'Lesson Direction'
  ],
  attitude: [
    '수업 태도',
    'Attitude and Tone'
  ],
  punctualityRight: [
    '수업시간 엄수',
    'Punctuality'
  ],
  tailoringRight: [
    '수업 설정 숙지',
    'Tailoring to Lesson Requests'
  ],
  writeThisPlace: [
    '소중한 의견을 작성해주세요. 더 나은 서비스를 위해 노력하겠습니다.',
    'Please write your valuable comments. We will strive for better service.',
  ],
  material: [
    '교재',
    'Packets'
  ],
  network: [
    '네트워크',
    'Network',
  ],
  overall: [
    '총평',
    'Overall'
  ],
  doNotWantToMeetAgain: [
    '이 튜터와 다시 만나지 않기',
    'I do not want to meet this tutor again'
  ],
  howWasYourLessonWith: (tutor) => [
    <>
      {tutor}와의 수업은 어떠셨나요?
    </>,
    <>
      How was your lesson with {tutor}?
    </>,
  ],
  leaveTutorComment: [
    '튜터에 대한 평가를 남겨주세요.',
    'Please leave your comment of evaluation for this tutor.'
  ],
  lessonOverall: [
    '전반적인 수업 만족도는 어떠셨나요?',
    'What did you think about the lesson overall?'
  ],
  optional: [
    '선택사항',
    'Optional'
  ]

}


