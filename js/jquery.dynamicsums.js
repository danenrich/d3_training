function activateSumsOverRows(inputTableID, sumTableID, pmethod, sformat) {
  var theTable = $('#' + inputTableID + ' tbody');
  var totTable = $('#' + sumTableID + ' tbody');
  var rowcount = $('tr', theTable).length - 1;
  var nregions = $('tr', totTable).length - 1;
  var nproducts = rowcount/nregions;
  if (rowcount%nproducts != 0) {
   alert('number of rows in input table is not a whole multiple of the number of rows in totals table');
   return -1;
  }
  
  $('tr:eq(0)', totTable).remove();
  $('tr', totTable).each(function(j) {
   var totRow = (j+ 1) * (nproducts + 1);
   $(this).insertAfter($('tr:nth-child(' + totRow + ')', theTable));
  });

 $('input', theTable).each(function(){
  $(this).blur(function(){
   calculateSum($(this).parent().parent().prevAll().length, $(this).parent().prevAll().length, $(this).closest('table').attr('id'), nproducts, pmethod, sformat);
  });
 });
}
     
//Position is the row AND column AND table in which the cell that was changed is in 
function calculateSum(rowpos, colpos, tableID, nproducts, pmethod, sformat) {
 var sum=0;
  var msum = 0;
 var theTable = $('#' + tableID + ' tbody')
  var region_row_start = Math.floor(rowpos/(nproducts + 1)) * (nproducts + 1) + 1;
  var region_row_end = region_row_start + nproducts;    

 $('tr', theTable).slice(region_row_start, region_row_end).each(function(j) {
  var thisInput = $('td:eq(' + colpos + ') input', this);
    if ($(thisInput).val().length!=0){
      if(!isNaN(filterNum($(thisInput).val(), pmethod))) {
          msum += parseFloat(filterNum($(thisInput).val(), pmethod));
      }
   }
  });
  var totalsRow = $('tr:eq(' + region_row_end + ')', theTable);
  $('td:eq(' + colpos + ')', totalsRow).html(sumFormat(msum.toFixed(2).replace(/(\.0*$|0*$)/,''), sformat));
}
//Support both a "sum as percent" summing method and "convert percent then sum" method:
// sum as percent "sumpercent" : any number not having a "%" will be multiplied by 100 in order to sum the numbers *as percentages"
// convert percent then sum "<anything else>": any number having a "%" will be divided by 100 in order to sum these numbers are fractions of 100
function filterNum(str, pmethod) {
 re = /\$|,|%|\)/g;
 re2 = /^\(/g;
 var noPercent = str.indexOf("%")<0 ? 1 : 0; 
 var str2 = str.replace(re2, "-");
 // remove "$", "%", and ","
 var str3 = str2.replace(re, "");
 if (pmethod == 'sumpercent')
  if (noPercent) str3 = parseFloat(str3)*100 + '';
 else
  if(!noPercent) str3 = parseFloat(str3) + '';
 return str3;
}

//user can specify the displayed sum format as "%" (append after sum) or anything else (append before sum, "$", or most other currency symbols)
function sumFormat(nStr, sformat) {
 var negNum = parseFloat(nStr)<0 ? 1 : 0;
 if (parseFloat(nStr)==0) return '-';
 var returnStr;
 if (sformat == '%')
  returnStr = addCommas((Math.abs(nStr).toFixed(2))) + sformat;
 else
  returnStr = sformat + addCommas((Math.abs(nStr).toFixed(2)));
 if(negNum) returnStr= '(' + returnStr + ')';
 return returnStr;
}
   
function addCommas(nStr)
{
 nStr += '';
 x = nStr.split('.');
 x1 = x[0];
 x2 = x.length > 1 ? '.' + x[1] : '';
 var rgx = /(\d+)(\d{3})/;
 while (rgx.test(x1)) {
  x1 = x1.replace(rgx, '$1' + ',' + '$2');
 }
 return x1 + x2;
}  