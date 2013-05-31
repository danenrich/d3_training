
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



// replaced by jquery code
function changeColorState(thisObj, objName, chkColor, unchkColor)
 {
  var tmpobj = document.getElementById(objName);
  var cVal = thisObj.name.replace('_def', '_val');
  if (tmpobj != null) {
    if (thisObj.checked == true) {
      thisObj.title = 'Clear this Box to use Default Color for this Series.';
      tmpobj.disabled = false;
      tmpobj.style.background = chkColor;
      tmpobj.title = 'Custom Color Value being used:[' + chkColor + '].';
      tmpobj.style.cursor = 'hand';
      document.getElementById(cVal).value = chkColor.replace('#', '');
      if (document.getElementById(cVal) != null) {
        ActivateInput(document.getElementById(cVal), true);
      }
    } else {
      thisObj.title = 'Check this Box to apply a Custom Color to this Series.';
      tmpobj.style.background = unchkColor;
      tmpobj.title = 'Default Color Value being used:[' + unchkColor + '].';
      tmpobj.style.cursor = 'wait';
      tmpobj.disabled = true;
      document.getElementById(cVal).value = unchkColor.replace('#', '');
      if (document.getElementById(cVal) != null) {
        ActivateInput(document.getElementById(cVal), false);
      }
    }
  } else {
    alert('Bad objName:' + objName);
  }
}


// legacy function for old color wheel
function chooseColor(elem, butt) {
  document.getElementById('elemtname').value = elem;
  document.getElementById('buttname').value = butt;
  openCustomWin('ColorPicker', 'ColorPicker2.htm', 450, 560, top.window, 'left', retFuncSetColor, '');
}
// legacy call-back function for old color wheel
function retFuncSetColor() 
 {
  var elemname, buttname;

  //if( document.getElementById('colorchanged').value == 'yes')
  //{
  elemname = document.getElementById('elemtname').value;
  buttname = document.getElementById('buttname').value;
  document.getElementById(elemname).value = document.getElementById('pickedcolor').value;
  document.getElementById(buttname).style.backgroundColor = document.getElementById(elemname).value;
  document.getElementById(buttname).title = 'Custom Color Value being used:[' + document.getElementById(elemname).value + ']';
  document.getElementById(buttname).blur;
  // }
}






function testFunction()
 {
  alert('Calling testFunction');
}
