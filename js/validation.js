// validation.js

// Lifted from: http://developer.netscape.com/docs/examples/javascript/formval/FormChek.js
// See http://developer.netscape.com/docs/examples/javascript/formval/overview.html

var suffixes = 'MmKkGgBb%';
var whitespace = ' \t\n\r';
var decimalPointDelimiter = '.';
var defaultEmptyOK = false;
var emptyIsZero = false;

var LESS_THAN = 1;
var GREATER_THAN = 2;
var LESS_THAN_OR_EQUAL_TO = 3;
var GREATER_THAN_OR_EQUAL_TO = 4;

// special var to hold RegEx expression, should be overwritten by local page after this js file loads.
// regex for these are made by the engine and engine load.
var isInteger_RegEx = '^[0-9]{1,}$';
var isSignedInteger_RegEx = '^[+\-]{0,1}[0-9]{1,}$';
var isFloat_RegEx = '^[0-9]{1,}[\.]{0,1}[0-9]{0,}$';
var isSignedFloat_RegEx = '^[+\-]{0,1}[0-9]{1,}[\.]{0,1}[0-9]{0,}$';

var unformatNumber_RegEx = '/\\$|\ /g';
// number suffix abreviations
var sfx_Pico = 'p';
var sfx_Nano = 'n';
var sfx_Micro = 'u';
var sfx_Mili = 'm';
var sfx_Thousand = 'K';
var sfx_Million = 'M';
var sfx_Billion = 'B';
var sfx_Trillion = 'T';

// Remove Number currency formatting leaders and trailers
function unformatNumber(s) {
  var rxInt = new RegExp(unformatNumber_RegEx);
  var str = s.toString();
  return str.replace(rxInt, '').toString();
}

function isDigit(c) { return ((c >= '0') && (c <= '9')) }
function isEmpty(s) { return ((s == null) || (s.length == 0)); }
function isWhitespace(s)
{
  if (typeof s == 'object') { s = s.value; }
  var i;

  // Is s empty?
  if (isEmpty(s)) return true;

  // Search through string's characters one by one
  // until we find a non-whitespace character.
  // When we do, return false; if we don't, return true.

  for (i = 0; i < s.length; i++)
  {
    // Check that current character isn't whitespace.
    var c = s.charAt(i);

    if (whitespace.indexOf(c) == -1) return false;
  }

  // All characters are whitespace.
  return true;
}

// isInteger (STRING s [, BOOLEAN emptyOK])
//
// Returns true if all characters in string s are numbers.
//
// Accepts non-signed integers only. Does not accept floating
// point, exponential notation, etc.
//
// We don't use parseInt because that would accept a string
// with trailing non-numeric characters.
//
// By default, returns defaultEmptyOK if s is empty.
// There is an optional second argument called emptyOK.
// emptyOK is used to override for a single function call
//      the default behavior which is specified globally by
//      defaultEmptyOK.
// If emptyOK is false (or any value other than true),
//      the function will return false if s is empty.
// If emptyOK is true, the function will return true if s is empty.
//
// EXAMPLE FUNCTION CALL:     RESULT:
// isInteger ("5")            true
// isInteger ("")             defaultEmptyOK
// isInteger ("-5")           false
// isInteger ("", true)       true
// isInteger ("", false)      false
// isInteger ("5", false)     true

function isInteger(s)
{
  if (typeof s == 'object') { s = s.value; }
  var i;
  if (isEmpty(s)) {
    if (isInteger.arguments.length == 1) return defaultEmptyOK;
    else return (isInteger.arguments[1] == true);
  }
  var rxInt = new RegExp(isInteger_RegEx);
  return rxInt.test(parseNumeric(s));
}

