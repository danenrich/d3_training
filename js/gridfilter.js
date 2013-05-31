function getConditions(gridId) {
  var conditions = new Array();
  $("INPUT[PF_GridId='" + gridId + "']").each(function(index) {
    if ($(this).val().length > 0) {
      $(this).parent().removeClass('nofilt').addClass('filt');
      cIdx = conditions.length;
      conditions[cIdx] = new Object;
      conditions[cIdx].name = $(this).attr('PF_colKey');
      conditions[cIdx].value = $(this).val();
      conditions[cIdx].single = true;
      conditions[cIdx].projatt = $(this).attr('PF_pa');
      $(this).parent().removeClass('nofilt').addClass('filt');
    }
    else
      $(this).parent().removeClass('filt').addClass('nofilt');
  });

  //go thru each type of SELECT elements which contain PF_Colkey attributes
  var pt_selected;
  $("SELECT[PF_GridId='" + gridId + "']").each(function(index) {
    pt_selected = false;
    var optsSelected = new Array();
    $(this).children('option:selected').each(function() {
      optIndex = optsSelected.length;
      if ($(this).attr('PF_value') != null) { // PF_value attribute exist, we must collect data from value() attribute
        optsSelected[optIndex] = $(this).val();
      }
      else {
        if ($(this).attr('PF_title') != null) // PF_title attribute exist, we must collect data from title() attribute
          optsSelected[optIndex] = $(this).attr('title');
        else
          optsSelected[optIndex] = $(this).text();
      }

      pt_selected = true;
    });

    if (pt_selected == true) {
      cIdx = conditions.length;
      conditions[cIdx] = new Object;
      conditions[cIdx].name = $(this).attr('PF_colKey');
      conditions[cIdx].value = optsSelected;
      conditions[cIdx].single = false;
      conditions[cIdx].projatt = $(this).attr('PF_pa');
      $(this).parent().removeClass('nofilt').addClass('filt');
    }
    else
      $(this).parent().removeClass('filt').addClass('nofilt');
  });

  return conditions;
}

function pre(gridId, searchBox) {
  if (searchBox.type == 'text') {
    if (searchBox.value != this.SearchString) {
      this.SearchString = searchBox.value;
      if (this.SearchTimeout) {
        clearTimeout(this.SearchTimeout);
      }
      this.SearchTimeout = setTimeout('FilterProjectsOnServer("' + gridId + '");', 500);
    }
  } else {
    eval('FilterProjectsOnServer("' + gridId + '");');
  }
}

function FilterProjectsOnServer(gridId) {

  var conditions = getConditions(gridId);

  //ok, now that we have all the conditions, lets do the filtering proper
  var filterExp = getFilterExpression(conditions);

  // fix javascript crash when user enter "quotation mark"
  filterExp = filterExp.replace(/\"/g, '\\"');

  var mfilter = '"' + filterExp + '"';

  var uniqValue = '';
  if (getQueryVariable('value'))
    uniqValue = getQueryVariable('value');
  else
    uniqValue = gridId;

  // try to get filter dock id, for coloring
  var fDockTitle;
  fDockTitle = $('#' + gridId + '_filter_title');
  // if filter is empty we need to send the clear filter message
  if (mfilter.length == 2) {
    mfilter = '\"#!CLEAR!#\"';
    if (fDockTitle) { fDockTitle.removeClass('filter_active'); }
  }
  else {
    if (fDockTitle) { fDockTitle.addClass('filter_active'); }
  }
  var gridFilter = gridId + '.Filter(' + mfilter + '); ';
  try {
    eval(gridFilter);
  } catch (err) {
    gridFilter = '';
  }
}

function resetFilterOnServer(gridId) {

  resetFilter(gridId);
  /*  TO DEVELOPERS:
   If we set mfilter to blank "", the grid only remove all filters by re-rendering ON CLIENT only,
   but not send the filter event to the server. Therefore, we have to set filter to a specific value so that
   we can process it on the server
  */
  var mfilter = '\"#!CLEAR!#\"';

  // try to get filter dock id, for coloring
  var fDockTitle;
  fDockTitle = $('#' + gridId + '_filter_title');
  if (fDockTitle) { fDockTitle.removeClass('filter_active'); }

  var gridFilter = gridId + '.Filter(' + mfilter + '); ';
  eval(gridFilter);
}


function FilterProjectsOnClient(gridId) {

  var conditions = getConditions(gridId);

  //ok, now that we have all the conditions, lets do the filtering proper
  var filterExp = '';

  for (k = 0; k < conditions.length; k++)
  {
    var colName = conditions[k].name;
    var conVals = conditions[k].value;

    if (conditions[k].single == true) { //single value
      filterExp += "(DataItem.GetMember('" + colName + "').Value.indexOf('" + conVals + "') >=0 ) ";
    }
    else { //multiple values
      filterExp += '(';
      for (l = 0; l < conditions[k].value.length; l++)
      {
        conVals = conditions[k].value[l];
        filterExp += " (DataItem.GetMember('" + colName + "').Value.indexOf('" + conVals + "') >=0 ) ";

        if (l < conditions[k].value.length - 1)
          filterExp += ' || ';
      }
      filterExp += ')';
    }
    if (k < conditions.length - 1)
      filterExp += ' && ';
  }

  //Grid_ProjList.Filter(filterExp);
  //Grid_ProjList.Render();

  var gridFilter = gridId + '.Filter(' + mfilter + '); ';
  setTimeout(gridFilter + gridId + '.Render();' , 500); // delay 500ms befpre running the js

}

function resetFilterOnClient(gridid) {

  resetFilter(gridId);
  FilterProjectsOnClient(gridid);
}


function resetFilter(gridId)
 {
  //go thru each type of INPUT elements that has PF_GridId = specific gridID
  $("INPUT[PF_GridId='" + gridId + "']").each(function(index) {
    $(this).val('');
    $(this).parent().removeClass('filt').addClass('nofilt');
  });

  //go thru each type of SELECT elements that has PF_Colkey attribute
  $("SELECT[PF_GridId='" + gridId + "']").each(function(index) {
    $(this).attr('selectedIndex', '-1');
    $(this).parent().removeClass('filt').addClass('nofilt');
  });
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (pair[0] == variable) {
      return pair[1];
    }
  }
}

function getFilterExpression(conditions) {
  var filterExp = '';
  for (k = 0; k < conditions.length; k++)
  {
    var colName = conditions[k].name;
    var conVals = conditions[k].value;
    if (k > 0) {filterExp += '#cf#';}

    if (conditions[k].single == true) { //single value
      if (conditions[k].projatt == 'true')
        filterExp += 'select-pa-one';
      else
        filterExp += 'select-one';
      filterExp += colName + '#nv#' + conVals;
    }
    else { //multiple values
      if (conditions[k].projatt == 'true')
        filterExp += 'select-pa-multiple';
      else
        filterExp += 'select-multiple';

      filterExp += colName + '#nv#';
      for (l = 0; l < conditions[k].value.length; l++)
      {
        if (l > 0) {filterExp += '#ms#';}

        conVals = escapeSingleQuotesSQL(conditions[k].value[l]);
        filterExp += conVals;
      }
    }
  }
  return filterExp;
}

