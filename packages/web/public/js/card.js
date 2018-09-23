/* eslint-disable */

//*****************************************************************************
// Do not remove this notice.
//
// Copyright 2001 by Mike Hall.
// See http://www.brainjar.com for terms of use.                                                                        *
//*****************************************************************************

var minSize = 8;

function resizeCards(d) {
  var n;

  // Change the font size on the "card" style class.

  // DOM-compliant browsers.

  if (document.styleSheets[1].cssRules) {
    n = parseInt(document.styleSheets[1].cssRules[0].style.fontSize, 10);
    document.styleSheets[1].cssRules[0].style.fontSize =
      Math.max(n + d, minSize) + "pt";

    // For NS 6.1, insert a dummy rule to force styles to be reapplied.

    if (navigator.userAgent.indexOf("Netscape6/6.1") >= 0) {
      document.styleSheets[1].insertRule(
        null,
        document.styleSheets[1].cssRules.length
      );
    }
  } else if (document.styleSheets[1].rules[0]) {
    // IE browsers.

    n = parseInt(document.styleSheets[1].rules[0].style.fontSize, 10);
    document.styleSheets[1].rules[0].style.fontSize =
      Math.max(n + d, minSize) + "pt";
  }

  return false;
}
