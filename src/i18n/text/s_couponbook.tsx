import React from 'react'
export const s_couponbook = {
  reg: [
    `정규`,
    `REG`
  ],
  late: [
    `심야`,
    `Late`
  ],
  early: [
    `새벽`,
    `Early`
  ],
  lunch: [
    `점심`,
    `Lunch`
  ],
  expired_in_days: (n) => [
    `수강기간: ${n}일 남음`,
    `Expired in ${n} days`
  ],
  available: [
    `남은횟수`,
    `Available`
  ],
  n_count: (n) => [
    `${n}회`,
    `${n}`
  ],
  n_used_coupons: (used, total) => [
    `${used}회 사용 / ${total}회`,
    `${used} used / ${total}Coupons`
  ],
  earn_free_coupons_by_using_all_coupons_until: (date, n) => [
    `${date}까지 모두 사용하면 정규 수업권 ${n}회 발급`,
    `Earn ${n} free coupons by using all coupons until ${date}`
  ],
  earn_1_free_within_24_h_coupon_every_4_times_of_use: [
    `1회 사용할 때마다 보충 수업권 4회 발급`,
    `Earn 1 free within 24-H coupon every 4 times of use`
  ],
  free: [
    `무료`,
    `Free`
  ],
  free_lesson_coupon: [
    `무료 수업권`,
    `Free Lesson Coupon`
  ],
  regular: [
    `정규`,
    `Regular`
  ],
  within_24_hour: [
    `보충`,
    `Within 24-Hour`
  ],
  within_2_hour: [
    `긴급편성`,
    `Within 2-Hour`
  ],
  coupon_details: [
    `수업권 상세`,
    `Coupon Details`
  ],
  purchase_details_benefits: [
    `구매정보 및 혜택`,
    `Purchase Details & Benefits`
  ],
  purchase_date: [
    `구매일`,
    `Purchase date`
  ],
  refund_availability: [
    `환불 가능 여부`,
    `Refund availability`
  ],
  partially_refundable: [
    `부분 환불 가능`,
    `Partially refundable`
  ],
  fully_refundable: [
    `전체 환불 가능`,
    `Fully refundable`
  ],
  non_refundable: [
    `환불 불가능`,
    `Non-refundable`
  ],
  please_use_the_pc_version_for_your_receipts_and_certificates_: [
    `증명서 및 영수증 발급은 웹에서 가능합니다.`,
    `Please use the PC version for your receipts and certificates.`
  ],
  benefits: [
    `구매 혜택`,
    `Benefits`
  ],
  n_coupons_issued: (n, total) => [
    `${n}회 발급/ ${total}회`,
    `${n} Coupons issued / ${total}`
  ],
  view_issue_history: [
    `발급 내역 확인`,
    `View Issue History`
  ],
  are_you_sure_you_want_to_use_this_coupon: [
    `쿠폰 사용하시겠습니까?`,
    `Are you sure you want to use this coupon?`,
  ],
  the_coupon_you_selected_has_been_used: [
    `쿠폰이 사용되었습니다`,
    `The coupon you selected has been used.`,
  ],
}