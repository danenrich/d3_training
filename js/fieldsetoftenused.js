
//fielset and legend defined, this sets the blue border and heading for each form


//fielset and legend defined, this sets the blue border and heading for each form

$(document).ready(function(){  
 	$('fieldset').not(".staticwidth").addClass("ui-widget ui-widget-content").attr("style","padding-top:15px;");
  $('fieldset.staticwidth').addClass("ui-widget ui-widget-content").attr("style","padding-top:15px;");
  $('legend').addClass("ui-widget-header ui-corner-all");		        
	
	setTimeout("alignFieldsets()",1);
		
	//buttonset hides the 'Previous' and  'Next' buttons while changing the title of the 'Submit' button to 'Update'
	var buttons=$('.buttonset');
	$('tr:eq(1) td:eq(1), tr:eq(1) td:eq(0)',buttons).hide();
	$('tr:eq(1) td:eq(2) input',buttons).attr('value', 'Update').attr('title', 'Reload the page with the filter changes.');
	$('.hidden').hide();
	
	var p1State = getSubCookie('dock', 'display_incroy');
  if (p1State == null) p1State = 'itemshow';
  var p1Img = (p1State == 'itermhide') ? 'images/ui_OM_expand.gif' : 'images/ui_OM_collapse.gif' ;
});

			
	function setDockCookie(theNode, uniqueStr) {
		setSubCookie('dock',uniqueStr,$(theNode).css('display')=='none' ? 'itemshow': 'itemhide');
	}
		

function alignFieldsets() {

	if(initialRender==1) {
		setTimeout("alignFieldsets()",200);
		return;
	}
	
	//align the width of all fieldsets that don't have a class of staticwidth on them
	var dynamicFieldsets = $('fieldset').not('.staticwidth');
	var maxWidth = 0;
	$(dynamicFieldsets).each(function (i) {
		if($(this).width() > maxWidth) maxWidth = $(this).width();
	});
	$(dynamicFieldsets).each(function (i) {
		$(this).width(maxWidth+'px');
	});

	$('fieldset legend').not('.alwaysopen' || 'startclosed' || 'startopen').each(function() {
				var initState = getSubCookie('dock',  $('#formvar').attr('value') + $(this).text());
				$('.fsbody', this.parentNode).toggle(initState==null || initState=='itemshow');
			});
	$('fieldset legend.startclosed').each(function() {
				$('.fsbody', this.parentNode).css('display','none');
			});
	$('fieldset legend.startopen').each(function() {
				$('.fsbody', this.parentNode).css('display','block');
			});
	$('fieldset legend').not('.alwaysopen').each(function() {
				$(this).click(function() { 
					$('.fsbody', this.parentNode).toggle(setDockCookie($('.fsbody', this.parentNode), $('#formvar').attr('value') + $(this).text()));
					return false;
				});
			});		

}