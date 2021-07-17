import React from 'react'
import { Span } from 'src/components/common/Span'

export const s_coupon_box = {
  subtitle: [
    '각종 혜택을 누릴 수 있는 쿠폰을 확인하세요',
    'Enjoy various benefits by using your coupon below.',
  ],
  coupon_count: (count) => [
    <>
      쿠폰 <Span primary>{count}</Span>개
    </>,
    <>
      Number of coupons : <Span primary>{count}</Span>
    </>
  ],
  redeem: [
    '사용하기',
    'Redeem',
  ],
  used: [
    '사용완료',
    'Used',
  ],
  code: [
    '입력코드:',
    'Code:',
  ]
}
