
// $File: //dev/EPS/js/jquery.showhide.js $ 
// $DateTime: 2011/05/16 10:35:10 $ 
// $Revision: #2 $ 
// $Author: matt $ 

jQuery.hideItems = function(item) {
 $("." + item.id).hide();
 $(".toggle_link", item).text($(".toggle_link", item).attr("show_text"))
 if ($(".toggle_image", item).length == 0) {var newimage = "images/expand.gif";} else {var newimage = $(".toggle_image", item).attr("show_image")};
 $(".toggle_image", item).attr("src", newimage);  
 return;
};

jQuery.showItems = function(item) {
 $("." + item.id).show();
 $(".toggle_link", item).text($(".toggle_link", item).attr("hide_text"))
 if ($(".toggle_image", item).length == 0) {var newimage = "images/collapse.gif";} else {var newimage = $(".toggle_image", item).attr("hide_image")};
 $(".toggle_image", item).attr("src", newimage);  
   return;
};

jQuery.forceShow = function(item) {
 var initState = getSubCookie('dock', item.id);
 if (initState == 'itemhide') {$(item).toggleClass("toggle_selected"); $.showItems(item); setSubCookie('dock',item.id,'itemshow');}
};

jQuery.forceHide = function(item) {
 var initState = getSubCookie('dock', item.id);
 if (initState == 'itemshow') {$(item).toggleClass("toggle_selected"); $.hideItems(item); setSubCookie('dock',item.id,'itemhide');}
};

jQuery.initShowHide = function(tclass) {
 $("." + tclass).each(function() {
  $(".toggle_image", this).addClass('toggle_handcursor');
  $(".toggle_link", this).addClass('toggle_fakelink toggle_handcursor');
  var initState = getSubCookie('dock', this.id);
  if (initState == null) initState = 'itemhide';
  if (initState == 'itemhide') $.hideItems(this); else $.showItems(this);
  setSubCookie('dock',this.id,initState);     
 });

 $("." + tclass).click(function() {
  $(this).toggleClass("toggle_selected");
  var currentState = getSubCookie('dock', this.id);
  if (currentState == 'itemhide') {
   var newState = 'itemshow'; 
   $.showItems(this); 
  } else {
   var newState = 'itemhide';
   $.hideItems(this);
  }
  setSubCookie('dock',this.id,newState);
 });
};
