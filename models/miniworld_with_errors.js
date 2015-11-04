SYSTO.models.miniworld_with_errors = 
{
"meta":{
    "language":"system_dynamics"},
"nodes":{
        "cloud1": {"id":"cloud1", "type":"cloud", "label":"cloud1", "centrex":37, "centrey":239, "text_shiftx":0, "text_shifty":25, "extras":{}},
        "cloud2": {"id":"cloud2", "type":"cloud", "label":"cloud2", "centrex":352, "centrey":243, "text_shiftx":0, "text_shifty":25, "extras":{}},
        "cloud3": {"id":"cloud3", "type":"cloud", "label":"cloud3", "centrex":265, "centrey":113, "text_shiftx":0, "text_shifty":25, "extras":{}},
        "cloud4": {"id":"cloud4", "type":"cloud", "label":"cloud4", "centrex":620, "centrey":117, "text_shiftx":0, "text_shifty":25, "extras":{}},
        "cloud5": {"id":"cloud5", "type":"cloud", "label":"cloud5", "centrex":614, "centrey":341, "text_shiftx":0, "text_shifty":25, "extras":{}},
        "stock1": {"id":"stock1", "type":"stock", "label":"Population", "centrex":215, "centrey":241, "text_shiftx":0, "text_shifty":22, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"1"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"5", "value":"24"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "stock3": {"id":"stock3", "type":"stock", "label":"Environ_pollution", "centrex":434, "centrey":117, "text_shiftx":-2, "text_shifty":-22, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"1"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"5", "value":"5"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "stock5": {"id":"stock5", "type":"stock", "label":"Production_capacity", "centrex":415, "centrey":342, "text_shiftx":0, "text_shifty":22, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"1"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"5", "value":"5"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "valve1": {"id":"valve1", "type":"valve", "label":"births", "centrex":126, "centrey":240, "text_shiftx":-29, "text_shifty":-10, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"birth_rate*siin(Population*quality_of_environment*consumption_level)*birth_control"}, "min_value":{"type":"short_text", "default_value":"", "value":"0"}, "max_value":{"type":"short_text", "default_value":"", "value":"23"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "valve2": {"id":"valve2", "type":"valve", "label":"deaths", "centrex":283.5, "centrey":242, "text_shiftx":8, "text_shifty":-24, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"death_rate*min(Population)*Environ_pollution"}, "min_value":{"type":"short_text", "default_value":"", "value":""}, "max_value":{"type":"short_text", "default_value":"", "value":""}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "valve3": {"id":"valve3", "type":"valve", "label":"degradation", "centrex":349.5, "centrey":115, "text_shiftx":-36, "text_shifty":-12, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"degradation_rate*Population*consumption_level"}, "min_value":{"type":"short_text", "default_value":"", "value":""}, "max_value":{"type":"short_text", "default_value":"", "value":""}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "valve4": {"id":"valve4", "type":"valve", "label":"regeneration", "centrex":527, "centrey":117, "text_shiftx":-27, "text_shifty":18, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"quality_of_environment>1?regeneration_rate*Environ_pollution:regeneration_rate*damage_threshold"}, "min_value":{"type":"short_text", "default_value":"", "value":""}, "max_value":{"type":"short_text", "default_value":"", "value":""}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "valve5": {"id":"valve5", "type":"valve", "label":"capacity_increase", "centrex":514.5, "centrey":341.5, "text_shiftx":0, "text_shifty":19, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"growth_rate*consumption_level*Environ_pollution*(1-(consumption_level*Environ_pollution/consumption_goal))"}, "min_value":{"type":"short_text", "default_value":"", "value":""}, "max_value":{"type":"short_text", "default_value":"", "value":""}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "variable1": {"id":"variable1", "type":"variable", "label":"birth_rate", "centrex":140, "centrey":321, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"0.03"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"0.1", "value":"0.1"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "variable11": {"id":"variable11", "type":"variable", "label":"regeneration_rate", "centrex":643, "centrey":170, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"0.1"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"0.5", "value":"0.5"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "variable13": {"id":"variable13", "type":"variable", "label":"degradation_rate", "centrex":641, "centrey":207, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"0.02"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"0.1", "value":"0.1"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "variable15": {"id":"variable15", "type":"variable", "label":"consumption_goal", "centrex":630, "centrey":250, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"10"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"50", "value":"50"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "variable17": {"id":"variable17", "type":"variable", "label":"growth_rate", "centrex":634, "centrey":291, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"0.05"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"0.2", "value":"0.2"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "variable19": {"id":"variable19", "type":"variable", "label":"consumption_level", "centrex":469, "centrey":233, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"Production_capacity"}, "min_value":{"type":"short_text", "default_value":"", "value":""}, "max_value":{"type":"short_text", "default_value":"", "value":""}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "variable3": {"id":"variable3", "type":"variable", "label":"birth_control", "centrex":72, "centrey":348, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"1"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"5", "value":"5"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "variable5": {"id":"variable5", "type":"variable", "label":"death_rate", "centrex":257, "centrey":318, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"0.01"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"0.05", "value":"0.05"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "variable7": {"id":"variable7", "type":"variable", "label":"quality_of_environment", "centrex":318, "centrey":50, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"damage_threshol/(Environ_pollution"}, "min_value":{"type":"short_text", "default_value":"", "value":""}, "max_value":{"type":"short_text", "default_value":"", "value":""}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "variable9": {"id":"variable9", "type":"variable", "label":"damage_threshold", "centrex":580, "centrey":46, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"1"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"5", "value":"5"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}}
    },

    "arcs":{
        "flow1": {"id":"flow1", "type":"flow", "label":"consumption_level", "start_node_id":"cloud1", "end_node_id":"stock1", "node_id":"valve1"},
        "flow2": {"id":"flow2", "type":"flow", "label":"consumption_level", "start_node_id":"stock1", "end_node_id":"cloud2", "node_id":"valve2"},
        "flow3": {"id":"flow3", "type":"flow", "label":"consumption_level", "start_node_id":"cloud3", "end_node_id":"stock3", "node_id":"valve3"},
        "flow4": {"id":"flow4", "type":"flow", "label":"consumption_level", "start_node_id":"stock3", "end_node_id":"cloud4", "node_id":"valve4"},
        "influence1": {"id":"influence1", "type":"influence", "label":"consumption_level", "start_node_id":"variable3", "end_node_id":"valve1", "curvature":0.2254980119582961, "along":0.5},
        "influence10": {"id":"influence10", "type":"influence", "label":"consumption_level", "start_node_id":"variable9", "end_node_id":"valve4", "curvature":0.3, "along":0.5},
        "influence11": {"id":"influence11", "type":"influence", "label":"consumption_level", "start_node_id":"variable7", "end_node_id":"valve4", "curvature":0.5461282017478921, "along":0.5},
        "influence12": {"id":"influence12", "type":"influence", "label":"consumption_level", "start_node_id":"stock3", "end_node_id":"valve4", "curvature":0.3, "along":0.5},
        "influence13": {"id":"influence13", "type":"influence", "label":"consumption_level", "start_node_id":"variable11", "end_node_id":"valve4", "curvature":0.3, "along":0.5},
        "influence14": {"id":"influence14", "type":"influence", "label":"consumption_level", "start_node_id":"variable13", "end_node_id":"valve3", "curvature":0.0812563222199089, "along":0.5},
        "influence15": {"id":"influence15", "type":"influence", "label":"consumption_level", "start_node_id":"variable15", "end_node_id":"valve5", "curvature":-0.07089898053753457, "along":0.5},
        "influence16": {"id":"influence16", "type":"influence", "label":"consumption_level", "start_node_id":"variable17", "end_node_id":"valve5", "curvature":0.010284162806812349, "along":0.5},
        "influence17": {"id":"influence17", "type":"influence", "label":"consumption_level", "start_node_id":"stock5", "end_node_id":"variable19", "curvature":-0.28406112330220956, "along":0.5},
        "influence18": {"id":"influence18", "type":"influence", "label":"consumption_level", "start_node_id":"variable19", "end_node_id":"valve5", "curvature":0.3, "along":0.5},
        "influence19": {"id":"influence19", "type":"influence", "label":"consumption_level", "start_node_id":"variable19", "end_node_id":"valve1", "curvature":-0.26482900887462313, "along":0.5},
        "influence2": {"id":"influence2", "type":"influence", "label":"consumption_level", "start_node_id":"variable1", "end_node_id":"valve1", "curvature":0.43784212614042045, "along":0.5},
        "influence20": {"id":"influence20", "type":"influence", "label":"consumption_level", "start_node_id":"variable19", "end_node_id":"valve3", "curvature":0.1864436619718311, "along":0.5},
        "influence21": {"id":"influence21", "type":"influence", "label":"consumption_level", "start_node_id":"stock3", "end_node_id":"variable7", "curvature":0.3, "along":0.5},
        "influence22": {"id":"influence22", "type":"influence", "label":"consumption_level", "start_node_id":"stock3", "end_node_id":"valve5", "curvature":0.3, "along":0.5},
        "influence3": {"id":"influence3", "type":"influence", "label":"consumption_level", "start_node_id":"stock1", "end_node_id":"valve1", "curvature":0.28447504302925974, "along":0.5},
        "influence4": {"id":"influence4", "type":"influence", "label":"consumption_level", "start_node_id":"stock1", "end_node_id":"valve2", "curvature":0.4104463114505938, "along":0.5},
        "influence5": {"id":"influence5", "type":"influence", "label":"consumption_level", "start_node_id":"variable5", "end_node_id":"valve2", "curvature":-0.4878303253809256, "along":0.5},
        "influence6": {"id":"influence6", "type":"influence", "label":"consumption_level", "start_node_id":"stock3", "end_node_id":"valve2", "curvature":0.20954932027806725, "along":0.5},
        "influence7": {"id":"influence7", "type":"influence", "label":"consumption_level", "start_node_id":"stock1", "end_node_id":"valve3", "curvature":0.03960547782655014, "along":0.5},
        "influence8": {"id":"influence8", "type":"influence", "label":"consumption_level", "start_node_id":"variable7", "end_node_id":"valve1", "curvature":-0.2712281049705453, "along":0.5},
        "flow5": {"id":"flow5", "type":"flow", "label":"consumption_level", "start_node_id":"cloud5", "end_node_id":"stock5", "node_id":"valve5"},
        "influence9": {"id":"influence9", "type":"influence", "label":"consumption_level", "start_node_id":"variable9", "end_node_id":"variable7", "curvature":-0.2982640094156796, "along":0.5}
    }
};

