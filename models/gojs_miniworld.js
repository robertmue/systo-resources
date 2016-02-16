SYSTO.gojsModelSources.miniworld = {
    "class": "go.GraphLinksModel",
    "linkLabelKeysProperty": "labelKeys",
    "modelData": {
        "id": "miniworld",
        "name": "Miniworld",
        "language": "system_dynamics"
    },
    "nodeDataArray": [
        {
            "key": "cloud1",
            "category": "cloud",
            "loc": "37 239",
            "text_shift": "0.5 0.5 0 -5",
            "has_equation": false
        },
        {
            "key": "cloud2",
            "category": "cloud",
            "loc": "352 243",
            "text_shift": "0.5 0.5 0 -5",
            "has_equation": false
        },
        {
            "key": "cloud3",
            "category": "cloud",
            "loc": "265 113",
            "text_shift": "0.5 0.5 0 -5",
            "has_equation": false
        },
        {
            "key": "cloud4",
            "category": "cloud",
            "loc": "620 117",
            "text_shift": "0.5 0.5 0 -5",
            "has_equation": false
        },
        {
            "key": "cloud5",
            "category": "cloud",
            "loc": "614 341",
            "text_shift": "0.5 0.5 0 -5",
            "has_equation": false
        },
        {
            "key": "stock1",
            "category": "stock",
            "label": "Population",
            "loc": "215 241",
            "text_shift": "0.5 0.5 0 -2",
            "equation": "1",
            "has_equation": true
        },
        {
            "key": "stock3",
            "category": "stock",
            "label": "Environ_pollution",
            "loc": "434 117",
            "text_shift": "0.5 0.5 -2 42",
            "equation": "1",
            "has_equation": true
        },
        {
            "key": "stock5",
            "category": "stock",
            "label": "Production_capacity",
            "loc": "415 342",
            "text_shift": "0.5 0.5 0 -2",
            "equation": "1",
            "has_equation": true
        },
        {
            "key": "valve1",
            "category": "valve",
            "label": "births",
            "loc": "126 240",
            "text_shift": "0.5 0.5 -29 30",
            "equation": "birth_rate*Population*quality_of_environment*consumption_level*birth_control",
            "has_equation": true
        },
        {
            "key": "valve2",
            "category": "valve",
            "label": "deaths",
            "loc": "283.5 242",
            "text_shift": "0.5 0.5 8 44",
            "equation": "death_rate*Population*Environ_pollution",
            "has_equation": true
        },
        {
            "key": "valve3",
            "category": "valve",
            "label": "degradation",
            "loc": "349.5 115",
            "text_shift": "0.5 0.5 -36 32",
            "equation": "degradation_rate*Population*consumption_level",
            "has_equation": true
        },
        {
            "key": "valve4",
            "category": "valve",
            "label": "regeneration",
            "loc": "527 117",
            "text_shift": "0.5 0.5 -27 2",
            "equation": "quality_of_environment>1?regeneration_rate*Environ_pollution:regeneration_rate*damage_threshold",
            "has_equation": true
        },
        {
            "key": "valve5",
            "category": "valve",
            "label": "capacity_increase",
            "loc": "514.5 341.5",
            "text_shift": "0.5 0.5 0 -19",
            "equation": "growth_rate*consumption_level*Environ_pollution*(1-(consumption_level*Environ_pollution/consumption_goal))",
            "has_equation": true
        },
        {
            "key": "variable1",
            "category": "variable",
            "label": "birth_rate",
            "loc": "140 321",
            "text_shift": "0.5 0.5 0 20",
            "equation": "0.03+rand_var(0,0.1)",
            "has_equation": true
        },
        {
            "key": "variable11",
            "category": "variable",
            "label": "regeneration_rate",
            "loc": "643 170",
            "text_shift": "0.5 0.5 0 20",
            "equation": "0.1",
            "has_equation": true
        },
        {
            "key": "variable13",
            "category": "variable",
            "label": "degradation_rate",
            "loc": "641 207",
            "text_shift": "0.5 0.5 0 20",
            "equation": "0.02",
            "has_equation": true
        },
        {
            "key": "variable15",
            "category": "variable",
            "label": "consumption_goal",
            "loc": "630 250",
            "text_shift": "0.5 0.5 0 20",
            "equation": "10",
            "has_equation": true
        },
        {
            "key": "variable17",
            "category": "variable",
            "label": "growth_rate",
            "loc": "634 291",
            "text_shift": "0.5 0.5 0 20",
            "equation": "0.05",
            "has_equation": true
        },
        {
            "key": "variable19",
            "category": "variable",
            "label": "consumption_level",
            "loc": "469 233",
            "text_shift": "0.5 0.5 0 20",
            "equation": "Production_capacity",
            "has_equation": true
        },
        {
            "key": "variable3",
            "category": "variable",
            "label": "birth_control",
            "loc": "72 348",
            "text_shift": "0.5 0.5 0 20",
            "equation": "1",
            "has_equation": true
        },
        {
            "key": "variable5",
            "category": "variable",
            "label": "death_rate",
            "loc": "257 318",
            "text_shift": "0.5 0.5 0 20",
            "equation": "0.01",
            "has_equation": true
        },
        {
            "key": "variable7",
            "category": "variable",
            "label": "quality_of_environment",
            "loc": "318 50",
            "text_shift": "0.5 0.5 0 20",
            "equation": "damage_threshold/Environ_pollution",
            "has_equation": true
        },
        {
            "key": "variable9",
            "category": "variable",
            "label": "damage_threshold",
            "loc": "580 46",
            "text_shift": "0.5 0.5 0 20",
            "equation": "1",
            "has_equation": true
        }
    ],
    "linkDataArray": [
        {
            "key": "flow1",
            "category": "flow",
            "from": "cloud1",
            "to": "stock1",
            "labelKeys": [
                "valve1"
            ]
        },
        {
            "key": "flow2",
            "category": "flow",
            "from": "stock1",
            "to": "cloud2",
            "labelKeys": [
                "valve2"
            ]
        },
        {
            "key": "flow3",
            "category": "flow",
            "from": "cloud3",
            "to": "stock3",
            "labelKeys": [
                "valve3"
            ]
        },
        {
            "key": "flow4",
            "category": "flow",
            "from": "stock3",
            "to": "cloud4",
            "labelKeys": [
                "valve4"
            ]
        },
        {
            "category": "influence",
            "from": "variable3",
            "to": "valve1"
        },
        {
            "category": "influence",
            "from": "variable9",
            "to": "valve4"
        },
        {
            "category": "influence",
            "from": "variable7",
            "to": "valve4"
        },
        {
            "category": "influence",
            "from": "stock3",
            "to": "valve4"
        },
        {
            "category": "influence",
            "from": "variable11",
            "to": "valve4"
        },
        {
            "category": "influence",
            "from": "variable13",
            "to": "valve3"
        },
        {
            "category": "influence",
            "from": "variable15",
            "to": "valve5"
        },
        {
            "key": "flow5",
            "category": "flow",
            "from": "cloud5",
            "to": "stock5",
            "labelKeys": [
                "valve5"
            ]
        },
        {
            "category": "influence",
            "from": "variable17",
            "to": "valve5"
        },
        {
            "category": "influence",
            "from": "stock5",
            "to": "variable19"
        },
        {
            "category": "influence",
            "from": "variable19",
            "to": "valve5"
        },
        {
            "category": "influence",
            "from": "variable19",
            "to": "valve1"
        },
        {
            "category": "influence",
            "from": "variable1",
            "to": "valve1"
        },
        {
            "category": "influence",
            "from": "variable19",
            "to": "valve3"
        },
        {
            "category": "influence",
            "from": "stock3",
            "to": "variable7"
        },
        {
            "category": "influence",
            "from": "stock3",
            "to": "valve5"
        },
        {
            "category": "influence",
            "from": "stock1",
            "to": "valve1"
        },
        {
            "category": "influence",
            "from": "stock1",
            "to": "valve2"
        },
        {
            "category": "influence",
            "from": "variable5",
            "to": "valve2"
        },
        {
            "category": "influence",
            "from": "stock3",
            "to": "valve2"
        },
        {
            "category": "influence",
            "from": "stock1",
            "to": "valve3"
        },
        {
            "category": "influence",
            "from": "variable7",
            "to": "valve1"
        },
        {
            "category": "influence",
            "from": "variable9",
            "to": "variable7"
        }
    ]
};
