/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
import unitlessNumbers from './unitlessNumbers';
import normalizeColor from './normalizeColor';
var colorProps = {
  backgroundColor: true,
  borderColor: true,
  borderTopColor: true,
  borderRightColor: true,
  borderBottomColor: true,
  borderLeftColor: true,
  color: true,
  shadowColor: true,
  textDecorationColor: true,
  textShadowColor: true
};
export default function normalizeValueWithProperty(value, property) {
  var returnValue = value;

  if ((property === "translateX" || property === "translateY") && typeof value === 'number') {
    returnValue = value + "px";
  }
  else if ((property == null || !unitlessNumbers[property]) && typeof value === 'number') {
    returnValue = value / 16 + "rem";
  } else if (property != null && colorProps[property]) {
    returnValue = normalizeColor(value);
  }

  return returnValue;
}