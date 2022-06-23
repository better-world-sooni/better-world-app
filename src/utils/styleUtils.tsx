import * as _ from 'lodash';
import {StyleSheet} from 'react-native';
import {varStyle} from 'src/modules/styles';

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
  {name: 'Info', color: varStyle.info},
  {name: 'InfoSoft', color: varStyle.infoSoft},
  {name: 'Success', color: varStyle.success},
  {name: 'SuccessSoft', color: varStyle.successSoft},
  {name: 'Warning', color: varStyle.warning},
  {name: 'WarningSoft', color: varStyle.warningSoft},
  {name: 'Danger', color: varStyle.danger},
  {name: 'DangerSoft', color: varStyle.dangerSoft},
  {name: 'White', color: varStyle.white},
  {name: 'Black', color: varStyle.black},
  {name: 'Transparent', color: 'transparent'},
];

const ACTIVE_PREFIX = 'a_';

export const getObjectName = obj => {
  return _.isString(obj) ? obj : Object.keys(obj)[0];
};

export const addIf = (ctx, obj, style) => {
  const {isActive, props, arr, key} = ctx;
  let propName = getObjectName(obj);
  if (isActive && props[ACTIVE_PREFIX + propName]) {
    propName = ACTIVE_PREFIX + propName;
  }
  const evalStyle = _.isFunction(style) ? style(props[propName]) : style;
  if (propName === key) {
    arr.push(evalStyle);
  }
  return propName === key;
};

const addIfPrefix = (ctx, propName: string, style) => {
  const {isActive, arr, key} = ctx;
  let prefix = propName;
  if (isActive && _.startsWith(key, ACTIVE_PREFIX + prefix)) {
    prefix = ACTIVE_PREFIX + propName;
  }
  if (_.startsWith(key, prefix)) {
    const postStr = key.substring(prefix.length);
    if (_.isEmpty(postStr)) {
      return false;
    }
    const n = _.toNumber(postStr);
    if (_.isNaN(n)) {
      return false;
    }
    arr.push(_.isFunction(style) ? style(n) : style);
    return true;
  }
  return false;
};

export const addStyles = (arr: Array<any>, style) => {
  if (style) {
    arr.push(StyleSheet.flatten(style));
  }
};

