// graph.js
// Javascript graph routines

var graphtype;
graphtype = document.getElementById('GG_graphtype');

function iographInit(graphtype)
 {
  if (graphtype == 'Line Bar')
  {
    InitSetScaleValues('YSL');
    InitSetScaleValues('YSB');
  }
  else if (graphtype != 'Pie')
  {
    InitSetScaleValues('YS1');
  }
  if (graphtype == 'XY')
  {
    InitSetScaleValues('XS1');
  }

  initCustomtitle();
  initColorWells();   //trying to all named colors from server side

}

function InitSetScaleValues(prefix) {
  var obj, elemId, objshowManual;
  elemId = prefix + '_Manual';
  obj = document.getElementById(elemId);
  objshowManual = document.getElementById('show' + prefix + 'Manual');

  if (objshowManual != null)
  {
    if (objshowManual.value == 'true')
    {
      showScaleOptions(prefix, 'Manual');
    }
    else
    {
      showScaleOptions(prefix, 'Auto');
      InitPercentUnderMinVal(prefix);
    }
  }
  else {

  }
}

function InitPercentUnderMinVal(prefix)
 { var obj1 = document.getElementById(prefix + '_SetScaleBaseToZero');
  var obj2 = document.getElementById(prefix + '_PercentUnderMinValue');
  if (obj1 != null)
  {
    EnablePercentUnderMinVal(obj2, obj1.checked);
  }
}

function initCustomtitle()
 {

  var obj = document.getElementById('CUS_customtitle');
  var custitle = obj.value;
  if (obj != null)
  {
    custitle = replaceXMLChars(custitle);
    obj.value = custitle;
  }

  initDataLabelFormatstring();
}

function initDataLabelFormatstring()
 {
  var obj = document.getElementById('DL_FormatString');
  if (obj != null)
  {
    var DLformatstr = obj.value;
    DLformatstr = replaceXMLChars(DLformatstr);
    obj.value = DLformatstr;
  }
}

function onClick_SetScaleBaseToZero(prefix)
 {
  InitPercentUnderMinVal(prefix);
}

function EnablePercentUnderMinVal(obj, enable)
 {
  if (obj != null)
  {
    if (!(isSignedInteger(obj.value)) || (isWhitespace(obj.value)))
    {
      obj.value = 11;
    }
    if (enable == true)
    {
      obj.className = 'gdisabled';
      obj.disabled = true;
    }
    else
    {
      obj.className = 'r1';
      obj.disabled = false;
    }
  }
}

function onUnload_document()
 {
  var prefix, obj;
  alert('unloading');
  if (graphtype == 'Line Bar')
  {
    prefix = 'YSL';
    obj = document.getElementById(prefix + '_PercentUnderMinValue');
    EnableObject(obj, false);
    prefix = 'YSB';
    obj = document.getElementById(prefix + '_PercentUnderMinValue');
    EnableObject(obj, false);
  }
  else if (graphtype != 'Pie')
  {
    prefix = 'YS1';
    obj = document.getElementById(prefix + '_PercentUnderMinValue');
    EnableObject(obj, false);
  }
  if (graphtype == 'XY')
  {
    prefix = 'XS1';
    obj = document.getElementById(prefix + '_PercentUnderMinValue');
    EnableObject(obj, false);
  }
}

function EnableObject(obj, enable)
 {
  if (obj != null)
  {
    obj.disabled = enable;
  }
}

function onChange_PercentUnderMinValue(obj)
 {
  if (!(isSignedInteger(obj.value)) || (isWhitespace(obj.value)))
  {
    obj.value = 10;
  }
}

