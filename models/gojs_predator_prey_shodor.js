SYSTO.gojsModelSources.predator_prey_shodor = { "class": "go.GraphLinksModel",
  "linkLabelKeysProperty": "labelKeys",
  "modelData": {"id":"predator_prey_shodor", "name":"Predator_prey_shodor", "title":"gojs", "description":"no description", "author":"no author", "language":"system_dynamics"},
  "nodeDataArray": [ 
{"key":"cloud1", "category":"cloud", "loc":"141 116", "text_shift":"0.5 0.5 0 -5", "has_equation":false},
{"key":"cloud2", "category":"cloud", "loc":"458 114", "text_shift":"0.5 0.5 0 -5", "has_equation":false},
{"key":"cloud3", "category":"cloud", "loc":"154 242", "text_shift":"0.5 0.5 0 -5", "has_equation":false},
{"key":"cloud4", "category":"cloud", "loc":"473 242", "text_shift":"0.5 0.5 0 -5", "has_equation":false},
{"key":"stock1", "category":"stock", "label":"Predator_population", "loc":"319.3333333333333 115.33333333333333", "text_shift":"0.5 0.5 -12.666666666666666 45.333333333333336", "equation":"aa", "has_equation":true, "documentation":"This is the size of the predator population"},
{"key":"stock2", "category":"stock", "label":"Prey_population", "loc":"317 241", "text_shift":"0.5 0.5 0 -2", "equation":"100", "has_equation":true},
{"key":"valve1", "category":"valve", "label":"predator_births", "loc":"228.66666666666666 115.67227414330218", "text_shift":"0.5 0.5 0 1", "equation":"(predator_birth_fraction*Prey_population)*Predator_population", "has_equation":true},
{"key":"valve2", "category":"valve", "label":"predator_deaths", "loc":"390.16666666666663 114.65224358974359", "text_shift":"0.5 0.5 0 1", "equation":"predator_death_constant*Predator_population", "has_equation":true},
{"key":"valve3", "category":"valve", "label":"prey_births", "loc":"234 241.5092024539877", "text_shift":"0.5 0.5 0 1", "equation":"prey_birth_fraction*Prey_population", "has_equation":true},
{"key":"valve4", "category":"valve", "label":"prey_deaths", "loc":"396.5 241.5096153846154", "text_shift":"0.5 0.5 0 1", "equation":"(prey_death_constant*Predator_population)*Prey_population", "has_equation":true},
{"key":"variable1", "category":"variable", "label":"predator_death_constant", "loc":"406 48", "text_shift":"0.5 0.5 0 20", "equation":"0.46", "has_equation":true},
{"key":"variable2", "category":"variable", "label":"prey_birth_fraction", "loc":"184 306", "text_shift":"0.5 0.5 0 20", "equation":"0.14", "has_equation":true},
{"key":"variable3", "category":"variable", "label":"prey_death_constant", "loc":"422 310", "text_shift":"0.5 0.5 0 20", "equation":"0.006", "has_equation":true},
{"key":"variable4", "category":"variable", "label":"predator_birth_fraction", "loc":"168 25", "text_shift":"0.5 0.5 0.3333333333333339 28.333333333333336", "equation":"0.01", "has_equation":true}
 ],
  "linkDataArray": [ 
{"key":"flow1", "category":"flow", "from":"cloud1", "to":"stock1", "labelKeys":[ "valve1" ]},
{"key":"flow2", "category":"flow", "from":"stock1", "to":"cloud2", "labelKeys":[ "valve2" ]},
{"key":"flow3", "category":"flow", "from":"cloud3", "to":"stock2", "labelKeys":[ "valve3" ]},
{"key":"flow4", "category":"flow", "from":"stock2", "to":"cloud4", "labelKeys":[ "valve4" ]},
{"category":"influence", "from":"variable4", "to":"valve1"},
{"category":"influence", "from":"stock1", "to":"valve4"},
{"category":"influence", "from":"stock2", "to":"valve1"},
{"category":"influence", "from":"stock1", "to":"valve1"},
{"category":"influence", "from":"variable1", "to":"valve2"},
{"category":"influence", "from":"stock1", "to":"valve2"},
{"category":"influence", "from":"variable2", "to":"valve3"},
{"category":"influence", "from":"stock2", "to":"valve3"},
{"category":"influence", "from":"variable3", "to":"valve4"},
{"category":"influence", "from":"stock2", "to":"valve4"}
 ]};
