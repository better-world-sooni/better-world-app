import {Dimensions} from 'react-native';

export const DEVICE_WIDTH = Dimensions.get('window').width;
export const DEVICE_HEIGHT = Dimensions.get('window').height;
export const PADDINGED_WIDTH = Dimensions.get('window').width - 40;
export const PADDINGED_HEIGHT = Dimensions.get('window').height - 40;

export const varStyle = {
  realBlack: '#000000',
  black: '#161c2d',
  primary: '#7a5de8',
  primarySoft: '#7a5de810',
  secondary: '#513ccd',
  secondarySoft: '#513ccd10',
  secondary2: '#3f3d88',
  secondary2Soft: '#3f3d8810',
  danger: '#ff3051',
  dangerSoft: '#ff305110',
  info: '#2a97ff',
  infoSoft: '#2a97ff10',
  warning: '#f6c343',
  warningSoft: '#f6c34310',
  success: '#3cd278',
  successSoft: '#3cd27810',
  gray700: '#2c3f58',
  gray700Soft: '#2c3f5810',
  gray600: '#869ab8',
  gray500: '#abbcd5',
  gray400: '#c6d3e6',
  gray300: '#e2e9f2',
  gray200: '#edf0f5',
  gray100: '#f9fbfd',
  white: '#ffffff',
  yellow: '#fabd3e',
  webinarPink: '#e68eb5',
  webinarYellow: '#e6b500',
  webinarBlue: '#46b6e0',
  weightBold: 'bold' as const,
  weightMedium: '500' as const,
  weightRegular: 'normal' as const,
  weightLight: '300' as const,
  weightThin: '100' as const,
  defaultBorderWidth: 1,
  defaultBorderRadius: 8,
  fullWidth: '100%',
  halfWidth: '50%',
  mediumWidth: '33%',
  smallWidth: '18%',
};

