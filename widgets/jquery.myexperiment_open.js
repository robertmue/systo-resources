(function ($) {

  /***********************************************************
   *         myexperiment_open widget
   ***********************************************************
   */
  // https://developer.yahoo.com/yql/guide/response.html - keep JSON as JSON (don't let YQL convert to XML)

    $.widget('systo.myexperiment_open', {
        meta:{
            short_description: 'View and open models stored as workflows on myexperiment.org.',
            long_description: 'This widget uses myExperiment\'s REST API to find Systo models stored '+
                'as workflows on myexperiment.org, and to load (open) a selected model.',
            author: 'Robert Muetzelfeldt',
            last_modified: 'May 2015',
            visible: true,
            options: {
            }
        },

        options: {
        },

        widgetEventPrefix: 'myexperiment_open:',

        _create: function () {
            var self = this;
            this.element.addClass('myexperiment_open-1');

            var div = $('<div style="border:solid 1px gray; margin:5px;"></div>');

            var modelsDiv = $('<div></div');
            var modelsTable = $(
                '<table style=" border-collapse:collapse;">'+
                    '<tr>'+
                        '<th>Number</th>'+
                        '<th>ID</th>'+
                        '<th>Name</th>'+
                        '<th>Title</th>'+
                        '<th>Author</th>'+
                        '<th>Date</th>'+
                    '</tr>'+
                '</table>');
            $(modelsDiv).append(modelsTable);
            $(div).append(modelsDiv);
            
            populateModelsTable(modelsTable);
            $(modelsTable).find('th').css('border', 'solid 1px gray');


            this._container = $(this.element).append(div);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('myexperiment_open-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
            var fnMap = {
            };

            // base
            this._super(key, value);

            if (key in fnMap) {
                fnMap[key]();

                // Fire event
                this._triggerOptionChanged(key, prev, value);
            }
        },

        _triggerOptionChanged: function (optionKey, previousValue, currentValue) {
            this._trigger('setOption', {type: 'setOption'}, {
                option: optionKey,
                previous: previousValue,
                current: currentValue
            });
        }
    });


    function populateModelsTable(modelsTable) {

        // search - get search results for 'simile' workflows
        var xmlSourceSearch1 = "http://www.myexperiment.org/search.xml?query=systo&type=workflow";
        var yqlUrlSearch1 = 
            "http://query.yahooapis.com/v1/public/yql"+
            "?q=" + encodeURIComponent("select * from xml where url='" + xmlSourceSearch1 + "'")+
            "&format=xml&callback=?";
        $.getJSON(yqlUrlSearch1, function(data){
            console.debug('\n=============================================\n'+xmlSourceSearch1);
            console.debug(data);
            xmlContent = $(data.results[0]);
            console.debug(xmlContent[0]);
            var fileObject = $.xml2json(xmlContent[0],true);
            console.debug(fileObject);
            var workflows = fileObject.workflow;
            for (var i=0; i<workflows.length; i++) {
                var workflow = workflows[i];
                console.debug(workflow.text+': '+workflow.uri);
                var j = i+1;
                var row = $(
                    '<tr>'+
                        '<td>'+j+'</td>'+
                        '<td class="model_id">'+workflow.id+'</td>'+
                        '<td class="model_name">'+workflow.text+'</td>'+
                        '<td>http://www.myexperiment.org/workflows/'+workflow.id+'/download</td>'+
                        '<td>Robert</td>'+
                        '<td>25 May 2015</td>'+
                    '</tr>');
                $(modelsTable).append(row);
                $(row).find('.model_name').
                    css('color','#0000c0c0').
                    click({workflow_id:workflow.id},function(event) {
                        xmlSourceWorkflow = 'http://www.myexperiment.org/workflow.xml?id='+event.data.workflow_id;
                        yqlUrlWorkflow = 
                            "http://query.yahooapis.com/v1/public/yql"+
                            "?q=" + encodeURIComponent("select * from xml where url='" + xmlSourceWorkflow + "'")+
                            "&format=xml&callback=?";
                        $.getJSON(yqlUrlWorkflow, function(data){
                            xmlContent = $(data.results[0]);
                            var xmlString = new XMLSerializer().serializeToString(xmlContent[0]);
                            var i1 = xmlString.indexOf('<content-uri>')+13;
                            var i2 = xmlString.indexOf('</content-uri>');
                            var contentUri = xmlString.substring(i1,i2);
                            SYSTO.loadModelFromUrl(contentUri);
                        });
                    });
            }
            $(modelsTable).find('td').css({border:'solid 1px gray',padding:'5px'});
        });


    }




    function processYqlObjects(yqlObjects, systoObjects) {
        for (var key in yqlObjects) {
            if (yqlObjects[key][0].text) {
                var value = yqlObjects[key][0].text;
                if (key !== 'value' && isNumericConstant(value)) {
                    systoObjects[key] = parseFloat(value);
                } else {
                    systoObjects[key] = yqlObjects[key][0].text;
                }
            } else if (yqlObjects[key][0] === "") {
                systoObjects[key] = "";
            } else {
                var yqlObject = yqlObjects[key][0];
                systoObjects[key] = processYqlObjects(yqlObject, {});
            }
        }
        return systoObjects;
    }

    function isNumericConstant(value) {
        if (value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        } else {
            return false;
        }
    }

function xml2json(xml, tab) {
   var X = {
      toObj: function(xml) {
         var o = {};
         if (xml.nodeType==1) {   // element node ..
            if (xml.attributes.length)   // element with attributes  ..
               for (var i=0; i<xml.attributes.length; i++)
                  o["@"+xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue||"").toString();
            if (xml.firstChild) { // element has child nodes ..
               var textChild=0, cdataChild=0, hasElementChild=false;
               for (var n=xml.firstChild; n; n=n.nextSibling) {
                  if (n.nodeType==1) hasElementChild = true;
                  else if (n.nodeType==3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                  else if (n.nodeType==4) cdataChild++; // cdata section node
               }
               if (hasElementChild) {
                  if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                     X.removeWhite(xml);
                     for (var n=xml.firstChild; n; n=n.nextSibling) {
                        if (n.nodeType == 3)  // text node
                           o["#text"] = X.escape(n.nodeValue);
                        else if (n.nodeType == 4)  // cdata node
                           o["#cdata"] = X.escape(n.nodeValue);
                        else if (o[n.nodeName]) {  // multiple occurence of element ..
                           if (o[n.nodeName] instanceof Array)
                              o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                           else
                              o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                        }
                        else  // first occurence of element..
                           o[n.nodeName] = X.toObj(n);
                     }
                  }
                  else { // mixed content
                     if (!xml.attributes.length)
                        o = X.escape(X.innerXml(xml));
                     else
                        o["#text"] = X.escape(X.innerXml(xml));
                  }
               }
               else if (textChild) { // pure text
                  if (!xml.attributes.length)
                     o = X.escape(X.innerXml(xml));
                  else
                     o["#text"] = X.escape(X.innerXml(xml));
               }
               else if (cdataChild) { // cdata
                  if (cdataChild > 1)
                     o = X.escape(X.innerXml(xml));
                  else
                     for (var n=xml.firstChild; n; n=n.nextSibling)
                        o["#cdata"] = X.escape(n.nodeValue);
               }
            }
            if (!xml.attributes.length && !xml.firstChild) o = null;
         }
         else if (xml.nodeType==9) { // document.node
            o = X.toObj(xml.documentElement);
         }
         else
            alert("unhandled node type: " + xml.nodeType);
         return o;
      },
      toJson: function(o, name, ind) {
         var json = name ? ("\""+name+"\"") : "";
         if (o instanceof Array) {
            for (var i=0,n=o.length; i<n; i++)
               o[i] = X.toJson(o[i], "", ind+"\t");
            json += (name?":[":"[") + (o.length > 1 ? ("\n"+ind+"\t"+o.join(",\n"+ind+"\t")+"\n"+ind) : o.join("")) + "]";
         }
         else if (o == null)
            json += (name&&":") + "null";
         else if (typeof(o) == "object") {
            var arr = [];
            for (var m in o)
               arr[arr.length] = X.toJson(o[m], m, ind+"\t");
            json += (name?":{":"{") + (arr.length > 1 ? ("\n"+ind+"\t"+arr.join(",\n"+ind+"\t")+"\n"+ind) : arr.join("")) + "}";
         }
         else if (typeof(o) == "string")
            json += (name&&":") + "\"" + o.toString() + "\"";
         else
            json += (name&&":") + o.toString();
         return json;
      },
      innerXml: function(node) {
         var s = ""
         if ("innerHTML" in node)
            s = node.innerHTML;
         else {
            var asXml = function(n) {
               var s = "";
               if (n.nodeType == 1) {
                  s += "<" + n.nodeName;
                  for (var i=0; i<n.attributes.length;i++)
                     s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue||"").toString() + "\"";
                  if (n.firstChild) {
                     s += ">";
                     for (var c=n.firstChild; c; c=c.nextSibling)
                        s += asXml(c);
                     s += "</"+n.nodeName+">";
                  }
                  else
                     s += "/>";
               }
               else if (n.nodeType == 3)
                  s += n.nodeValue;
               else if (n.nodeType == 4)
                  s += "<![CDATA[" + n.nodeValue + "]]>";
               return s;
            };
            for (var c=node.firstChild; c; c=c.nextSibling)
               s += asXml(c);
         }
         return s;
      },
      escape: function(txt) {
         return txt.replace(/[\\]/g, "\\\\")
                   .replace(/[\"]/g, '\\"')
                   .replace(/[\n]/g, '\\n')
                   .replace(/[\r]/g, '\\r');
      },
      removeWhite: function(e) {
         e.normalize();
         for (var n = e.firstChild; n; ) {
            if (n.nodeType == 3) {  // text node
               if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                  var nxt = n.nextSibling;
                  e.removeChild(n);
                  n = nxt;
               }
               else
                  n = n.nextSibling;
            }
            else if (n.nodeType == 1) {  // element node
               X.removeWhite(n);
               n = n.nextSibling;
            }
            else                      // any other node
               n = n.nextSibling;
         }
         return e;
      }
   };
   if (xml.nodeType == 9) // document node
      xml = xml.documentElement;
   var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
   return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
}

/*
    function processYqlObjects(yqlObjects, systoObjects) {

        for (var key in yqlObjects) {
            if (key === 'text') {
                systoObjects.text = yqlObjects[key][0];
            } else {
                var yqlObject = yqlObjects[key][0];
                systoObjects[key] = processSubobjects[yqlObjects, systoObjects];
            }
        }
        return systoObjects;
    }
*/


})(jQuery);
