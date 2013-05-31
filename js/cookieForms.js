//**********************************************************************
//  BEGIN Cookie Forms Filter Persistence
//***********************************************************************/

function cookieForms() {
  var mode = cookieForms.arguments[0];
  for (f = 1; f < cookieForms.arguments.length; f++) {
    var formName = cookieForms.arguments[f];
    if (typeof document[formName] == 'object' && mode == 'open') {
      cookieValue = unescape(getSubCookie('filter', 'saved_' + formName));
      if (cookieValue != null) {
        var cookieArray = cookieValue.split('#cf#');
        if (cookieArray.length == document[formName].elements.length) {
          for (i = 0; i < document[formName].elements.length; i++) {
            if (cookieArray[i].substring(0, 10) == 'select-one') {
              document[formName].elements[i].options.selectedIndex = cookieArray[i].substring(10, cookieArray[i].length);
            }
            if (cookieArray[i].substring(0, 15) == 'select-multiple') {
              var selected = cookieArray[i].substring(15, cookieArray[i].length);
              var selectedArray = selected.split(':o:');
              for (var k = 0; k < selectedArray.length; k++) {
                var item = selectedArray[k];
                for (var m = 0; m < document[formName].elements[i].options.length; m++) {
                  if (document[formName].elements[i].options[m].value == item) {
                    document[formName].elements[i].options[m].selected = true;
                    m = document[formName].elements[i].options.length;
                  }
                }
              }
            }
            else if ((cookieArray[i] == 'cbtrue') || (cookieArray[i] == 'rbtrue')) {
              document[formName].elements[i].checked = true;
            }
            else if ((cookieArray[i] == 'cbfalse') || (cookieArray[i] == 'rbfalse')) {
              document[formName].elements[i].checked = false;
            }
            else {
              document[formName].elements[i].value = (cookieArray[i]) ? cookieArray[i] : '';
            }
          }
        }
      }
    }
    if (typeof document[formName] == 'object' && mode == 'save') {
      cookieValue = '';
      for (i = 0; i < document[formName].elements.length; i++) {
        fieldType = document[formName].elements[i].type;
        if (fieldType == 'password') {
          passValue = '';
        }
        else if (fieldType == 'checkbox') {
          passValue = 'cb' + document[formName].elements[i].checked;
        }
        else if (fieldType == 'radio') {
          passValue = 'rb' + document[formName].elements[i].checked;
        }
        else if (fieldType == 'select-one') {
          passValue = 'select-one' + document[formName].elements[i].options.selectedIndex;
        }
        else if (fieldType == 'select-multiple') {
          selected = new Array();
          for (var k = 0; k < document[formName].elements[i].options.length; k++)
            if (document[formName].elements[i].options[k].selected)
              selected.push(document[formName].elements[i].options[k].value);
            passValue = 'select-multiple' + selected.join(':o:');
        }
        else {
          passValue = document[formName].elements[i].value;
        }
        cookieValue = cookieValue + passValue + '#cf#';
      }
      cookieValue = cookieValue.substring(0, cookieValue.length - 4);
      setSubCookie('filter', 'saved_' + formName, escape(cookieValue));
    }
  }
}
