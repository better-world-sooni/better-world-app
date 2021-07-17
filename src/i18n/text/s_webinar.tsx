import React from 'react'

export const s_webinar = {
  the_webinar_live_hasnt_started_yet: [
    <>아직 웨비나가 시작되지 않았습니다.{'\n'}링글 팀에 문의해주세요.</>,
    <>The webinar live hasn't started yet.</>,
  ],
  view_ringle_webinar_guide: [
    `링글 웨비나 사용 가이드 보기`,
    `View Ringle Webinar Guide`,
  ],
  register: [`신청하기`, `Register`],
  registered: [`신청완료`, `Registered`],
  cancel: [`신청취소`, `Unregister`],
  enter: [`입장하기`, `Enter`],
  n_already_registered: (n) => [`현재 신청 ${n} 명`, `${n} already registered`],
  up_to_n_attendees: (n) => [`전체 정원 ${n} 명`, `Up to ${n} attendees`],
  grammar_in_use: [`Grammar in Use`, `Grammar in Use`],
  ringle_class: [`Ringle Class`, `Ringle Class`],
  business_career: [`Business/Career`, `Business/Career`],
  trend_culture_life_tlc: [
    `Trend/Culture/Life (TLC)`,
    `Trend/Culture/Life (TLC)`,
  ],

  overview: [`개요`, `Overview`],
  clips: [`영상 목록`, `Clips`],
  n_total_length: (n) => [`총 ${n}분`, `${n} total length`],
  meet_your_tutor: [`튜터 소개`, `Meet your tutor`],
  materials: [`자료받기`, `Materials`],

  related_webinars: [`관련 웨비나`, `Related webinars`],

  more_webinars_by: (who) => [
    `${who}의 다른 웨비나`,
    `More webinars by ${who}`,
  ],
  no_pdf: [
    `해당 웨비나는 PDF 파일이 없습니다.`,
    `해당 웨비나는 PDF 파일이 없습니다.`, // TODO
  ],
  add_to_google_calendar: [`구글캘린더추가`, `Add to Google calendar`],
  successfully_registered: [
    `웨비나 라이브가 신청되었습니다.`,
    `Successfully registered`,
  ],
  registration_canceled: [
    `웨비나 라이브 신청이 취소되었습니다.`,
    `Registration canceled`,
  ],
  successfully_added_to_google_calendar: [
    `구글캘린더에 추가되었습니다.`,
    `Successfully added to Google calendar`,
  ],
  event_removed_from_google_calendar: [
    `구글캘린더에서 삭제되었습니다.`,
    `Event removed from Google calendar`,
  ],
  search_webinar: [`웨비나를 검색하세요.`, `Search Webinar`],
  search_results: [`웨비나 검색 결과`, `Search Results`],
  guide: [
    `웨비나 앱 접속 가이드`,
    `Webinar App Access Guide`,
  ],
  detail: [
    `자세히 보기`,
    `View detail`
  ],
  not_enterable: [
    `웨비나 시작 15분 전부터 입장하실 수 있습니다.`,
    `You can enter the webinar live 15 minutes before the webinar live begins.`
  ],
  registration_caceled: [
    `정상 취소 되었습니다.`,
    `Registration canceled`
  ]
};
