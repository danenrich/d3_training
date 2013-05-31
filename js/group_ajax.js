				var AjaxObj = new AjaxObject()
				AjaxObj.OnComplete = AjaxObj_Complete;
				AjaxObj.OnError    = AjaxObj_Error;

				function AjaxObj_Complete(responseText, responseXML)
				{
					// javascriptCode contains javascript code returned from Ajax_request.. 
					var javascriptCode = responseText.replace('&gt;', '>');
					var javascriptCode = javascriptCode.replace('&lt;', '<');
					
					if ( javascriptCode.length > 0 )
					{
						// using SetTimeout function to run javascript code return from the server - no time delay.
						setTimeout( javascriptCode, 0); 
					
					}
					setTimeout("HideLoadingDiv('ssssss ');" , 0) // Timeout for Debug-only

				}

				function AjaxObj_Error(status, statusText, responseText)
				{
					alert(responseText);
				}
			
				function UpdateProjects(tempid, groupid)					
				{	
					// This function returns a dropdown list of projects created with selected template.
					
					var queryString = 'getdata=temp_proj' + '&tempid=' + tempid + '&groupid=' + groupid ;
					
					// alert (queryString);
					
					if( queryString.length > 0 )
					{
						ShowLoadingDiv('Retrieving projects...');
						AjaxObj.Get_CallBack(queryString);
						
						//ShowHideModulesCheckboxes();
						
					    //alert ('UpdateProjects');
					}
					else
					{						
						AjaxObj.AbortCallBack();
					}			
				}
				
				function UpdateProjRolesAndModules( projid, tempid, groupid, global_proj_id)
				{
					// This function returns a list of project permissions checkboxes
					// and selects project role (if any) in project role dropdown list.
					var queryString = 'getdata=proj_permissions_user_list' + '&projid=' + projid + '&tempid=' + tempid + '&groupid=' + groupid + '&globalprojid=' + global_proj_id ;
					AjaxObj.Get_CallBack(queryString);
				};
				
				// This function loading all template modules for selected tempid 
				function LoadTemplateModules(tempid, groupid)
				{
					// This function returns a list of project permissions checkboxes
					// and selects project role (if any) in project role dropdown list.
					
					var queryString = 'getdata=template_modules' + '&projid=-1' + '&tempid=' + tempid + '&groupid=' + groupid				
					// alert (queryString);
					
					if( queryString.length > 0 )
					{
						AjaxObj.Get_CallBack(queryString);
						// Show or Hide Project Permissions
						// ShowHideModulesCheckboxes();
					}
					else
					{
						AjaxObj.AbortCallBack();
						// document.getElementById('errMsg').InnerHTML = "Ajax call failed - Check snoopLog for more error info." ;
					}					
				}