function showdivLayer(layerArray, buttonArray, divId, buttonId)
 {
  var count = layerArray.length;
  for (var indx = 0; indx < count; indx++)
  {
    var hiddenobj = document.getElementById(layerArray[indx]);
    if (hiddenobj != null)
    {
      hiddenobj.className = 'layhide';
    }
  }

  var visibleobj = document.getElementById(divId);
  if (visibleobj != null)
  {
    visibleobj.className = 'layshow';
  }

  count = buttonArray.length;
  for (var indx = 0; indx < count; indx++)
  {
    var unselectedbutt = document.getElementById(buttonArray[indx]);
    if (unselectedbutt != null)
    {
      unselectedbutt.className = 'gtabnosel';
    }
  }

  var selectedbutt = document.getElementById(buttonId);
  if (selectedbutt != null)
  {
    selectedbutt.className = 'gtabselected';
  }
}

function showGeneralGraph(divId, buttId)
 {
  var divArray = ['divGraphTitle', 'divGraphGeneral', 'divLegend'];
  var buttArray = ['btnGraphGeneral', 'btnGraphTitle', 'btnLegend'];

  showdivLayer(divArray, buttArray, divId, buttId);
}

function showYScale(divId, pos,  buttId)
 {
  var divArray = ['YScale' + pos, 'YSLabel' + pos, 'YSTick' + pos, 'YSFont' + pos];
  var buttArray = ['btnYS' + pos, 'btnYSLB' + pos, 'btnYSTick' + pos, 'btnYSFont' + pos];
  divId = divId + pos;
  buttId = buttId + pos;

  showdivLayer(divArray, buttArray, divId, buttId);
}

function showXScale(divId, buttId)
 {
  var divArray = ['divXScale', 'divXSLabel', 'divXSTick', 'divXSFont'];
  var buttArray = ['btnXS', 'btnXSLB', 'btnXSTick', 'btnXSFont'];

  showdivLayer(divArray, buttArray, divId, buttId);
}

function showDataLabel(divId, buttId)
 {
  var divArray = ['divDLGeneral', 'divDLFont', 'divDLValFormat'];
  var buttArray = ['btnDLGeneral', 'btnDLFont', 'btnDLValFormat'];

  showdivLayer(divArray, buttArray, divId, buttId);
}

function showGraphLabel(divId, buttId)
 {
  var divArray = ['divGSGeneral', 'divGSRanks', 'divGSColorVal'];
  var buttArray = ['btnGSGeneral', 'btnGSRanks', 'btnGSColorVal'];

  showdivLayer(divArray, buttArray, divId, buttId);
}

function showRadarXScale(divId, buttId)
 {
  var divArray = ['divXSLabel', 'divXSFont'];
  var buttArray = ['btnXSLB', 'btnXSFont'];

  showdivLayer(divArray, buttArray, divId, buttId);
}

function xscaleRadarTab(divObj) {
  aa = document.getElementById(divObj);
  aa.className = 'layshow';

  if (divObj == 'divXSLabel')
  {
    document.getElementById('divXSFont').className = 'layhide';

    document.getElementById('btnXSLB').className = 'gtabselected';
    document.getElementById('btnXSFont').className = 'gtabnosel';
  }

  if (divObj == 'divXSFont')
  {
    document.getElementById('divXSLabel').className = 'layhide';

    document.getElementById('btnXSLB').className = 'gtabnosel';
    document.getElementById('btnXSFont').className = 'gtabselected';
  }
}

function validateRotateValue(elem) 
 {
}

function insertDataLabelformat() {
  var objformatStr, orgval, newval;
  objformatStr = document.getElementById('DL_FormatString');
  objKeywords = document.getElementById('DL_Keywords');

  orgval = objformatStr.value;

  newval = objKeywords.value;
  objformatStr.value = orgval + newval;
}

function showScaleOptions(prefix, elem) {
  objManual = document.getElementById(prefix + 'Manual');
  objAuto = document.getElementById(prefix + 'Auto');
  if (elem == 'Manual')
  {
    objManual.style.display = 'block';
    objAuto.style.display = 'none';
  }
  else
  {
    objManual.style.display = 'none';
    objAuto.style.display = 'block';
  }
}

