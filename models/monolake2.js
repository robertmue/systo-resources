SYSTO.models.monolake2 = {
"meta":{
    "language":"system_dynamics"},
"nodes":{
        "cloud1": {"id":"cloud1", "type":"cloud", "label":"cloud1", "centrex":343, "centrey":45, "text_shiftx":0, "text_shifty":25, "equation":9999, "extras":{}},
        "cloud2": {"id":"cloud2", "type":"cloud", "label":"cloud2", "centrex":110, "centrey":191, "text_shiftx":0, "text_shifty":25, "equation":9999, "extras":{}},
        "cloud3": {"id":"cloud3", "type":"cloud", "label":"cloud3", "centrex":193, "centrey":351, "text_shiftx":0, "text_shifty":25, "equation":9999, "extras":{}},
        "cloud4": {"id":"cloud4", "type":"cloud", "label":"cloud4", "centrex":602, "centrey":192, "text_shiftx":0, "text_shifty":25, "equation":9999, "extras":{}},
        "cloud5": {"id":"cloud5", "type":"cloud", "label":"cloud5", "centrex":540, "centrey":316, "text_shiftx":0, "text_shifty":25, "equation":9999, "extras":{}},
        "stock1": {"id":"stock1", "type":"stock", "label":"Water_in_lake", "centrex":344, "centrey":191, "text_shiftx":44, "text_shifty":-18, "equation":"2228", "extras":{"equation":{"type":"long_text", "default_value":"", "value":"2228"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"100", "value":"100"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "valve1": {"id":"valve1", "type":"valve", "label":"precipitation", "centrex":343.5, "centrey":118, "text_shiftx":0, "text_shifty":19, "equation":"surface_area*precipitation_rate", "extras":{"equation":{"type":"long_text", "default_value":"", "value":"surface_area*precipitation_rate"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"1", "value":"1"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "valve2": {"id":"valve2", "type":"valve", "label":"flow_past_diversion_points", "centrex":227, "centrey":191, "text_shiftx":0, "text_shifty":19, "equation":"sierra_gauged_runoff-exported", "extras":{"equation":{"type":"long_text", "default_value":"", "value":"sierra_gauged_runoff-exported"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"1", "value":"1"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "valve3": {"id":"valve3", "type":"valve", "label":"other_in", "centrex":268.5, "centrey":271, "text_shiftx":12, "text_shifty":17, "equation":"47.6", "extras":{"equation":{"type":"long_text", "default_value":"", "value":"47.6"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"1", "value":"1"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "valve4": {"id":"valve4", "type":"valve", "label":"evaporation", "centrex":473, "centrey":191.5, "text_shiftx":0, "text_shifty":19, "equation":"surface_area*evaporation_rate", "extras":{"equation":{"type":"long_text", "default_value":"surface_area*evaporation_rate", "value":""}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"1", "value":"1"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "valve5": {"id":"valve5", "type":"valve", "label":"other_out", "centrex":442, "centrey":253.5, "text_shiftx":0, "text_shifty":19, "equation":"33.6", "extras":{"equation":{"type":"long_text", "default_value":"", "value":"33.6"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"1", "value":"1"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "variable1": {"id":"variable1", "type":"variable", "label":"surface_area", "centrex":461, "centrey":86, "text_shiftx":0, "text_shifty":0, "equation":"39", "extras":{"equation":{"type":"long_text", "default_value":"", "value":"39"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"1", "value":"1"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "variable2": {"id":"variable2", "type":"variable", "label":"evaporation_rate", "centrex":595, "centrey":247, "text_shiftx":0, "text_shifty":0, "equation":"3.75", "extras":{"equation":{"type":"long_text", "default_value":"", "value":"3.75"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"1", "value":"1"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "variable3": {"id":"variable3", "type":"variable", "label":"precipitation_rate", "centrex":172, "centrey":103, "text_shiftx":0, "text_shifty":0, "equation":"0.667", "extras":{"equation":{"type":"long_text", "default_value":"", "value":"0.667"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"1", "value":"1"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "variable4": {"id":"variable4", "type":"variable", "label":"sierra_gauged_runoff", "centrex":59, "centrey":226, "text_shiftx":0, "text_shifty":0, "equation":"150", "extras":{"equation":{"type":"long_text", "default_value":"", "value":"150"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"1", "value":"1"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "variable5": {"id":"variable5", "type":"variable", "label":"exported", "centrex":94, "centrey":275, "text_shiftx":0, "text_shifty":0, "equation":"100", "extras":{"equation":{"type":"long_text", "default_value":"", "value":"100"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"1", "value":"1"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}}
    },

    "arcs":{
        "flow1": {"id":"flow1", "type":"flow", "label":"exported", "start_node_id":"cloud1", "end_node_id":"stock1", "node_id":"valve1"},
        "flow2": {"id":"flow2", "type":"flow", "label":"exported", "start_node_id":"cloud2", "end_node_id":"stock1", "node_id":"valve2"},
        "flow3": {"id":"flow3", "type":"flow", "label":"exported", "start_node_id":"cloud3", "end_node_id":"stock1", "node_id":"valve3"},
        "flow4": {"id":"flow4", "type":"flow", "label":"exported", "start_node_id":"stock1", "end_node_id":"cloud4", "node_id":"valve4"},
        "flow5": {"id":"flow5", "type":"flow", "label":"exported", "start_node_id":"stock1", "end_node_id":"cloud5", "node_id":"valve5"},
        "influence1": {"id":"influence1", "type":"influence", "label":"exported", "start_node_id":"variable1", "end_node_id":"valve1", "curvature":-0.37491394028010727, "along":0.5},
        "influence2": {"id":"influence2", "type":"influence", "label":"exported", "start_node_id":"variable1", "end_node_id":"valve4", "curvature":0.3, "along":0.5},
        "influence3": {"id":"influence3", "type":"influence", "label":"exported", "start_node_id":"variable2", "end_node_id":"valve4", "curvature":0.3, "along":0.5},
        "influence4": {"id":"influence4", "type":"influence", "label":"exported", "start_node_id":"variable3", "end_node_id":"valve1", "curvature":0.3, "along":0.5},
        "influence5": {"id":"influence5", "type":"influence", "label":"exported", "start_node_id":"variable4", "end_node_id":"valve2", "curvature":0.3, "along":0.5},
        "influence6": {"id":"influence6", "type":"influence", "label":"exported", "start_node_id":"variable5", "end_node_id":"valve2", "curvature":0.3, "along":0.5},
        "influence7": {"id":"influence7", "type":"influence", "label":"exported", "start_node_id":"stock1", "end_node_id":"variable1", "curvature":0.3, "along":0.5}
    },
   "scenarios": {
      "default": {
         "simulation_settings": {
            "start_time": 0,
            "end_time": 100,
            "nstep": 10,
            "display_interval": 1,
            "integration_method": "euler1"
         }
      }
   }
};

