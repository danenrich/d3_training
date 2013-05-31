
// jQuery extentions and prototypes

// $File: //dev/EPS/js/jquery.prototypes.js $ 
// $DateTime: 2011/05/16 10:35:10 $ 
// $Revision: #2 $ 
// $Author: matt $ 


// jQuery Overload to copy CSS styles
(function( $ ){
 $.fn.copyCSS = function( style, toNode ){
//   var self = $(this);
   var self = this;
   var tNode = $(toNode);
   if (!toNode.attr) {
    tNode = $(toNode);
   } else {
    tNode = toNode;
   }
   if( !$.isArray( style ) ) style=style.split(' ');
   $.each( style, function( i, name ){ tNode.css( name, self.css(name) ) } );
   return self;
 }
})( jQuery );