export const addLayoutStyles = (props, arr: Array<any>, key) => {
  const {
    isActive,
    absolute,
    relative,
    left,
    right,
    top,
    bottom,
    overflow,
    overflowVisible,
    overflowHidden,
    overflowScroll,
    zIndex,
    itemsCenter,
    itemsStretch,
    itemsStart,
    itemsEnd,
    justifyStart,
    justifyEnd,
    justifyCenter,
    justifyAround,
    justifyBetween,
    h,
    w,
    maxH,
    minH,
    maxW,
    minW,
    dflex,
    dnone,
    flex,
    flexColumn,
    flexRow,
    flexWrap,
    flexNoWrap,
    flexWrapReverse,
    m,
    ml,
    mr,
    mb,
    mt,
    mx,
    my,
    p,
    pl,
    pr,
    pb,
    pt,
    px,
    py,
    opacity,
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    blur,
  } = props;
  const ctx = {props, arr, key, isActive};

  // height & width
  if (addIf(ctx, {h}, v => ({height: v}))) {
    return;
  }
  if (addIf(ctx, {maxH}, v => ({maxHeight: v}))) {
    return;
  }
  if (addIf(ctx, {minH}, v => ({minHeight: v}))) {
    return;
  }
  if (addIf(ctx, {w}, v => ({width: w}))) {
    return;
  }
  if (addIf(ctx, {maxW}, v => ({maxWidth: maxW}))) {
    return;
  }
  if (addIf(ctx, {minW}, v => ({minWidth: minW}))) {
    return;
  }

  if (addIfPrefix(ctx, 'w', n => ({width: n}))) {
    return;
  }
  if (addIfPrefix(ctx, 'h', n => ({height: n}))) {
    return;
  }
  if (addIfPrefix(ctx, 'maxW', n => ({maxWidth: n}))) {
    return;
  }
  if (addIfPrefix(ctx, 'maxH', n => ({maxHeight: n}))) {
    return;
  }
  if (addIfPrefix(ctx, 'minW', n => ({maxWidth: n}))) {
    return;
  }
  if (addIfPrefix(ctx, 'minH', n => ({maxHeight: n}))) {
    return;
  }

  // layout
  if (addIf(ctx, {absolute}, v => ({position: 'absolute'}))) {
    return;
  }
  if (addIf(ctx, {relative}, v => ({position: 'relative'}))) {
    return;
  }
  if (addIf(ctx, {dflex}, v => ({display: 'flex'}))) {
    return;
  }
  if (addIf(ctx, {dnone}, v => ({display: 'none'}))) {
    return;
  }
  if (addIf(ctx, {zIndex}, v => ({zIndex: v}))) {
    return;
  }
  if (addIfPrefix(ctx, 'zIndex', n => ({zIndex: n}))) {
    return;
  }

  if (addIf(ctx, {left}, v => ({left: _.isBoolean(v) ? 0 : v}))) {
    return;
  }
  if (addIf(ctx, {right}, v => ({right: _.isBoolean(v) ? 0 : v}))) {
    return;
  }
  if (addIf(ctx, {top}, v => ({top: _.isBoolean(v) ? 0 : v}))) {
    return;
  }
  if (addIf(ctx, {bottom}, v => ({bottom: _.isBoolean(v) ? 0 : v}))) {
    return;
  }
  if (addIfPrefix(ctx, 'left', n => ({left: n}))) {
    return;
  }
  if (addIfPrefix(ctx, 'right', n => ({right: n}))) {
    return;
  }
  if (addIfPrefix(ctx, 'top', n => ({top: n}))) {
    return;
  }
  if (addIfPrefix(ctx, 'bottom', n => ({bottom: n}))) {
    return;
  }

  if (addIf(ctx, {flex}, v => ({flex: _.isNumber(v) ? v : 1}))) {
    return;
  }
  if (addIf(ctx, {flexRow}, v => ({flexDirection: 'row'}))) {
    return;
  }
  if (addIf(ctx, {flexColumn}, v => ({flexDirection: 'column'}))) {
    return;
  }
  if (addIf(ctx, {flexWrap}, v => ({flexWrap: 'wrap'}))) {
    return;
  }
  if (addIf(ctx, {flexNoWrap}, v => ({flexWrap: 'nowrap'}))) {
    return;
  }
  if (addIf(ctx, {flexWrapReverse}, v => ({flexWrap: 'wrap-reverse'}))) {
    return;
  }
  if (addIf(ctx, {overflow}, v => ({overflow: v}))) {
    return;
  }
  if (addIf(ctx, {overflowHidden}, v => ({overflow: 'hidden'}))) {
    return;
  }
  if (addIf(ctx, {overflowVisible}, v => ({overflow: 'visible'}))) {
    return;
  }
  if (addIf(ctx, {overflowScroll}, v => ({overflow: 'scroll'}))) {
    return;
  }
  if (addIf(ctx, {itemsStart}, v => ({alignItems: 'flex-start'}))) {
    return;
  }
  if (addIf(ctx, {itemsEnd}, v => ({alignItems: 'flex-end'}))) {
    return;
  }
  if (addIf(ctx, {itemsCenter}, v => ({alignItems: 'center'}))) {
    return;
  }
  if (addIf(ctx, {itemsStretch}, v => ({alignItems: 'stretch'}))) {
    return;
  }
  if (addIf(ctx, {justifyStart}, v => ({justifyContent: 'flex-start'}))) {
    return;
  }
  if (addIf(ctx, {justifyCenter}, v => ({justifyContent: 'center'}))) {
    return;
  }
  if (addIf(ctx, {justifyEnd}, v => ({justifyContent: 'flex-end'}))) {
    return;
  }
  if (
    addIf(ctx, {justifyBetween}, v => ({
      justifyContent: 'space-between',
    }))
  ) {
    return;
  }
  if (
    addIf(ctx, {justifyAround}, v => ({
      justifyContent: 'space-around',
    }))
  ) {
    return;
  }

  // margin & padding
  if (addIf(ctx, {m}, v => ({margin: v}))) {
    return;
  }
  if (addIf(ctx, {ml}, v => ({marginLeft: v}))) {
    return;
  }
  if (addIf(ctx, {mr}, v => ({marginRight: v}))) {
    return;
  }
  if (addIf(ctx, {mt}, v => ({marginTop: v}))) {
    return;
  }
  if (addIf(ctx, {mb}, v => ({marginBottom: v}))) {
    return;
  }
  if (addIf(ctx, {mx}, v => ({marginHorizontal: v}))) {
    return;
  }
  if (addIf(ctx, {my}, v => ({marginVertical: v}))) {
    return;
  }
  if (addIf(ctx, {p}, v => ({padding: v}))) {
    return;
  }
  if (addIf(ctx, {pl}, v => ({paddingLeft: v}))) {
    return;
  }
  if (addIf(ctx, {pr}, v => ({paddingRight: v}))) {
    return;
  }
  if (addIf(ctx, {pt}, v => ({paddingTop: v}))) {
    return;
  }
  if (addIf(ctx, {pb}, v => ({paddingBottom: v}))) {
    return;
  }
  if (addIf(ctx, {px}, v => ({paddingHorizontal: v}))) {
    return;
  }
  if (addIf(ctx, {py}, v => ({paddingVertical: v}))) {
    return;
  }

  if (addIfPrefix(ctx, 'm', n => ({margin: n}))) {
    return;
  }
  if (addIfPrefix(ctx, 'mt', n => ({marginTop: n}))) {
    return;
  }
  if (addIfPrefix(ctx, 'mb', n => ({marginBottom: n}))) {
    return;
  }
  if (addIfPrefix(ctx, 'ml', n => ({marginLeft: n}))) {
    return;
  }
  if (addIfPrefix(ctx, 'mr', n => ({marginRight: n}))) {
    return;
  }
  if (addIfPrefix(ctx, 'mx', n => ({marginHorizontal: n}))) {
    return;
  }
  if (addIfPrefix(ctx, 'my', n => ({marginVertical: n}))) {
    return;
  }
  if (addIfPrefix(ctx, 'p', n => ({padding: n}))) {
    return;
  }
  if (addIfPrefix(ctx, 'pt', n => ({paddingTop: n}))) {
    return;
  }
  if (addIfPrefix(ctx, 'pb', n => ({paddingBottom: n}))) {
    return;
  }
  if (addIfPrefix(ctx, 'pl', n => ({paddingLeft: n}))) {
    return;
  }
  if (addIfPrefix(ctx, 'pr', n => ({paddingRight: n}))) {
    return;
  }
  if (addIfPrefix(ctx, 'px', n => ({paddingHorizontal: n}))) {
    return;
  }
  if (addIfPrefix(ctx, 'py', n => ({paddingVertical: n}))) {
    return;
  }

  // opacity
  if (addIf(ctx, {opacity}, v => ({opacity: v}))) {
    return;
  }
  //shadow
  if (addIf(ctx, {shadowColor}, v => ({shadowColor: v}))) {
    return;
  }
  if (addIf(ctx, {shadowOffset}, v => ({shadowOffset: v}))) {
    return;
  }
  if (addIf(ctx, {shadowOpacity}, v => ({shadowOpacity: v}))) {
    return;
  }
  if (addIf(ctx, {shadowRadius}, v => ({shadowRadius: v}))) {
    return;
  }
};

