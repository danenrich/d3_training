
function ConvertMonthEnd(theDate) {
  if (theDate == 'top') return;
  if (confirm('All non-named ' + loc_snapshots + ' within this ' + loc_portfolio + ' will be transformed into ' + loc_snapshots + ' \nbased on the month end close date you just specified. Continue?')) {
    document.form3.convert.value = 'dated';
    document.form3.changeDate.value = theDate;
    document.form3.submit();
  } else
  { document.getElementById('monthend').value = 'top';
  }
}

