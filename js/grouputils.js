/* ---------------- GroupUtils.js   ------------------
  Common Javascript group routines
  Created by Norm Thai - Enrich Consulting Inc.
  Created date: 06-25-2006
  Modified date:    by
 ---------------------------------------------------- */

function deselectOptions(the_Select) {
  var theOptions = the_Select.options;
  var idx_len = theOptions.length;
  var idx_cnt = 0;

  for (; idx_cnt < idx_len; idx_cnt++)
  {
    if (theOptions[idx_cnt].value == '')
      theOptions[idx_cnt].selected = false;
  }
}
