import {Dimensions} from 'react-native';

export const DEVICE_WIDTH = Dimensions.get('window').width;
export const DEVICE_HEIGHT = Dimensions.get('window').height;

export const Colors = {
  primary: {
    DEFAULT: 'rgb(170, 55, 255)',
    light: 'rgb(214, 156, 255)',
  },
  secondary: {
    DEFAULT: '#4738ff',
    light: 'rgb(137, 128, 255)',
  },
  gray: {
    100: 'rgb(242, 242, 247)',
    200: 'rgb(229, 229, 234)',
    300: 'rgb(209, 209, 214)',
    400: 'rgb(199, 199, 204)',
    500: 'rgb(174, 174, 178)',
    DEFAULT: 'rgb(142, 142, 147)',
    600: 'rgb(99, 99, 102)',
    700: 'rgb(72, 72, 74)',
  },
  info: {
    DEFAULT:  '#2a97ff',
    light: '#2a97ff90'
  },
  warning: {DEFAULT: '#f6c343', light: '#f6c34390',},
  success: { DEFAULT: '#3cd278', light: '#3cd27890' },
  danger: { DEFAULT: '#ff3051', light: '#ff305190' },
  admin: {DEFAULT: 'rgb(0, 0, 0)', light: 'rgba(0, 0, 0, 0.5)'},
  black: '#000000',
  white: '#ffffff',
  opacity: {
    100: 'rgba(0, 0, 0, 0.1)'
  }
};

export const varStyle = {
  black: Colors.black,
  primary: Colors.primary.DEFAULT,
  primarySoft: Colors.primary.light,
  secondary: Colors.secondary.DEFAULT,
  secondarySoft: Colors.secondary.light,
  danger: Colors.danger.DEFAULT,
  dangerSoft: Colors.danger.light,
  info: Colors.info.DEFAULT,
  infoSoft: Colors.info.light,
  warning: Colors.warning.DEFAULT,
  warningSoft: Colors.warning.light,
  success: Colors.success.DEFAULT,
  successSoft: Colors.success.light,
  admin: Colors.admin.DEFAULT,
  adminSoft: Colors.admin.light,
  gray: Colors.gray.DEFAULT,
  gray100: Colors.gray[100],
  gray200: Colors.gray[200],
  gray300: Colors.gray[300],
  gray400: Colors.gray[400],
  gray500: Colors.gray[500],
  gray600: Colors.gray[600],
  gray700: Colors.gray[700],
  white: Colors.white,
  weightBold: 'bold' as const,
  weightMedium: '500' as const,
  weightRegular: 'normal' as const,
  weightLight: '300' as const,
  weightThin: '100' as const,
  defaultBorderRadius: 10,
};

export const COLOR_PALETTE = [
  {name: 'Primary', color: varStyle.primary},
  {name: 'PrimarySoft', color: varStyle.primarySoft},
  {name: 'Secondary', color: varStyle.secondary},
  {name: 'SecondarySoft', color: varStyle.secondarySoft},
  {name: 'Gray700', color: varStyle.gray700},
  {name: 'Gray600', color: varStyle.gray600},
  {name: 'Gray500', color: varStyle.gray500},
  {name: 'Gray400', color: varStyle.gray400},
  {name: 'Gray300', color: varStyle.gray300},
  {name: 'Gray200', color: varStyle.gray200},
  {name: 'Gray100', color: varStyle.gray100},
  {name: 'Gray', color: varStyle.gray},
  {name: 'Info', color: varStyle.info},
  {name: 'InfoSoft', color: varStyle.infoSoft},
  {name: 'Success', color: varStyle.success},
  {name: 'SuccessSoft', color: varStyle.successSoft},
  {name: 'Warning', color: varStyle.warning},
  {name: 'WarningSoft', color: varStyle.warningSoft},
  {name: 'Admin', color: varStyle.admin},
  {name: 'AdminSoft', color: varStyle.adminSoft},
  {name: 'Danger', color: varStyle.danger},
  {name: 'DangerSoft', color: varStyle.dangerSoft},
  {name: 'White', color: varStyle.white},
  {name: 'Black', color: varStyle.black},
  {name: 'Transparent', color: 'transparent'},
];

export const globalStyle = {
  bgPrimary: {
    backgroundColor: varStyle.primary,
  },
  bgPrimarySoft: {
    backgroundColor: varStyle.primarySoft,
  },
  bgSecondary: {
    backgroundColor: varStyle.secondary,
  },
  bgDanger: {
    backgroundColor: varStyle.danger,
  },
  bgSuccess: {
    backgroundColor: varStyle.success,
  },
  bgSuccessSoft: {
    backgroundColor: varStyle.successSoft,
  },
  bgWarning: {
    backgroundColor: varStyle.warning,
  },
  bgAdmin: {
    backgroundColor: varStyle.admin,
  },
  bgAdminSoft: {
    backgroundColor: varStyle.adminSoft,
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
  textAdmin: {
    color: varStyle.admin,
  },
  textAdminSoft: {
    color: varStyle.adminSoft,
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
  borderAdmin: {
    borderColor: varStyle.admin,
  },
  borderAdminSoft: {
    borderColor: varStyle.adminSoft,
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
};