export const globalStyle = {
  basicContainer: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  bgPrimary: {
    backgroundColor: varStyle.primary,
  },
  bgSecondary: {
    backgroundColor: varStyle.secondary,
  },
  bgSecondary2: {
    backgroundColor: varStyle.secondary2,
  },
  bgDanger: {
    backgroundColor: varStyle.danger,
  },
  bgSuccess: {
    backgroundColor: varStyle.success,
  },
  bgWarning: {
    backgroundColor: varStyle.warning,
  },
  bgInfo: {
    backgroundColor: varStyle.info,
  },
  bgBlack: {
    backgroundColor: varStyle.black,
  },
  bgWhite: {
    backgroundColor: varStyle.white,
  },
  bgGray100: {
    backgroundColor: varStyle.gray100,
  },
  bgGray200: {
    backgroundColor: varStyle.gray200,
  },
  bgGray300: {
    backgroundColor: varStyle.gray300,
  },
  bgGray400: {
    backgroundColor: varStyle.gray400,
  },
  bgGray500: {
    backgroundColor: varStyle.gray500,
  },
  bgGray600: {
    backgroundColor: varStyle.gray600,
  },
  bgGray700: {
    backgroundColor: varStyle.gray700,
  },
  textPrimary: {
    color: varStyle.primary,
  },
  textSecondary: {
    color: varStyle.secondary,
  },
  textSecondary2: {
    color: varStyle.secondary2,
  },
  textDanger: {
    color: varStyle.danger,
  },
  textWarning: {
    color: varStyle.warning,
  },
  textSuccess: {
    color: varStyle.success,
  },
  textInfo: {
    color: varStyle.info,
  },
  textBlack: {
    color: varStyle.black,
  },
  textWhite: {
    color: varStyle.white,
  },
  textBold: {
    fontWeight: varStyle.weightBold,
  },
  textMedium: {
    fontWeight: varStyle.weightMedium,
  },
  textRegular: {
    fontWeight: varStyle.weightRegular,
  },
  textThin: {
    fontWeight: varStyle.weightThin,
  },
  textLight: {
    fontWeight: varStyle.weightLight,
  },
  textCenter: {
    textAlign: 'center' as const,
  },
  textLeft: {
    textAlign: 'left' as const,
  },
  textRight: {
    textAlign: 'right' as const,
  },
  borderBlack: {
    borderColor: varStyle.black,
  },
  borderWhite: {
    borderColor: varStyle.white,
  },
  borderPrimary: {
    borderColor: varStyle.primary,
  },
  borderSecondary: {
    borderColor: varStyle.secondary,
  },
  borderSecondary2: {
    borderColor: varStyle.secondary2,
  },
  borderDanger: {
    borderColor: varStyle.danger,
  },
  borderWarning: {
    borderColor: varStyle.warning,
  },
  borderSuccess: {
    borderColor: varStyle.success,
  },
  borderInfo: {
    borderColor: varStyle.warning,
  },
  justifyContentCenter: {
    justifyContent: 'center' as const,
  },
  alignItemsCenter: {
    alignItems: 'center' as const,
  },
  rounded4: {
    borderRadius: 4,
  },
  rounded8: {
    borderRadius: 8,
  },
  rounded10: {
    borderRadius: 10,
  },
  m0: {
    margin: 0,
  },
  m4: {
    margin: 4,
  },
  m8: {
    margin: 8,
  },
  m16: {
    margin: 16,
  },
  m32: {
    margin: 32,
  },
  ml0: {
    marginLeft: 0,
  },
  ml4: {
    marginLeft: 4,
  },
  ml8: {
    marginLeft: 8,
  },
  ml16: {
    marginLeft: 16,
  },
  ml32: {
    marginLeft: 32,
  },
  mr0: {
    marginRight: 0,
  },
  mr4: {
    marginRight: 4,
  },
  mr8: {
    marginRight: 8,
  },
  mr16: {
    marginRight: 16,
  },
  mr32: {
    marginRight: 32,
  },
  mx0: {
    marginLeft: 0,
    marginRight: 0,
  },
  mx4: {
    marginLeft: 4,
    marginRight: 4,
  },
  mx8: {
    marginLeft: 8,
    marginRight: 8,
  },
  mx16: {
    marginLeft: 16,
    marginRight: 16,
  },
  mx32: {
    marginLeft: 32,
    marginRight: 32,
  },
  my0: {
    marginTop: 0,
    marginBottom: 0,
  },
  my4: {
    marginTop: 4,
    marginBottom: 4,
  },
  my8: {
    marginTop: 8,
    marginBottom: 8,
  },
  my16: {
    marginTop: 16,
    marginBottom: 16,
  },
  my32: {
    marginTop: 32,
    marginBottom: 32,
  },
  mt0: {
    marginTop: 0,
  },
  mt4: {
    marginTop: 4,
  },
  mt8: {
    marginTop: 8,
  },
  mt16: {
    marginTop: 16,
  },
  mt32: {
    marginBottom: 32,
  },
  mb0: {
    marginBottom: 0,
  },
  mb4: {
    marginBottom: 4,
  },
  mb8: {
    marginBottom: 8,
  },
  mb16: {
    marginBottom: 16,
  },
  mb32: {
    marginBottom: 32,
  },
  p0: {
    padding: 0,
  },
  p4: {
    padding: 4,
  },
  p8: {
    padding: 8,
  },
  p16: {
    padding: 16,
  },
  p32: {
    padding: 32,
  },
  pl0: {
    paddingLeft: 0,
  },
  pl4: {
    paddingLeft: 4,
  },
  pl8: {
    paddingLeft: 8,
  },
  pl16: {
    paddingLeft: 16,
  },
  pl32: {
    paddingLeft: 32,
  },
  pr0: {
    paddingRight: 0,
  },
  pr4: {
    paddingRight: 4,
  },
  pr8: {
    paddingRight: 8,
  },
  pr16: {
    paddingRight: 16,
  },
  pr32: {
    paddingRight: 32,
  },
  px0: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  px4: {
    paddingLeft: 4,
    paddingRight: 4,
  },
  px8: {
    paddingHorizontal: 8,
  },
  px16: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  px32: {
    paddingLeft: 32,
    paddingRight: 32,
  },
  py0: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  py4: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  py8: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  py16: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  py32: {
    paddingTop: 32,
    paddingBottom: 32,
  },
  pt0: {
    paddingTop: 0,
  },
  pt4: {
    paddingTop: 4,
  },
  pt8: {
    paddingTop: 8,
  },
  pt16: {
    paddingTop: 16,
  },
  pt32: {
    paddingBottom: 32,
  },
  pb0: {
    paddingBottom: 0,
  },
  pb4: {
    paddingBottom: 4,
  },
  pb8: {
    paddingBottom: 8,
  },
  pb16: {
    paddingBottom: 16,
  },
  pb32: {
    paddingBottom: 32,
  },
  p: (n: number) => ({
    padding: n,
  }),
  pl: (n: number) => ({
    paddingLeft: n,
  }),
  pr: (n: number) => ({
    paddingRight: n,
  }),
  pt: (n: number) => ({
    paddingTop: n,
  }),
  pb: (n: number) => ({
    paddingBottom: n,
  }),
  px: (n: number) => ({
    paddingHorizontal: n,
  }),
  py: (n: number) => ({
    paddingVertical: n,
  }),
  m: (n: number) => ({
    margin: n,
  }),
  ml: (n: number) => ({
    marginLeft: n,
  }),
  mr: (n: number) => ({
    marginRight: n,
  }),
  mt: (n: number) => ({
    marginTop: n,
  }),
  mb: (n: number) => ({
    marginBottom: n,
  }),
  mx: (n: number) => ({
    marginLeft: n,
    marginRight: n,
  }),
  my: (n: number) => ({
    marginTop: n,
    marginBottom: n,
  }),
  header1: {
    fontSize: 24,
    fontWeight: varStyle.weightBold,
    letterSpacing: 0,
    lineHeight: 36,
    fontFamily: 'NotoSansKR-Regular',
  },
  header2: {
    fontSize: 20,
    fontWeight: varStyle.weightBold,
    letterSpacing: -0.5,
    lineHeight: 30,
    fontFamily: 'NotoSansKR-Regular',
  },
  header3: {
    fontSize: 18,
    fontWeight: varStyle.weightMedium,
    letterSpacing: 0.5,
    lineHeight: 27,
    fontFamily: 'NotoSansKR-Regular',
  },
  header4: {
    fontSize: 16,
    fontWeight: varStyle.weightMedium,
    letterSpacing: 0,
    lineHeight: 24,
    fontFamily: 'NotoSansKR-Regular',
  },
  header5: {
    fontSize: 14,
    fontWeight: varStyle.weightMedium,
    letterSpacing: -0.3,
    lineHeight: 21,
    fontFamily: 'NotoSansKR-Regular',
  },
  header6: {
    fontSize: 12,
    fontWeight: varStyle.weightMedium,
    letterSpacing: 0,
    lineHeight: 18,
    fontFamily: 'NotoSansKR-Regular',
  },
  header7: {
    fontSize: 15,
    fontWeight: varStyle.weightMedium,
    letterSpacing: -0.3,
    fontFamily: 'NotoSansKR-Regular',
  },
  header8: {
    fontSize: 12,
    fontWeight: varStyle.weightMedium,
    letterSpacing: -0.26,
    fontFamily: 'NotoSansKR-Regular',
  },
  headerDesc: {
    fontSize: 12,
    fontWeight: varStyle.weightRegular,
    letterSpacing: 0.5,
    lineHeight: 18,
    fontFamily: 'NotoSansKR-Regular',
  },
  sectionBody: {
    fontSize: 14,
    fontWeight: varStyle.weightRegular,
    letterSpacing: -0.3,
    lineHeight: 21,
    fontFamily: 'NotoSansKR-Regular',
  },
  sectionBody2: {
    fontSize: 12,
    fontWeight: varStyle.weightRegular,
    letterSpacing: -0.3,
    lineHeight: 20,
    fontFamily: 'NotoSansKR-Regular',
  },
  dialogTitle: {
    fontSize: 12,
    fontWeight: varStyle.weightMedium,
    letterSpacing: -0.5,
    lineHeight: 24,
    fontFamily: 'NotoSansKR-Regular',
  },
  dialogBody: {
    fontSize: 12,
    fontWeight: varStyle.weightRegular,
    letterSpacing: -0.5,
    lineHeight: 24,
    fontFamily: 'NotoSansKR-Regular',
  },
  notice: {
    fontSize: 11,
    fontWeight: varStyle.weightMedium,
    letterSpacing: 0,
    lineHeight: 17,
    fontFamily: 'NotoSansKR-Regular',
  },
  noticeDetail: {
    color: varStyle.gray600,
    fontSize: 11,
    lineHeight: 17,
    fontWeight: varStyle.weightMedium,
    letterSpacing: -0.5,
    fontFamily: 'NotoSansKR-Regular',
  },
  enCourseHeader1: {
    fontFamily: 'DroidSerif',
    fontSize: 32,
    fontWeight: 'bold',
    fontStyle: 'italic',
    lineHeight: 48,
    letterSpacing: 0,
    color: varStyle.black,
  },
  enCourseHeader2: {
    fontFamily: 'DroidSerif',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 28,
    letterSpacing: -0.05,
    color: varStyle.black,
  },
};