// Handle click of Save Settings button
function saveGraphHandler() 
 {
  document.graphform.act.value = 'save';
  document.graphform.submit();

  if (opener && !opener.closed) {
    srcform.graphaction.value = 'save';
    opener.dialogWin.returnFunc();

  }
  window.close();
  return false;
}

// Handle click of Preview Settings button
function previewGraphHandler() 
 {
  document.graphform['act'].value = 'preview';
  document.graphform.submit();

  if (opener && !opener.closed) {
    srcform.graphaction.value = 'preview';
    opener.dialogWin.returnFunc();
  }
  return false;
}

// Handle click of Preview Default  button
function prevDefaultGraphHandler() 
 {
  document.graphform['act'].value = 'prevdef';

  if (opener && !opener.closed) {
    srcform.graphaction.value = 'prevdef';
    opener.dialogWin.returnFunc();
  }
  return false;
}

// Handle click of Use Default  button
function useDefaultGraphHandler() 
 {
  document.graphform['act'].value = 'clear';
  document.graphform.submit();
  if (opener && !opener.closed) {
    srcform.graphaction.value = 'clear';
    opener.dialogWin.returnFunc();
  }
  window.close();
  return false;
}

// Handle click of Cancel button
function cancelGraphHandler() 
 {
  // Empty the hidden input "graphaction" on the source frame ( graph output )
  window.parent.srcform.graphaction.value = '';
}

// Handle click on all buttons in graph control area.
function GraphButtonsHandler(action) 
 {
  var prevwin;
  document.graphform['act'].value = action;

  if (action == 'preview') {
    document.graphform.target = 'hiddenIFRAME';
    document.graphform.submit();
    document.graphform.target = '_self';
  } else if (action != 'prevdef') {
    document.graphform.target = '_self';
    document.graphform.submit();
  }

  if (window.parent.my_opener && !window.parent.my_opener.closed) {

    window.parent.srcform.graphaction.value = action;
    prevwin = window.parent.my_opener.dialogWin.returnFunc();
  }
  return prevwin;
}

// assumes:
//  button   with id prefix  _color  and class="colorbtn"
//  hidden   with id prefix  _val   and class="colorwell"
//  checkbox with id prefix  _def   and class="actwell"
function getColor(elem, butt) {
  //  clrPick.hex=true;
  window.hex = true;
  clrPick.select(document.getElementById(elem), document.getElementById(butt), 'clr_' + butt);
  clrPick.highlightColor(document.getElementById(elem).value);
  clrPick.setCanxColor(document.getElementById(elem).value);
  //   document.getElementById('pickedcolor').value = "#" + document.getElementById(elem).value.replace("#","");
  return false;
}


function toggleWidthHeightOptions(rdobj)
 {
  var wpixel, hpixel, wpercent, hpercent;

  wpixel = document.getElementById('GG_widthpx');
  hpixel = document.getElementById('GG_heightpx');
  wpercent = document.getElementById('GG_widthpc');
  hpercent = document.getElementById('GG_heightpc');

  if (rdobj.value == 'Pixels')
  {
    EnableObject(wpixel, false);
    EnableObject(hpixel, false);
    EnableObject(wpercent, true);
    EnableObject(hpercent, true);
  }
  else
  {
    wpixel.value = document.getElementById('hid_widthpx').value;
    hpixel.value = document.getElementById('hid_heightpx').value;
    EnableObject(wpixel, true);
    EnableObject(hpixel, true);
    EnableObject(wpercent, false);
    EnableObject(hpercent, false);
  }
}

function EnableObject(obj, enable)
 {
  if (obj != null)
  {
    if (enable == true)
    {
      obj.className = 'gtxtnumber0';
      obj.disabled = true;
    }
    else
    {
      obj.className = 'gtxtnumber1';
      obj.disabled = false;
    }
  }
  else
  {
    alert('Error in EnableObject(): obj is null');
  }
}

function changeState(obj, objname)
 {
  var tmpobj = document.getElementById(objname);
  if (tmpobj != null)
  {
    if (obj.checked == true)
    {
      tmpobj.className = 'gtxtnumber1';
      tmpobj.disabled = false;
    }
    else
    {
      tmpobj.className = 'gtxtnumber0';
      tmpobj.disabled = true;
    }
  }
}





