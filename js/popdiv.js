// popdiv.js
// Javascript routines to handle popup DIV
// $File: //dev/EPS/js/popdiv.js $
// $DateTime: 2012/03/26 16:43:36 $
// $Revision: #22 $
// $Author: matt $


function HideLoadingDiv(s)
{
  var fld = null;
  if (top.document.getElementById('load1')) {
    fld = top.document.getElementById('load1');
  } else {
    if (top.header) {
      fld = top.header.document.getElementById('load1');
    }
  }
  if (fld) fld.style.display = 'none';
}

function HideLoadingDiv2()
{
  if (top.document.getElementById('load2')) {
    fld = top.document.getElementById('load2');
  } else {
    fld = top.header.document.getElementById('load2');
  }
  if (fld) fld.style.display = 'none';
}

function ShowLoadingDiv(s)

{
  if (typeof top.document == 'object') {
    if (top.document.getElementById('load1')) {
      fld = top.document.getElementById('load1');
    } else {
      fld = top.header.document.getElementById('load1');
    }
    fld.style.display = '';

    if (top.document.getElementById('loadtext')) {
      fld = top.document.getElementById('loadtext');
    } else {
      fld = top.header.document.getElementById('loadtext');
    }
    fld.firstChild.nodeValue = s;
  }
}

function ShowLoadingDiv2(s)
{
  if (typeof top.document == 'object') {
    if (top.document.getElementById('load2')) {
      fld = top.document.getElementById('load2');
    } else {
      fld = top.header.document.getElementById('load2');
    }
    fld.style.display = '';

    if (top.document.getElementById('loadtext2')) {
      fld = top.document.getElementById('loadtext2');
    } else {
      fld = top.header.document.getElementById('loadtext2');
    }
    fld.firstChild.nodeValue = s;
  }
}

function ShowLoadingDivXHTML(s)

{
  if (typeof top.document == 'object') {
    if (top.document.getElementById('load1')) {
      fld = top.document.getElementById('load1');
    } else {
      fld = top.header.document.getElementById('load1');
    }
    fld.style.display = '';
    if (s.length > 100) {
      fld.style.width = '500px';
    } else if (s.length > 50) {
      fld.style.width = '400px';
    } else {
      fld.style.width = '260px';
    }
    //fld.className = 'xhtml_div';
    if (top.document.getElementById('loadtext')) {
      fld = top.document.getElementById('loadtext');
    } else {
      fld = top.header.document.getElementById('loadtext');
    }
    fld.className = 'xhtml_div';
    fld.innerHTML = s;
  }
}

function ShowLoadingDivXHTML2(s)

{
  if (typeof top.document == 'object') {
    if (top.document.getElementById('load2')) {
      fld = top.document.getElementById('load2');
    } else {
      fld = top.header.document.getElementById('load2');
    }
    fld.style.display = '';
    if (top.document.getElementById('loadtext2')) {
      fld = top.document.getElementById('loadtext2');
    } else {
      fld = top.header.document.getElementById('loadtext2');
    }
    fld.innerHTML = s;
  }
}

function WriteLoadingDiv()
{
  document.write("<div id='maincont'><div id='load1' style='display:none'>");
  document.write("<b class='lb1'></b><b class='lb2'></b><b class='lb3'></b><b class='lb4'></b><b class='lb5'></b><b class='lb6'></b><b class='lb7'></b>");
  document.write("<div class='lbox'>");
  document.write("<span id='loadtext'>Loading...</span></div>");
  document.write("<b class='lb7'></b><b class='lb6'></b><b class='lb5'></b><b class='lb4'></b><b class='lb3'></b><b class='lb2'></b><b class='lb1'></b>");
  document.write('</div></div>');
}

// second loading div - off-set to the right
function WriteLoadingDiv2()
{
  document.write("<div id='maincont2'><div id='load2' style='display:none'>");
  document.write("<b class='lb21'></b><b class='lb22'></b><b class='lb23'></b><b class='lb24'></b><b class='lb25'></b><b class='lb26'></b><b class='lb27'></b>");
  document.write("<div class='lbox2'>");
  document.write("<span id='loadtext2'>Loading...</span></div>");
  document.write("<b class='lb27'></b><b class='lb26'></b><b class='lb25'></b><b class='lb24'></b><b class='lb23'></b><b class='lb22'></b><b class='lb21'></b>");
  document.write('</div></div>');
}


function Trim(str)
{
  while (str.charAt(0) == (' '))
  {
    str = str.substring(1);
  }
  while (str.charAt(str.length - 1) == ' ')
  {
    str = str.substring(0, str.length - 1);
  }
  return str;
}

String.prototype.truncate = function(to_len, smart)
    {
  /*
  SmartTruncate routine take a string and truncate its width:
   - to_len: length to truncate to.
   - Set smart = true:  prevent truncating inside a word.
   - Set smart = false: truncate to the length of to_len.
 */
  var reducedStr;
  if (smart) {
    var words = this.split(' ');
    var numWords = words.length;
    var output = [];
    var ol, cWord, w;
    ol = 0;
    for (w = 0; w < numWords; ++w)
    {
      cWord = words[w];
      cwl = cWord.length;
      if ((ol + cwl) <= to_len)
      {
        output.push(cWord);
        ol += cwl + 1;
      }
      else break;
    }

    reducedStr = output.join(' ');
  }
  else {

    reducedStr = this.substring(0, to_len);
  }

  return reducedStr;
};

function ValidateName(fldname, fld)
{
  var orgName = Trim(fld.value);
  var validName = orgName;
  var bad = '#\&\"\\';
  var re = new RegExp(/[\#&\"\\]/g);
  if (re.test(orgName)) {
    alert(fldname + ' contains illegal character: ' + bad);
    validName = null;
  }
  else if (orgName.length == 0) {
    alert(fldname + ' cannot be null');
    validName = null;
  }
  else if (orgName.length > 64) {
    if (confirm(fldname + ' is longer than the maximum length (64). Press Cancel to re-enter the name or press OK to truncate the entered name to allowable length. Accept?')) {
      // var smart = true;
      validName = orgName.substring(0, 63);
      fld.value = validName;
    }
    else {
      validName = null;
    }
  }
  return validName;
}

function CleanName(varname)
{
  varname = varname.replace(/[\f\n\r\t\v]|\s$/g, '');
  return varname;
}


function doselectAllng(theBox) {
  var xState = true;
  var eName, eID;
  var vName = '';

  xState = theBox.checked;

  for (i = 0; document.form1.elements[i]; i++) {

    eName = document.form1.elements[i].name;
    eID = document.form1.elements[i].id;

    if (isIE() != true) {
      // {Matt} The following code is a trick to fix problem on NON-IE browsers
      if (typeof document.form1.elements[i] == 'object') {
        document.form1.elements[i] = document.form1.elements[i].value;
      }
    }

    if (eName == 'check') {
      document.form1.elements[i].checked = xState;
    }

    if (eName.indexOf('_id') >= 0 && startsWith(eID, 'id') == true) {
      document.form1.elements[i].value = (xState) ? 1 : 0;
      vName = eName.substr(0, eName.indexOf('_id'));
      fch(document.form1.elements[i], false, vName);
    }
  }
}

function startsWith(str, startW) {
  return (str.match('^' + startW) == startW);
}