export const addBorderStyles = (props, arr: Array<any>, key) => {
  const {
    isActive,
    borderColor,
    borderLeftColor,
    borderRightColor,
    borderTopColor,
    borderBottomColor,
    border,
    borderLeft,
    borderRight,
    borderTop,
    borderBottom,
    rounded,
    roundedTop,
    roundedTopLeft,
    roundedTopRight,
    roundedBottom,
    roundedBottomLeft,
    roundedBottomRight,
    roundedLeft,
    roundedRight,
    solid,
    dotted,
    dashed,
  } = props;
  const ctx = {props, arr, key, isActive};

  // border style
  if (addIf(ctx, {dotted}, v => ({borderStyle: 'dotted'}))) {
    return;
  }
  if (addIf(ctx, {solid}, v => ({borderStyle: 'solid'}))) {
    return;
  }
  if (addIf(ctx, {dashed}, v => ({borderStyle: 'dashed'}))) {
    return;
  }

  // border color
  if (addIf(ctx, {borderColor}, v => ({borderColor: v}))) {
    return;
  }
  if (addIf(ctx, {borderLeftColor}, v => ({borderLeftColor: v}))) {
    return;
  }
  if (addIf(ctx, {borderRightColor}, v => ({borderRightColor: v}))) {
    return;
  }
  if (addIf(ctx, {borderTopColor}, v => ({borderTopColor: v}))) {
    return;
  }
  if (addIf(ctx, {borderBottomColor}, v => ({borderBottomColor: v}))) {
    return;
  }
  COLOR_PALETTE.forEach(item => {
    addIf(ctx, `border${item.name}`, {borderColor: item.color});
    addIf(ctx, `borderLeft${item.name}`, {borderLeftColor: item.color});
    addIf(ctx, `borderRight${item.name}`, {borderRightColor: item.color});
    addIf(ctx, `borderTop${item.name}`, {borderTopColor: item.color});
    addIf(ctx, `borderBottom${item.name}`, {borderBottomColor: item.color});
  });
  // border radius
  if (
    addIf(ctx, {rounded}, v => ({
      borderRadius: _.isNumber(v) ? v : varStyle.defaultBorderRadius,
    }))
  ) {
    return;
  }
  if (
    addIf(ctx, {roundedTop}, v => ({
      borderTopLeftRadius: _.isNumber(v) ? v : varStyle.defaultBorderRadius,
      borderTopRightRadius: _.isNumber(v) ? v : varStyle.defaultBorderRadius,
    }))
  ) {
    return;
  }
  if (
    addIf(ctx, {roundedBottom}, v => ({
      borderBottomLeftRadius: _.isNumber(v) ? v : varStyle.defaultBorderRadius,
      borderBottomRightRadius: _.isNumber(v) ? v : varStyle.defaultBorderRadius,
    }))
  ) {
    return;
  }
  if (
    addIf(ctx, {roundedLeft}, v => ({
      borderTopLeftRadius: _.isNumber(v) ? v : varStyle.defaultBorderRadius,
      borderBottomLeftRadius: _.isNumber(v) ? v : varStyle.defaultBorderRadius,
    }))
  ) {
    return;
  }
  if (
    addIf(ctx, {roundedRight}, v => ({
      borderTopRightRadius: _.isNumber(v) ? v : varStyle.defaultBorderRadius,
      borderBottomRightRadius: _.isNumber(v) ? v : varStyle.defaultBorderRadius,
    }))
  ) {
    return;
  }
  if (
    addIf(ctx, {roundedTopLeft}, v => ({
      borderTopLeftRadius: _.isNumber(v) ? v : varStyle.defaultBorderRadius,
    }))
  ) {
    return;
  }
  if (
    addIf(ctx, {roundedTopRight}, v => ({
      borderTopRightRadius: _.isNumber(v) ? v : varStyle.defaultBorderRadius,
    }))
  ) {
    return;
  }
  if (
    addIf(ctx, {roundedBottomLeft}, v => ({
      borderBottomLetRadius: _.isNumber(v) ? v : varStyle.defaultBorderRadius,
    }))
  ) {
    return;
  }
  if (
    addIf(ctx, {roundedBottomRight}, v => ({
      borderBottomRightRadius: _.isNumber(v) ? v : varStyle.defaultBorderRadius,
    }))
  ) {
    return;
  }

  if (addIfPrefix(ctx, 'rounded', n => ({borderRadius: n}))) {
    return;
  }
  if (
    addIfPrefix(ctx, 'roundedTop', n => ({
      borderTopLeftRadius: n,
      borderTopRightRadius: n,
    }))
  ) {
    return;
  }
  if (
    addIfPrefix(ctx, 'roundedBottom', n => ({
      borderBottomLeftRadius: n,
      borderBottomRightRadius: n,
    }))
  ) {
    return;
  }
  if (
    addIfPrefix(ctx, 'roundedLeft', n => ({
      borderTopLeftRadius: n,
      borderBottomLeftRadius: n,
    }))
  ) {
    return;
  }
  if (
    addIfPrefix(ctx, 'roundedRight', n => ({
      borderTopRightRadius: n,
      borderBottomRightRadius: n,
    }))
  ) {
    return;
  }
  if (
    addIfPrefix(ctx, 'roundedTopLeft', n => ({
      borderTopLeftRadius: n,
    }))
  ) {
    return;
  }
  if (
    addIfPrefix(ctx, 'roundedTopRight', n => ({
      borderTopRightRadius: n,
    }))
  ) {
    return;
  }
  if (
    addIfPrefix(ctx, 'roundedBottomLeft', n => ({
      borderBottomLeftRadius: n,
    }))
  ) {
    return;
  }
  if (
    addIfPrefix(ctx, 'roundedBottomRight', n => ({
      borderBottomRightRadius: n,
    }))
  ) {
    return;
  }

  // border width
  if (addIf(ctx, {border}, v => ({borderWidth: _.isNumber(v) ? v : 1}))) {
    return;
  }
  if (
    addIf(ctx, {borderLeft}, v => ({
      borderLeftWidth: _.isNumber(v) ? v : 1,
    }))
  ) {
    return;
  }
  if (
    addIf(ctx, {borderRight}, v => ({
      borderRightWidth: _.isNumber(v) ? v : 1,
    }))
  ) {
    return;
  }
  if (
    addIf(ctx, {borderTop}, v => ({
      borderTopWidth: _.isNumber(v) ? v : 1,
    }))
  ) {
    return;
  }
  if (
    addIf(ctx, {borderBottom}, v => ({
      borderBottomWidth: _.isNumber(v) ? v : 1,
    }))
  ) {
    return;
  }

  if (addIfPrefix(ctx, 'border', n => ({borderWidth: n}))) {
    return;
  }
  if (addIfPrefix(ctx, 'borderLeft', n => ({borderLeftWidth: n}))) {
    return;
  }
  if (addIfPrefix(ctx, 'borderRight', n => ({borderRightWidth: n}))) {
    return;
  }
  if (addIfPrefix(ctx, 'borderTop', n => ({borderTopWidth: n}))) {
    return;
  }
  if (addIfPrefix(ctx, 'borderBottom', n => ({borderBottomWidth: n}))) {
    return;
  }
};