//   ==================  Begin  Color Picker Code ===============================

function initColorWells() {

  $('.colorwell')
        .each(function() {
        $(this).css('text-transform', 'uppercase');
        if ($(this).get(0).value.length < 2) {
          var cBut = $(this).get(0).name.replace('_val', '_color');
          $(document.getElementById(cBut)).attr('title', 'No Value Set');
        //                $(document.getElementById(cBut)).attr('value','-+-');

        } else {
          $(this).get(0).value = $(this).get(0).value.replace('#', '').toUpperCase();
          $(this).get(0).value = $(this).get(0).value.pad(6, '0', 0);
        }
        $(this).css('background-color', 'transparent');
        $(this).attr('max', '6');
      });

  $('.colorbtn')
         .hover(
      function() {
        var cVal = $(this).get(0).name.replace('_color', '_val');
        var vObj = document.getElementById(cVal);
        if ($(vObj).get(0).value.length > 2) {
                    $(this).attr('title', 'Custom Color Value being used:[#' + $(vObj).get(0).value.replace('#', '').toUpperCase() + ']');
                  }
      },
      function() {
        null;
      }
      );
}

function fixColorWells() {
  $('.colorwell')
        .each(function() {
        $(this).get(0).value = '#' + $(this).get(0).value.replace('#', '');
      });
}

// replaces changeColorState
function toggleColorState(chkObj, btnName, schColor)
 {
  var btnObj = document.getElementById(btnName);
  var cVal = chkObj.name.replace('_def', '_val');
  var valObj = document.getElementById(cVal);

  $(btnObj).hover(
      function() {
        if (chkObj.checked == true) {
          $(this).attr('title', 'Custom Color Value being used:[#' + valObj.value.replace('#', '').toUpperCase() + '].');
        }
      },
      function() {
        $(this).attr('title', 'Default Color Value being used:[' + schColor.toUpperCase() + '].');
      }
  );

  if (btnObj != null) {
    if (chkObj.checked == true) {
      chkObj.title = 'Clear this Box to use Default Color for this Series.';
      btnObj.disabled = false;
      btnObj.style.cursor = 'hand';
      if (valObj != null) {
        ActivateInput(valObj, true);
      }
    } else {
      chkObj.title = 'Check this Box to apply a Custom Color to this Series.';
      //btnObj.style.background=schColor;
      $(btnObj).css('backgroundColor', schColor);
      btnObj.style.cursor = 'wait';
      btnObj.disabled = true;
      if (valObj != null) {
        valObj.value = schColor.replace('#', '').toUpperCase();
        ActivateInput(valObj, false);
      }
    }
  } else {
    alert('Bad btnName:' + btnName);
  }
}



function ShowCCEntryCheck() {
  var dsub = getSubCookie('dock', 'ShowCCEntry');
  if (dsub != null) {
    if (dsub == 'on') {
      if (document.getElementById('ShowCCEntry') != null) {
        document.getElementById('ShowCCEntry').checked = true;
      }
    } else {
      if (document.getElementById('ShowCCEntry') != null) {
        document.getElementById('ShowCCEntry').checked = false;
      }
    }
    TogCustomColorEntry(document.getElementById('ShowCCEntry'));
  } else {
    HideCustomColorEntry();
    if (document.getElementById('ShowCCEntry') != null) {
      document.getElementById('ShowCCEntry').checked = false;
    }
  }
}



function TogCustomColorEntry(obj) {
  if (obj != null && obj.checked == true) {
    ShowCustomColorEntry();
    setSubCookie('dock', 'ShowCCEntry', 'on');
  } else {
    HideCustomColorEntry();
    if (obj != null) {
      setSubCookie('dock', 'ShowCCEntry', 'off');
    }
  }
}


