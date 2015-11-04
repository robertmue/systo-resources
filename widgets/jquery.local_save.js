(function ($) {

  /***********************************************************
   *         Local-save widget
   ***********************************************************
   */
    $.widget('systo.local_save', {

        meta: {
            short_description: 'Saves a Systo model to your local file system',
            long_description: '<p>This widget is equivalent to a normal File > Open operation.</p>',
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

        options: {
            modelId:''
        },

        widgetEventPrefix: 'local_save:',

        _create: function () {
            console.debug('@log. creating_widget: local_save');
            $.Widget.prototype._create.apply(this); // I don't know what this does - got it from
            // http://stackoverflow.com/questions/3162901/how-to-derive-a-custom-widget-from-jquery-ui-dialog
            var self = this;
            this.element.addClass('local_save-1');
/*
            var div = $('<div></div>');
            var modelName = $('<input type="text" id="modelName"></input>');
            var saveButton = $('<button>Save</button>').
                click(function () {
                    // The following line DOES NOT WORK.  It returns
                    // {"meta":{},"nodes":{},"arcs":{}} 
                    // i.e. the original value, rather than the current value.    WHY?
                    //var modelJSON = JSON.stringify(SYSTO.models.new, ['meta', 'nodes', 'arcs']);
                    var meta = SYSTO.models.new.meta;
                    var nodes = SYSTO.models.new.nodes;
                    var arcs = SYSTO.models.new.arcs;
                    var modelJSON = JSON.stringify({meta:meta, nodes:nodes, arcs:arcs},{},1);
                    var modelName = $('#modelName').val();
                    localStorage.setItem(modelName, modelJSON);
                });
            var loadButton = $('<button>Load</button>').
                click(function () {
                    var modelName = $('#modelName').val();
                    var modelJSON = localStorage.getItem(modelName, modelJSON);
                    SYSTO.models.new = JSON.parse(modelJSON);
                    $('.diagram_listener').trigger('click');
                });
            $(div).append(modelName).append(saveButton).append(loadButton);

            var displayJSON = $('<textarea id="displayJSON" rows="15" cols="40"></textarea>"');
            var displayButton = $('<button>Display</button>').
                click(function () {
                    // The following line DOES NOT WORK.  It returns
                    // {"meta":{},"nodes":{},"arcs":{}} 
                    // i.e. the original value, rather than the current value.    WHY?
                    //var modelJSON = JSON.stringify(SYSTO.models.new, ['meta', 'nodes', 'arcs']);
                    var meta = SYSTO.models.new.meta;
                    var nodes = SYSTO.models.new.nodes;
                    var arcs = SYSTO.models.new.arcs;
                    var modelJSON = JSON.stringify({meta:meta, nodes:nodes, arcs:arcs},{},1);
                    $('#displayJSON').val(modelJSON);
                });
            var loadFromDisplayButton = $('<button>Load</button>').
                click(function () {
                    var modelJSON = $('#displayJSON').val();
                    SYSTO.models.new = JSON.parse(modelJSON);
                    $('.diagram_listener').trigger('click');
                });
            $(div).append(displayJSON).append(displayButton).append(loadFromDisplayButton);
*/

            //var div = $('<div></div>');

            var model = SYSTO.models[this.options.modelId];
            if (model.meta.title) {
                var title = model.meta.title;
            } else {
                title = '';
            }
            if (model.meta.description) {
                var description = model.meta.description;
            } else {
                description = '';
            }
            if (model.meta.author) {
                var author = model.meta.author;
            } else {
                author = '';
            }
            if (!model.meta.id) {
                model.meta.id = SYSTO.getUID();
            }
            var modelId = model.meta.id;
/*
            var modelIdList = {};
            for (var key in localStorage) {
                var i1 = key.indexOf('_');
                var header = key.substring(0,i1);
                if (header === 'SYSTO') {
                    var modelId = key.substring(i1+1);
                    var rest = key.substring(i1+1);
                    var i2 = rest.indexOf('_');
                    var type = rest.substring(0,i2);
                    if (type === 'MODEL') {
                        var modelId = rest.substring(i2+1);
                        modelIdList[modelId] = {};
                    }
                }
          }
*/

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



 /*
            var dialog = $(
                '<div id="save_dialog_form" title="Save the model" style="font-size:75%;">'+
                    '<form style="width:400px;">'+
                        '<fieldset>'+
                            '<p>All fields are optional</p>'+
                            '<label for="local_save_name">Name - <i style="color:#808080">default is model ID: change to something better</i></label>'+
                            '<input type="text" id="local_save_name" name="name" class="text ui-widget-content ui-corner-all" value="'+this.options.modelId+'"/>'+

                            '<label for="local_save_title">Title - <i style="color:#808080">a single-line title for the model</i></label>'+
                            '<input type="text" id="local_save_title" name="title" class="text ui-widget-content ui-corner-all" value="'+title+'"/>'+

                            '<label for="local_save_description">Description</label>'+
                            '<textarea type="text" rows="5" cols="52" id="local_save_description" name="description" class="text ui-widget-content ui-corner-all">'+description+'</textarea>'+
                            '<label for="local_save_author">Author</label>'+
                            '<input type="text" id="local_save_author" name="author" class="text ui-widget-content ui-corner-all" value="'+author+'"/>'+
                        '</fieldset>'+
                    '</form>'+
                '</div>');
*/ 
            var dialog = $(
                '<div id="save_dialog_form" title="Open a model" '+
                    'style="font-size:75%;">'+
                    '<p>You can open a model stored in Local Storage, held as a local file, or from a URL</p>'+
                    '<div>'+
                        '<input style="float:left;" type="checkbox" name="replaceParameterValues" id="replaceParameterValues"></input>'+
                        '<label style="float:left; margin-left:5px; " for="replaceParameterValues">Overwrite parameter values with current values</label>'+
                        '<button id="replaceParameterValuesHelp" style="float:left; margin-left:10px;"><b>?</b></button>'+
                    '</div>'+
                '</div>');


            var tabsDiv = $(
                '<div id="save_dialog_tabs" style="float:left; margin-top:10px; overflow:auto; height:95%;">'+
	                '<ul>'+
		                '<li>'+
                            '<a id="save_dialog_tab_file_a" href="#save_dialog_tab_file" style="font-size:0.9em; font-weight:normal; outline-color:transparent;">File</a>'+
                        '</li>'+
		                '<li>'+
                            '<a id="save_dialog_tab_localstorage_a" href="#save_dialog_tab_localstorage" style="font-size:0.9em; font-weight:normal; outline-color:transparent;">Local storage</a>'+
                        '</li>'+
		                '<li>'+
                            '<a id="save_dialog_tab_text_a" href="#save_dialog_tab_text" style="font-size:0.9em; font-weight:normal; outline-color:transparent;">Text</a>'+
                        '</li>'+
                    '</ul>'+
                '</div>');
            $(dialog).append(tabsDiv);

            var fileDiv = $(
                '<div id="save_dialog_tab_file" style="float:left; width:450px; margin:10px;padding:5px;">'+
                    '<span>Edit model metadata (optional), then click on <b>Save</b> button below.</span>'+
                '</div>');
            var localstorageDiv = $(
                '<div id="save_dialog_tab_localstorage" style="float:left; width:450px; margin:10px; border:1px solid black; padding:5px;">'+
                    '<span><b>Save to Local Storage</b></span>'+
                '</div>');
            var textDiv = $('<div id="save_dialog_tab_text">'+
                    '<span><b>Display as text</b>, for saving by cut-and-paste</span>'+
                '</div>');
            $(tabsDiv).append(fileDiv).append(localstorageDiv).append(textDiv);


            var display = $(
                    '<form style="width:400px;">'+
                        '<fieldset>'+
                            '<label for="save_dialog_display_name">Name - <i style="color:#808080">default is model ID: change to something better</i></label>'+
                            '<input type="text" id="save_dialog_display_name" name="name" class="text ui-widget-content ui-corner-all" value="'+this.options.modelId+'"/>'+

                            '<label for="save_dialog_display_title">Title - <i style="color:#808080">a single-line title for the model</i></label>'+
                            '<input type="text" id="save_dialog_display_title" name="title" class="text ui-widget-content ui-corner-all" value="'+title+'"/>'+

                            '<label for="save_dialog_display_description">Description</label>'+
                            '<textarea type="text" rows="5" cols="52" id="save_dialog_display_description" name="description" class="text ui-widget-content ui-corner-all">'+description+'</textarea>'+
                            '<label for="save_dialog_display_author">Author</label>'+
                            '<input type="text" id="save_dialog_display_author" name="author" class="text ui-widget-content ui-corner-all" value="'+author+'"/>'+
                        '</fieldset>'+
                    '</form>');
           $(dialog).append(display);


            this._container = $(this.element).append(dialog);

            $('#replaceParameterValuesHelp').click(function() {
                alert('If you select this option, then all model parameters will be set to their '+
                    'current values (e.g. as set by the sliders).\n\nThese could possibly be '+
                    'different from the ones provided with the model.\n\nOnly select this option '+
                    'if you are really sure you want to do this!');
            });
            
            $('#save_dialog_tabs').tabs({selected:0});

            var name = $('#save_dialog_display_name');
            var title = $('#save_dialog_display_title');
            var description = $('#save_dialog_display_description');
            var author = $('#save_dialog_display_author');
            var allFields = $( [] ).add(name).add(title).add(description).add(author);
            var tips = $('.validateTips');

            $(this.element).dialog({
                title: 'Save the model',
                autoOpen: false,
                height: 370,
                width: 550,
                modal: true,
                buttons: {
                    "Save": function() {
                        // http://codereview.stackexchange.com/questions/35263/html5-file-api-demo
                        var model = SYSTO.models[SYSTO.state.currentModelId];
                        var nameObj = $("#save_dialog_display_name");
                        var titleObj = $("#save_dialog_display_title");
                        var descriptionObj = $("#save_dialog_display_description");
                        var authorObj = $("#save_dialog_display_author");
                        var allFields = $([]).add(nameObj).add(titleObj).add(descriptionObj).add(authorObj);

/*
                        var bValid = true;
                        allFields.removeClass( "ui-state-error" );           
                        bValid = bValid && checkLength(nameObj, 'model name', 3, 100 );
                        bValid = bValid && checkRegexp(nameObj, /^[a-z]([0-9a-z_])+$/i, "Username may consist of a-z, 0-9, underscores, begin with a letter." );             
                        bValid = bValid && checkLength(titleObj, 'title', 0, 80 );
                        bValid = bValid && checkLength(descriptionObj, 'description', 0, 200 );
                        bValid = bValid && checkLength(authorObj, 'author', 0, 60 );
*/
                        var errorArray = [];
                        var checkResult = checkLength(nameObj, 'model name', 3, 100 );
                        if (checkResult.error) {
                            errorArray.push(checkResult.message);
                        }
                        checkResult = checkRegexp(nameObj, /^[a-z]([0-9a-z_])+$/i, "Name must consist of a-z, 0-9, underscores, begin with a letter." );
                        if (checkResult.error) {
                            errorArray.push(checkResult.message);
                        }
                        checkResult = checkLength(titleObj, 'title', 0, 80 );
                        if (checkResult.error) {
                            errorArray.push(checkResult.message);
                        }
                        checkResult = checkLength(descriptionObj, 'description', 0, 200 );
                        if (checkResult.error) {
                            errorArray.push(checkResult.message);
                        }
                        checkResult = checkLength(authorObj, 'author', 0, 60 );
                        if (checkResult.error) {
                            errorArray.push(checkResult.message);
                        }

                        if ( errorArray.length === 0 ) {
                            var name = $('#save_dialog_display_name').val();
                            var title = $('#save_dialog_display_title').val();
                            var description = $('#save_dialog_display_description').val();
                            var author = $('#save_dialog_display_author').val();
                            model.meta.name = name;
                            model.meta.title = title;
                            model.meta.description = description;
                            model.meta.author = author;
                            var replaceParamValues = $('#replaceParameterValues').is(':checked');
                            var modelPrepared = SYSTO.prepareModelForSaving(model, replaceParamValues);
                            var outputXmlStr, blob;
                            outputXmlStr = JSON.stringify(modelPrepared,null,3);
                            outputXmlStr = 'SYSTO.models.'+model.meta.id+' = '+outputXmlStr+';';
                            //alert(JSON.stringify(model.meta));
                            // If the string is null or empty, do nothing.
                            if (!outputXmlStr) {
                                return;
                            }
                            blob = new Blob([outputXmlStr], { type: 'text/plain' });
                            // Use the FileSaver.js interface to download the file.
                            saveAs(blob, name+'.js');
                            $( this ).dialog( "close" );
                        } else {
                            alert('Error(s) in the form - please correct.'+
                                '\n'+JSON.stringify(errorArray));
                        }
                    },
                    Cancel: function() {
                        $( this ).dialog( "close" );
                    }
                },
                open: function() {
                    console.debug('Opening save-model dialogue');
                    var modelId = SYSTO.state.currentModelId;
                    console.debug(modelId);
                    var model = SYSTO.models[modelId];
                    console.debug(JSON.stringify(model.meta));

                    if (!model.meta.name) model.meta.name = modelId;
                    if (!model.meta.title) model.meta.title = 'no title';
                    if (!model.meta.description) model.meta.description = 'no description';
                    if (!model.meta.author) model.meta.author = 'no author';

                    $('#save_dialog_display_name').val(model.meta.name);
                    $('#save_dialog_display_title').val(model.meta.title);
                    $('#save_dialog_display_description').val(model.meta.description);
                    $('#save_dialog_display_author').val(model.meta.author);
                },
                close: function() {
                    allFields.val( "" ).removeClass( "ui-state-error" );
                }
            });

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('local_save-1');
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
        //updateTips( "Length of " + n + " must be between " +
        //  min + " and " + max + "." );
        return {error:true,message:"Length of " + n + " must be between " +
          min + " and " + max + "."};
      } else {
        return {error:false};
      }
    }

 
    function checkRegexp( o, regexp, n ) {
      if ( !( regexp.test( o.val() ) ) ) {
        o.addClass( "ui-state-error" );
        //updateTips( n );
        return {error:true, message:n};
      } else {
        return {error:false};
      }
    }


 
    function updateTips( t ) {
        console.debug(t);
      $('#local_save_validateTips')
        .text( t )
        .addClass( "ui-state-highlight" );
      setTimeout(function() {
        tips.removeClass( "ui-state-highlight", 1500 );
      }, 2000 );
    }


})(jQuery);