// isSignedInteger (STRING s [, BOOLEAN emptyOK])
//
// Returns true if all characters are numbers;
// first character is allowed to be + or - as well.
//
// Does not accept floating point, exponential notation, etc.
//
// We don't use parseInt because that would accept a string
// with trailing non-numeric characters.
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.
//
// EXAMPLE FUNCTION CALL:          RESULT:
// isSignedInteger ("5")           true
// isSignedInteger ("")            defaultEmptyOK
// isSignedInteger ("-5")          true
// isSignedInteger ("+5")          true
// isSignedInteger ("", false)     false
// isSignedInteger ("", true)      true

function isSignedInteger(s)
{
  if (typeof s == 'object') { s = s.value; }
  if (isEmpty(s)) {
    if (isSignedInteger.arguments.length == 1) return defaultEmptyOK;
    else return (isSignedInteger.arguments[1] == true);
  }
  var rxInt = new RegExp(isSignedInteger_RegEx);
  return rxInt.test(parseNumeric(s));
}

function isFloat(s)
{
  if (typeof s == 'object') { s = s.value; }
  if (isEmpty(s)) {
    if (isFloat.arguments.length == 1) return defaultEmptyOK;
    else return (isFloat.arguments[1] == true);
  }
  var rxInt = new RegExp(isFloat_RegEx);
  return rxInt.test(parseNumeric(s));
}

// isSignedFloat (STRING s [, BOOLEAN emptyOK])
//
// True if string s is a signed or unsigned floating point
// (real) number. First character is allowed to be + or -.
//
// Also returns true for unsigned integers. If you wish
// to distinguish between integers and floating point numbers,
// first call isSignedInteger, then call isSignedFloat.
//
// Does not accept exponential notation.
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.

function isSignedFloat(s)
{
  if (typeof s == 'object') { s = s.value; }
  if (isEmpty(s.trim())) {
    if (emptyIsZero) return true;
    if (isSignedFloat.arguments.length == 1) return defaultEmptyOK;
    else return (isSignedFloat.arguments[1] == true);
  }
  var rxInt = new RegExp(isSignedFloat_RegEx);
  return rxInt.test(parseNumeric(s));
}

function isIntegerInRange(s, a, b)
{
  if (typeof s == 'object') { s = s.value; }
  if (isEmpty(s)) {
    if (isIntegerInRange.arguments.length == 1) return defaultEmptyOK;
    else return (isIntegerInRange.arguments[1] == true);
  }

  // Catch non-integer strings to avoid creating a NaN below,
  // which isn't available on JavaScript 1.0 for Windows.
  if (!isInteger(s, false)) return false;

  // Now, explicitly change the type to integer via parseInt
  // so that the comparison code below will work both on
  // JavaScript 1.2 (which typechecks in equality comparisons)
  // and JavaScript 1.1 and before (which doesn't).
  var num = parseInt(s);
  return ((num >= a) && (num <= b));
}

function isFloatInRange(s, a, b)
{
  if (typeof s == 'object') { s = s.value; }
  if (typeof a == 'object') { a = a.value; }
  if (typeof b == 'object') { b = b.value; }
  if (isEmpty(s)) {
    if (isFloatInRange.arguments.length == 1) return defaultEmptyOK;
    else return (isFloatInRange.arguments[1] == true);
  }
  // Catch non-integer strings to avoid creating a NaN below,
  // which isn't available on JavaScript 1.0 for Windows.
  if (!isSignedFloat(s, false)) return false;
  if (!isSignedFloat(a, false)) return false;
  if (!isSignedFloat(b, false)) return false;

  // Now, explicitly change the type to float via parseFloat
  // so that the comparison code below will work both on
  // JavaScript 1.2 (which typechecks in equality comparisons)
  // and JavaScript 1.1 and before (which doesn't).
  var num = parseNumeric(s);
  return ((num >= parseNumeric(a)) && (num <= parseNumeric(b)));
}