export const addBackgroundStyles = (props, arr: Array<any>, key) => {
  const {isActive, bg, bgColor} = props;

  const ctx = {props, arr, key, isActive};
  // bg
  if (addIf(ctx, {bg}, v => ({backgroundColor: v}))) {
    return;
  }
  if (addIf(ctx, {bgColor}, v => ({backgroundColor: v}))) {
    return;
  }
  COLOR_PALETTE.forEach(item => {
    addIf(ctx, `bg${item.name}`, {backgroundColor: item.color});
  });
  COLOR_PALETTE.forEach(item => {
    addIf(ctx, `bg${item.name}Alpha`, v => {
      const numStr = ('0' + v).slice(-2);
      return {backgroundColor: `${item.color}${numStr}`};
    });
  });
  COLOR_PALETTE.forEach(item => {
    addIfPrefix(ctx, `bg${item.name}Alpha`, n => {
      if (n >= 100) {
        return {backgroundColor: item.color};
      }
      const numStr = ('0' + n).slice(-2);
      return {
        backgroundColor: `${item.color}${numStr}`,
      };
    });
  });
};

export const addTextStyles = (props, arr: Array<any>, key) => {
  const {
    isActive,
    color,
    fontSize,
    italic,
    weight,
    bold,
    medium,
    regular,
    light,
    thin,
    alignCenter,
    alignLeft,
    alignRight,
    alignJustify,
    alignAuto,
    lineHeight,
    decoNone,
    underline,
    lineThrough,
    fontFamily,
    shadowOffset,
    shadowColor,
    shadowRadius,
    letterSpacing,
    uppercase,
    lowercase,
    capitalize,
  } = props;
  const ctx = {props, arr, key, isActive};

  if (addIf(ctx, {color}, v => ({color: v}))) {
    return;
  }
  if (addIf(ctx, {fontSize}, v => ({fontSize: v}))) {
    return;
  }
  if (addIf(ctx, {italic}, v => ({fontStyle: 'italic'}))) {
    return;
  }
  if (addIf(ctx, {weight}, v => ({fontWeight: v}))) {
    return;
  }
  if (addIf(ctx, {bold}, v => ({fontWeight: 'bold'}))) {
    return;
  }
  if (addIf(ctx, {medium}, v => ({fontWeight: varStyle.weightMedium}))) {
    return;
  }
  if (addIf(ctx, {regular}, v => ({fontWeight: varStyle.weightRegular}))) {
    return;
  }
  if (addIf(ctx, {light}, v => ({fontWeight: varStyle.weightLight}))) {
    return;
  }
  if (addIf(ctx, {thin}, v => ({fontWeight: varStyle.weightThin}))) {
    return;
  }
  if (addIf(ctx, {alignCenter}, v => ({textAlign: 'center'}))) {
    return;
  }
  if (addIf(ctx, {alignLeft}, v => ({textAlign: 'left'}))) {
    return;
  }
  if (addIf(ctx, {alignRight}, v => ({textAlign: 'right'}))) {
    return;
  }
  if (addIf(ctx, {alignJustify}, v => ({textAlign: 'justify'}))) {
    return;
  }
  if (addIf(ctx, {alignAuto}, v => ({textAlign: 'auto'}))) {
    return;
  }
  if (addIf(ctx, {lineHeight}, v => ({lineHeight: v}))) {
    return;
  }
  if (addIf(ctx, {decoNone}, v => ({textDecorationLine: 'none'}))) {
    return;
  }
  if (
    addIf(ctx, {underline}, v => ({
      textDecorationLine: lineThrough ? 'underline line-through' : 'underline',
    }))
  ) {
    return;
  }
  if (
    addIf(ctx, {lineThrough}, v => ({
      textDecorationLine: underline ? 'underline line-through' : 'line-through',
    }))
  ) {
    return;
  }
  if (addIf(ctx, {shadowOffset}, v => ({textShadowOffset: v}))) {
    return;
  }
  if (addIf(ctx, {shadowColor}, v => ({textShadowColor: v}))) {
    return;
  }
  if (addIf(ctx, {shadowRadius}, v => ({textShadowRadius: v}))) {
    return;
  }
  if (addIf(ctx, {fontFamily}, v => ({fontFamily: v}))) {
    return;
  }
  if (addIf(ctx, {letterSpacing}, v => ({letterSpacing: v}))) {
    return;
  }
  if (addIf(ctx, {uppercase}, v => ({textTransfrom: 'upepercase'}))) {
    return;
  }
  if (addIf(ctx, {lowercase}, v => ({textTransfrom: 'lowercase'}))) {
    return;
  }
  if (addIf(ctx, {capitalize}, v => ({textTransfrom: 'capitalize'}))) {
    return;
  }

  // color
  COLOR_PALETTE.forEach(item => {
    addIf(ctx, _.lowerFirst(item.name), {color: item.color});
  });
};

export const addImageStyles = (props, arr: Array<any>, key) => {
  const {
    isActive,
    resizeMode,
    resizeCover,
    resizeContain,
    resizeStretch,
    resizeRepeat,
    resizeCenter,
    tintColor,
    aspectRatio,
  } = props;
  const ctx = {isActive, props, arr, key};
  // bg
  if (addIf(ctx, {aspectRatio}, v => ({aspectRatio: v}))) {
    return;
  }
  if (addIf(ctx, {tintColor}, v => ({tintColor: v}))) {
    return;
  }
  COLOR_PALETTE.forEach(item => {
    addIf(ctx, `tint${item.name}`, {tintColor: item.color});
  });
};
