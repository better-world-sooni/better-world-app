import urljoin from 'url-join';

const BASE_URL = 'http://localhost:3000';
const toUrl = (...args) => ({url: urljoin(...args)});
const base = path => toUrl(BASE_URL, path);
const v1 = path => toUrl(BASE_URL, '/api/v1', path);
const v2 = path => toUrl(BASE_URL, '/api/v2', path);
const v3 = path => toUrl(BASE_URL, '/api/v3', path);
const v4 = path => toUrl(BASE_URL, '/api/v4', path);
const v3_student = path => toUrl(BASE_URL, '/api/v3/student', path);
const v4_student = path => toUrl(BASE_URL, '/api/v4/student', path);
const fetchRoute = ({ directionsServiceBaseUrl = "https://maps.googleapis.com/maps/api/directions/json", origin, waypoints, destination, apikey, mode, language, region, precision, timePrecisionString, channel, alternatives }) => {
  let url = directionsServiceBaseUrl;
  if (typeof (directionsServiceBaseUrl) === 'string') {
    url += `?origin=${origin}&waypoints=${waypoints}&destination=${destination}&key=${apikey}&mode=${mode.toLowerCase()}&language=${language}&region=${region}&alternatives=${alternatives}`;
    if (timePrecisionString) {
      url += `&departure_time=${timePrecisionString}`;
    }
    if (channel) {
      url += `&channel=${channel}`;
    }
  }
  return { url: url }
}

