SYSTO.models.lintul = {
"meta":{
    "language":"system_dynamics"},
    "nodes":{
        "cloud1": {"id":"cloud1", "type":"cloud", "label":"cloud1", "centrex":77, "centrey":163, "text_shiftx":0, "text_shifty":25, "extras":{}},

        "cloud2": {"id":"cloud2", "type":"cloud", "label":"cloud2", "centrex":380, "centrey":163, "text_shiftx":0, "text_shifty":1, "extras":{}},

        "cloud3": {"id":"cloud3", "type":"cloud", "label":"cloud3", "centrex":-32, "centrey":359, "text_shiftx":0, "text_shifty":25, "extras":{}},

        "cloud4": {"id":"cloud4", "type":"cloud", "label":"cloud4", "centrex":360, "centrey":248, "text_shiftx":34, "text_shifty":19, "extras":{}},

        "cloud5": {"id":"cloud5", "type":"cloud", "label":"cloud5", "centrex":371, "centrey":340, "text_shiftx":0, "text_shifty":25, "extras":{}},

        "cloud6": {"id":"cloud6", "type":"cloud", "label":"cloud6", "centrex":363, "centrey":418, "text_shiftx":0, "text_shifty":25, "extras":{}},

        "cloud7": {"id":"cloud7", "type":"cloud", "label":"cloud7", "centrex":366, "centrey":500, "text_shiftx":0, "text_shifty":25, "extras":{}},

        "stock1": {"id":"stock1", "type":"stock", "label":"LAI", "centrex":226, "centrey":162, "text_shiftx":1, "text_shifty":22, "extras":{"equation":{"value":"2"}, "min_value":{"value":"0"}, "max_value":{"value":"100"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "stock2": {"id":"stock2", "type":"stock", "label":"TSUM", "centrex":87, "centrey":365, "text_shiftx":1, "text_shifty":22, "extras":{"equation":{"value":"0"}, "min_value":{"value":"0"}, "max_value":{"value":"100"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "stock3": {"id":"stock3", "type":"stock", "label":"WLVG", "centrex":489, "centrey":246, "text_shiftx":1, "text_shifty":22, "extras":{"equation":{"value":"0.545454"}, "min_value":{"value":"0"}, "max_value":{"value":"100"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "stock4": {"id":"stock4", "type":"stock", "label":"WLVD", "centrex":617, "centrey":248, "text_shiftx":1, "text_shifty":22, "extras":{"equation":{"value":"0"}, "min_value":{"value":"0"}, "max_value":{"value":"100"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "stock5": {"id":"stock5", "type":"stock", "label":"WST", "centrex":510, "centrey":340, "text_shiftx":1, "text_shifty":22, "extras":{"equation":{"value":"0"}, "min_value":{"value":"0"}, "max_value":{"value":"100"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "stock6": {"id":"stock6", "type":"stock", "label":"WSO", "centrex":511, "centrey":419, "text_shiftx":1, "text_shifty":22, "extras":{"equation":{"value":"0"}, "min_value":{"value":"0"}, "max_value":{"value":"100"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "stock7": {"id":"stock7", "type":"stock", "label":"WRT", "centrex":512, "centrey":499, "text_shiftx":1, "text_shifty":22, "extras":{"equation":{"value":"0"}, "min_value":{"value":"0"}, "max_value":{"value":"100"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "valve1": {"id":"valve1", "type":"valve", "label":"GLAI", "centrex":152, "centrey":163, "text_shiftx":0, "text_shifty":19, "extras":{"equation":{"value":"if TSUM<330 and LAI<0.75 then LAI*(exp(RGRL*DTEFF*DELT)-1)/DELT elseif t>=DOYEM and LAI==0 then LAII/DELT elseif t<DOYEM then 0 else SLA*GLV"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "valve2": {"id":"valve2", "type":"valve", "label":"DLAI", "centrex":303, "centrey":163, "text_shiftx":0, "text_shifty":19, "extras":{"equation":{"value":"LAI*RDR"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "valve3": {"id":"valve3", "type":"valve", "label":"RTSUM", "centrex":28, "centrey":362, "text_shiftx":0, "text_shifty":19, "extras":{"equation":{"value":"DTEFF*EMERG"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "valve4": {"id":"valve4", "type":"valve", "label":"grWLVG", "centrex":425, "centrey":247, "text_shiftx":0, "text_shifty":19, "extras":{"equation":{"value":"GTOTAL*FLV1"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "valve5": {"id":"valve5", "type":"valve", "label":"DLV", "centrex":553, "centrey":247, "text_shiftx":0, "text_shifty":19, "extras":{"equation":{"value":"WLVG*RDR"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "valve6": {"id":"valve6", "type":"valve", "label":"grWST", "centrex":441, "centrey":340, "text_shiftx":0, "text_shifty":19, "extras":{"equation":{"value":"GTOTAL*FST1"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "valve7": {"id":"valve7", "type":"valve", "label":"grWSO", "centrex":437, "centrey":419, "text_shiftx":0, "text_shifty":19, "extras":{"equation":{"value":"GTOTAL*FSO1"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "valve8": {"id":"valve8", "type":"valve", "label":"grWRT", "centrex":439, "centrey":500, "text_shiftx":0, "text_shifty":19, "extras":{"equation":{"value":"GTOTAL*FRT1"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable1": {"id":"variable1", "type":"variable", "label":"RDD", "centrex":-25, "centrey":489, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"10"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable10": {"id":"variable10", "type":"variable", "label":"FSO", "centrex":274, "centrey":413, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"if TSUM<=1055 then 0 elseif TSUM<=1160 then 1*(TSUM-1055)/105 else 1"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable11": {"id":"variable11", "type":"variable", "label":"FSO1", "centrex":373, "centrey":388, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"FSO/Fsum"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable12": {"id":"variable12", "type":"variable", "label":"Fsum", "centrex":314, "centrey":349, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"FLV+FST+FSO+FRT"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable13": {"id":"variable13", "type":"variable", "label":"FST", "centrex":265, "centrey":308, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"if TSUM<110 then 0.17 elseif TSUM<=275 then 0.17+0.3*(TSUM-110)/165 elseif TSUM<=555 then 0.2+0.22*(TSUM-275)/280 elseif TSUM<=780 then 0.44+0.35*(TSUM-555)/125 elseif TSUM<=1055 then 0.79+0.18*(TSUM-780)/275 elseif TSUM<=1160 then  0.97+0.03*(TSUM-1055)/105 else 0"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable14": {"id":"variable14", "type":"variable", "label":"FST1", "centrex":367, "centrey":302, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"FST/Fsum"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable15": {"id":"variable15", "type":"variable", "label":"FLV", "centrex":267, "centrey":241, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"if TSUM<=110 then 0.330 elseif TSUM<=275 then 0.33+0.13*(TSUM-110)/165 elseif TSUM<=555 then 0.46-0.02*(TSUM-275)/280 elseif TSUM<=780 then 0.44-0.30*(TSUM-555)/225 elseif TSUM<=1055 then 0.14-0.14*(TSUM-780)/275 else 0"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable16": {"id":"variable16", "type":"variable", "label":"FLV1", "centrex":349, "centrey":219, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"FLV/Fsum"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable17": {"id":"variable17", "type":"variable", "label":"WLVI", "centrex":469, "centrey":184, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"LAII/SLA"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable18": {"id":"variable18", "type":"variable", "label":"LAII", "centrex":415, "centrey":197, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"0.012"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable19": {"id":"variable19", "type":"variable", "label":"SLA", "centrex":490, "centrey":119, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"0.022"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable2": {"id":"variable2", "type":"variable", "label":"DTR", "centrex":39, "centrey":461, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"RDD/10^6"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable20": {"id":"variable20", "type":"variable", "label":"RDR", "centrex":477, "centrey":77, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"max(RDRDV, RDRSH)"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable21": {"id":"variable21", "type":"variable", "label":"RDRSH", "centrex":382, "centrey":95, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"min(max(RDRSHM*(LAI-LAICR),0),RDRSHM)"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable22": {"id":"variable22", "type":"variable", "label":"LAICR", "centrex":257, "centrey":100, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"4.0"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable23": {"id":"variable23", "type":"variable", "label":"RDRSHM", "centrex":262, "centrey":63, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"0.03"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable24": {"id":"variable24", "type":"variable", "label":"DELT", "centrex":200, "centrey":99, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"1.0"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable25": {"id":"variable25", "type":"variable", "label":"RGRL", "centrex":144, "centrey":103, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"0.009"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable26": {"id":"variable26", "type":"variable", "label":"TSUMAN", "centrex":56, "centrey":32, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"1110"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable27": {"id":"variable27", "type":"variable", "label":"RDRDV", "centrex":80, "centrey":90, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"if TSUM-TSUMAN<0 then 0 elseif DAVTMP<10 then 0.03 elseif DAVTMP<15 then 0.03+0.01*(DAVTMP-10)/5 elseif DAVTMP<30 then 0.04+0.05*(DAVTMP-15)/15 else 0.09"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable28": {"id":"variable28", "type":"variable", "label":"DAVTMP", "centrex":18, "centrey":63, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"0.5*(TMMN+TMMX)"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable29": {"id":"variable29", "type":"variable", "label":"TMMN", "centrex":-54, "centrey":65, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"8"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable3": {"id":"variable3", "type":"variable", "label":"K", "centrex":69, "centrey":505, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"0.6"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable30": {"id":"variable30", "type":"variable", "label":"TMMX", "centrex":-41, "centrey":119, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"12"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable31": {"id":"variable31", "type":"variable", "label":"TBASE", "centrex":-48, "centrey":182, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"0"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable32": {"id":"variable32", "type":"variable", "label":"DTEFF", "centrex":22, "centrey":207, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"max(0,DAVTMP-TBASE)"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable33": {"id":"variable33", "type":"variable", "label":"EMERG", "centrex":-2, "centrey":277, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"if t<DOYEM then 0 else 1"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable34": {"id":"variable34", "type":"variable", "label":"DOYEM", "centrex":87, "centrey":228, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"32"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable4": {"id":"variable4", "type":"variable", "label":"PARINT", "centrex":131, "centrey":448, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"0.5*DTR*(1-exp(-1*K*LAI))"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable5": {"id":"variable5", "type":"variable", "label":"GLV", "centrex":191, "centrey":325, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"FLV*GTOTAL"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable6": {"id":"variable6", "type":"variable", "label":"GTOTAL", "centrex":221, "centrey":508, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"LUE*PARINT"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable7": {"id":"variable7", "type":"variable", "label":"LUE", "centrex":154, "centrey":511, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"3.0"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable8": {"id":"variable8", "type":"variable", "label":"FRT", "centrex":273, "centrey":476, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"min(0.5,0.5*exp(0.003*(TSUM-110)))"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}},

        "variable9": {"id":"variable9", "type":"variable", "label":"FRT1", "centrex":365, "centrey":469, "text_shiftx":0, "text_shifty":0, "extras":{"equation":{"value":"FRT/Fsum"}, "min_value":{"value":"0"}, "max_value":{"value":"1"}, "documentation":{"value":""}, "comments":{"value":""}}}

    },

    "arcs":{
        "flow01": {"id":"flow01", "type":"flow", "label":"FRT1", "start_node_id":"cloud1", "end_node_id":"stock1", "node_id":"valve1", "curvature":0.3, "along":0.5},

        "flow11": {"id":"flow11", "type":"flow", "label":"FRT1", "start_node_id":"stock1", "end_node_id":"cloud2", "node_id":"valve2", "curvature":0.3, "along":0.5},

        "flow21": {"id":"flow21", "type":"flow", "label":"FRT1", "start_node_id":"cloud3", "end_node_id":"stock2", "node_id":"valve3", "curvature":0.3, "along":0.5},

        "flow31": {"id":"flow31", "type":"flow", "label":"FRT1", "start_node_id":"cloud4", "end_node_id":"stock3", "node_id":"valve4", "curvature":0.3, "along":0.5},

        "flow41": {"id":"flow41", "type":"flow", "label":"FRT1", "start_node_id":"stock3", "end_node_id":"stock4", "node_id":"valve5", "curvature":0.3, "along":0.5},

        "flow51": {"id":"flow51", "type":"flow", "label":"FRT1", "start_node_id":"cloud5", "end_node_id":"stock5", "node_id":"valve6", "curvature":0.3, "along":0.5},

        "flow61": {"id":"flow61", "type":"flow", "label":"FRT1", "start_node_id":"cloud6", "end_node_id":"stock6", "node_id":"valve7", "curvature":0.3, "along":0.5},

        "flow71": {"id":"flow71", "type":"flow", "label":"FRT1", "start_node_id":"cloud7", "end_node_id":"stock7", "node_id":"valve8", "curvature":0.3, "along":0.5},

        "influence01": {"id":"influence01", "type":"influence", "label":"FRT1", "start_node_id":"variable1", "end_node_id":"variable2", "curvature":0.3, "along":0.5},

        "influence101": {"id":"influence101", "type":"influence", "label":"FRT1", "start_node_id":"variable12", "end_node_id":"variable14", "curvature":0.3, "along":0.5},

        "influence11": {"id":"influence11", "type":"influence", "label":"FRT1", "start_node_id":"variable7", "end_node_id":"variable6", "curvature":0.3, "along":0.5},

        "influence111": {"id":"influence111", "type":"influence", "label":"FRT1", "start_node_id":"variable12", "end_node_id":"variable11", "curvature":0.3, "along":0.5},

        "influence121": {"id":"influence121", "type":"influence", "label":"FRT1", "start_node_id":"variable12", "end_node_id":"variable9", "curvature":0.3, "along":0.5},

        "influence131": {"id":"influence131", "type":"influence", "label":"FRT1", "start_node_id":"variable6", "end_node_id":"valve8", "curvature":0.3, "along":0.5},

        "influence141": {"id":"influence141", "type":"influence", "label":"FRT1", "start_node_id":"variable6", "end_node_id":"valve7", "curvature":0.3, "along":0.5},

        "influence151": {"id":"influence151", "type":"influence", "label":"FRT1", "start_node_id":"variable6", "end_node_id":"valve6", "curvature":0.3, "along":0.5},

        "influence161": {"id":"influence161", "type":"influence", "label":"FRT1", "start_node_id":"variable6", "end_node_id":"valve4", "curvature":0.3, "along":0.5},

        "influence171": {"id":"influence171", "type":"influence", "label":"FRT1", "start_node_id":"variable8", "end_node_id":"variable9", "curvature":0.333224596313815, "along":0.5},

        "influence181": {"id":"influence181", "type":"influence", "label":"FRT1", "start_node_id":"variable10", "end_node_id":"variable11", "curvature":0.3, "along":0.5},

        "influence191": {"id":"influence191", "type":"influence", "label":"FRT1", "start_node_id":"variable13", "end_node_id":"variable14", "curvature":0.3, "along":0.5},

        "influence201": {"id":"influence201", "type":"influence", "label":"FRT1", "start_node_id":"variable15", "end_node_id":"variable16", "curvature":0.3, "along":0.5},

        "influence21": {"id":"influence21", "type":"influence", "label":"FRT1", "start_node_id":"variable3", "end_node_id":"variable4", "curvature":0.3, "along":0.5},

        "influence211": {"id":"influence211", "type":"influence", "label":"FRT1", "start_node_id":"variable18", "end_node_id":"variable17", "curvature":0.3, "along":0.5},

        "influence221": {"id":"influence221", "type":"influence", "label":"FRT1", "start_node_id":"variable19", "end_node_id":"variable17", "curvature":0.3, "along":0.5},

        "influence231": {"id":"influence231", "type":"influence", "label":"FRT1", "start_node_id":"variable17", "end_node_id":"stock3", "curvature":0.3, "along":0.5},

        "influence241": {"id":"influence241", "type":"influence", "label":"FRT1", "start_node_id":"stock3", "end_node_id":"valve5", "curvature":0.3, "along":0.5},

        "influence251": {"id":"influence251", "type":"influence", "label":"FRT1", "start_node_id":"variable16", "end_node_id":"valve4", "curvature":0.3, "along":0.5},

        "influence261": {"id":"influence261", "type":"influence", "label":"FRT1", "start_node_id":"variable14", "end_node_id":"valve6", "curvature":0.3, "along":0.5},

        "influence271": {"id":"influence271", "type":"influence", "label":"FRT1", "start_node_id":"variable11", "end_node_id":"valve7", "curvature":0.3, "along":0.5},

        "influence281": {"id":"influence281", "type":"influence", "label":"FRT1", "start_node_id":"variable9", "end_node_id":"valve8", "curvature":0.3, "along":0.5},

        "influence291": {"id":"influence291", "type":"influence", "label":"FRT1", "start_node_id":"variable19", "end_node_id":"valve1", "curvature":0.3, "along":0.5},

        "influence301": {"id":"influence301", "type":"influence", "label":"FRT1", "start_node_id":"stock1", "end_node_id":"valve2", "curvature":0.3, "along":0.5},

        "influence31": {"id":"influence31", "type":"influence", "label":"FRT1", "start_node_id":"variable2", "end_node_id":"variable4", "curvature":0.3, "along":0.5},

        "influence311": {"id":"influence311", "type":"influence", "label":"FRT1", "start_node_id":"variable20", "end_node_id":"valve2", "curvature":0.3, "along":0.5},

        "influence321": {"id":"influence321", "type":"influence", "label":"FRT1", "start_node_id":"variable21", "end_node_id":"variable20", "curvature":0.3, "along":0.5},

        "influence331": {"id":"influence331", "type":"influence", "label":"FRT1", "start_node_id":"variable27", "end_node_id":"variable20", "curvature":0.3, "along":0.5},

        "influence341": {"id":"influence341", "type":"influence", "label":"FRT1", "start_node_id":"variable22", "end_node_id":"variable21", "curvature":0.3, "along":0.5},

        "influence351": {"id":"influence351", "type":"influence", "label":"FRT1", "start_node_id":"variable23", "end_node_id":"variable21", "curvature":0.3, "along":0.5},

        "influence361": {"id":"influence361", "type":"influence", "label":"FRT1", "start_node_id":"variable24", "end_node_id":"valve1", "curvature":0.3, "along":0.5},

        "influence371": {"id":"influence371", "type":"influence", "label":"FRT1", "start_node_id":"variable25", "end_node_id":"valve1", "curvature":0.3, "along":0.5},

        "influence381": {"id":"influence381", "type":"influence", "label":"FRT1", "start_node_id":"variable32", "end_node_id":"valve1", "curvature":0.3, "along":0.5},

        "influence391": {"id":"influence391", "type":"influence", "label":"FRT1", "start_node_id":"variable34", "end_node_id":"valve1", "curvature":0.3, "along":0.5},

        "influence401": {"id":"influence401", "type":"influence", "label":"FRT1", "start_node_id":"variable34", "end_node_id":"variable33", "curvature":0.3, "along":0.5},

        "influence411": {"id":"influence411", "type":"influence", "label":"FRT1", "start_node_id":"variable33", "end_node_id":"valve3", "curvature":0.3, "along":0.5},

        "influence421": {"id":"influence421", "type":"influence", "label":"FRT1", "start_node_id":"stock2", "end_node_id":"variable27", "curvature":0.3, "along":0.5},

        "influence431": {"id":"influence431", "type":"influence", "label":"FRT1", "start_node_id":"stock2", "end_node_id":"valve1", "curvature":0.3, "along":0.5},

        "influence441": {"id":"influence441", "type":"influence", "label":"FRT1", "start_node_id":"stock2", "end_node_id":"variable15", "curvature":0.3, "along":0.5},

        "influence451": {"id":"influence451", "type":"influence", "label":"FRT1", "start_node_id":"stock2", "end_node_id":"variable13", "curvature":0.3, "along":0.5},

        "influence461": {"id":"influence461", "type":"influence", "label":"FRT1", "start_node_id":"stock2", "end_node_id":"variable10", "curvature":0.3, "along":0.5},

        "influence471": {"id":"influence471", "type":"influence", "label":"FRT1", "start_node_id":"stock2", "end_node_id":"variable8", "curvature":0.3, "along":0.5},

        "influence481": {"id":"influence481", "type":"influence", "label":"FRT1", "start_node_id":"variable4", "end_node_id":"variable6", "curvature":0.3, "along":0.5},

        "influence491": {"id":"influence491", "type":"influence", "label":"FRT1", "start_node_id":"variable31", "end_node_id":"variable32", "curvature":0.3, "along":0.5},

        "influence501": {"id":"influence501", "type":"influence", "label":"FRT1", "start_node_id":"variable30", "end_node_id":"variable28", "curvature":0.3, "along":0.5},

        "influence51": {"id":"influence51", "type":"influence", "label":"FRT1", "start_node_id":"variable10", "end_node_id":"variable12", "curvature":0.3, "along":0.5},

        "influence511": {"id":"influence511", "type":"influence", "label":"FRT1", "start_node_id":"variable29", "end_node_id":"variable28", "curvature":0.3, "along":0.5},

        "influence521": {"id":"influence521", "type":"influence", "label":"FRT1", "start_node_id":"variable28", "end_node_id":"variable27", "curvature":0.3, "along":0.5},

        "influence531": {"id":"influence531", "type":"influence", "label":"FRT1", "start_node_id":"stock1", "end_node_id":"variable5", "curvature":0.3, "along":0.5},

        "influence541": {"id":"influence541", "type":"influence", "label":"FRT1", "start_node_id":"variable5", "end_node_id":"valve1", "curvature":0.3, "along":0.5},

        "influence551": {"id":"influence551", "type":"influence", "label":"FRT1", "start_node_id":"variable15", "end_node_id":"variable5", "curvature":0.3, "along":0.5},

        "influence561": {"id":"influence561", "type":"influence", "label":"FRT1", "start_node_id":"variable6", "end_node_id":"variable5", "curvature":0.3, "along":0.5},

        "influence571": {"id":"influence571", "type":"influence", "label":"FRT1", "start_node_id":"variable20", "end_node_id":"valve5", "curvature":0.3, "along":0.5},

        "influence581": {"id":"influence581", "type":"influence", "label":"FRT1", "start_node_id":"variable32", "end_node_id":"valve3", "curvature":0.3, "along":0.5},

        "influence591": {"id":"influence591", "type":"influence", "label":"FRT1", "start_node_id":"variable26", "end_node_id":"variable27", "curvature":0.3, "along":0.5},

        "influence5911": {"id":"influence5911", "type":"influence", "label":"FRT1", "start_node_id":"variable28", "end_node_id":"variable32", "curvature":0.3, "along":0.5},

        "influence5921": {"id":"influence5921", "type":"influence", "label":"FRT1", "start_node_id":"stock1", "end_node_id":"variable4", "curvature":0.3, "along":0.5},

        "influence5931": {"id":"influence5931", "type":"influence", "label":"FRT1", "start_node_id":"stock1", "end_node_id":"variable21", "curvature":0.3, "along":0.5},

        "influence61": {"id":"influence61", "type":"influence", "label":"FRT1", "start_node_id":"variable13", "end_node_id":"variable12", "curvature":0.3, "along":0.5},

        "influence71": {"id":"influence71", "type":"influence", "label":"FRT1", "start_node_id":"variable15", "end_node_id":"variable12", "curvature":0.3, "along":0.5},

        "influence81": {"id":"influence81", "type":"influence", "label":"FRT1", "start_node_id":"variable8", "end_node_id":"variable12", "curvature":0.3, "along":0.5},

        "influence91": {"id":"influence91", "type":"influence", "label":"FRT1", "start_node_id":"variable12", "end_node_id":"variable16", "curvature":0.3, "along":0.5}

    },
   "scenarios": {
      "default": {
         "simulation_settings": {
            "start_time": 0,
            "end_time": 1000,
            "nstep": 10,
            "display_interval": 1,
            "integration_method": "euler1"
         }
      }
   }

};

