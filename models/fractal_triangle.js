SYSTO.models.fractal_triangle = 
{
   "meta": {
      "language": "system_dynamics",
      "id": "ad5j_aeb8"
   },
   "nodes": {
      "stock1": {
         "id": "stock1",
         "type": "stock",
         "label": "X",
         "centrex": 404,
         "centrey": 82,
         "text_shiftx": 1,
         "text_shifty": -22,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "30"
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
         "label": "Y",
         "centrex": 400,
         "centrey": 172,
         "text_shiftx": 1,
         "text_shifty": -22,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "40"
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
         "centrex": 249,
         "centrey": 76,
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
         "label": "dX",
         "centrex": 326.5,
         "centrey": 79,
         "text_shiftx": 0,
         "text_shifty": 19,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "ratio*(sidemidx-X)"
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
         "centrex": 238,
         "centrey": 174,
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
         "label": "dY",
         "centrex": 319,
         "centrey": 173,
         "text_shiftx": 0,
         "text_shifty": 18,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "ratio*(sidemidy-Y)"
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
         "label": "side",
         "centrex": 74,
         "centrey": 120,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "irand_var(3)+dummy"
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
         "label": "sidemidx",
         "centrex": 187,
         "centrey": 101,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "side==1?0:side==2?400:200"
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
         "label": "sidemidy",
         "centrex": 182,
         "centrey": 140,
         "text_shiftx": 0,
         "text_shifty": 0,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "side==1?300:side==2?300:0"
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
         "label": "dummy",
         "centrex": 66,
         "centrey": 196,
         "text_shiftx": 0,
         "text_shifty": 0,
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
         "label": "ratio",
         "centrex": 145,
         "centrey": 59,
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
         "start_node_id": "cloud2",
         "end_node_id": "stock2",
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
         "start_node_id": "variable1",
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
      "influence2": {
         "id": "influence2",
         "type": "influence",
         "label": "influence2",
         "start_node_id": "variable1",
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
      "influence3": {
         "id": "influence3",
         "type": "influence",
         "label": "influence3",
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
         "start_node_id": "variable3",
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
         "start_node_id": "stock2",
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
         "start_node_id": "variable4",
         "end_node_id": "variable1",
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
         "start_node_id": "variable5",
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
      "influence9": {
         "id": "influence9",
         "type": "influence",
         "label": "influence9",
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
      }
   },
   "scenarios": {
      "default": {
         "simulation_settings": {
            "start_time": 0,
            "end_time": 1000,
            "nstep": 1,
            "display_interval": 1,
            "integration_method": "euler1"
         }
      }
   }
};
