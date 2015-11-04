SYSTO.processQueryString = function(queryString) {
    var queryString1 = queryString.replace(/\+/g, ' ');
    var queryObject = ptq(queryString1);

    if (queryObject.initial && queryObject.initial.length == 1) {
        var initialModelId = queryObject.initial[0];
        SYSTO.state.initialModelId = initialModelId;
    } else {
        initialModelId = null;
    }

    var modelsFromUrl = [];
    if (queryObject.modelurl && queryObject.modelurl.length>0) {
        var modelUrls = queryObject.modelurl;   // Note: this is an array of
            // 1 *or more* model URLs
        for (var i=0; i<modelUrls.length; i++) {
            var modelUrl = modelUrls[i];
            if (modelUrl.substring(0,7) === 'http://') {
                SYSTO.loadModelFromUrl(modelUrl);
            } else {
                console.debug('\nWARNING: expected a model URL in the URL query string, '+
                    'but instead got '+modelUrl);
            }
        }
    } else {
        modelUrls = null;
    }

    if (queryObject.myexid && queryObject.myexid.length>0) {
        var myexids = queryObject.myexid;   // Note: this is an array of
            // 1 *or more* myExperiment workflow IDs.
        for (var i=0; i<myexids.length; i++) {
            var myexid = myexids[i];
            var modelUrl = 'http://www.myexperiment.org/workflows/'+myexid+'/download';
            SYSTO.loadModelFromUrl(modelUrl);
        }
    } else {
        modelUrls = null;
    }

    // Experimental bit, for passing a model in highly-compacted form in the URL query string.
    if (queryObject.compact && queryObject.compact.length==1) {
        var resultObject = SYSTO.decompress(queryObject.compact[0]);
        var modelId = 'compact';
        SYSTO.state.currentModelId = modelId;
        SYSTO.models[SYSTO.state.currentModelId] = {
            meta:{
                language:'system_dynamics',
                id:SYSTO.state.currentModelId,
                name:'noname'},
            nodes:resultObject.nodeList,
            arcs:resultObject.arcList
        };
        initialModelId = modelId;
    }

    // The URL parameter 'initial' can refer either to a Systolite 
    // built-in model, or to a model referenced using the URL parameter 'modelurl', 
    // or to a model passed in minified form.
    if (queryObject.initial && queryObject.initial.length == 1) {
        initialModelId = queryObject.initial[0];
        if (!SYSTO.models[initialModelId]) {
            console.debug('WARNING: a model with the ID "'+modelId+'" in the URL '+
                'query string does not currently exist.');
        }
    }

    return initialModelId;
};
