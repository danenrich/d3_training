// varinput.js
// Javascript routines to handle variable rendering
// $Id: //dev/EPS/js/varinput.js#48 $

function inspect()
{
  form1.xml.value = '1';
  SubmitFormSpecial('table');
}

// global variable used for items that submit on change or selection
var autosubmit = '';
var autopublish = '';
var workspaceByPass = false;

function valueChanged(ident) {
  var theField = document.getElementById('form1').variablechanged;
  if (theField != null) {
    theField.value = (theField.value == '') ? ',' + ident + ',' : (theField.value.indexOf(',' + ident + ',') > -1) ? theField.value : theField.value + ident + ',';
    if (autopublish.indexOf(',' + ident + ',') > -1 && autosubmitting == 0) {
      bypass_comment = 1; autosubmitting = 1;
      document.form1.pubPress.value = 'pubPress';
      document.form1.autopubvar.value = ident;
      PreSubmit('autopublish');
    }
    else if (autosubmit.indexOf(',' + ident + ',') > -1 && autosubmitting == 0) {
      bypass_comment = 1; autosubmitting = 1;
      document.form1.subPress.value = 'subPress';
      if (workspaceByPass == true) {
        document.form1.bypassPress.value = 'bypassPress';
      }
      PreSubmit();
    }
  }
}

function valueUnChanged(ident) {
  var theField = document.getElementById('form1').variablechanged;
  if (theField != null) {
    if (theField.value.indexOf(ident + ',') > -1) {
      theField.value = theField.value.replace(ident + ',', '');
    }
  }
}

function processCmt(obj, ident) {
  obj.value = obj.value.substring(0, 1999);
  var theField = document.getElementById('form1').commentchanged;
  theField.value = (theField.value == '') ? ',' + ident + ',' : (theField.value.indexOf(',' + ident + ',') > -1) ? theField.value : theField.value + ident + ',';
  valueChanged(ident);
}

function addAutosubmit(ident) {
  autosubmit = ((autosubmit == '') ? ',' + ident + ',' : autosubmit + ident + ',');
}

function hasAutoSubmit(ident) {
  return (autosubmit.indexOf(',' + ident + ',') > -1);
}

function addAutoPublish(ident) {
  autopublish = ((autopublish == '') ? ',' + ident + ',' : autopublish + ident + ',');
}


function hasVariableChanged() { return (document.getElementById('form1').variablechanged.value.length > 1); }
function hasCommentChanged() { return (document.getElementById('form1').commentchanged.value.length > 1); }
function keyPressed(f,e, acceptEnter)  // can use as form or field handler
{
  var keycode;
  if (window.event) keycode = window.event.keyCode;
  else if (e) keycode = e.which;
  else return true;
  if (keycode == 13)
    return acceptEnter;
  else
    return true;
}


function SubmitFormSpecial(s, s2) {
  var form1 = document.getElementById('form1');
  if (s2 != null) {
    if (s2 == 'table_image')
      form1.table_image.value = 'true';
  }
  form1.act.value = s;
  form1.submit();
}
function SubmitFormSpecialLarge(s,v) {
  var form1 = document.getElementById('form1');
  form1.act.value = s;
  form1.sview.value = v;
  form1.submit();
  form1.act.value = '';
  form1.sview.value = '';
}

function SubmitFormAndExcel() {
  var form1 = document.getElementById('form1');
  form1.act.value = 'Excel';
  form1.submit();
  form1.act.value = '';
  form1.sview.value = '';
}

function ExcelandRestore(s, isPortForm, varMode) {
  var form1 = document.getElementById('form1');
  var formType = 'proj';

  if (isPortForm == 'true') { formType = 'port'; }
  if (varMode != 'output') { varMode = 'input'; }

  var aspxPage = formType + varMode + '.aspx?var=';

  form1.target = 'excel';
  var oldact = form1.action;
  form1.action = aspxPage + s + oldact.substring(oldact.indexOf('&')).replace(/var=(\w+)&/, '');
  form1.act.value = 'Excel';
  form1.submit();
  form1.target = '_self';
  form1.act.value = '';
  form1.action = oldact;
}


function SubmitFormSpecialWithMenus(s) {
  var d = new Date(), form1 = document.getElementById('form1');
  var wName = d.getUTCSeconds() + '_' + d.getUTCMinutes() + '_';   //Create a unique name for the window
  window.open('about:blank', wName, 'toolbar=yes,location=no,directories=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes,copyhistory=no,width=850,height=700');
  form1.target = wName;
  form1.act.value = s;
  form1.submit();
  form1.target = '_self';
  form1.act.value = '';
}

function ReturnComment() {
  PostSubmit();
}