function isRelative(s, test, val)
{
  if (typeof s == 'object') { s = s.value; }
  if (!isSignedFloat(s, false)) return false;
  if (!isSignedFloat(val, false)) return false;
  var num = parseNumeric(s);
  var v = parseNumeric(val);
  if (test == GREATER_THAN)
    return (num > v);
  else if (test == LESS_THAN)
    return (num < v);
  else if (test == LESS_THAN_OR_EQUAL_TO)
    return (num <= v);
  else if (test == GREATER_THAN_OR_EQUAL_TO)
    return (num >= v);
  else
    return false;
}

function isInf(fld)
{
  var val = fld.value;
  if (val != null)
    return (val.toLowerCase() == 'inf');
  else
    return false;
}

// Expand numeric suffix and remove formatting
function parseNumeric(s)
{
  if (typeof s == 'object') { s = s.value; }
  var v = unformatNumber(s.toString());
  if (typeof v == 'object') { v = v.value; }

  var c = v.charAt(v.length - 1);
  if (typeof c == 'object') { c = c.value; }

  var r = v.substring(0, v.length - (c.length - 1));
  if (typeof r == 'object') { r = r.value; }

  var factor;
  if (c == '.')
    factor = parseFloat(1);
  else if (c == '\%')
    factor = parseFloat(0.01);
  else if (c == sfx_Pico.toLowerCase() || c == sfx_Pico.toUpperCase())
    factor = parseFloat(0.000000000001);
  else if (c == sfx_Nano.toLowerCase() || c == sfx_Nano.toUpperCase())
    factor = parseFloat(0.000000001);
  else if (c == sfx_Micro.toLowerCase() || c == sfx_Micro.toUpperCase())
    factor = parseFloat(0.000001);
  else if (c == sfx_Mili)
    factor = parseFloat(0.001);
  else if (c == sfx_Thousand.toUpperCase() || c == sfx_Thousand.toLowerCase())
    factor = parseFloat(1000);
  else if (c == sfx_Million)
    factor = parseFloat(1000000);
  else if (c == 'G' || c == 'g' || c == sfx_Billion.toUpperCase() || c == sfx_Billion.toLowerCase())
    factor = parseFloat(1000000000);
  else if (c == sfx_Trillion.toUpperCase() || c == sfx_Trillion.toLowerCase())
    factor = parseFloat(1000000000000);
  else if (isDigit(c) || c == ' ' || c.length == 0) {
    factor = parseFloat(1);
    r = v;
  }
  else {
    return NaN;
  }
  var num = parseFloat(r);

  return num * factor;
}

// Parse a string and see if a date number can be coherced
function isDate(s) {
  var dt = Date.parse(s);
  return (dt > 0);
}

// Named Validators for Forms with DataType Attributes
function ValidateIntegerField(iObj,dispName) {
  var i = iObj.value;
  if (!isInteger(i) && (iObj.value.length > 0)) {
    alert("Entry for '" + dispName + "' must be an Integer");
    document.getElementById(iObj.attributes('id').value).focus();
    setTimeout('document.getElementById("' + iObj.id + '").focus()', 150);
    return false;
  }
  if (isNaN(parseNumeric(iObj.value))) {
    iObj.value = '';
  } else {
    iObj.value = parseNumeric(iObj.value);
  }
  return true;
}

function ValidateDoubleField(iObj,dispName) {
  var i = iObj.value;
  if (!isFloat(i) && (iObj.value.length > 0)) {
    alert("Entry for '" + dispName + "' must be a Decimal");
    document.getElementById(iObj.attributes('id').value).focus();
    setTimeout('document.getElementById("' + iObj.id + '").focus()', 150);
    return false;
  }

  if (isNaN(parseNumeric(iObj.value))) {
    iObj.value = '';
  } else {
    iObj.value = parseNumeric(iObj.value);
  }
  return true;
}


function ValidateDateField(iObj,dispName) {
  var i = iObj.value;
  if (!isDate(i) && (iObj.value.length > 0)) {
    alert("Entry for '" + dispName + "' must be a Date");
    document.getElementById(iObj.attributes('id').value).focus();
    setTimeout('document.getElementById("' + iObj.id + '").focus()', 150);
    return false;
  }
  return true;
}
