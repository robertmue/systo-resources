SYSTO.gojsModelSources.cascade = {
    "class": "go.GraphLinksModel",
    "linkLabelKeysProperty": "labelKeys",
    "modelData": {
        "id": "cascade",
        "name": "4-tank cascade",
        "language": "system_dynamics",
        "author": "",
        "title": "",
        "description": "This model represents a set of 4 tanks, connected in a linear sequence.  At the start, tank1 contains some water while the other 3 are empty.   Water drains out of the first one into the second, and so on, ending up in tank4.  Each flow is simply proportional to the amount of water in its source tank, with the constants k1, k2 and k3 determining the proportional loss per unit of time."
    },
    "nodeDataArray": [
        {
            "key": "stock1",
            "category": "stock",
            "label": "tank1",
            "loc": "92 117",
            "text_shift": "0.5 0.5 1 42",
            "equation": "100",
            "has_equation": true
        },
        {
            "key": "stock2",
            "category": "stock",
            "label": "tank2",
            "loc": "240 119",
            "text_shift": "0.5 0.5 1 42",
            "equation": "0",
            "has_equation": true
        },
        {
            "key": "stock3",
            "category": "stock",
            "label": "tank3",
            "loc": "373 121",
            "text_shift": "0.5 0.5 1 42",
            "equation": "0",
            "has_equation": true
        },
        {
            "key": "stock4",
            "category": "stock",
            "label": "tank4",
            "loc": "503 120",
            "text_shift": "0.5 0.5 1 42",
            "equation": "0",
            "has_equation": true
        },
        {
            "key": "valve1",
            "category": "valve",
            "label": "flow1",
            "loc": "166 118",
            "text_shift": "0.5 0.5 0 1",
            "equation": "k1*tank1",
            "has_equation": true
        },
        {
            "key": "valve2",
            "category": "valve",
            "label": "flow2",
            "loc": "306.5 120",
            "text_shift": "0.5 0.5 0 1",
            "equation": "k2*tank2",
            "has_equation": true
        },
        {
            "key": "valve3",
            "category": "valve",
            "label": "flow3",
            "loc": "438 120.5",
            "text_shift": "0.5 0.5 0 1",
            "equation": "k3*tank3",
            "has_equation": true
        },
        {
            "key": "variable1",
            "category": "variable",
            "label": "k1",
            "loc": "129 172",
            "text_shift": "0.5 0.5 0 20",
            "equation": "0.02",
            "has_equation": true
        },
        {
            "key": "variable2",
            "category": "variable",
            "label": "k2",
            "loc": "268 173",
            "text_shift": "0.5 0.5 0 20",
            "equation": "0.02",
            "has_equation": true
        },
        {
            "key": "variable3",
            "category": "variable",
            "label": "k3",
            "loc": "414 170",
            "text_shift": "0.5 0.5 0 20",
            "equation": "0.02",
            "has_equation": true
        }
    ],
    "linkDataArray": [
        {
            "key": "flow1",
            "category": "flow",
            "from": "stock1",
            "to": "stock2",
            "labelKeys": [
                "valve1"
            ]
        },
        {
            "key": "flow2",
            "category": "flow",
            "from": "stock2",
            "to": "stock3",
            "labelKeys": [
                "valve2"
            ]
        },
        {
            "key": "flow3",
            "category": "flow",
            "from": "stock3",
            "to": "stock4",
            "labelKeys": [
                "valve3"
            ]
        },
        {
            "category": "influence",
            "from": "stock1",
            "to": "valve1"
        },
        {
            "category": "influence",
            "from": "stock2",
            "to": "valve2"
        },
        {
            "category": "influence",
            "from": "stock3",
            "to": "valve3"
        },
        {
            "category": "influence",
            "from": "variable1",
            "to": "valve1"
        },
        {
            "category": "influence",
            "from": "variable2",
            "to": "valve2"
        },
        {
            "category": "influence",
            "from": "variable3",
            "to": "valve3"
        }
    ]
};
