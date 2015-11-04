SYSTO.models.predator_prey_shodor = 
{
"meta":{
    "id": "predator_prey_shodor",
    "name": "Predator-prey Shodor",
    "language":"system_dynamics"},
"nodes":{
        "cloud1": {"id":"cloud1", "type":"cloud", "label":"cloud1", "centrex":141, "centrey":116, "text_shiftx":0, "text_shifty":25, "extras":{}},
        "cloud2": {"id":"cloud2", "type":"cloud", "label":"cloud2", "centrex":458, "centrey":114, "text_shiftx":0, "text_shifty":25, "extras":{}},
        "cloud3": {"id":"cloud3", "type":"cloud", "label":"cloud3", "centrex":154, "centrey":242, "text_shiftx":0, "text_shifty":25, "extras":{}},
        "cloud4": {"id":"cloud4", "type":"cloud", "label":"cloud4", "centrex":473, "centrey":242, "text_shiftx":0, "text_shifty":25, "extras":{}},
        "stock1": {"id":"stock1", "type":"stock", "label":"Predator_population", "centrex":319.3333333333333, "centrey":115.33333333333333, "text_shiftx":-12.666666666666666, "text_shifty":-25.333333333333336, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"15"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"100", "value":"100"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "stock2": {"id":"stock2", "type":"stock", "label":"Prey_population", "centrex":317, "centrey":241, "text_shiftx":0, "text_shifty":22, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"100"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"100", "value":"100"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "valve1": {"id":"valve1", "type":"valve", "label":"predator_births", "centrex":230.16666666666666, "centrey":115.66666666666666, "text_shiftx":0, "text_shifty":19, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"(predator_birth_fraction*Prey_population)*Predator_population"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"1", "value":"1"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "valve2": {"id":"valve2", "type":"valve", "label":"predator_deaths", "centrex":388.66666666666663, "centrey":114.66666666666666, "text_shiftx":0, "text_shifty":19, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"predator_death_constant*Predator_population"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"1", "value":"1"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "valve3": {"id":"valve3", "type":"valve", "label":"prey_births", "centrex":235.5, "centrey":241.5, "text_shiftx":0, "text_shifty":19, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"prey_birth_fraction*Prey_population"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"1", "value":"1"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "valve4": {"id":"valve4", "type":"valve", "label":"prey_deaths", "centrex":395, "centrey":241.5, "text_shiftx":0, "text_shifty":19, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"(prey_death_constant*Predator_population)*Prey_population"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"1", "value":"1"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "variable1": {"id":"variable1", "type":"variable", "label":"predator_death_constant", "centrex":406, "centrey":48, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"0.46"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"1", "value":"1"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "variable2": {"id":"variable2", "type":"variable", "label":"prey_birth_fraction", "centrex":184, "centrey":306, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"0.14"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"0.3", "value":"0.3"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "variable3": {"id":"variable3", "type":"variable", "label":"prey_death_constant", "centrex":422, "centrey":310, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"0.006"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"0.02", "value":"0.02"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}},
        "variable4": {"id":"variable4", "type":"variable", "label":"predator_birth_fraction", "centrex":168, "centrey":25, "text_shiftx":0.3333333333333339, "text_shifty":-8.333333333333336, "extras":{"equation":{"type":"long_text", "default_value":"", "value":"0.01"}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"0.02", "value":"0.02"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}}}
    },

    "arcs":{
        "flow1": {"id":"flow1", "type":"flow", "label":"predator_birth_fraction", "start_node_id":"cloud1", "end_node_id":"stock1", "node_id":"valve1"},
        "flow2": {"id":"flow2", "type":"flow", "label":"predator_birth_fraction", "start_node_id":"stock1", "end_node_id":"cloud2", "node_id":"valve2"},
        "flow3": {"id":"flow3", "type":"flow", "label":"predator_birth_fraction", "start_node_id":"cloud3", "end_node_id":"stock2", "node_id":"valve3"},
        "flow4": {"id":"flow4", "type":"flow", "label":"predator_birth_fraction", "start_node_id":"stock2", "end_node_id":"cloud4", "node_id":"valve4"},
        "influence1": {"id":"influence1", "type":"influence", "label":"predator_birth_fraction", "start_node_id":"variable4", "end_node_id":"valve1", "curvature":0.3, "along":0.5},
        "influence10": {"id":"influence10", "type":"influence", "label":"predator_birth_fraction", "start_node_id":"stock1", "end_node_id":"valve4", "curvature":0.3, "along":0.5},
        "influence2": {"id":"influence2", "type":"influence", "label":"predator_birth_fraction", "start_node_id":"stock2", "end_node_id":"valve1", "curvature":0.3, "along":0.5},
        "influence3": {"id":"influence3", "type":"influence", "label":"predator_birth_fraction", "start_node_id":"stock1", "end_node_id":"valve1", "curvature":0.19119351100811136, "along":0.5},
        "influence4": {"id":"influence4", "type":"influence", "label":"predator_birth_fraction", "start_node_id":"variable1", "end_node_id":"valve2", "curvature":0.35769024364065677, "along":0.5},
        "influence5": {"id":"influence5", "type":"influence", "label":"predator_birth_fraction", "start_node_id":"stock1", "end_node_id":"valve2", "curvature":0.3, "along":0.5},
        "influence6": {"id":"influence6", "type":"influence", "label":"predator_birth_fraction", "start_node_id":"variable2", "end_node_id":"valve3", "curvature":0.3, "along":0.5},
        "influence7": {"id":"influence7", "type":"influence", "label":"predator_birth_fraction", "start_node_id":"stock2", "end_node_id":"valve3", "curvature":0.3, "along":0.5},
        "influence8": {"id":"influence8", "type":"influence", "label":"predator_birth_fraction", "start_node_id":"variable3", "end_node_id":"valve4", "curvature":0.3, "along":0.5},
        "influence9": {"id":"influence9", "type":"influence", "label":"predator_birth_fraction", "start_node_id":"stock2", "end_node_id":"valve4", "curvature":0.3, "along":0.5}
    },
"scenarios": {
    "default": {
        "simulation_settings": {
            "start_time": 0,
            "end_time": 50,
            "nstep": 20,
            "display_interval": 1,
            "integration_method": "euler1"
        }
    }
}

}

