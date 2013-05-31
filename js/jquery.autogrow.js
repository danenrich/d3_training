(function(jQuery) {
    
 var self = null;
 
 jQuery.fn.autogrow = function(o)
 { 
  return this.each(function() {
   new jQuery.autogrow(this, o);
  });
 };
 
    /**
     * The autogrow object.
     *
     * @constructor
     * @name jQuery.autogrow
     * @param Object e The textarea to create the autogrow for.
     * @param Hash o A set of key/value pairs to set as configuration properties.
     * @cat Plugins/autogrow
     *
     * Function has been modified to work in tandem with EPS resizeCols functionality -rss 07 25 10
     */
 
 jQuery.autogrow = function (e, o)
 {
  this.options     = o || {};
  this.dummy      = null;
  this.interval      = null;
  this.line_height    = this.options.lineHeight || parseInt(jQuery(e).css('line-height'));
  this.min_height     = this.options.minHeight || parseInt(jQuery(e).css('min-height'));
  this.max_height     = this.options.maxHeight || parseInt(jQuery(e).css('max-height'));;
  this.textarea     = jQuery(e);
  this.expand_tolerance = (!isNaN(this.options.expandTolerance) && this.options.expandTolerance > 0) ? this.options.expandTolerance : 1;

  if(isNaN(this.line_height))
    this.line_height = 0;
  
  // Only one textarea activated at a time, the one being used
  this.init();
 };
 
 jQuery.autogrow.fn = jQuery.autogrow.prototype = {
     autogrow: '1.2.3'
   };
 
  jQuery.autogrow.fn.extend = jQuery.autogrow.extend = jQuery.extend;
 
 jQuery.autogrow.fn.extend({
  init: function() {   
   var self = this;   
   this.textarea.css({overflow: 'hidden', display: 'block'});
   this.textarea.bind('focus', function() { self.startExpand() } ).bind('blur', function() { //On blur, we need to stop the periodic expanding, resize the column width to fit content, and then set the row height a final time since the width may have changed
      self.stopExpand(); 
      resizeCol(document.getElementById(self.textarea.attr('id'))); 
      self.checkExpand(); 
     });
   resizeCol(document.getElementById(self.textarea.attr('id')));
   this.checkExpand(); 
  },
       
  startExpand: function() {    
    var self = this;
   this.interval = window.setInterval(function() {self.checkExpand()}, 400);
  },
  
  stopExpand: function() {
   clearInterval(this.interval); 
  },
  
  checkExpand: function() {
   if (this.dummy == null) {
    this.dummy = jQuery('<div></div>');
    this.dummy.css({
     'font-size'  : this.textarea.css('font-size'),
     'font-family': this.textarea.css('font-family'),
     'width'      : this.textarea.css('width'),
     'padding'    : this.textarea.css('padding'),
     'line-height': this.line_height + 'px',
     'overflow-x' : 'hidden',
     'position'   : 'absolute',
     'top'        : 0,
     'left'   : -9999
     }).appendTo('body');
   } else {
    // If the dummy was already created, show it as it is hidden after expansion
    if (this.dummy.css('width') != this.textarea.css('width') ) this.dummy.css({'width' : this.textarea.css('width')}); //The width can change because we are resizing the column width based on content.
    this.dummy.show();
   }
   
   // Strip HTML tags
   var html = this.textarea.val().replace(/(<|>)/g, '');
   
   // IE is different, as per usual
   if (jQuery.browser.msie) {
    html = html.replace(/\n/g, '<BR/>new');
   }
   else {
    html = html.replace(/\n/g, '<br/>new');
   }
   
   if (this.dummy.html() != html) {
    this.dummy.html(html); 
    if (this.max_height > 0 && (this.dummy.height() + (this.expand_tolerance*this.line_height) > this.max_height)) {
     this.textarea.css('overflow-y', 'auto');
     if (this.textarea.height() < this.max_height) {
      this.textarea.animate({height: (this.max_height + (this.expand_tolerance*this.line_height)) + 'px'}, 100); 
     }
    }
    else {
     this.textarea.css('overflow-y', 'hidden');
     if (this.textarea.height() < this.dummy.height() + (this.expand_tolerance*this.line_height) || (this.dummy.height() < this.textarea.height())) { 
      if (this.dummy.height() < this.min_height) {
       this.textarea.animate({height: (this.min_height + (this.expand_tolerance*this.line_height)) + 'px'}, 100); 
      } else {
       this.textarea.animate({height: (this.dummy.height() + (this.expand_tolerance*this.line_height)) + 'px'}, 100); 
      }
     }
    }
   }

   // Hide the dummy, as otherwise it overflows the body when the content is long
   this.dummy.hide();
  }
       
  });
})(jQuery);
