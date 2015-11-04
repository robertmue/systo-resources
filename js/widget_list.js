
$(document).ready(function() {

    var widget_list = {
        audio_plotter:{name:'xxx', usage:'display', descr:'Audio display of simulation results. For a selected variable, plays a tone whose frequency is related to the value of the variable.',language:'System Dynamics'},
        auto_layout:{name:'xxx', usage:'work', descr:'Calculates node positions to achieve a reasonable layout.', language:'Any'},
        //bulletchart:{name:'xxx', usage:'display', descr:'zzz'},
        diagram:{name:'xxx', usage:'display', descr:'The primary widget for creating, editing and vieweing the model diagram.', language:'Any'},
        dialog_sd_node:{name:'xxx', usage:'dialog', descr:'Puts up a dialog window for nodes (variables) in a System Dynamics model, primarily for entering values or equations.', language:'System Dynamics'},
        equation_listing:{name:'xxx', usage:'display', descr:'Lists out the equations for a model.',language:'System Dynamics'},
        import_vensim:{name:'xxx', usage:'display', descr:'Converts a Vensim model (.mdl text) into a Systo model.', language:'System Dynamics'},
        inline_value:{name:'xxx', usage:'display', descr:'Displays a single value derived from a simulation run (e.g. the maximum, or the final, value)', language:'System Dynamics'},
        keypad:{name:'xxx', usage:'support', descr:'Provides a keypad for entering equations.', language:'System Dynamics'},
        local_open:{name:'xxx', usage:'display', descr:'Saves a model to local file system.', language:'Any'},
        local_save:{name:'xxx', usage:'display', descr:'Opens a model from local file system.', language:'Any'},
        messages:{name:'xxx', usage:'display', descr:'Manages the display of messages.', language:'Any'},
        multiple_sliders:{name:'xxx', usage:'display', descr:'Displays a collection of sliders.', language:'System Dynamics'},
        //node_arclist:{name:'xxx', usage:'display', descr:'zzz'},
        plotter:{name:'xxx', usage:'display', descr:'Plots simulation results (values over time) for one or more variables.', language:'System Dynamics'},
        runcontrol:{name:'xxx', usage:'display', descr:'Run Control window for simulatable models.', language:'System Dynamics'},
        sketchgraph:{name:'xxx', usage:'dialog', descr:'For creating, editing or displaying a sketched ("lookup") relationship between two variables.', language:'System Dynamics'},
        slider1:{name:'xxx', usage:'display', descr:'A basic slider enhanced with display of value, and user-settable min and max values.', language:'System Dynamics'}
    };

    for (var widgetId in widget_list) {
        //$('#widget_nav').append('<span><a href="widget_page/'+widgetId+'.html">'+widgetId+'</a></span><br/>');
    }
    for (var widgetId in widget_list) {
        var widget = widget_list[widgetId];
        //$('#widget_table').append('<tr><td><a href="widget_'+widgetId+'.html">'+widgetId+'</a></td><td>'+widget.usage+'</td><td>'+widget.descr+'</td></tr>');
        $('#widget_table').append('<tr><td><b>'+widgetId+'</b><br/><a href="/static/js/systo_widgets/jquery.'+widgetId+'.js">code</a></td><td>'+widget.usage+'</td><td>'+widget.descr+'</td></tr>');
    }
});

