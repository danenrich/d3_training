var Wsbp_AjaxObj = new AjaxObject();
Wsbp_AjaxObj.OnComplete = Wsbp_AjaxObj_Complete;
Wsbp_AjaxObj.OnError = Wsbp_AjaxObj_Error;

function Wsbp_AjaxObj_Complete(responseText, responseXML)
 {
  // javascriptCode contains javascript code returned from Ajax_request..
	var javascriptCode = responseText.replace('&gt;', '>');
	var javascriptCode = javascriptCode.replace('&lt;', '<');
  if (javascriptCode.length != 0)
  {
    // using SetTimeout function to run javascript code return from the server - no time delay.
    //alert (javascriptCode);
    setTimeout(javascriptCode, 0);
  }
}

function Wsbp_AjaxObj_Error(status, statusText, responseText)
 {
  alert('AJAX Error: status: ' + status + '(' + statusText + ')');
}

function Ajax_CheckPublishedInput(isMulti, inputList, cargoTxt, projId, tempId, ade_LoadTime, epsPath)     
 {
  cic_cargo_text = cargoTxt;

  if (inputList.length != 0) {
    var queryString = 'getdata=check_published_input';
    var pid = projId;
    var tid = tempId;
    var loadtime = ade_LoadTime;

    queryString = queryString + '&multi=' + isMulti + '&tid=' + tid + '&pid=' + pid + '&ade_loadtime=' + loadtime + '&inputlist=' + inputList;
    queryString = escape_amp(queryString);

    if (queryString.length != 0)
    {
      initAjaxRequestUrl(epsPath, 'AjaxRequest.aspx');
      Wsbp_AjaxObj.Get_CallBack(queryString);
    }
    else
    {
      Wsbp_AjaxObj.AbortCallBack();
    }
  }
  else {
    // alert(' Ajax_CheckPublishedInput returns false');
    return false;
  }
  return true;
}

var cic_AjaxResult = true;
var cic_publishOK_Callback = null;
var cic_cargo_text = '';
function confirmInputsConflict(isConflict, isMulti, inputLists) {
  /* ==============================================================
     isConflict  =  0 : No conflict
         1 : There are conflict inputs
     isMulti  = 1 : Multi-input form
         0 : Single-input
     inputLists =  Reserve for future use if required to
         return a list of conflict inputs.
   =============================================================== */
  var publishOK = true;
  var confirmMsg = '';
  // var debugMsg = " Debug msg (confirmInputsConflict) : " + autosubmitting;
  cic_AjaxResult = true;

  if (isConflict != 0) {
    // Conflict in the input(s) selected for publishing, we need a confirm by user b4 publishing the inputs
    if (isMulti == 0) {
      confirmMsg = 'This input has been modified by another user since the beginning of your session.\n' +
          'Press OK to publish your data, or Cancel to abort publication.';
    } else {
      confirmMsg = 'Inputs on this form have been modified by another user since the beginning of your session.\n' +
          'Press OK to publish your data, or Cancel to abort publication.';
    }
    if (!confirm(confirmMsg)) {
      publishOK = false;
    }
  }

  if (publishOK) {
    document.form1.subPress.value = 'subPress';
    g_ConfirmExit = false;
    document.form1.reloadheader.value = 'true';
    if (cic_publishOK_Callback != null) {
      cic_publishOK_Callback(cic_cargo_text);
    } else {
      //alert('submitting-confirmInputsConflict-A');
      document.form1.submit();
    }
  } else {
    // adjust globals
    cic_AjaxResult = false;
    g_ConfirmExit = true;
    bypass_comment = 0;
    // also enable all links from all frames
    if (parent.frames['list'] != null) {
      parent.frames['header'].enableAllLinks('dlg_disable_header');
      parent.frames['list'].enableAllLinks('dlg_disable_list');
      enableAllLinks('dlg_disable_details');
    }
    HideLoadingDiv();
  }
  return cic_AjaxResult;
}

function getChangedInputList(varChanged, cmtChanged) {
  var tempArr1 = cmtChanged.split(',');
  var tempArr2 = varChanged.split(',');

  $.each(tempArr1, function(index, value) {
    if (value != '') {
      if ($.inArray(value, tempArr2) == -1)
        varChanged = varChanged + value + ',';
    }
  });

  // alert("inputList =" +  varChanged);
  return varChanged;
}