function SubmitFormSpecialOnValue(field,s) {
  if (field.value.length > 0) {
    SubmitFormSpecial(s);
    field.selectedIndex = 0;
  }
}

function currTime() {
  var now = new Date();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();
  var timeValue = '' + ((hours > 12) ? hours - 12 : hours);
  if (timeValue == '0') timeValue = 12;
  timeValue += ((minutes < 10) ? ':0' : ':') + minutes;
  timeValue += ((seconds < 10) ? ':0' : ':') + seconds;
  timeValue += (hours >= 12) ? ' PM' : ' AM';
  return timeValue;
}


function showHandle() {
  if (showHandleFlag == 0) {
    showHandleFlag = 1;
    $('img.frameHandle').show();
    setTimeout("$('img.frameHandle').hide(); showHandleFlag=0;", 2600);
  }
}

function frameResize() {
  if (window.parent.document.getElementById('fs2').getAttribute('cols') == '200,*') {
    window.parent.document.getElementById('fs2').setAttribute('cols', '0,*');
    $('img.frameHandle').attr('src', 'images/dbl_r.gif').attr('alt', 'Restore the navigation bar').attr('title', 'Restore the navigation bar');
  } else {
    window.parent.document.getElementById('fs2').setAttribute('cols', '200,*');
    $('img.frameHandle').attr('src', 'images/dbl_l.gif').attr('alt', 'Minimize the navigation bar').attr('title', 'Minimize the navigation bar');
  }
}

function bindEvents() {
  var justFocused;

  $('.epsgrid input').mouseup(function(e) {if (justFocused == 1) {e.preventDefault(); justFocused = 0;} });

  $('.epsgrid input[type!="checkbox"]').focus(function() {
    origVals[this.name] = this.value;
    this.select();
    justFocused = 1;
    setTimeout('justFocused = 0', 50);
  }).blur(function() {
    resizeCol(this);
  }).keydown(function(e) {
    return InputKeyPress(this, e);
  }).keypress(function(e) {
    return keyPressed(this, e, false);
  }).change(function() {
    fch(this, true, this.id.substring(0, this.id.lastIndexOf('_id')));
  });

}

//          LEAVE AT BOTTOM OF JS FILE          //
// special jQuery to paint events onto inputs   //
var showHandleFlag;
showHandleFlag = 0;

if (typeof jQuery != 'undefined') {
  $(document).ready(function() {

    setTimeout('bindEvents()', 1);

    $('.epsvar').change(function() {
      var cmdStr;
      cmdStr = 'validate_' + $(this).attr('vname') + "($('#valueField_" + $(this).attr('vname') + "').val(),'" + $(this).attr('orig_value') + "',true)";
      setTimeout(cmdStr, 1);
    });

    var textValue;
    $('textarea.expanding').each(function() {

      textValue = $(this).text();

      while (textValue.indexOf('**br**') != -1) {
        textValue = textValue.replace('**br**', '\n');
      }
      $(this).val(textValue);
    });

    $('textarea.expanding').autogrow();

    if (window.parent.document.getElementById('fs2')) {
      $('body').mousemove(function(e) {
        if (e.pageX < 50 && e.pageY < 50) showHandle();
      }).append('<img class="frameHandle" src="images/dbl_l.gif"/>');

      $('img.frameHandle').bind('click', function() {frameResize()});

      if (window.parent.document.getElementById('fs2').getAttribute('cols') == '0,*') {
        $('img.frameHandle').attr('src', 'images/dbl_r.gif');
        $('img.frameHandle').attr('alt', 'Restore the navigation bar');
        $('img.frameHandle').attr('title', 'Restore the navigation bar');
      } else {
        $('img.frameHandle').attr('src', 'images/dbl_l.gif').attr('alt', 'Minimize the navigation bar').attr('title', 'Minimize the navigation bar');
      }
    }
  });
}
function openShortcutNode(aspxfile, sc_tid,  sc_pid,  sc_var, formcls)
{
  var urlStr;

  urlStr = aspxfile + '?' + 'tempid=' + sc_tid + '\&modelid=' + sc_pid + '\&var=' + sc_var + '\&form_class=' + formcls;
  urlStr = urlStr + '\&shortcut_popup=true';

  window.open(urlStr, 'shortcut_popup', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=650,height=550');

  /*
// TODO: thread this into comment and form submit logic
//  fixup close button not working
 $("#shortcutdiv").load(urlStr).dialog(
  { autoOpen: false ,
   modal:true,
   height: 650,
   width: 800,
   buttons: [ {text: "Cancel",
         click: function() { $(this).dialog("close"); alert('closing'); }
         },
         { text: "Submit",
           click: function() { var thisForm = $("#shortcutdiv form"); thisForm.submit(); }
         }
        ]
  }
 );
  $("#shortcutdiv").dialog("open");
  */

}

