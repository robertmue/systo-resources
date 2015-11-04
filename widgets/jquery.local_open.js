(function ($) {

  /***********************************************************
   *         Local-open widget
   ***********************************************************
   */
    $.widget('systo.local_open', {

        meta: {
            short_description: 'Opens (loads) a Systo model.',
            long_description: '<p>This widget eanbles you to load a model into Systo in one of 3 ways:'+
            '<ol>'+
            '<li>from a file held in the user\'s local file system;</li>'+
            '<li>from Local Storage;</li>'+
            '<li>by pasting text into a text box.</li>'+
            '</ol></p>'+
            '<p>Method 1 is equivalent to a conventional File > Open command.</p>'+
            '<p>Method 2 makes use of Local Storage, which is a very large (5MB) cache made available '+
            'by your browser.   Systo models are held in a flat list, by model ID.'+
            '<p>Method 3 requires that you have access to the text listing of a Systo model, for example, '+
            'sent to you in an email, or on a web page.  You simply copy-and-paste this text into the '+
            'text box provided.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            options: {
                modelId: {
                    description: 'The ID of the model.',
                    type: 'string (model ID)',
                    default: 'null'
                }
            }
        },

        selectedModel:{},

        options: {
            modelId:''
        },

        widgetEventPrefix: 'local_open:',

        _create: function () {
            $.Widget.prototype._create.apply(this); // I don't know what this does - got it from
            // http://stackoverflow.com/questions/3162901/how-to-derive-a-custom-widget-from-jquery-ui-dialog
            var self = this;
            this.element.addClass('local_open-1');

            //var selected = false;
            var selectedTitle;
            var selectedDescription;
            var selectedAuthor;

            var modelIdList = {};
            for (var key in localStorage) {
                var i1 = key.indexOf('_');
                var header = key.substring(0,i1);
                if (header === 'SYSTO') {
                    var rest = key.substring(i1+1);
                    var i2 = rest.indexOf('_');
                    var type = rest.substring(0,i2);
                    if (type === 'MODEL') {
                        var modelId = rest.substring(i2+1);
                        modelIdList[modelId] = {};
                    }
                }
            }
 
            var dialog = $(
                '<div id="open_dialog_form" title="Open a model" '+
                    'style="font-size:75%;">'+
                    '<p>You can open a model stored in Local Storage, held as a local file, or from a URL</p>'+
                '</div>');


            var tabsDiv = $(
                '<div id="open_dialog_tabs" style="overflow:auto; height:95%;">'+
	                '<ul>'+
		                '<li>'+
                            '<a id="open_dialog_tab_file_a" href="#open_dialog_tab_file" style="font-size:0.9em; font-weight:normal; outline-color:transparent; ">File</a>'+
                        '</li>'+
		                '<li>'+
                            '<a id="open_dialog_tab_localstorage_a" href="#open_dialog_tab_localstorage" style="font-size:0.9em; font-weight:normal; outline-color:transparent;">Local storage</a>'+
                        '</li>'+
		                '<li>'+
                            '<a id="open_dialog_tab_text_a" href="#open_dialog_tab_text" style="font-size:0.9em; font-weight:normal; outline-color:transparent;">Text</a>'+
                        '</li>'+
		                '<li>'+
                            '<a id="open_dialog_tab_url_a" href="#open_dialog_tab_url" style="font-size:0.9em; font-weight:normal; outline-color:transparent;">URL</a>'+
                        '</li>'+
		                '<li>'+
                            '<a id="open_dialog_tab_myexperiment_a" href="#open_dialog_tab_myexperiment" style="font-size:0.9em; font-weight:normal; outline-color:transparent;">myExperiment</a>'+
                        '</li>'+
                    '</ul>'+
                '</div>');
            $(dialog).append(tabsDiv);

            var fileDiv = $(
                '<div id="open_dialog_tab_file" style="float:left; width:300px; margin:10px; border:1px solid black; padding:5px;">'+
                    '<span><b>Source: Local file</b></span>'+
                '</div>');
            var localstorageDiv = $(
                '<div id="open_dialog_tab_localstorage">'+
                    '<span>Sorry - opening a model from Local Storage is not yet implemented</span>'+
                '</div>');
            var textDiv = $('<div id="open_dialog_tab_text">'+
                    '<span>Sorry - opening a model from text pasted into a text box is not yet implemented</span>'+
                '</div>');
            var urlDiv = $('<div id="open_dialog_tab_url">'+
                    '<span><b>Source: URL</b></span>'+
                '</div>');
            var myexperimentDiv = $('<div id="open_dialog_tab_myexperiment">'+
                    '<span><b>Source: myExperiment</span>'+
                '</div>');
            $(tabsDiv).append(fileDiv).append(localstorageDiv).append(textDiv).append(urlDiv).append(myexperimentDiv);

/*
            var sourceOptions = $('<div/>');
            $(dialog).append(sourceOptions);


            var sourceLocalStorage = $(
                '<div style="float:left; width:200px; margin:10px; border:1px solid black; padding:5px;">'+
                    '<span><b>Local Storage</b></span>'+
                '</div>');
            var sourceFile = $(
                '<div style="float:left; width:300px; margin:10px; border:1px solid black; padding:5px;">'+
                    '<span><b>Local file</b></span>'+
                '</div>');
            var sourceURL = $(
                '<div style="float:left; width:300px; margin:10px; border:1px solid black; padding:5px;">'+
                    '<span><b>URL</b></span>'+
                '</div>');
            $(sourceOptions).append(sourceLocalStorage).append(sourceFile).append(sourceURL);
*/

            // source=local storage - a <select> element
            var select = $('<select id="open_dialog_select" size="10" style="background-color:white; float:left; margin:10px;"/>').
                mouseout(function() {
                    console.debug('mouseout');
                    $('#open_dialog_display_title').text(selectedTitle);
                    $('#open_dialog_display_description').text(selectedDescription);
                    $('#open_dialog_display_author').text(selectedAuthor);
                });
            for (var modelId in modelIdList) {
                var option = $('<option value="'+modelId+'">'+modelId+'</option>').
                    mouseover(function(event) {
                        //if (!selected) {
                            var modelId = event.target.value;
                            var model = JSON.parse(localStorage.getItem('SYSTO_MODEL_'+modelId));
                            var title = model.meta.title;
                            var description = model.meta.description;
                            var author = model.meta.author;
                            $('#open_dialog_display_title').text(title);
                            $('#open_dialog_display_description').text(description);
                            $('#open_dialog_display_author').text(author);
                        //}
                    }).
                    click(function(event) {
                        var modelId = event.target.value;
                        var model = JSON.parse(localStorage.getItem('SYSTO_MODEL_'+modelId));
                        self.selectedModel = {id:modelId, model:model};
                        selectedTitle = model.meta.title;
                        selectedDescription = model.meta.description;
                        selectedAuthor = model.meta.author;
                        $('#open_dialog_display_title').text(selectedTitle);
                        $('#open_dialog_display_description').text(selectedDescription);
                        $('#open_dialog_display_author').text(selectedAuthor);
                        //selected = true;
                    });
                $(select).append(option);
            }
            //$(localstorageDiv).append(select);


            // source=local file - an <input type="file"> element
            var file = $(
                    '<div style="margin:10px;">'+
                        '<label for="files">Select a file: </label>'+
                        '<input id="files" type="file" />'+
                        '<output id="result" />'+
                    '</div');
            $(fileDiv).append(file);


            // source=URL - an <input type="text"> element
            var url = $(
                    '<div style="margin:10px;">'+
                        '<label for="url">Enter the URL: </label>'+
                        '<input id="url" type="text" size="37"/>'+
                        '<span>Example:<br/>http://www.similette.com/systo/miniworld.js</span>'+
                    '</div');
            $(urlDiv).append(url);

            // source=myExperiment 
            var myexperiment = $(
                    '<div style="margin:10px;">'+
                        '<span>Get model from myExperiment...</span>'+
                    '</div');
            $(myexperimentDiv).append(myexperiment);


            // The display div - for showing model metadata.
            var display = $(
                '<div style="clear:both; float:left; width:60%; margin-left:10px;margin-right:10px;">'+
                    '<span>Title</span>'+
                    '<div id="open_dialog_display_title" style="border:solid 1px black; width:100%; height:20px;"></div>'+
                    '<span>Description</span>'+
                    '<div id="open_dialog_display_description" style="border:solid 1px black; width:100%; height:80px;"></div>'+
                    '<span>Author</span>'+
                    '<div id="open_dialog_display_author" style="border:solid 1px black; width:100%; height:20px;"></div>'+
                '</div>');
            //$(dialog).append(display);
         
            this._container = $(this.element).append(dialog);

            $('#open_dialog_tabs').tabs({selected:0});
            
            //$(dialog).dialog({
            $(this.element).dialog({
                autoOpen: false,
                //height: 600,
                width: 500,
                modal: false,    // 6 July 2015 TODO: make modal.   Apparent bug with current jQuery UI
                title: 'Open a model',
                buttons: {
                    "OK": function() {
/*
                        //var openModelId = $('#open_dialog_select option:selected').text();
                        //var modelString = localStorage.getItem('SYSTO_MODEL_'+openModelId);
                        //var model = JSON.parse(modelString);
                        var openModelId = 'cascade';
                        //var openModelId = self.selectedModel.id;
                        //var model = self.selectedModel.model;
                        //SYSTO.models[openModelId] = model;
                        //document.write("<script src='http://www.similette.com/systo/models/cascade.js'><\/script>");
                        var oHead = document.getElementsByTagName('HEAD').item(0);
                        var oScript= document.createElement("script");
                        oScript.type = "text/javascript";
                        oScript.src="http://www.similette.com/systo/models/cascade.js";
                        oHead.appendChild( oScript);
                        SYSTO.state.currentModelId = openModelId;
                        alert('loading external model...'+openModelId);
                        SYSTO.switchToModel(openModelId);
*/
                        $( this ).dialog( "close" );
                    },
                    Cancel: function() {
                        $( this ).dialog( "close" );
                    }
                },
                close: function() {
                }
            });

            fileRead(self);


            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('local_open-1');
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


 
    function checkLength( o, n, min, max ) {
      if ( o.val().length > max || o.val().length < min ) {
        o.addClass( "ui-state-error" );
        updateTips( "Length of " + n + " must be between " +
          min + " and " + max + "." );
        return false;
      } else {
        return true;
      }
    }

 
    function checkRegexp( o, regexp, n ) {
      if ( !( regexp.test( o.val() ) ) ) {
        o.addClass( "ui-state-error" );
        updateTips( n );
        return false;
      } else {
        return true;
      }
    }


 
    function updateTips( t ) {
        console.debug(t);
      $('#local_open_validateTips')
        .text( t )
        .addClass( "ui-state-highlight" );
      setTimeout(function() {
        tips.removeClass( "ui-state-highlight", 1500 );
      }, 2000 );
    }




// Thanks to http://jsfiddle.net/0GiS0/nDVYd/
function fileRead(widget) {
    //Check File API support
    if (window.File && window.FileList && window.FileReader) {
        var filesInput = document.getElementById("files");

        filesInput.addEventListener("change", function(event) {

            console.debug('\n\n^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
            var files = event.target.files; //FileList object
            console.debug(files);
            var output = document.getElementById("result");

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var openModelId = file.name;
                console.debug('openModelId: '+openModelId);
                //Only plain text
                //if (!file.type.match('plain')) continue;
                var picReader = new FileReader();
                picReader.addEventListener("load", function(event) {
                    //try {
                        console.debug('trying======');
                        var fileString = event.target.result;
                        var istart = fileString.indexOf('{');
                        var iend = fileString.lastIndexOf('}');
                        console.debug(istart+', '+iend);
                        var modelString = fileString.substring(istart, iend+1);
                        console.debug(istart+', '+iend);
                        //console.debug(modelString);
                        var model = JSON.parse(modelString);
                        console.debug(model);
                        console.debug('model.meta.id: '+model.meta.id);
                        var modelId = model.meta.id;    // This is a biggie.   We can:
                            // 1. use the model's ID, as stored in model.meta.id, if provided; or
                            // 2. use the provided SYSTO.models.ID, if the model is held as a .js statement; or
                            // 3. use the file name; or
                            // 4. get the user to provide a name !!!
                        console.debug('----');
                        SYSTO.models[modelId] = model;
                        //SYSTO.state.currentModelId = modelId;
                        //$('.diagram_listener').trigger('click');  


                        var option = $('<option value="'+modelId+'" title="Model ID: '+modelId+'">'+model.meta.name+'</option>').
                            mouseover(function(event) {
                                var modelId = event.target.value;
                                var model = SYSTO.models[modelId];
                                var title = model.meta.title;
                                var description = model.meta.description;
                                var author = model.meta.author;
                            }).
                            click(function(event) {
                                var modelId = event.target.value;
                                var model = SYSTO.models[modelId];
                                //var backgroundColour = $('#toolbar_buttons').language_toolbar('option', 'button_background_node_normal');
                                SYSTO.revertToPointer();
                                //var modelStr = JSON.stringify(model);
                                //var modelBase64 = window.btoa(modelStr);
                                //console.debug(modelBase64);
                                //var modelStr1 = window.atob(modelBase64);
                                //console.debug(modelStr);
                                //var model1 = JSON.parse(modelStr1);
                                //console.debug(model1);
                                SYSTO.switchToModel(modelId);
                            });
                        $('#model_select').prepend(option);


                        SYSTO.revertToPointer();
                        SYSTO.switchToModel(modelId);
                        console.debug('vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv\n');
                    //}
                    //catch (err) {
                    //    alert('Error:\nFile does not contain a valid Systo model!');
                    //}
                    widget.selectedModel = {id:openModelId, model:model};
                    //$(this).dialog( "close" );

                });

                //Read the text file
                picReader.readAsText(file);
            }

        });
    }
    else {
        console.log("Your browser does not support the File API");
    }
}


// Alternative (not currently used)
// Derived from http://jsfiddle.net/jamiefearon/8kUYj/20/
/*
function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    f = files[0];
    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function (theFile) {
        return function (e) {
            JsonObj = e.target.result
            console.log(JsonObj);
            var parsedJSON = JSON.parse(JsonObj);
            var x = parsedJSON.nodes.stock1.label;
            alert(x);

        };
    })(f);

    // Read in JSON as a data URL.
    reader.readAsText(f, 'UTF-8');
}
*/

})(jQuery);
