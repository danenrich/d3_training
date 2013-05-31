

String.prototype.pad = function(l, s, t) {
  return s || (s = ' '), (l -= this.length) > 0 ? (s = new Array(Math.ceil(l / s.length)
    + 1).join(s)).substr(0, t = !t ? l : t == 1 ? 0 : Math.ceil(l / 2))
    + this + s.substr(0, l - t) : this;
};


function isHex(arg) {
  if (arg == null) {
    return false;
  }
  //  48 - 57  #
  if (arg >= 48 && arg <= 57) {
    return true;
  }
  //  65 - 70 A
  if (arg >= 65 && arg <= 70) {
    return true;
  }
  //  97 - 102 a
  if (arg >= 97 && arg <= 102) {
    return true;
  }
  return false;
}


String.prototype.isHex = function(arg) {
  if (arg == null) {
    return false;
  }
  //  48 - 57  #
  if (arg >= 48 && arg <= 57) {
    return true;
  }
  //  65 - 70 A
  if (arg >= 65 && arg <= 70) {
    return true;
  }
  //  97 - 102 a
  if (arg >= 97 && arg <= 102) {
    return true;
  }
  return false;
};

String.prototype.isHex = function() {
  if (String.value == null) {
    return false;
  }
  //  48 - 57  #
  if (String.value >= 48 && String.value <= 57) {
    return true;
  }
  //  65 - 70 A
  if (String.value >= 65 && String.value <= 70) {
    return true;
  }
  //  97 - 102 a
  if (String.value >= 97 && String.value <= 102) {
    return true;
  }
  return false;
};

String.prototype.trim = function() {
  return this.replace(/^\s+|\s+$/g, '');
};

String.prototype.ltrim = function() {
  return this.replace(/^\s+/, '');
};

String.prototype.rtrim = function() {
  return this.replace(/\s+$/, '');
};

String.prototype.toCapitalCase = function() {
  var re = /\s/;
  var words = this.split(re);
  re = /(\S)(\S+)/;
  for (i = words.length - 1; i >= 0; i--) {
    re.exec(words[i]);
    words[i] = RegExp.$1.toUpperCase()
   + RegExp.$2.toLowerCase();
  }
  return words.join(' ');
};

String.prototype.endsWith = function(str) {
  var lastIndex = this.lastIndexOf(str);
  return (lastIndex != -1) && (lastIndex + str.length == this.length);
};
String.prototype.startsWith = function(str) {
  return this.indexOf(str) === 0;
};


