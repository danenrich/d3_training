// var xmlHttp;
// var ajaxUrl = 'http://localhost/Eps.net/AjaxRequest.aspx?q=';
var is_ie = (navigator.userAgent.indexOf('MSIE') >= 0) ? 1 : 0;
var is_ie5 = (navigator.appVersion.indexOf('MSIE 5.5') != -1) ? 1 : 0;
var is_opera = ((navigator.userAgent.indexOf('Opera6') != -1) || (navigator.userAgent.indexOf('Opera/6') != -1)) ? 1 : 0;
//netscape, safari, mozilla behave the same???
var is_netscape = (navigator.userAgent.indexOf('Netscape') >= 0) ? 1 : 0;

var ajaxUrl;

function initAjaxRequestUrl(epspath, page) {
  ajaxUrl = epspath + '/' + page + '?';
}


function AjaxObject()
{
  this.XmlHttp = this.GetHttpObject();
}

AjaxObject.prototype.GetHttpObject = function()
    {
  var objXmlHttp = null;    //Holds the local xmlHTTP object instance

  //Depending on the browser, try to create the xmlHttp object
  if (is_ie) {
    // The object to create depends on version of IE
    // If it isn't ie5, then default to the Msxml2.XMLHTTP object
    var strObjName = (is_ie5) ? 'Microsoft.XMLHTTP' : 'Msxml2.XMLHTTP';

    //Attempt to create the object
    try {
      objXmlHttp = new ActiveXObject(strObjName);

    }
    catch (e) {
      // Object creation errored
      return false;
    }
  }
  else if (is_opera) {
    // Opera has some issues with xmlHttp object functionality
    return false;
  }
  else {
    // Mozilla or Netscape or Safari
    objXmlHttp = new XMLHttpRequest();
  }

  //Return the instantiated object
  return objXmlHttp;

};

AjaxObject.prototype.Get_CallBack = function(queryStr)
    {
  var thePage = ajaxUrl + queryStr;
  if (this.XmlHttp)
  {
    if (this.XmlHttp.readyState == 4 || this.XmlHttp.readyState == 0)
    {
      var oThis = this;
      this.XmlHttp.open('GET', thePage, true);
      this.XmlHttp.onreadystatechange = function()
          { oThis.ReadyStateChange(); };
      this.XmlHttp.send(null);
    }
  }
};

AjaxObject.prototype.Post_CallBack = function(eventTarget, eventArgument, theForm)
    {
  var theData = '';
  var thePage = ajaxUrl;

  if (this.XmlHttp)
  {
    if (this.XmlHttp.readyState == 4 || this.XmlHttp.readyState == 0)
    {
      var oThis = this;
      this.XmlHttp.open('POST', thePage, true);
      this.XmlHttp.onreadystatechange = function()
          { oThis.ReadyStateChange(); };
      this.XmlHttp.setRequestHeader('Content-Type',
          'application/x-www-form-urlencoded');
      this.XmlHttp.send(theData);
    }
  }
};

AjaxObject.prototype.AbortCallBack = function()
    {
  if (this.XmlHttp)
    this.XmlHttp.abort();
};

AjaxObject.prototype.OnLoading = function()
    {
  // Loading
};

AjaxObject.prototype.OnLoaded = function()
    {
  // Loaded
};

AjaxObject.prototype.OnInteractive = function()
    {
  // Interactive
};

AjaxObject.prototype.OnComplete = function(responseText, responseXml)
    {

};

AjaxObject.prototype.OnAbort = function()
    {
  // Abort
};

AjaxObject.prototype.OnError = function(status, statusText)
    {
  // Error
};

AjaxObject.prototype.ReadyStateChange = function()
    {

  if (this.XmlHttp.readyState == 1)
  {
    this.OnLoading();
  }
  else if (this.XmlHttp.readyState == 2)
  {
    this.OnLoaded();
  }
  else if (this.XmlHttp.readyState == 3)
  {
    this.OnInteractive();
  }
  else if (this.XmlHttp.readyState == 4)
  {
    if (this.XmlHttp.status == 0)
    {
      this.OnAbort();
    }
    else if (this.XmlHttp.status == 200 && this.XmlHttp.statusText == 'OK')
    {
      this.OnComplete(this.XmlHttp.responseText, this.XmlHttp.responseXML);

    }
    else
    {
      this.OnError(this.XmlHttp.status,
          this.XmlHttp.statusText,
          this.XmlHttp.responseText);

    }
  }
};

function escape_amp(inStr)
{
  var regString = /amp;/g;
  return inStr.replace(regString, '');
}
