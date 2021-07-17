import React from 'react'
export const s_portal_schedule = {
  exit: [
    '나가기',
    'Exit',
  ],
  valid_n_days: (expiredDays) => [
    `유효기간 ${expiredDays}일`,
    `${expiredDays} days until your coupon expires`,
  ],
  valid_from_to_days: (from, to) => [
    `유효기간 ${from} ~ ${to}일`,
    `Valid from ${from} to ${to}`,
  ],
  unused_credits: [
    '미사용 크레딧',
    `Unused coupons`,
  ],
  please_click_button_to_select_material: [
    '다음을 눌러 교재를 선택하세요',
    `Please click the following button to select your lesson material`,
  ],
  please_select_more_than_one_lesson: [
    '1개 이상 수업을 신청하세요',
    `Please select more than one lesson.`,
  ],
  select_credit: [
    '크레딧 선택',
    `Select coupons`,
  ],
  please_select_the_time_and_tutors: [
    '시간과 튜터를 선택해 주세요.',
    `Please select the lesson time and tutors.`,
  ],
  your_selection_will_be_cancelled: [
    '현재까지 신청한 내용이 취소됩니다.',
    'Your selection will be cancelled',
  ],
  automatic_matching_for_tutor: [
    `튜터 자동 매칭`,
    `Match my tutor automatically`,
  ],
  select_time_within_expiration: [
    `수강기간 이내의 시간을 선택해주세요.`,
    `Select a lesson time within the lesson term(validity period of your coupon).`,
  ],
  ringle_automatic_matching: [
    `링글 자동 매칭`,
    `Ringle automatic matching`,
  ],
  ringle_will_match_appropriate_tutor : [
    `링글이 고객님에게 적합한 튜터를 자동으로 매칭해 드립니다.`,
    `Ringle will match the most appropriate tutor for you with its automatic system.`,
  ],
  recommend: [
    '추천',
    'Recommend',
  ],
  server_error: (code) => [
    `서버 에러입니다 [${code}].`,
    `Server Error [${code}].`,
  ],
  register_for_lesson: [
    '수강 신청',
    `Schedule Lessons`,
  ],
  plz_assign_another_tutor_to_me: [
    '다른 튜터로 배정해 주세요',
    `Please assign another tutor to me`
  ],
  let_me_know_other_available_times: [
    '튜터의 다른 시간을 알려주세요',
    `Let me know other available times of the tutor`,
  ],
  plz_refund_my_credits: [
    '크레딧을 복구해 주세요',
    `Please refund my coupon`,
  ],
  choose_something_if_the_tutor_cancele_the_lesson: (selected) => [
    <>튜터가 수업을 취소할 경우 {selected}를 선택하셨습니다.</>,
    <>You have chosen {selected} if the tutor cancels the lesson.</>,
  ],
  you_can_change_in_prep_page: [
    '예습/수업 페이지에서 수정 가능합니다. (튜터 수업 수락 전까지 변경 가능)',
    'You can change it in the Prep/Lesson page (until the tutor accepts the scheduled lesson).',
  ],
  we_failed_to_get_information_from_server: [
    '서버에서 정보를 가져오지 못했습니다.',
    `We failed to get information from the server.`,
  ],
  warning: [
    '경고',
    'Warning',
  ],
  success: [
    '성공',
    'Success',
  ],
  failed: [
    '실패',
    'Failed',
  ],
  you_have_registered_for_n_lessons: (n) => [
    `${n} 건의 수강 신청이 완료되었습니다.`,
    `You have requested for scheduling ${n} lessons. `,
  ],
  you_have_failed_to_register_for_n_lessons: (failureCount) => [
    `${failureCount}건의 수강 신청이 실패했습니다.`,
    `You have failed to request for scheduling ${failureCount} lessons.`,
  ],
  register_for_more: [
    '수강신청 더하기',
    `Schedule more lessons`
  ],
  go_to_prep_page: [
    '예습하러 가기',
    `Go to Prep page`,
  ],
  please_select_material: [
    '교재를 선택해 주세요',
    `Please select a lesson material.`,
  ],
  click_button_to_go_to_the_next_step: [
    '버튼을 누르면 다음 단계로 넘어갑니다.',
    `Click button to go to the next step.`,
  ],
  previous: [
    '이전',
    `Back`,
  ],
  next: [
    '다음',
    `Next`,
  ],
  do_you_want_to_cancel_lesson: [
    '이 수업을 취소하시겠습니까?',
    `Do you want to cancel this lesson?`,
  ],
  please_select_material_from_the_righthand_section: [
    '오른쪽 교재 선택 영역에서 수업 교재를 선택해 주세요',
    `Please select lesson material from the righthand section.`,
  ],
  the_material_is_not_selected: [
    '교재가 선택되지 않았습니다',
    `There is no selected lesson material.`,
  ],
  go_to_the_previous_step_cuz_no_lessons: [
    `신청한 수업이 없어서 이전 단계로 이동합니다`,
    `Since there is no scheduled lesson, you're moving to the previous step.`,
  ],
  counter_of_selected_materials: (materialCount, completedCount) => [
    `교재 선택 : ${materialCount} / ${completedCount} 개`,
    `Selected materials: ${materialCount} / ${completedCount}`,
  ],
  do_you_want_to_exit: [
    '수상 신청 페이지를 나가겠습니까?',
    `Do you want to exit this page?`,
  ],
  this_registration_will_be_canceled: [
    '현재까지 신청한 내용이 취소됩니다.',
    `Your scheduling process will be cancelled.`,
  ],
  an_error_occurred_during_the_process: [
    '신청 과정에서 오류가 발생했습니다.',
    `An error occurred during the process.`,
  ],
  are_you_sure_you_want_to_register: [
    '수강 신청 하시겠습니까?',
    `Are you sure you want to schedule?`,
  ],
  btn_register: [
    '신청하기',
    `Register`,
  ],
  complete: [
    '신청 완료',
    'Complete',
  ],
  let_us_what_to_do_if_the_lesson_with_the_tutor_becomes_unavailable: [
    '신청한 수업이 선택한 튜터와 이뤄지지 않을 경우에 어떻게 처리할지 알려주세요',
    `Please let us know what to do if the lesson with the tutor becomes unavailable :`,
  ],
  after_cancel_auto_matching_unavailable: [
    '현재 가능한 튜터가 없어서, 취소 후 자동 매칭 기능은 제공되지 않습니다.',
    `No automatic matching function available after cancelling. `,
  ],
  click_butotn_after_confirmation: [
    '확인 후 수업 신청 완료를 눌러주세요.',
    `Click "Complete" button if you confirm.`,
  ],
  you_can_choose_what_to_do_if_tutor_cancels_lesson: [
    '튜터가 부득이한 이유로 취소할 경우에 어떻게 할지 선택 가능합니다.',
    `You can choose what to do if the tutor cancels the lesson for unavoidable reasons.`
  ],
  the_past_time: [
    '지난 시간 입니다.',
    `It is the past time.`,
  ],
  you_cannot_register_within_26_hours: [
    '현재 시간 기준 26시간 안에는 신청 할 수 없습니다',
    `You cannot schedule within 26 hours from the current time.`,
  ],
  you_cannet_register_with_the_selected_credits: [
    '선택된 크레딧으로는 신청하실 수 없습니다.',
    `You cannot schedule with the selected coupon.`,
  ],
  you_are_out_of_credits_please_choose_another_credit: [
    '남은 크레딧이 없습니다. 다른 크레딧을 선택해 주세요.',
    `You are out of coupon. Please choose another coupon.`,
  ],
  credit: [
    '크레딧',
    'Coupon',
  ],
  n_of_registered_lessons: (completedCount) => [
    `신청한 수업 수 : ${completedCount}개`,
    <>Scheduled Lessons: {completedCount}</>,
  ],
  plz_select_your_tutor: [
    '튜터를 선택하세요.',
    'Please select your tutor',
  ],
  the_available_times_will_be_displayed: [
    '캘린더에 신청 가능한 시간이 표시됩니다.',
    `The available times will be displayed on calandar.`,
  ],
  change_registration_mode: [
    '신청 방식 변경',
    `Change scheduling mode`,
  ],
  select_time_first: [
    '시간 먼저 선택',
    `Select time first`,
  ],
  select_tutor_first: [
    '튜터 먼저 선택',
    `Select tutor first`,
  ],
  are_you_sure_you_want_to_delete_this_lesson: [
    '이 수업을 삭제하시겠습니까?',
    `Are you sure you want to delete this lesson?`,
  ],
  the_selected_time_is_only_available_20_min_lessons: [
    '선택한 시간은 20분 수업만 가능합니다',
    `The selected time is only available for 20-minute lessons`,
  ],
  lesson_reserved: [
    '수업 예정',
    `Lesson reserved`,
  ],
  selected: [
    '선택 완료',
    'Selected',
  ],
  select_tutor: [
    '튜터 선택',
    `Select tutor`,
  ],
  selectable: [
    '선택 가능',
    'Available',
  ],
  unavailable: [
    '신청 불가',
    'Unavailable'
  ],
  reserve_closed: [
    '예약 마감',
    <>Closed{'\n'}Schedule</>,
  ],
  available_20_lesson: [
    '20분 가능',
    <>20min lesson</>,
  ],
  not_service_hours: [
    '서비스 운영 시간이 아닙니다',
    `It is not service hour.`,
  ],
  view_profiles: [
    '프로필 보기',
    `View profiles`,
  ],
  new_recommendations: [
    '신규 추천',
    'New',
  ],
  no_available_schedule: [
    '가능한 스케쥴이 없습니다',
    `There is no available schedule.`,
  ],
  please_register_for_lessons_by_select_the_desired_time_on_calender: [
    '캘린더에서 원하시는 시간을 눌러 수업을 신청해 주세요.',
    `Please schedule lessons by selecting the desired time on calendar.`,
  ],
  not_able_to_fetch_tutors_info: [
    '튜터 정보를 가져오지 못했습니다.',
    `We were not able to fetch the tutor's information.`,
  ],
  gender: [
    '성별',
    'Gender',
  ],
  accent: [
    '억양',
    'Accent',
  ],
  major: [
    '전공',
    'Major',
  ],
  all_tutors: [
    '모든 튜터',
    'All tutors',
  ],
  preferred_tutors: [
    '선호 튜터',
    'Preferred',
  ],
  liked_tutors: [
    '찜한 튜터',
    'My Picks',
  ],
  rising_star_tutors: [
    '신규 추천',
    'New',
  ],
  tutors_available_in_this_time: [
    '해당 시간 수업이 가능한 튜터들 입니다',
    `Tutors available in this time`,
  ],
  tutors_unavailable_in_this_time: [
    '해당 시간 수업 신청이 마감된 튜터들 입니다',
    `Tutors unavailable in this time`,
  ],
  tutors_available_you_gave_a_good_rating: [
    `수업 후 좋은 평점을 준 튜터들 중 선택하신 시간에 수업이 가능한 튜터들 입니다`,
    `Tutors with good reviews that are available for your selected time.`,
  ],
  tutors_youve_liked_that_are_available: [
    '찜한 튜터들 중에서해당 시간 수업이 가능한 튜터들 입니다',
    `Liked tutors that are available for your selected time`,
  ],
  select_a_tutor: [
    '튜터 선택하기',
    `Select a tutor`,
  ],
  add_more_tutor: [
    '더 많은 튜터를 추가해 보세요',
    'Add more tutors',
  ],
  find_a_tutor: [
    '튜터 찾기',
    `Find a tutor`,
  ],
  the_tutors_you_gave_a_good_raitings: [
    `수업 후 내가 좋은 평점을 준 튜터들입니다.`,
    `Tutors who received good reveiws from you after your lessons`,
  ],
  there_is_no_credit_available_you_can_register_for_lesson_after_purchase: [
    '신청 가능한 크레딧이 없습니다. 크레딧 구매 후 수업 신청하실 수 있습니다. ',
    `There is no coupon available. You can schedule after purchasing more coupons.`,
  ],
  the_selected_lesson_starts_within_48_hours: [
    '선택하신 수업은 48시간 이내에 시작하는 수업입니다. 튜터와의 시차 및 응답 속도에 따라 매칭되지 않을 가능성이 높습니다.',
    `The selected lesson starts within 48 hours. You may not be able to match with this tutor, depending on the time difference and answering time.`,
  ],
  AM_hour: (h) => [
    `오전 ${h}시`,
    `AM ${h}`
  ],
  PM_hour: (h) => [
    `오후 ${h}시`,
    `PM ${h}`
  ],
  thirty_min: [
    ' 30분',
    ":30"
  ],
  o_clock: [
    '',
    ":00"
  ],
  if_the_lesson_with_the_tutor_becomes_unavailable: [
    '신청한 수업이 선택한 튜터와 이뤄지지 않을 경우 :',
    `If the lesson with the tutor becomes unavailable :`,
  ],
}
