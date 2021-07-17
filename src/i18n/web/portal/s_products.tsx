import {Span} from "src/components/common/Span"
import React from 'react'

export const s_products = {
  headline: [
    '퀄리티는 그대로, 부담은 절반으로.',
    'Great Quality, Half the Price',
  ],
  mainHeadline: [
    <>검증된 Quality의 수업을{'\n'}합리적인 가격으로</>,
    <>Take high quality lessons for reasonable price</>,
  ],
  subtitle: [
    '나에게 맞는 링글 패키지로 시작하세요.',
    'Start with a Ringle package perfect for you.',
  ],
  // dollarDescription: [
  //   <>
  //     <ul>
  //       <li>
  //         현재 환율에 의거하여 달러($)로 결제됩니다.
  //       </li>
  //       <li>
  //         PayPal을 로그인하지 않아도 사용가능합니다(PayPal Guest Checkout 또는 Pay with Debit or Credit Card로 결제하시면 됩니다)
  //       </li>
  //       <li>
  //         영수증은 등록하신 이메일로 자동 발송됩니다. (링글 사이트 내에서 확인이 불가합니다.)
  //       </li>
  //       <li>
  //         청구주소가 한국이면 이용이 <Span danger>불가능</Span>합니다.
  //       </li>
  //       <li>
  //         일부 국내법인카드는 Paypal을 지원하지 않습니다. 이 경우, 국내 &gt; 비인증 결제 진행부탁드립니다.
  //       </li>
  //     </ul>
  //   </>,
  //   <>
  //     <ul>
  //       <li>
  //         The purchase will be made in USD, while the price may vary depending on the exchange rate. (USD-KRW)
  //       </li>
  //       <li>
  //         You can use Paypal without logging in. (Select Paypal Guest Checkout or Pay with Debit or Credit Card)
  //       </li>
  //       <li>
  //         Your receipt will be automatically emailed to you. (You cannot view it on Ringle website)
  //       </li>
  //       <li>
  //         If your address is in South Korea, you <Span danger>cannot</Span> use Paypal.
  //       </li>
  //       <li>
  //         Some domestic cards may not be compatible with Paypal. Please use Domestic or Non-certificate pay
  //       </li>
  //     </ul>
  //   </>
  // ],
  dollarConfirm: (price) => [
    <>
      <Span bold>해당 상품은 <Span primary>${price}</Span>로 결제 됩니다.{'\n'}
        진행하시겠습니까?
      </Span>
    </>,
    <>
      <Span bold>The selected package will be purchased with <Span primary>${price}</Span>. Do you want to proceed?</Span>
    </>,
  ],
  no: [
    '아니오',
    'No',
  ],
  yes: [
    '네',
    'Yes',
  ],
  // wonDescription: [
  //   <>
  //     <ul>
  //       <li>
  //         원화(￦)로 결제됩니다.
  //       </li>
  //       <li>
  //         결제 내역에는 링글의 결제 대행사인 ‘JTNET’이 상점명으로 표시됩니다.
  //       </li>
  //       <li>
  //         링글 사이트 내에서 영수증을 확인할 수 있습니다.
  //       </li>
  //       <li>
  //         소량의 환전 수수료가 추가될 수 있습니다.
  //       </li>
  //     </ul>
  //   </>,
  //   <>
  //     <ul>
  //       <li>
  //         The purchase will be made in Korean Won(KRW).
  //       </li>
  //       <li>
  //         The receipt will be issued under 'JTNET,' Ringle's payment agency.
  //       </li>
  //       <li>
  //         You can view your receipt on the Ringle website.
  //       </li>
  //       <li>
  //         A small amount of currency exchange fee may be charged.
  //       </li>
  //     </ul>
  //   </>
  // ],
  wonConfirm: (price) => [
    <>
      <Span bold>해당 상품은 <Span primary>￦{price}</Span>로 결제 됩니다.{'\n'}
        진행하시겠습니까?
      </Span>
    </>,
    <>
      <Span bold>
        The selected package will be purchased with <Span primary>￦{price}</Span>.
        Do you want to proceed?
      </Span>
    </>,
  ],
  lumpPayment: [
    '일시불',
    'Pay in lump sum',
  ],
  month: (month) => [
    <>{month}개월</>,
    <>{month} months</>,
  ],
  totalPrice: (price) => [
    <>총 결제 금액: {price}원</>,
    <>Total Payment: {price} KRW</>
  ],
  firstCard: [
    '첫번째 카드 결제 금액',
    'Charge on the first card',
  ],
  secondCard: [
    '두번째 카드 결제 금액',
    'Charge on the second card',
  ],
  person: [
    '일시불 / 개인',
    'Pay in lump sum/Individual'
  ],
  secondCardPrice: (price) => [
    <>두번째 카드 결제 금액은 {price} 원 입니다.</>,
    <>{price} KRW will be charged to your second card.</>,
  ],
  firstCardPrice: (price) => [
    <>첫번째 카드 결제 금액은 {price} 원 입니다.</>,
    <>{price} KRW will be charged to your first card.</>,
  ],
  totalAmount: [
    '결제 금액',
    'Total Price',
  ],
  realAmount: (n) => [
    <>{n}원</>,
    <>${n}</>,
  ],
  cardInstallmentInfo: [
    '카드 할부 안내',
    'Information on paying in installations',
  ],
  installment: [
    '할부',
    'Pay in installations',
  ],
  inputCard: [
    '카드번호 입력',
    'Enter card number',
  ],
  personal: [
    '개인',
    'Personal',
  ],
  corporation: [
    '법인',
    'Corporate',
  ],
  expiryDate: [
    '유효기간(MM/YY)',
    'Expiration date (MM/YY)',
  ],
  passwordTwoDigit: [
    '비밀번호 앞 2자리',
    'First 2 digits of the PIN',
  ],
  birthPersonal: [
    '생년월일(6자리)',
    'Birth Date (6 digits)',
  ],
  birthCompany: [
    '사업자등록번호(10자리)',
    'Business registration number (10 digits)',
  ],
  limitPromotionPoint: [
    '해당 패키지는 프로모션 포인트만 사용가능합니다.',
    'You can only use promotion points for this package.',
  ],
  notAllowedPoint: [
    '해당 패키지는 할인 패키지로써, 포인트 사용이 불가합니다.',
    'You cannot use points for discount packages.',
  ],
  payment: [
    '결제하기',
    'Purchase'
  ],
  cardInfo: [
    '카드사 무이자 할부 안내',
    '카드사 무이자 할부 안내',
  ],
  cardInfoContent: [
    <>
      기간 : 2020년 1월 1일 ~ 2020년 1월 31일{'\n'}
      금액 : 5만원 이상{'\n'}{'\n'}
      ▣ 무이자 안내{'\n'}
      1. 롯데카드: 2, 3, 4개월 무이자{'\n'}
      2. 신한카드: 2, 3, 4, 5, 6개월 무이자{'\n'}
      3. 하나카드: 2, 3, 4, 5, 6개월 무이자{'\n'}
      4. NH농협카드: 2, 3, 4, 5, 6개월 무이자{'\n'}
      5. 비씨카드: 2, 3, 4, 5, 6개월 무이자{'\n'}
      6. 삼성카드: 2, 3, 4, 5, 6개월 무이자{'\n'}
      7. KB국민카드: 2, 3, 4, 5, 6개월 무이자{'\n'}
      8. 현대카드: 2, 3, 4, 5, 6, 7개월 무이자{'\n'}
      {'\n'}
      그 이외의 카드는 결제 시 확인 부탁드립니다.
    </>,
    <>
      기간 : 2020년 1월 1일 ~ 2020년 1월 31일{'\n'}
      금액 : 5만원 이상{'\n'}{'\n'}
      ▣ 무이자 안내{'\n'}
      1. 롯데카드: 2, 3, 4개월 무이자{'\n'}
      2. 신한카드: 2, 3, 4, 5, 6개월 무이자{'\n'}
      3. 하나카드: 2, 3, 4, 5, 6개월 무이자{'\n'}
      4. NH농협카드: 2, 3, 4, 5, 6개월 무이자{'\n'}
      5. 비씨카드: 2, 3, 4, 5, 6개월 무이자{'\n'}
      6. 삼성카드: 2, 3, 4, 5, 6개월 무이자{'\n'}
      7. KB국민카드: 2, 3, 4, 5, 6개월 무이자{'\n'}
      8. 현대카드: 2, 3, 4, 5, 6, 7개월 무이자{'\n'}
      {'\n'}
      그 이외의 카드는 결제 시 확인 부탁드립니다.
    </>,
  ]


}

export const s_purchase_success = {
  headline: [
    <>결제 완료되었습니다.{'\n'}내역을 확인하세요</>,
    <>Payment complete.{'\n'}Please check for your receipt. </>
  ],
  info: [
    '결제 정보',
    'Payment info',
  ],
  name: [
    '성함',
    'Name',
  ],
  phone: [
    '전화번호',
    'Phone',
  ],
  realAmount: (n) => [
    <>{n}원</>,
    <>${n}</>,
  ],
  purchaseList: [
    '구매목록',
    'Order List',
  ],
  expiredDate: [
    '유효기간',
    'Expiration date',
  ],
  amount: [
    '결제 금액',
    'Total purchase',
  ],
  description1: [
    '필요한 증명서류는 PC로 크레딧 관리 페이지를 접속하면 출력할 수 있습니다.',
    'In order to print your certificate documents, access Certificates page on PC.'
  ],
  description2: [
    '구매한 크레딧 패키지로 첫 수업이 완료되기 전까지는 유효기간이 차감되지 않습니다.',
    `We won't start counting down the validity period of the purchased package until you complete your first lesson. `
  ],
}
