SYSTO.models.zerodim_ebm = {
   "meta": {
      "language": "system_dynamics",
      "id": "acjt_6wz3"
   },
   "nodes": {
      "stock1": {
         "id": "stock1",
         "type": "stock",
         "label": "Heat",
         "centrex": 369,
         "centrey": 125,
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
      "variable1": {
         "id": "variable1",
         "type": "variable",
         "label": "earth_radius",
         "centrex": 269,
         "centrey": 54,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "6367000"
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
         "label": "solar_constant",
         "centrex": 166,
         "centrey": 95,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "1370"
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
         "label": "albedo",
         "centrex": 154,
         "centrey": 59,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "0.4"
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
      "cloud1": {
         "id": "cloud1",
         "type": "cloud",
         "label": "cloud1",
         "centrex": 183,
         "centrey": 127,
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
         "label": "Rin",
         "centrex": 276,
         "centrey": 126,
         "text_shiftx": -19,
         "text_shifty": -9,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "3.14*earth_radius*earth_radius*solar_constant*(1-albedo)"
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
         "centrex": 534,
         "centrey": 125,
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
         "label": "Rout",
         "centrex": 451.5,
         "centrey": 125,
         "text_shiftx": -19,
         "text_shifty": -13,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "4*3.14+earth_radius*earth_radius*stefan*pow(surface_temperature,4)*torr"
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
      "variable4": {
         "id": "variable4",
         "type": "variable",
         "label": "stefan",
         "centrex": 433,
         "centrey": 64,
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
      "variable5": {
         "id": "variable5",
         "type": "variable",
         "label": "surface_temperature",
         "centrex": 504,
         "centrey": 54,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "293"
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
         "label": "torr",
         "centrex": 578,
         "centrey": 53,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "0.62"
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
      "influence1": {
         "id": "influence1",
         "type": "influence",
         "label": "influence1",
         "start_node_id": "variable3",
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
      "influence2": {
         "id": "influence2",
         "type": "influence",
         "label": "influence2",
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
      "influence3": {
         "id": "influence3",
         "type": "influence",
         "label": "influence3",
         "start_node_id": "variable1",
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
      "influence4": {
         "id": "influence4",
         "type": "influence",
         "label": "influence4",
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
      "influence5": {
         "id": "influence5",
         "type": "influence",
         "label": "influence5",
         "start_node_id": "variable4",
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
      "influence6": {
         "id": "influence6",
         "type": "influence",
         "label": "influence6",
         "start_node_id": "variable5",
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
      "influence7": {
         "id": "influence7",
         "type": "influence",
         "label": "influence7",
         "start_node_id": "variable6",
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
      }
   },
   "scenarios": {
      "default": {
         "simulation_settings": {
            "start_time": 0,
            "end_time": 1000000,
            "nstep": 10,
            "display_interval": 1,
            "integration_method": "euler1"
         }
      }
   }
};
