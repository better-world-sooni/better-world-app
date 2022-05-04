const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  primary: {
    DEFAULT: 'rgb(25, 110, 237)',
    light: 'rgba(25, 110, 237, 0.1)',
  },
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
  gray: {
    DEFAULT: 'rgb(142, 142, 147)',
    100: 'rgb(242, 242, 247)',
    200: 'rgb(209, 209, 214)',
    300: 'rgb(174, 174, 178)',
    400: 'rgb(142, 142, 147)',
    500: 'rgb(99, 99, 102)',
    600: 'rgb(58, 58, 60)',
    700: 'rgb(28, 28, 30)',
  },
  success: { DEFAULT: '#3cd278', light: 'rgba(60, 210, 120, 0.1)' },
  danger: { DEFAULT: '#ff3051', light: 'rgba(255, 48, 81, 0.1)' },
};
