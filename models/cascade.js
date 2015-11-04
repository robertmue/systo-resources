SYSTO.models.cascade = {
   "meta": {
      "id": "cascade",
      "language": "system_dynamics",
      "name": "4-tank cascade",
      "title": "",
      "description": "This model represents a set of 4 tanks, connected in a linear sequence.  At the start, tank1 contains some water while the other 3 are empty.   Water drains out of the first one into the second, and so on, ending up in tank4.  Each flow is simply proportional to the amount of water in its source tank, with the constants k1, k2 and k3 determining the proportional loss per unit of time.",
      "author": ""
   },
   "nodes": {
      "stock1": {
         "id": "stock1",
         "type": "stock",
         "label": "tank1",
         "centrex": 92,
         "centrey": 117,
         "text_shiftx": 1,
         "text_shifty": -22,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "100"
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
         "label": "tank2",
         "centrex": 240,
         "centrey": 119,
         "text_shiftx": 1,
         "text_shifty": -22,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "0"
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
      "stock3": {
         "id": "stock3",
         "type": "stock",
         "label": "tank3",
         "centrex": 373,
         "centrey": 121,
         "text_shiftx": 1,
         "text_shifty": -22,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "0"
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
      "stock4": {
         "id": "stock4",
         "type": "stock",
         "label": "tank4",
         "centrex": 503,
         "centrey": 120,
         "text_shiftx": 1,
         "text_shifty": -22,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "0"
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
         "label": "flow1",
         "centrex": 166,
         "centrey": 118,
         "text_shiftx": 0,
         "text_shifty": 19,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "k1*tank1"
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
      "valve2": {
         "id": "valve2",
         "type": "valve",
         "label": "flow2",
         "centrex": 306.5,
         "centrey": 120,
         "text_shiftx": 0,
         "text_shifty": 19,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "k2*tank2"
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
      "valve3": {
         "id": "valve3",
         "type": "valve",
         "label": "flow3",
         "centrex": 438,
         "centrey": 120.5,
         "text_shiftx": 0,
         "text_shifty": 19,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "k3*tank3"
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
         "label": "k1",
         "centrex": 129,
         "centrey": 172,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "0.02"
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
         "label": "k2",
         "centrex": 268,
         "centrey": 173,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "0.02"
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
         "label": "k3",
         "centrex": 414,
         "centrey": 170,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "0.02"
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
         "start_node_id": "stock1",
         "end_node_id": "stock2",
         "curvature": 0.0,
         "along": 0.5,
         "node_id": "valve1",
         "shape": "straight",
         "set_state": "set",
         "select_state": "normal",
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
         "start_node_id": "stock2",
         "end_node_id": "stock3",
         "curvature": 0.0,
         "along": 0.5,
         "node_id": "valve2",
         "shape": "straight",
         "set_state": "set",
         "select_state": "normal",
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
         "start_node_id": "stock3",
         "end_node_id": "stock4",
         "curvature": 0.0,
         "along": 0.5,
         "node_id": "valve3",
         "shape": "straight",
         "set_state": "set",
         "select_state": "normal",
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
         "end_node_id": "valve1",
         "curvature": 0.3,
         "along": 0.5,
         "shape": "curved",
         "set_state": "set",
         "select_state": "normal",
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
         "start_node_id": "stock2",
         "end_node_id": "valve2",
         "curvature": 0.3,
         "along": 0.5,
         "shape": "curved",
         "set_state": "set",
         "select_state": "normal",
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
         "start_node_id": "stock3",
         "end_node_id": "valve3",
         "curvature": 0.3,
         "along": 0.5,
         "shape": "curved",
         "set_state": "set",
         "select_state": "normal",
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
         "start_node_id": "variable1",
         "end_node_id": "valve1",
         "curvature": 0.3,
         "along": 0.5,
         "shape": "curved",
         "set_state": "set",
         "select_state": "normal",
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
         "start_node_id": "variable2",
         "end_node_id": "valve2",
         "curvature": 0.3,
         "along": 0.5,
         "shape": "curved",
         "set_state": "set",
         "select_state": "normal",
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
         "start_node_id": "variable3",
         "end_node_id": "valve3",
         "curvature": 0.3,
         "along": 0.5,
         "shape": "curved",
         "set_state": "set",
         "select_state": "normal",
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
            "end_time": 80,
            "nstep": 25,
            "display_interval": 1,
            "integration_method": "euler1"
         }
      }
   }
};
