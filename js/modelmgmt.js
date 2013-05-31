


function ActivateObject(objName,show) {
  var obj;

  obj = document.getElementById(objName);
  if (show) {
    $(obj).attr('readonly', false);
    //   $(obj).css('borderstyle','inset');
    //     $(obj).css('borderWidth','2px');
    //   $(obj).css('background-color','white');
    $(obj).css('visibility', 'visible');
  } else {
    $(obj).attr('readonly', true);
    //   $(obj).css('borderstyle','none');
    //     $(obj).css('borderWidth','0px');
    //   $(obj).css('background-color','transparent');
    $(obj).css('visibility', 'hidden');
  }

}

function ShowProgress(show) {
  if (show) {
    ActivateObject('ModelsList', false);
    ActivateObject('RunOutput', true);
    ActivateObject('runUpload', false);
    ActivateObject('runModelMgmt', false);
  } else {
    ActivateObject('ModelsList', true);
    ActivateObject('RunOutput', false);
    ActivateObject('runUpload', true);
    ActivateObject('runModelMgmt', true);
  }
}


function processComplete() {
  ActivateObject('runModelMgmt', false);
}

function convertButton(butName,dispName,butClick) {
  var obj;
  obj = document.getElementById(butName);
  alert(butName + ':' + dispName + ':' + butClick);

  alert('mm1' + $(obj).get(0).onclick);

  $(obj).attr('value', dispName);
  $(obj).attr('onclick', 'function anonymous(){alert("msg: ' + butClick + '");}');

  alert('mm2' + $(obj).get(0).onclick);
}