function ShowCustomColorEntry() {
  // some settings are controlled by initColorWell()
  $('.colorwell')
        .each(function() {
        $(this).attr('height', '20');
        $(this).attr('width', '60');
        $(this).css('opacity', 1);
        var cBox = $(this).get(0).name.replace('_val', '_def');
        if ($(document.getElementById(cBox)).attr('checked') == true) {
          ActivateInput(this, true);
        }else {
          ActivateInput(this, false);
        }
      })
        .keypress(function(e) {
        if (e.keyCode == 13) { $(this).get(0).blur(); }
        if (e.keyCode == 27) { $(this).get(0).blur(); }
        var cBox = $(this).get(0).name.replace('_val', '_def');
        if ($(document.getElementById(cBox)).attr('checked') == true) {
              if (e.keyCode != 27 && e.keyCode != 13 && ! isHex(e.keyCode)) {
            var oldVal = String.fromCharCode(e.keyCode);
            e.keyCode = 48;
            alert('Only HEX Numbers Allowed!' + String.fromCharCode(13) + '  0-9,A-F  ' + String.fromCharCode(13) + 'Setting: ' + oldVal + ' to: 0');
          }
        }
      })
        .focus(function() {
        var cBox = $(this).get(0).name.replace('_val', '_def');
        if ($(document.getElementById(cBox)).attr('checked') == true) {
              $(this).get(0).value = $(this).get(0).value.replace('#', '').toUpperCase();
              $(this).select();
        }
      })
        .blur(function() {
        $(this).css('font-weight', 'normal');
        var cBut = $(this).get(0).name.replace('_val', '_color');
        $(this).get(0).value = $(this).get(0).value.pad(6, '0', 0);
            $(document.getElementById(cBut)).css('background-color', $(this).get(0).value.toUpperCase());
      });

  $('.colorwellSpan')
        .each(function() {
        $(this).css('visibility', 'visible');
        $(this).css('width', '80');
      });

  ShowHideTableCol('gsIndex', 4, true);

}

function HideCustomColorEntry() {
  $('.colorwell')
        .each(function() {
        $(this).attr('height', '0px');
        $(this).attr('width', '0px');
      })
        .focus(function() {
        $(this).blur;
      });

  $('.colorwellSpan')
        .each(function() {
        $(this).css('visibility', 'hidden');
        $(this).attr('height', '0px');
        $(this).attr('width', '0px');
      });
  ShowHideTableCol('gsIndex', 4, false);

}

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

function ActivateInput(obj,show) {
  if (show) {
    $(obj).attr('readonly', false);
    $(obj).css('borderstyle', 'inset');
    $(obj).css('borderWidth', '2px');
    $(obj).css('background-color', 'white');
  } else {
    $(obj).attr('readonly', true);
    $(obj).css('borderstyle', 'none');
    $(obj).css('borderWidth', '0px');
    $(obj).css('background-color', 'transparent');
  }
}

function ShowHideTableCol(table_id, col_no, show) {

  var style;
  if (show)
    style = '';
  else
    style = 'none';


  var tableObj = document.getElementById(table_id);
  if (tableObj != null)
  {
    var th_row = tableObj.getElementsByTagName('th');
    var tr_rows = tableObj.getElementsByTagName('tr');

    th_row[col_no].style.display = style;

    for (var row = 1; row < tr_rows.length; row++)
    {
      var cels = tr_rows[row].getElementsByTagName('td');
      try {
        cels[col_no].style.display = style;
      } catch (err) {
        cels = null;
      }
    }
  }
}









function retFunc() 
 {
  var elemname, buttname;

  //if( document.getElementById('colorchanged').value == 'yes')
  //{
  elemname = document.getElementById('elemtname').value;
  buttname = document.getElementById('buttname').value;
  document.getElementById(elemname).value = document.getElementById('pickedcolor').value;
  document.getElementById(buttname).style.backgroundColor = document.getElementById(elemname).value;
  // }
}




function testFunction()
 {
  alert('Calling testFunction');
}

