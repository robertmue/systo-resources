(function ($) {
  /***********************************************************
   *         dialog_sd_node widget
   ***********************************************************
   */
    $.widget('systo.dialog_sd_node', {

        meta: {
            short_description: 'Standard dialogue for a System Dynamics node.',
            long_description: '<p>The typical use for this widget is for allowing the user to set various '+
            'properties for a node in a System Dynamics diagram - most obviously, the equation for the '+
            'node (or its initial value, if it is a stock node).    Used like this, the dialogue will '+
            'appear when (typically) the user double-clicks on a node.</p>'+
            '<p>However, the widget can be used for other modelling languages which also have an equation '+
            'attached to a node.   Also, it could also conceivably be used when the model is presented in '+
            'some other (e.g. non-diagrammatic) way - e.g. as a text list of variables in the model - in '+
            'which case the user could click onthe variable name to open up this dialogue.</p>'+
            '<p>This widget (currently) has 3 tabs:'+
            '<ul><li>the Equation tab - for vieweing or entering an equation for the node;</li>'+
            '<li>the Graph tab - for sletching a graphical relationship between this variable and one other variable; and</li>'+
            '<li>the Documenation tab - for providing extra information about the node.</li></ul>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            options: {
                modelId: {
                    description: 'The ID of the model.',
                    type: 'string (model ID)',
                    default: 'null'
                },
                nodeId: {
                    description: 'The ID of the node.',
                    type: 'string (node ID)',
                    default: 'null'
                }
            }
        },

        cursorPos:0,

        open: function(options) {
        },

        options: {
            modelId: null,
            nodeId: null
        },

        widgetEventPrefix: 'dialog_sd_node:',

        _create: function () {
            console.debug('@log. creating_widget: dialog_sd_node');
            $.Widget.prototype._create.apply(this); // I don't know what this does - got it from
            // http://stackoverflow.com/questions/3162901/how-to-derive-a-custom-widget-from-jquery-ui-dialog

            var self = this;
            this.element.addClass('dialog_sd_node-1');

            var dialog = $(
                '<div id="sd_node_dialog_form" style="font-size:75%;">'+
                '</div>');

            var tabsDiv = $(
                '<div id="sd_node_dialog_tabs" style="overflow:auto; height:95%">'+
	                '<ul>'+
		                '<li>'+
                            '<a id="sd_node_dialog_tab_equation_a" href="#sd_node_dialog_tab_equation" style="font-size:1em; font-weight:normal; outline-color:transparent;">Equation</a>'+
                        '</li>'+
		                '<li>'+
                            '<a id="sd_node_dialog_tab_sketchgraph_a" href="#sd_node_dialog_tab_sketchgraph" style="font-size:1em; font-weight:normal; outline-color:transparent;">Sketch graph</a>'+
                        '</li>'+
		                '<li>'+
                            '<a id="sd_node_dialog_tab_documentation_a" href="#sd_node_dialog_tab_documentation" style="font-size:1em; font-weight:normal; outline-color:transparent;">Documentation</a>'+
                        '</li>'+
                    '</ul>'+
                '</div>');
            $(dialog).append(tabsDiv);

            var equationDiv = $('<div id="sd_node_dialog_tab_equation"></div>');
            var sketchgraphDiv = $('<div id="sd_node_dialog_tab_sketchgraph" style="height:255px; width:490px;"></div>');
            var documentationDiv = $(
                '<div id="sd_node_dialog_tab_documentation">'+
                    '<h3>Documentation for this node</h3>'+
                '</div>');
            $(tabsDiv).append(equationDiv).append(sketchgraphDiv).append(documentationDiv);


            // First tab (tab index = 0) - the main equation panel
            var top = $('<div class="top"/>');
            $(top).
                append(buildFunctionDiv(this)).
                append(buildInfluenceDiv());
                //append(buildKeypadDiv());  March 2015.  Temporarily disabled for UKSD workshop, because of
                // problems with insertion point in equation box.  TODO: re-instate
            $(equationDiv).append(top);
            var equDiv = $('<div style="float:left; clear:both; margin-top:30px; width:400px;"/>');
            var label = $(
                '<label for="name">Dependent variable = </label>');
            var equation = $('<div id="equation" class="equation" style="-webkit-user-select:text; -moz-user-select:text;'+
                'width:450px; height:60px; border-style:solid; border-width:px; border-color:#e0e0e0;"'+
                'contenteditable="true" />').
                click(function() {
                    //self.cursorPos = getCursorPos(); March 2015.  Temporarily disabled for UKSD workshop,
                });
            var datatype = $(
                '<select>'+
                    '<option>numeric</option>'+
                    '<option>string</option>'+
                    '<optgroup label="enumerated types:">'+
                        '<option>colour</option>'+
                        '<option>age class</option>'+
                    '</optgroup>'+
                '</select>');
            $(equDiv).append(label).append(equation).append(datatype);
            $(equationDiv).append(equDiv);

            // Third tab (tab index = 2) - the documentation tab
            var documentation = $('<div class="node_documentation" contenteditable style="height:200px; overflow:auto; border:black 1px solid"></div>');
            $(documentationDiv).append(documentation);


            this._container = $(this.element).append(dialog);
            //$(this.element).css({zindex:5000});

            $('#sd_node_dialog_tabs').tabs({selected:0});

            $('#sd_node_dialog_tab_sketchgraph').
                sketchgraph();

            $('#sd_node_dialog_tabs').
                on( "tabsactivate", function( event, ui ) {
                    if (ui.newTab.index() === 1) {
                        var influencingNodeIdArray = getInfluencingNodeIdArray(self);
                        if (influencingNodeIdArray.length === 0) {
                            $('#sd_node_dialog_tab_sketchgraph').
                                sketchgraph({
                                    modelId: self.options.modelId,
                                    nodeIdx: 'SIMTIME',
                                    nodeIdy: self.options.nodeId}).
                                resize();
                        } else if (influencingNodeIdArray.length === 1) {
                            console.debug('nodeIdx: '+influencingNodeIdArray[0]+'\nnodeIdy: '+self.options.nodeId);
                            $('#sd_node_dialog_tab_sketchgraph').
                                sketchgraph({
                                    modelId: self.options.modelId,
                                    nodeIdx: influencingNodeIdArray[0],
                                    nodeIdy: self.options.nodeId}).
                                resize();
                        } else {
                            alert('Too many influencing variables to sketch a graph;\nYou can sketch a graph only if:\n- there are no influencing variables (so it will be a function of simulation time); or\n- there is one influencing variable.');
                        }
                    }
                } );

            $(this.element).dialog({
                autoOpen: false,
                height: 510,
                width: 700,
                modal: true,
                title:'xxx',
                buttons: {
                    OK: function() {
                        var modelId = $(this).data('modelId');
                        var nodeId = $(this).data('nodeId');
                        var model = SYSTO.models[modelId];
                        var node = model.nodes[nodeId];
                        var equationString = $(equation).text();
                        console.debug('equationString = '+equationString);
                        var equationCheckResult = SYSTO.checkEquationString(model, node, equationString);
                        if (equationCheckResult.status === 'OK') {
                            //alert('Equation OK');
                            //node.extras.equation.value = equationString;
                            var action = new Action(model, 'set_equation', {mode:node.type, nodeId:node.id,  nodeLabel:node.label, 
                                        oldEquation:node.extras.equation.value, equation:equationString});
                            action.doAction();
                            SYSTO.trigger({
                                file:' jquery.dialog_sd_node.js', 
                                action: 'OK to close dialog', 
                                event_type: 'equation_listener', 
                                parameters: {packageId:SYSTO.state.packageId, modelId:modelId}
                            });
                            $( this ).dialog( "close" );
                        } else {
                            var errorString = 'ERROR(S) IN EQUATION';
                            var resultList = equationCheckResult.resultList;
                            for (var resultId in resultList) {
                                result = resultList[resultId];
                                if (result.status === 'OK') continue;
                                errorString += '\n\n'+result.message+'\n';
                                if (result.errorWordList) {
                                    var first = true;
                                    for (word in result.errorWordList) {
                                        if (!first) errorString += ', ';
                                        errorString += word;
                                        first = false;
                                    }
                                }
                            }
                            alert(errorString);
                        }
                        node.extras.documentation.value = $(documentation).text();
                    },
                    Cancel: function() {
                        $( this ).dialog( "close" );
                    }
                },
                open: function(event) {
                    console.debug('dialog_sd_node open '+$(this).data('modelId')+', '+$(this).data('nodeId'));
                    $('#sd_node_dialog_tabs').tabs( "option", "active", 0 );
                    var modelId = $(this).data('modelId');
                    var nodeId = $(this).data('nodeId');
                    self.options.modelId = modelId;
                    self.options.nodeId = nodeId;
                    var model = SYSTO.models[modelId];
                    var nodeList = model.nodes;
                    var node = nodeList[nodeId];

                    // Documentation
                    $(documentation).text(node.extras.documentation.value);

                    // Equation
                    if (node.extras.equation) {
                        $(equation).text(node.extras.equation.value);
                    }
                    if (node.type === 'stock') {
                        var extra = 'Initial value for ';
                    } else {
                        extra = '';
                    }
                    //$(this).dialog('option', 'title', $(this).data('nodeId'));
                    $(this).dialog('option', 'title', node.label);
                    //$('#sd_node_dialog_form').find('label').text(extra+nodeId+' =');
                    $('#sd_node_dialog_form').find('label').text(extra+node.label+' =');
                    $('.influenceSelect').empty();
                    assignInarcsAndOutarcsForEachNode(model);
                    if (isEmpty(node.inarcList)) {
                        $('.influenceSelect').css('display','none');
                        $('.influenceMessage').css('display','block');
                    } else {
                        $('.influenceSelect').css('display','block');
                        $('.influenceMessage').css('display','none');
                    }
                    populateInfluenceDiv(self, model, node, nodeList);
                    var el = document.getElementById('equation');
                    // This (the call to setCursor()) sometimes generates an error message (in the
                    // developer's console - users will not be aware of it):
                    // "Uncaught Error: IndexSizeError: DOM Exception 1"
                    // TODO: Obviously, I need to trap it.   
                    // But better still: find out what's caused it.
                    // Until it's trapped, do not put any other code below this point!
                    //setCursor(el,1);  TODO: check why this was here in the first place - seems not to be needed.
                },
                close: function() {
                }
            });

            $('.keypad_key').
                click(function(event) {
                    var keypad_symbol = event.target.attributes[3].value;
/*
                    var equationString = $('#equation').text();
                    equationString += keypad_symbol;
                    $('#equation').text(equationString);
                    var el = document.getElementById('equation');
                    self.cursorPos += 1;
                    setCursor(el, self.cursorPos);
*/
                    addAtCurrentPosition(self, keypad_symbol);
                });


            this._setOptions({
                modelId:this.options.modelId,
                nodeId:this.options.nodeId
            });
        },

        _destroy: function () {
            this.element.removeClass('dialog_sd_node-1');
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





function buildFunctionDiv(widget) {

    var functionDiv = $('<div class="functions" style="float:left; width:200px; height:200px;">Functions<br/></div>');

    var functionInfo = $('<div class="functionInfo" style="float:left; display:block; height:40px; min-height:40px; clear:both;"> </div>');
    var functionSelect = $('<select size="6" style="width:95%;"/>').
        mouseout(function() {
        });

    for (functionId in SYSTO.functions) {       
        var option = $('<option value="'+SYSTO.functions[functionId].systo+'">'+
            SYSTO.functions[functionId].display+'</option>').
            mouseover(function(event) {
                var functionId = event.target.value;
                $(functionInfo).text(functionId);
            }).
            click(function(event) {
                // March 2015.  Temporarily disabled for UKSD workshop,  TODO: re-activate
                // addAtCurrentPosition(widget, event.target.value+'()');
                alert('"Click-to-insert" not yet operational. Please type the name of the function you need '+
                    'into the equation.');
            });
        $(functionSelect).append(option);
    }
    $(functionDiv).append(functionSelect).append(functionInfo);
    return functionDiv;
}


function buildInfluenceDiv() {

    var influenceDiv = $('<div class="influences" style="float:left; width:200px; '+
        '">Influences<br/></div>');

    var influenceSelect = $('<select class="influenceSelect" size="6" style="width:95%;"/>').
        mouseout(function() {
        });

    var influenceMessage = $('<p class="influenceMessage" >There are no influences on this node.</p>');

    $(influenceDiv).append(influenceSelect).append(influenceMessage);
    return influenceDiv;
}



function populateInfluenceDiv(widget, model, node, nodeList) {
    for (var inarcId in node.inarcList) {
        var arc = node.inarcList[inarcId];    // TODO: wrong!!
        if (arc.type === 'flow') break;
        var influencingNodeId = arc.start_node_id;
        var influencingNode = nodeList[influencingNodeId];
        var option = $('<option value="'+influencingNodeId+'">'+influencingNode.label+'</option>').
            mouseover(function(event) {
                var nodeId = event.target.value;
                $('.functionInfo').text(nodeId);
            }).
            click(function(event) {
                // March 2015.  Temporarily disabled for UKSD workshop,  TODO: re-instate
                //var nodeId1 = event.target.value;
                //var node1 = model.nodes[nodeId1];
                //addAtCurrentPosition(widget, node1.label);
                alert('"Click-to-insert" not yet operational. Please type the name of the variable '+
                    'into the equation.');
                //$('.equation').text(node1.label);
            });

        $('.influenceSelect').append(option);
    }
}




function getInfluencingNodeIdArray(widget) {
    var options = widget.options;
    var modelId = options.modelId;
    var model = SYSTO.models[modelId];
    var nodeIdx = options.nodeId;
    var nodex = model.nodes[nodeIdx];

    var influencingNodeIdArray = [];
    for (var inarcId in nodex.inarcList) {
        var arc = model.arcs[inarcId];
        var influencingNodeId = arc.start_node_id;
        influencingNodeIdArray.push(influencingNodeId);
    }
    return influencingNodeIdArray;
}



function buildKeypadDiv() {

    var keypadDiv = $('<div class="keypad" style="float:left; '+
        '">Keypad<br/></div>').
        keypad();

    return keypadDiv;
}




function buildSketchgraphDiv(widget) {

    var sketchgraphDiv = $('<div class="sketchgraph" style="float:left; '+
        '">Sketchgraph<br/></div>').
        sketchgraph();

    return sketchgraphDiv;
}


// =================================================================
// Handling caret (text cursor) position
//
// Note: At the moment, the only time we get the cursor position is when 
// the user clicks in the equation text field.   Trying to get the cursor 
// position at other times (e.g. when clicking a function) does not seem to
// work.  So we handle such cases by looking at widget.cursorPos, which is
// incremented as required.   
// Therefore, at the moment, moving the cursor using the left- and right-arrows
// WILL NOT WORK.



function setCursor(el, pos) {
    var range = document.createRange();
    var sel = window.getSelection();
    range.setStart(el.childNodes[0], pos);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}



function getCursorPos() {
    var getSelectionObj = window.getSelection();
    return getSelectionObj.anchorOffset;
};



function addAtCurrentPosition(widget, text) {
    var equationString = $('#equation').text();
    var firstBit = equationString.substring(0,widget.cursorPos);
    var lastBit = equationString.substring(widget.cursorPos,999);
    equationString = firstBit + text + lastBit;
    $('#equation').text(equationString);
    widget.cursorPos += text.length;
    var el = document.getElementById('equation');
    setCursor(el, widget.cursorPos);
}




// NOT CURRENTLY USED
// From http://jsfiddle.net/QcN4G/2/
// See http://stackoverflow.com/questions/4811822/get-a-ranges-start-and-end-offsets-relative-to-its-parent-container/4812022#4812022

function getCaretCharacterOffsetWithin(element) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
        var range = win.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
    } else if ( (sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}



})(jQuery);

