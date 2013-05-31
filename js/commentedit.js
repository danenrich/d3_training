var MAXCHAR = 2000;
var EMPTY_COMMENT_MSG = 'Enter a comment for this input change';
var g_cmtchanged = false;

$(document).ready(function() {
  var dPos, dTop, dLeft;
  var d_ID, d_Wid, d_Hi;

  d_ID = 'commentedit_dialog';
  // There is a bug in Jquery lib when it calculation size of popup window for different type of browser.

  d_Wid = 420;

  // Dialog
  $('#' + d_ID).dialog({
    autoOpen: false,
    modal: true,
    width: d_Wid,
    resizable: false,
    buttons: {
      'Ok': function() {
        var submitted = handleOk(d_ID);
        if ((!submitted) && (parent.frames['list'])) {
          parent.frames['header'].enableAllLinks('dlg_disable_header');
          parent.frames['list'].enableAllLinks('dlg_disable_list');
        }

      },

      'Cancel': function() {
        $(this).dialog('close');
        if (parent.frames['list']) {
          parent.frames['header'].enableAllLinks('dlg_disable_header');
          parent.frames['list'].enableAllLinks('dlg_disable_list');
        }
        if (preSubInProcess != null) preSubInProcess = false;
        if (document.form1 != null) {
          if (document.form1.pubPress != null) document.form1.pubPress.value = '';
          if (document.form1.subPress != null) document.form1.subPress.value = '';
          if (document.form1.nextPress != null) document.form1.nextPress.value = '';
          if (document.form1.prevPress != null) document.form1.prevPress.value = '';
          if (document.form1.bypassPress != null) document.form1.bypassPress.value = '';
        }
      }
    }
  });

  $('.ui-dialog-titlebar-close').hide();

  var txtareaCmtObj = $('#txt_area_cmt');

  if ($('#comment').val().length > 0) {
    txtareaCmtObj.val($('#comment').val());
    txtareaCmtObj.attr('style', 'color:black');
    g_cmtchanged = true;
  }

  txtareaCmtObj.keyup(function(e) {
    //var valCCount =  $(this).val().length ;
    updateCharacterCount($('#ccount'), $(this).val().length);

  }).keyup();

  txtareaCmtObj.keydown(function(e) {
    var valCCount = $(this).val().length;
    updateCharacterCount($('#ccount'), valCCount);
  }).keydown();


  txtareaCmtObj.click(function(e) {

    if ($(this).val() == EMPTY_COMMENT_MSG && !g_cmtchanged) {
      $(this).val('');
      $(this).attr('style', 'color:black');
      g_cmtchanged = true;
    }
    updateCharacterCount($('#ccount'), $(this).val().length);
    $(this).focus();
  });

  txtareaCmtObj.change(function(e) {
    updateCharacterCount($('#ccount'), $(this).val().length);
    g_cmtchanged = true;
    $(this).focus();
  });
});


function EditComment(var_name) {
  OpenEditCommentDialog('commentedit_dialog', 400, 600, var_name);
}

function OpenEditCommentDialog(d_id, d_hi, d_wid, var_name)  // Open the dialog using Jquery.UI Dialog component
 {

  $('#' + d_id).dialog('open');

  if (parent.frames['list']) {
    parent.frames['header'].disableAllLinks('dlg_disable_header');
    parent.frames['list'].disableAllLinks('dlg_disable_list');
  }

  // Calculate and set the top-left position of the Comment Edit Dialog Box
  var dPos = getTopLeftPosition($('div[aria-labelledby$=' + d_id + ']').width(), $('div[aria-labelledby$=' + d_id + ']').height());
  $('#' + d_id).dialog('option', 'position', dPos);

  // Set focus to the text box
  var cmbTextarea = $('#txt_area_cmt');
  var cmtVal = cmbTextarea.val();

  if (!($.browser.msie))  // && !($.browser.mozilla))  //in standards mode, cols=60 is needed for FF
    cmbTextarea.attr('cols', '60');
  else
    cmbTextarea.attr('cols', '68');

  cmbTextarea.focus();
  cmbTextarea.val(cmtVal); // Trick to set the cursor to the end of text string in the text area of Comment Edit Dialog box

}


function handleOk(d_id, var_name) {
  var cmtVal = $('#txt_area_cmt').val();

  if ($('#cmtPress').val() == 'cmtPress') {
    if ($('#comment').val() == cmtVal) {
      document.bypass = 1;
      $('#' + d_id).dialog('close');
      return false;
    }
  }
  var sourcevar, submitOK;
  sourcevar = $('#form1 input[name=sourcevar]:hidden').val();

  if (sourcevar == undefined)
    sourcevar = $('#form1 input[name=formvar]:hidden').val();

  submitOK = true;
  if (cmtVal.length > MAXCHAR) {
    submitOK = confirm('The maximum number of characters that can be entered is ' + MAXCHAR + '.\nYou have entered '
         + cmtVal.length + " characters.\n\nSelect \'OK\' to automatically truncate to "
         + MAXCHAR + " characters, or\nselect \'Cancel\' to edit the comment yourself.");
    if (submitOK == true) {
      cmtVal = cmtVal.substring(0, MAXCHAR);
    }
  }

  if (submitOK) {
    $('#comment').val(cmtVal);
    $('#commentchanged').val(sourcevar);
    document.bypass = 1;
    $('#' + d_id).dialog('close');
    PostSubmit();
  }

  return submitOK;
}

function getTopLeftPosition(dialogW, dialogH) {
  var topP, leftP, topLeftPos;
  var hH, hW, nH, nW, dH, dW;
  var wholeH, wholeW;

  if (this != top) {
    hH = parent.frames['header'].getWindowSize('h');
    hW = parent.frames['header'].getWindowSize('w');
    nH = parent.frames['list'].getWindowSize('h');
    nW = parent.frames['list'].getWindowSize('w');
    dH = $(window).height();
    dW = $(window).width();

    wholeH = hH + $(window).height();
    wholeW = nW + $(window).width();

    leftP = 0; topP = 0;

    if (((wholeW - dialogW) / 2) > nW)
      leftP = (((wholeW - dialogW) / 2) - nW);

    if (((wholeH - dialogH) / 2) > hH)
      topP = (((wholeH - dialogH) / 2) - hH);

    topLeftPos = [leftP, topP];
  }
  else
    topLeftPos = 'center';

  return topLeftPos;
}

function updateCharacterCount(ccObj, ccnt) {
  var txtStyle = 'color:black;';
  ccObj.text(ccnt);
  if (ccnt > MAXCHAR)
    txtStyle = 'color:red;';

  ccObj.attr('style', txtStyle);
}
