{
   "meta": {
      "language": "system_dynamics",
      "id": "acjh_awu3"
   },
   "nodes": {
      "stock1": {
         "id": "stock1",
         "type": "stock",
         "label": "Black_area",
         "centrex": 340,
         "centrey": 59,
         "text_shiftx": 0,
         "text_shifty": -22,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "0.01"
            },
            "min_value": {
               "type": "short_text",
               "default_value": 0,
               "value": 0
            },
            "max_value": {
               "type": "short_text",
               "default_value": 100,
               "value": 100
            },
            "documentation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "stock2": {
         "id": "stock2",
         "type": "stock",
         "label": "White_area",
         "centrex": 346,
         "centrey": 237,
         "text_shiftx": 1,
         "text_shifty": -22,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "0.01"
            },
            "min_value": {
               "type": "short_text",
               "default_value": 0,
               "value": 0
            },
            "max_value": {
               "type": "short_text",
               "default_value": 100,
               "value": 100
            },
            "documentation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "cloud1": {
         "id": "cloud1",
         "type": "cloud",
         "label": "cloud1",
         "centrex": 127,
         "centrey": 55,
         "text_shiftx": 0,
         "text_shifty": 25,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "min_value": {
               "type": "short_text",
               "default_value": 0,
               "value": 0
            },
            "max_value": {
               "type": "short_text",
               "default_value": 100,
               "value": 100
            },
            "documentation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "valve1": {
         "id": "valve1",
         "type": "valve",
         "label": "black_increase",
         "centrex": 233.5,
         "centrey": 57,
         "text_shiftx": 0,
         "text_shifty": 19,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "Black_area*bare_area*black_growth"
            },
            "min_value": {
               "type": "short_text",
               "default_value": 0,
               "value": 0
            },
            "max_value": {
               "type": "short_text",
               "default_value": 10,
               "value": 10
            },
            "documentation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "cloud2": {
         "id": "cloud2",
         "type": "cloud",
         "label": "cloud2",
         "centrex": 526,
         "centrey": 61,
         "text_shiftx": 0,
         "text_shifty": 25,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "min_value": {
               "type": "short_text",
               "default_value": 0,
               "value": 0
            },
            "max_value": {
               "type": "short_text",
               "default_value": 100,
               "value": 100
            },
            "documentation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "valve2": {
         "id": "valve2",
         "type": "valve",
         "label": "black_decrease",
         "centrex": 433,
         "centrey": 60,
         "text_shiftx": -2,
         "text_shifty": 24,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "death*Black_area"
            },
            "min_value": {
               "type": "short_text",
               "default_value": 0,
               "value": 0
            },
            "max_value": {
               "type": "short_text",
               "default_value": 10,
               "value": 10
            },
            "documentation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "cloud3": {
         "id": "cloud3",
         "type": "cloud",
         "label": "cloud3",
         "centrex": 134,
         "centrey": 234,
         "text_shiftx": 0,
         "text_shifty": 25,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "min_value": {
               "type": "short_text",
               "default_value": 0,
               "value": 0
            },
            "max_value": {
               "type": "short_text",
               "default_value": 100,
               "value": 100
            },
            "documentation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "valve3": {
         "id": "valve3",
         "type": "valve",
         "label": "white_increase",
         "centrex": 240,
         "centrey": 235.5,
         "text_shiftx": 0,
         "text_shifty": 19,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "White_area*bare_area*white_growth"
            },
            "min_value": {
               "type": "short_text",
               "default_value": 0,
               "value": 0
            },
            "max_value": {
               "type": "short_text",
               "default_value": 10,
               "value": 10
            },
            "documentation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "cloud4": {
         "id": "cloud4",
         "type": "cloud",
         "label": "cloud4",
         "centrex": 536,
         "centrey": 237,
         "text_shiftx": 0,
         "text_shifty": 25,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "min_value": {
               "type": "short_text",
               "default_value": 0,
               "value": 0
            },
            "max_value": {
               "type": "short_text",
               "default_value": 100,
               "value": 100
            },
            "documentation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "valve4": {
         "id": "valve4",
         "type": "valve",
         "label": "white_decrease",
         "centrex": 441,
         "centrey": 237,
         "text_shiftx": 0,
         "text_shifty": 19,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "death*White_area"
            },
            "min_value": {
               "type": "short_text",
               "default_value": 0,
               "value": 0
            },
            "max_value": {
               "type": "short_text",
               "default_value": 10,
               "value": 10
            },
            "documentation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "variable1": {
         "id": "variable1",
         "type": "variable",
         "label": "death",
         "centrex": 517,
         "centrey": 147,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "0.3"
            },
            "min_value": {
               "type": "short_text",
               "default_value": 0,
               "value": 0
            },
            "max_value": {
               "type": "short_text",
               "default_value": 1,
               "value": 1
            },
            "documentation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "variable2": {
         "id": "variable2",
         "type": "variable",
         "label": "bare_area",
         "centrex": 442,
         "centrey": 149,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "1-Black_area-White_area"
            },
            "min_value": {
               "type": "short_text",
               "default_value": 0,
               "value": 0
            },
            "max_value": {
               "type": "short_text",
               "default_value": 1,
               "value": 1
            },
            "documentation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "variable3": {
         "id": "variable3",
         "type": "variable",
         "label": "planet_albedo",
         "centrex": 347,
         "centrey": 140,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "black_albedo*Black_area+white_albedo*White_area+bare_albedo*bare_area"
            },
            "min_value": {
               "type": "short_text",
               "default_value": 0,
               "value": 0
            },
            "max_value": {
               "type": "short_text",
               "default_value": 1,
               "value": 1
            },
            "documentation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "variable4": {
         "id": "variable4",
         "type": "variable",
         "label": "black_albedo",
         "centrex": 266,
         "centrey": 107,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "0.25"
            },
            "min_value": {
               "type": "short_text",
               "default_value": 0,
               "value": 0
            },
            "max_value": {
               "type": "short_text",
               "default_value": 1,
               "value": 1
            },
            "documentation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "variable5": {
         "id": "variable5",
         "type": "variable",
         "label": "white_albedo",
         "centrex": 238,
         "centrey": 180,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "0.75"
            },
            "min_value": {
               "type": "short_text",
               "default_value": 0,
               "value": 0
            },
            "max_value": {
               "type": "short_text",
               "default_value": 1,
               "value": 1
            },
            "documentation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "variable6": {
         "id": "variable6",
         "type": "variable",
         "label": "bare_albedo",
         "centrex": 326,
         "centrey": 183,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "0.5"
            },
            "min_value": {
               "type": "short_text",
               "default_value": 0,
               "value": 0
            },
            "max_value": {
               "type": "short_text",
               "default_value": 1,
               "value": 1
            },
            "documentation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "variable7": {
         "id": "variable7",
         "type": "variable",
         "label": "black_temp",
         "centrex": 185,
         "centrey": 89,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "q1*(planet_albedo-black_albedo)+effective_temp"
            },
            "min_value": {
               "type": "short_text",
               "default_value": 0,
               "value": 0
            },
            "max_value": {
               "type": "short_text",
               "default_value": 1,
               "value": 1
            },
            "documentation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "variable8": {
         "id": "variable8",
         "type": "variable",
         "label": "white_temp",
         "centrex": 151,
         "centrey": 196,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "q1*(planet_albedo-white_albedo)+effective_temp"
            },
            "min_value": {
               "type": "short_text",
               "default_value": 0,
               "value": 0
            },
            "max_value": {
               "type": "short_text",
               "default_value": 1,
               "value": 1
            },
            "documentation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "variable9": {
         "id": "variable9",
         "type": "variable",
         "label": "q1",
         "centrex": 197,
         "centrey": 139,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "20"
            },
            "min_value": {
               "type": "short_text",
               "default_value": 0,
               "value": 0
            },
            "max_value": {
               "type": "short_text",
               "default_value": 1,
               "value": 1
            },
            "documentation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "variable10": {
         "id": "variable10",
         "type": "variable",
         "label": "effective_temp",
         "centrex": 127,
         "centrey": 137,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "pow(solar_const*luminosity*(1-planet_albedo)/stefan,0.25)-273"
            },
            "min_value": {
               "type": "short_text",
               "default_value": 0,
               "value": 0
            },
            "max_value": {
               "type": "short_text",
               "default_value": 1,
               "value": 1
            },
            "documentation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "variable11": {
         "id": "variable11",
         "type": "variable",
         "label": "solar_const",
         "centrex": 76,
         "centrey": 92,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "917"
            },
            "min_value": {
               "type": "short_text",
               "default_value": 0,
               "value": 0
            },
            "max_value": {
               "type": "short_text",
               "default_value": 1,
               "value": 1
            },
            "documentation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "variable12": {
         "id": "variable12",
         "type": "variable",
         "label": "luminosity",
         "centrex": 32,
         "centrey": 152,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "0.8"
            },
            "min_value": {
               "type": "short_text",
               "default_value": 0,
               "value": 0
            },
            "max_value": {
               "type": "short_text",
               "default_value": 1,
               "value": 1
            },
            "documentation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "variable13": {
         "id": "variable13",
         "type": "variable",
         "label": "stefan",
         "centrex": 42,
         "centrey": 189,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "0.0000000567"
            },
            "min_value": {
               "type": "short_text",
               "default_value": 0,
               "value": 0
            },
            "max_value": {
               "type": "short_text",
               "default_value": 1,
               "value": 1
            },
            "documentation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "variable14": {
         "id": "variable14",
         "type": "variable",
         "label": "k1",
         "centrex": -34,
         "centrey": 158,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "0.003265"
            },
            "min_value": {
               "type": "short_text",
               "default_value": 0,
               "value": 0
            },
            "max_value": {
               "type": "short_text",
               "default_value": 1,
               "value": 1
            },
            "documentation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "variable15": {
         "id": "variable15",
         "type": "variable",
         "label": "best_temp",
         "centrex": -6,
         "centrey": 121,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "22.5"
            },
            "min_value": {
               "type": "short_text",
               "default_value": 0,
               "value": 0
            },
            "max_value": {
               "type": "short_text",
               "default_value": 1,
               "value": 1
            },
            "documentation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "variable16": {
         "id": "variable16",
         "type": "variable",
         "label": "black_growth",
         "centrex": -9,
         "centrey": 66,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "pow(1-k1*(best_temp-black_temp),2)"
            },
            "min_value": {
               "type": "short_text",
               "default_value": 0,
               "value": 0
            },
            "max_value": {
               "type": "short_text",
               "default_value": 1,
               "value": 1
            },
            "documentation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "variable17": {
         "id": "variable17",
         "type": "variable",
         "label": "white_growth",
         "centrex": 7,
         "centrey": 221,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "pow(1-k1*(best_temp-white_temp),2)"
            },
            "min_value": {
               "type": "short_text",
               "default_value": 0,
               "value": 0
            },
            "max_value": {
               "type": "short_text",
               "default_value": 1,
               "value": 1
            },
            "documentation": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      }
   },
   "arcs": {
      "flow1": {
         "id": "flow1",
         "type": "flow",
         "label": "flow1",
         "start_node_id": "cloud1",
         "end_node_id": "stock1",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "node_id": "valve1",
         "shape": "straight",
         "line_colour": "#a0a0a0",
         "line_width": 4,
         "fill_colour": "#a0a0a0",
         "arrowhead": {
            "shape": "diamond",
            "gap": 6,
            "width": 5,
            "front": 12,
            "back": 0
         }
      },
      "flow2": {
         "id": "flow2",
         "type": "flow",
         "label": "flow2",
         "start_node_id": "stock1",
         "end_node_id": "cloud2",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "node_id": "valve2",
         "shape": "straight",
         "line_colour": "#a0a0a0",
         "line_width": 4,
         "fill_colour": "#a0a0a0",
         "arrowhead": {
            "shape": "diamond",
            "gap": 6,
            "width": 5,
            "front": 12,
            "back": 0
         }
      },
      "flow3": {
         "id": "flow3",
         "type": "flow",
         "label": "flow3",
         "start_node_id": "cloud3",
         "end_node_id": "stock2",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "node_id": "valve3",
         "shape": "straight",
         "line_colour": "#a0a0a0",
         "line_width": 4,
         "fill_colour": "#a0a0a0",
         "arrowhead": {
            "shape": "diamond",
            "gap": 6,
            "width": 5,
            "front": 12,
            "back": 0
         }
      },
      "flow4": {
         "id": "flow4",
         "type": "flow",
         "label": "flow4",
         "start_node_id": "stock2",
         "end_node_id": "cloud4",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "node_id": "valve4",
         "shape": "straight",
         "line_colour": "#a0a0a0",
         "line_width": 4,
         "fill_colour": "#a0a0a0",
         "arrowhead": {
            "shape": "diamond",
            "gap": 6,
            "width": 5,
            "front": 12,
            "back": 0
         }
      },
      "influence1": {
         "id": "influence1",
         "type": "influence",
         "label": "influence1",
         "start_node_id": "stock1",
         "end_node_id": "valve2",
         "curvature": 0.21202312138728313,
         "along": 1.2181502890173412,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence2": {
         "id": "influence2",
         "type": "influence",
         "label": "influence2",
         "start_node_id": "variable1",
         "end_node_id": "valve2",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence3": {
         "id": "influence3",
         "type": "influence",
         "label": "influence3",
         "start_node_id": "variable1",
         "end_node_id": "valve4",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence4": {
         "id": "influence4",
         "type": "influence",
         "label": "influence4",
         "start_node_id": "stock1",
         "end_node_id": "valve1",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence5": {
         "id": "influence5",
         "type": "influence",
         "label": "influence5",
         "start_node_id": "stock2",
         "end_node_id": "valve4",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence6": {
         "id": "influence6",
         "type": "influence",
         "label": "influence6",
         "start_node_id": "stock2",
         "end_node_id": "valve3",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence7": {
         "id": "influence7",
         "type": "influence",
         "label": "influence7",
         "start_node_id": "stock2",
         "end_node_id": "variable2",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence8": {
         "id": "influence8",
         "type": "influence",
         "label": "influence8",
         "start_node_id": "stock1",
         "end_node_id": "variable2",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence9": {
         "id": "influence9",
         "type": "influence",
         "label": "influence9",
         "start_node_id": "variable2",
         "end_node_id": "variable3",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence10": {
         "id": "influence10",
         "type": "influence",
         "label": "influence10",
         "start_node_id": "stock1",
         "end_node_id": "variable3",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence11": {
         "id": "influence11",
         "type": "influence",
         "label": "influence11",
         "start_node_id": "stock2",
         "end_node_id": "variable3",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence12": {
         "id": "influence12",
         "type": "influence",
         "label": "influence12",
         "start_node_id": "variable6",
         "end_node_id": "variable3",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence13": {
         "id": "influence13",
         "type": "influence",
         "label": "influence13",
         "start_node_id": "variable4",
         "end_node_id": "variable3",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence14": {
         "id": "influence14",
         "type": "influence",
         "label": "influence14",
         "start_node_id": "variable5",
         "end_node_id": "variable3",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence15": {
         "id": "influence15",
         "type": "influence",
         "label": "influence15",
         "start_node_id": "variable4",
         "end_node_id": "variable7",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence16": {
         "id": "influence16",
         "type": "influence",
         "label": "influence16",
         "start_node_id": "variable3",
         "end_node_id": "variable7",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence17": {
         "id": "influence17",
         "type": "influence",
         "label": "influence17",
         "start_node_id": "variable3",
         "end_node_id": "variable8",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence18": {
         "id": "influence18",
         "type": "influence",
         "label": "influence18",
         "start_node_id": "variable3",
         "end_node_id": "variable10",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence19": {
         "id": "influence19",
         "type": "influence",
         "label": "influence19",
         "start_node_id": "variable11",
         "end_node_id": "variable10",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence20": {
         "id": "influence20",
         "type": "influence",
         "label": "influence20",
         "start_node_id": "variable12",
         "end_node_id": "variable10",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence21": {
         "id": "influence21",
         "type": "influence",
         "label": "influence21",
         "start_node_id": "variable13",
         "end_node_id": "variable10",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence22": {
         "id": "influence22",
         "type": "influence",
         "label": "influence22",
         "start_node_id": "variable14",
         "end_node_id": "variable17",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence23": {
         "id": "influence23",
         "type": "influence",
         "label": "influence23",
         "start_node_id": "variable14",
         "end_node_id": "variable16",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence24": {
         "id": "influence24",
         "type": "influence",
         "label": "influence24",
         "start_node_id": "variable15",
         "end_node_id": "variable17",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence25": {
         "id": "influence25",
         "type": "influence",
         "label": "influence25",
         "start_node_id": "variable15",
         "end_node_id": "variable16",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence26": {
         "id": "influence26",
         "type": "influence",
         "label": "influence26",
         "start_node_id": "variable7",
         "end_node_id": "variable16",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence27": {
         "id": "influence27",
         "type": "influence",
         "label": "influence27",
         "start_node_id": "variable8",
         "end_node_id": "variable17",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence28": {
         "id": "influence28",
         "type": "influence",
         "label": "influence28",
         "start_node_id": "variable16",
         "end_node_id": "valve1",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence29": {
         "id": "influence29",
         "type": "influence",
         "label": "influence29",
         "start_node_id": "variable17",
         "end_node_id": "valve3",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence30": {
         "id": "influence30",
         "type": "influence",
         "label": "influence30",
         "start_node_id": "variable10",
         "end_node_id": "variable7",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence31": {
         "id": "influence31",
         "type": "influence",
         "label": "influence31",
         "start_node_id": "variable10",
         "end_node_id": "variable8",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence32": {
         "id": "influence32",
         "type": "influence",
         "label": "influence32",
         "start_node_id": "variable2",
         "end_node_id": "valve3",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence33": {
         "id": "influence33",
         "type": "influence",
         "label": "influence33",
         "start_node_id": "variable2",
         "end_node_id": "valve1",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence34": {
         "id": "influence34",
         "type": "influence",
         "label": "influence34",
         "start_node_id": "variable9",
         "end_node_id": "variable7",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence35": {
         "id": "influence35",
         "type": "influence",
         "label": "influence35",
         "start_node_id": "variable9",
         "end_node_id": "variable8",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      },
      "influence36": {
         "id": "influence36",
         "type": "influence",
         "label": "influence36",
         "start_node_id": "variable5",
         "end_node_id": "variable8",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "#505050",
         "line_width": 1,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 3,
            "front": 10,
            "back": -2
         }
      }
   },
   "scenarios": {
      "default": {
         "simulation_settings": {
            "start_time": 0,
            "end_time": 100,
            "nstep": 100
            "display_interval": 1,
            "integration_method": "euler1"
         }
      }
   }
}
