(function ($) {

  /***********************************************************
   *         Choose-a-tutorial dialog widget
   ***********************************************************
   */
    $.widget('systo.dialog_choose_tutorial', {

        meta: {
            short_description: 'Starts a tutorial selected by the user.',
            long_description: '<p>This dialog window presents a menu of available tutorials to the user, then '+
            'starts the selected one.</p>'+
            'Currently, the list of available tutorials is hard-wired in to this widget, but it will easy to '+
            'build the list automatically.  [Technical note: ...by looking at the properties of the '+
            'SYSTO.tutorials object]</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            options: {
            }
        },

        selectedModel:{},

        options: {
        },

        widgetEventPrefix: 'dialog_choose_tutorial:',

        _create: function () {
            $.Widget.prototype._create.apply(this); // I don't know what this does - got it from
            // http://stackoverflow.com/questions/3162901/how-to-derive-a-custom-widget-from-jquery-ui-dialog
            var self = this;
            this.element.addClass('dialog_choose_tutorial-1');

            var dialog = $(
                '<div id="open_dialog_form" title="Open a model" '+
                    'style="font-size:75%;">'+
                    '<p>Choose a tutorial from the list.</p>'+
                '</div>');

            var tutorialSelect = $(
                '<select size="4">'+
                '</select>'
            );

            var tutorials = {
                tank1: {label:'Simple tank model'},
                simple_sir: {label:'Simple SIR disease model'}
            };

            for (tutId in tutorials) {
                tutInfo = tutorials[tutId];
                var option = $('<option value="'+tutId+'">'+tutInfo.label+'</option>').
                    click(function(event) {
/*
                        SYSTO.state.tutorial.showInstruction = true;
                        var result = SYSTO.createNewModel_1({
                                file: 'jquery.dialog_choose_tutorial.js', 
                                action: 'Selected tutorial from list',
                                languageId: 'system_dynamics'});  // TODO: define in tutorial file
                        if (result.status === 'OK') {
                            SYSTO.state.languageId = 'system_dynamics';   // TODO: define in tutorial file
                            $('#tutorial').tutorial({
                                modelId: result.modelId, 
                                tutorialId: tutId,
                                start_step: 0,
                                end_step: 99
                            });
                        } else {
                            alert('Internal error - not your fault!\n\n'+result.message);
                        }
*/
                    });
                $(tutorialSelect).append(option);
            }

            $(dialog).append(tutorialSelect);

            var instructions = $('<p>The tutorial instructions will appear one at a time in a yellow box.  You can:'+
                '<ul>'+
                    '<li>Follow the instruction.   If successful, the tutorial will move on to the next instruction.  '+
                    'If you need help, press the Help button.   Or:</li>'+
                    '<li>Press the Cheat button.   This will do the next step for you, then show the next instructions.'+
                '</ul>');
            $(dialog).append(instructions);
         
            this._container = $(this.element).append(dialog);
            
            //$(dialog).dialog({
            $(this.element).dialog({
                autoOpen: false,
                //height: 600,
                width: 500,
                modal: true,
                title: 'Choose a tutorial',
                buttons: {
                    "OK": function() {
                        var tutorialId = $(tutorialSelect).val();
                        if (!tutorialId) {
                            alert('Please select a tutorial, or click Cancel.');
                            return;
                        }
                        console.debug(tutorialId);
                        SYSTO.state.tutorial.showInstruction = true;
                        var result = SYSTO.createNewModel_1({
                                file: 'jquery.dialog_choose_tutorial.js', 
                                action: 'Selected tutorial from list',
                                baseName: tutorialId,
                                languageId: 'system_dynamics'});  // TODO: define in tutorial file
                        if (result.status === 'OK') {
                            SYSTO.state.languageId = 'system_dynamics';   // TODO: define in tutorial file
                            try {
                                $('#tutorial').tutorial('destroy');
                            }
                            catch (x) {
                            }
                            $('#tutorial').tutorial({
                                modelId: result.modelId, 
                                tutorialId: tutorialId,
                                start_step: 0,
                                end_step: 99
                            });
                        } else {
                            alert('Internal error - not your fault!\n\n'+result.message);
                        }
                        $( this ).dialog( "close" );
                    },
                    Cancel: function() {
                        $( this ).dialog( "close" );
                    }
                },
                close: function() {
                }
            });

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('dialog_choose_tutorial-1');
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



})(jQuery);