const APIS = {
  paths: {
    default: () => base('/default'),
    fetch: fetchRoute
  },
  lessonEnter: id => v1(`/rtc/rtc_lesson_info?lesson_id=${id}`),
  version: (platform, target) =>
    v4(`/version?platform=${platform}&target=${target}`),
  auth: {
    get: () => v4_student('/auth'),
    signup: () => v3('/common/authenticate/signup'),
    signIn: () => v4('/authenticate/signin'),
    signupWithProvider: () => v3('/common/authenticate/signup_with_provider'),
    checkPromoCode: () => v4_student('/profile/promo'),
    checkReferralCode: () => v4_student('/profile/referral'),
    changeLocale: () => v3('/common/user_configuration/change_locale'),
    passwordReset: () => v3('/common/authenticate/reset_password'),
    setRegistrationToken: () => v3('/common/user_configuration/register_token'),
  },
  referral: code => v4_student(`/referral?referral_code=${code}`),
  invite: {
    index: () => v4_student('/invite'),
    referralCode: userId => v1(`/userinfo/get_referral_code?user_id=${userId}`),
    history: () => v4_student('/invite/history'),
  },
  trial: {
    get: () => v4_student('/trial'),
    complete: () => v4_student('/trial/complete'),
    times: date => v4_student(`/trial/times?time=${date}`),
    requestPhone: () => v4_student('/trial/phone/request'),
    verify: () => v4_student('/trial/phone/verify'),
    submit: () => v4_student('/trial'),
  },
  material: {
    list: () => v4_student('/course'),
    detail: id => v4_student(`/course/${id}`),
    search: () => v4_student('/course/search'),
  },
  home: {
    curation: () => v4_student('curation'),
  },
  notice: {
    list: () => v4_student('/notices'),
    detail: id => v4_student(`notice/${id}`),
    read: id => v4_student(`notice/${id}/read`),
  },
  faq: {
    list: () => v4_student('/faq'),
  },
  tutor: {
    list: page => v4_student(`/tutor?page=${page}`),
    risingStars: () => v4_student('/tutor/rising_stars'),
    myTutors: () => v4_student('/tutor/my_tutors'),
    preferredTutors: () => v4_student('/tutor/preferred_tutors'),
    experiencedTutors: () => v4_student('/tutor/experienced_tutors'),
    search: () => v4_student('/tutor/search_tutors'),
    profile: id => v4_student(`/tutor/profile?tutor_id=${id}`),
    add: () => v4_student('/tutor/add'),
    delete: () => v4_student('/tutor/delete'),
  },
  //query = `${server}/api/v3/student/select_matching/tutor_profile?tutor_id=${tutor_id}`;
  matching: {
    tutorSchedule: ({tutor_id, date_from, date_to, coupon_type_id}) =>
      v4_student(
        `/matching/tutor_schedules?tutor_id=${tutor_id}&date_from=${date_from}&date_to=${date_to}&coupon_type_id=${coupon_type_id}`,
      ),
    coupons: () => v4_student('/matching/coupons'),
    validateCoupon: () => v4_student('/matching/book_time_and_validate_coupon'),
    validateCouponForEdit: () =>
      v4_student('/matching/book_time_and_validate_coupon_for_edit'),
    unbook: () => v4_student('/matching/unbook_time'),
    index: () => v4_student('/matching'),
    forEdit: id => v4_student(`/matching/for_edit/${id}`),
    schedule: ({tutor_id, date_from, date_to, coupon_type_id}) =>
      v4_student(
        `/matching/schedule?tutor_id=${tutor_id}&date_from=${date_from}&date_to=${date_to}&coupon_type_id=${coupon_type_id}`,
      ),
    scheduleAtTime: (year, month, day, hours, minutes, coupon_type_id) =>
      v4_student(
        `/matching/schedule_at_time?year=${year}&month=${month}&day=${day}&hours=${hours}&minutes=${minutes}&coupon_type_id=${coupon_type_id}`,
      ),
    checkTutorAvail: ({tutorId, userApplyId, couponTypeId}) =>
      v3(
        `/student/select_matching/check_tutor_avail?tutor_id=${tutorId}&userapply_id=${userApplyId}&coupon_type_id=${couponTypeId}`,
      ),
    checkCouponAvail: ({time}) =>
      v3(`/student/coupon/available?time=${time}&match_type_allowed=all`),
    detach: ({userApplyId, is_40m}) =>
      v3(
        `/student/select_matching/detach_apply?userapply_id=${userApplyId}&is_40m=${is_40m}`,
      ),
    courses: duration => v4_student(`matching/courses?duration=${duration}`),
    classtimes: ({date_from, date_to, coupon_type_id}) =>
      v4_student(
        `/matching/classtimes?date_from=${date_from}&date_to=${date_to}&coupon_type_id=${coupon_type_id}`,
      ),
  },
  lessons: {
    apply: () => v4_student('/lesson/apply'),
    applyAuto: () => v4_student('/lesson/apply_auto'),
    enter: id => v4_student(`/lesson/upcoming/${id}/enter`),
    review: (completedType, size, start) =>
      v4_student(
        `/lesson/past?type=${completedType}&size=${size}&start=${start}`,
      ),
    reviewDetail: id => v4_student(`/lesson/past/${id}`),
    analysis: id => v3(`student/lesson/past/${id}/analysis`),
    feedback: id => v4_student(`lesson/feedback/${id}`),
    evalFeedback: () => v3('student/evaluation/feedback/submit'),
    setting: id => v4_student(`/lesson_setting/${id}`),
    upcomings: () => v4_student('/lesson/upcoming'),
    upcoming: id => v4_student(`lesson/upcoming/${id}`),
    editCourse: () => v4_student('lesson/edit/course'),
    editTimeForSelectMatching: () =>
      v4_student('lesson/edit/time_for_select_matching'),
    editTimeForAutoMatching: () =>
      v4_student('lesson/edit/time_for_auto_matching'),
    classroom: id => v4_student(`lesson/classroom/${id}`),
    pusherUrl: () => base('/pusher/auth_mobile'),
    chat: () => base('/api/v1/rtc/talk_with_admin'),
    translate: id => v4_student(`lesson/classroom/${id}/translate`),
    exit: id => v4_student(`lesson/classroom/${id}/exit`),
    candidate: courseKeyquestionId =>
      v4_student(
        `lesson/answer/candidates?coursekeyquestion_id=${courseKeyquestionId}`,
      ),
    preparation: {
      get: id => v4_student(`/lesson/preparation/${id}`),
      answer: id => v4_student(`/lesson/preparation/${id}/answer`),
      correction: () => v4_student('/lesson/answer/corrections'),
      upload: id => v4_student(`/lesson/preparation/${id}/upload`),
      option: id => v4_student(`/lesson/preparation/${id}/option`),
    },
    unassigned: {
      get: () => v4_student('/lesson/unassigned'),
      take: () => v3('/student/lesson/unassigned/take'),
    },
    challengeBook: {
      get: () => v3('/student/challenge_book'),
      start: () => v3('/student/challenge_book/start'),
      bonus: id => v3(`/student/challenge_book/bonus?challenge_book_id=${id}`),
      retroactive: id =>
        v3(`/student/challenge_book/retroactive?challenge_book_id=${id}`),
    },
    lessonMaterial: id => v3(`/student/lesson/past/${id}/lesson_material`),
    deleteLessonMaterial: () =>
      v3('/student/lesson/past/delete_lesson_material'),
  },
  tip: {
    get: page => v3(`/student/best_practice?page_number=${page}`),
    detail: id => v3(`/student/best_practice/${id}`),
  },
  review: {
    customerReview: () => v4_student('/review'),
    lessonReview: () => v4_student('/lesson_review'),
  },
  webinar: {
    list: page => v4_student(`webinar?page=${page}`),
    apply: id => v4_student(`/webinar/${id}/apply`),
    cancel: () => v4_student('/webinar/cancel'),
    detail: id => v4_student(`/webinar/${id}`),
    myWebinar: () => v4_student('/my_webinar'),
    search: () => v4_student('/webinar/search'),
    enter: () => v4_student('/webinar/enter'),
  },
  credit: {
    availableLesson: id => v4_student(`lesson/${id}/coupon`),
    creditList: () => v4_student('/credit/list'),
    list: () => v4_student('/credit/'),
    detail: () => v4_student('/credit/detail'),
    convert: () => v4_student('/credit/convert'),
    lessonHistory: id => v4_student(`/log/lesson_book?id=${id}`),
    receive: id => v4_student(`/log/lesson_book/credit?id=${id}`),
  },
  couponBox: {
    list: () => v4_student('/credit/coupon_box'),
    useCoupon: () => v4_student('/credit/coupon_box/used'),
  },
  point: {
    list: () => v4_student('/points'),
    compensate: () => v4_student('/points/compensate'),
  },
  products: {
    list: () => v4_student('/product'),
    detail: id => v4_student(`/product/${id}`),
  },
  lesson: {
    get: id => v4_student(`/lesson/${id}`),
    cancel: id => v4_student(`/cancel/${id}`),
    cancelPolicy: id => v4_student(`/cancel/${id}/policy`),
    getShareAnswer: () => v4_student('/lesson/answer/candidates'),
    answerSelect: () => v4_student('/lesson/answer/select'),
    like: () => v4_student('/lesson/answer/like'),
    unlike: () => v4_student('/lesson/answer/unlike'),
    prestudy: id => v4_student(`/lesson/preparation/${id}/prestudy`),
    pastStudy: id => v4_student(`/lesson/past/${id}/study`),
  },
  profile: {
    get: () => v4_student('/profile'),
    setInfo: () => v4_student('/profile/info'),
    video: () => v4_student('/video/submit'),
    zoom: () => v4_student('/profile/zoom'),
    password: () => v4_student('/profile/password'),
    leave: () => v4_student('/profile/leave'),
    timezone: () => v4_student('/profile/timezone'),
    notifications: () => v4_student('/profile/notifications'),
    updateNotifications: () => v4_student('/profile/notifications'),
    updateRemindTime: () => v4_student('/profile/notifications/time'),
    updateProfileImage: () => v4_student('/profile/avatar'),
    updateSetting: () => v4_student('/profile/notifications/setting'),
    updatePushOption: () => v3_student('/setting/unassigned'),
    resolution: () => v3('/student/resolution'),
    phoneCodeRequest: () => v4_student('/profile/phone'),
    phoneCodeAuthorized: () => v4_student('/profile/code'),
  },
  evaluation: {
    post: id => v4_student(`/evaluation/${id}`),
  },
  memo: {
    other: page => v3(`/memo/public/list?page=${page}`),
    myMemo: page => v3(`/memo/list?page=${page}`),
    delete: id => v3(`/memo/${id}/delete`),
    update: id => v3(`/memo/${id}/update`),
    save: () => v3('/memo/create'),
    quiz: () => v3('/quiz?offset=0'),
    submitAnswer: () => v3('/quiz/submit_translation'),
  },
  notifications: {
    get: page => v4_student(`/profile/notifications/push?page=${page}`),
    delete: () => v2('/notification/delete_checked_push_notifications'),
    read: () => v2('/notification/read_all_unread_push_notifications'),
  },
  logdata: {
    getMonthly: (year, month) =>
      v4_student(`/log/monthly?year=${year}&month=${month}`),
    getDatail: id => v4_student(`/log/${id}`),
    getWeekly: (start, end) =>
      v4_student(`/log?start_date=${start}&end_date=${end}&&only_date=true`),
    getLogData: (start, idx) =>
      v4_student(`/log/history?start_date=${start}&start=${idx}`),
  },
  stats: {
    summary: () => v4_student('/statistics/summary'),
    overall: month => v4_student(`/statistics?month=${month}`),
    feedbackChart: () => v4_student('/statistics/feedback/chart'),
    feedback: lesson_id => v4_student(`/statistics/feedback/${lesson_id}`),
    vocaChart: duration =>
      v4_student(`/statistics/voca/chart?duration=${duration}`),
    voca: lesson_id => v4_student(`/statistics/voca/${lesson_id}`),
    wpmChart: () => v4_student('/statistics/wpm/chart'),
    wpm: lesson_id => v4_student(`/statistics/wpm/${lesson_id}`),
  },
};

const mapFunctionToPath = (data, path = []) => {
  data &&
    Object.entries(data).map(([key, v]) => {
      if (typeof v === 'function') {
        const apiKey = [...path, key].join('.');
        data[key] = (...args) => ({...v(...args), key: apiKey});
        Object.defineProperty(data[key], '_apiKey', {value: apiKey});
      } else if (typeof v === 'object') {
        mapFunctionToPath(v, [...path, key]);
      }
    });
};
(function () {
  mapFunctionToPath(APIS, ['APIS']);
})();

export default APIS;
