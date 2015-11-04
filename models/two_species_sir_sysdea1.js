SYSTO.models.two_species_sir = {
   "meta": {
      "language": "system_dynamics_sysdea",
      "name": "two_species_sir",
      "id": "two_species_sir",
      "title": "Animal-human disease model",
      "description": "This is a Systo re-implementation of the Sysdea model \"Disease model for One Health Vet College LSHTM\" - https://app.sysdea.com/shared/VLiZDzT7WAB2LV4jCGqbxY3DCWB",
      "author": "robertm"
   },
   "nodes": {
      "stock1": {
         "id": "stock1",
         "type": "stock",
         "label": "human_susceptible",
         "centrex": 153,
         "centrey": 250,
         "text_shiftx": 1,
         "text_shifty": -42,
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
         "label": "human_infected",
         "centrex": 414,
         "centrey": 241,
         "text_shiftx": 75,
         "text_shifty": -43,
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
         "label": "human_resistant",
         "centrex": 642,
         "centrey": 242,
         "text_shiftx": 1,
         "text_shifty": -42,
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
         "label": "human_becoming_infected",
         "centrex": 291,
         "centrey": 241.60653877296,
         "text_shiftx": 10,
         "text_shifty": -44,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "human_susceptible*(1-pow(1-human_pinf_from_human, human_contacts_with_human)*pow(1-human_pinf_from_animal, human_contacts_with_animal))"
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
         "label": "human_recovering",
         "centrex": 534.404001514769,
         "centrey": 241.4302458060326,
         "text_shiftx": -31,
         "text_shifty": -18,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "human_infected/recovery_time"
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
         "label": "human_vaccination",
         "centrex": 415.1786013220021,
         "centrey": 119.78522054938482,
         "text_shiftx": 4,
         "text_shifty": -32,
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
      "valve4": {
         "id": "valve4",
         "type": "valve",
         "label": "human_becoming_susceptible",
         "centrex": 392.31203828542743,
         "centrey": 405.30759528101635,
         "text_shiftx": -13,
         "text_shifty": 31,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "loss_of_resistance*human_resistant"
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
         "centrex": 33,
         "centrey": 346,
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
      "valve6": {
         "id": "valve6",
         "type": "valve",
         "label": "human_uninfected_dying",
         "centrex": 82.49540812009346,
         "centrey": 309.3437361214566,
         "text_shiftx": 4,
         "text_shifty": -34,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "human_death_rate/52*human_susceptible"
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
         "centrex": 467,
         "centrey": 338,
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
      "valve7": {
         "id": "valve7",
         "type": "valve",
         "label": "human_infected_dying",
         "centrex": 419.1124954415596,
         "centrey": 324.84138897511366,
         "text_shiftx": 69,
         "text_shifty": -2,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "human_death_rate_infected*human_infected"
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
         "centrex": 759,
         "centrey": 255,
         "text_shiftx": -77,
         "text_shifty": 117,
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
      "valve8": {
         "id": "valve8",
         "type": "valve",
         "label": "human_resistant_dying",
         "centrex": 708.5129970638186,
         "centrey": 249.39033300709096,
         "text_shiftx": 0,
         "text_shifty": 19,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "human_death_rate/52*human_resistant"
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
         "label": "human_total",
         "centrex": 170,
         "centrey": 155,
         "text_shiftx": -59,
         "text_shifty": -16,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "human_susceptible+human_infected+human_resistant"
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
         "label": "recovery_time",
         "centrex": 503,
         "centrey": 171,
         "text_shiftx": -67,
         "text_shifty": -1,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "10"
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
         "label": "human_percent_infected",
         "centrex": 400,
         "centrey": 68,
         "text_shiftx": 67,
         "text_shifty": 9,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "100*human_infected/human_total"
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
         "label": "human_death_rate",
         "centrex": 745,
         "centrey": 314,
         "text_shiftx": 1,
         "text_shifty": -30,
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
               "value": "deaths per person per year"
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
         "label": "human_birth_rate",
         "centrex": 40,
         "centrey": 176,
         "text_shiftx": 1,
         "text_shifty": -30,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "0.05"
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
               "value": "births per person per year"
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
         "label": "human_pinf_from_human",
         "centrex": 164,
         "centrey": 21,
         "text_shiftx": -39,
         "text_shifty": 21,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "human_to_human_transmissability*human_percent_infected"
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
         "label": "human_contacts_with_human",
         "centrex": 77,
         "centrey": 113,
         "text_shiftx": 1,
         "text_shifty": -30,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "5"
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
         "label": "human_contacts_with_animal",
         "centrex": 240,
         "centrey": 415,
         "text_shiftx": 1,
         "text_shifty": -30,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "5"
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
         "label": "human_pinf_from_animal",
         "centrex": 140,
         "centrey": 380,
         "text_shiftx": -4,
         "text_shifty": -41,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "animal_to_human_transmissability*animal_percent_infected"
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
         "label": "human_to_human_transmissability",
         "centrex": 378,
         "centrey": 23,
         "text_shiftx": -70,
         "text_shifty": 3,
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
         "label": "loss_of_resistance",
         "centrex": 320,
         "centrey": 435,
         "text_shiftx": 1,
         "text_shifty": -30,
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
      "cloud5": {
         "id": "cloud5",
         "type": "cloud",
         "label": "cloud5",
         "centrex": 32,
         "centrey": 235,
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
      "valve9": {
         "id": "valve9",
         "type": "valve",
         "label": "human_births",
         "centrex": 84.48385752885807,
         "centrey": 241.50626333002373,
         "text_shiftx": -40,
         "text_shifty": -28,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "human_birth_rate/52*human_total"
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
      "variable17": {
         "id": "variable17",
         "type": "variable",
         "label": "human_death_rate_infected",
         "centrex": 338,
         "centrey": 320,
         "text_shiftx": -55,
         "text_shifty": -14,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "0.2"
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
               "value": "This is per week, not per year"
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
         "label": "animal_susceptible",
         "centrex": 222,
         "centrey": 664,
         "text_shiftx": 1,
         "text_shifty": -42,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "90"
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
      "stock5": {
         "id": "stock5",
         "type": "stock",
         "label": "animal_infected",
         "centrex": 412,
         "centrey": 667,
         "text_shiftx": 1,
         "text_shifty": -42,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "10"
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
      "stock6": {
         "id": "stock6",
         "type": "stock",
         "label": "animal_resistant",
         "centrex": 598,
         "centrey": 666,
         "text_shiftx": 1,
         "text_shifty": -42,
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
      "cloud6": {
         "id": "cloud6",
         "type": "cloud",
         "label": "cloud6",
         "centrex": 13,
         "centrey": 628,
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
      "valve10": {
         "id": "valve10",
         "type": "valve",
         "label": "animal_births",
         "centrex": 109.46916057073211,
         "centrey": 644.6166975145759,
         "text_shiftx": 0,
         "text_shifty": 19,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "animal_birth_rate*animal_susceptible"
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
      "cloud7": {
         "id": "cloud7",
         "type": "cloud",
         "label": "cloud7",
         "centrex": 30,
         "centrey": 740,
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
      "valve11": {
         "id": "valve11",
         "type": "valve",
         "label": "animal_uninfected_dying",
         "centrex": 117.85083905277645,
         "centrey": 705.2257095416094,
         "text_shiftx": 0,
         "text_shifty": 19,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "animal_death_rate/52*animal_susceptible"
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
      "valve12": {
         "id": "valve12",
         "type": "valve",
         "label": "animal_becoming_infected",
         "centrex": 317,
         "centrey": 665.5,
         "text_shiftx": 0,
         "text_shifty": 19,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "animal_susceptible*(1-pow(1-animal_pinf_from_animal,animal_contact_with_animals))"
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
      "valve13": {
         "id": "valve13",
         "type": "valve",
         "label": "animal_recovering",
         "centrex": 505,
         "centrey": 666.5,
         "text_shiftx": 0,
         "text_shifty": 19,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "animal_infected/animal_recovery_time"
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
      "cloud8": {
         "id": "cloud8",
         "type": "cloud",
         "label": "cloud8",
         "centrex": 763,
         "centrey": 669,
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
      "valve14": {
         "id": "valve14",
         "type": "valve",
         "label": "animal_resistant_dying",
         "centrex": 688.5003511526093,
         "centrey": 667.6454609300474,
         "text_shiftx": 0,
         "text_shifty": 19,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "animal_death_rate/52*animal_resistant"
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
      "variable18": {
         "id": "variable18",
         "type": "variable",
         "label": "animal_death_rate",
         "centrex": 703,
         "centrey": 741,
         "text_shiftx": 1,
         "text_shifty": -30,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "0.2"
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
               "value": "deaths per animal per year"
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "valve15": {
         "id": "valve15",
         "type": "valve",
         "label": "animal_becoming_susceptible",
         "centrex": 437.6788744060354,
         "centrey": 760.5416246228442,
         "text_shiftx": 0,
         "text_shifty": 19,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "animal_resistant*0"
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
      "cloud9": {
         "id": "cloud9",
         "type": "cloud",
         "label": "cloud9",
         "centrex": 571,
         "centrey": 571,
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
      "valve16": {
         "id": "valve16",
         "type": "valve",
         "label": "animal_infected_dying",
         "centrex": 499.80586305379074,
         "centrey": 613.9851392882772,
         "text_shiftx": 0,
         "text_shifty": 19,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "animal_death_rate_infected/52*animal_infected"
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
      "variable19": {
         "id": "variable19",
         "type": "variable",
         "label": "animal_total",
         "centrex": 386,
         "centrey": 568,
         "text_shiftx": 1,
         "text_shifty": -30,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "animal_susceptible+animal_infected+animal_resistant"
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
      "variable20": {
         "id": "variable20",
         "type": "variable",
         "label": "animal_birth_rate",
         "centrex": 60,
         "centrey": 581,
         "text_shiftx": 1,
         "text_shifty": -30,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "0.2"
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
               "value": "births per animal per year"
            },
            "comments": {
               "type": "long_text",
               "default_value": "",
               "value": ""
            }
         }
      },
      "variable21": {
         "id": "variable21",
         "type": "variable",
         "label": "animal_contact_with_animals",
         "centrex": 95,
         "centrey": 522,
         "text_shiftx": 1,
         "text_shifty": -30,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "5"
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
      "variable22": {
         "id": "variable22",
         "type": "variable",
         "label": "animal_pinf_from_animal",
         "centrex": 173,
         "centrey": 465,
         "text_shiftx": 4,
         "text_shifty": -40,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "animal_to_animal_transmissability*animal_percent_infected"
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
      "variable23": {
         "id": "variable23",
         "type": "variable",
         "label": "animal_to_animal_transmissability",
         "centrex": 218,
         "centrey": 578,
         "text_shiftx": 1,
         "text_shifty": -30,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "0.0001"
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
      "variable24": {
         "id": "variable24",
         "type": "variable",
         "label": "animal_percent_infected",
         "centrex": 579,
         "centrey": 458,
         "text_shiftx": 44,
         "text_shifty": 28,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "100*animal_infected/animal_total"
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
      "variable25": {
         "id": "variable25",
         "type": "variable",
         "label": "animal_to_human_transmissability",
         "centrex": 69,
         "centrey": 458,
         "text_shiftx": 1,
         "text_shifty": -30,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "0.1"
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
      "variable26": {
         "id": "variable26",
         "type": "variable",
         "label": "animal_recovery_time",
         "centrex": 623,
         "centrey": 613,
         "text_shiftx": 1,
         "text_shifty": -30,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "10"
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
      "variable27": {
         "id": "variable27",
         "type": "variable",
         "label": "animal_death_rate_infected",
         "centrex": 664,
         "centrey": 516,
         "text_shiftx": 1,
         "text_shifty": -30,
         "extras": {
            "equation": {
               "type": "long_text",
               "default_value": "",
               "value": "0.1"
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
         "curvature": 0.021164021164021097,
         "along": 0.5582010582010583,
         "select_state": "normal",
         "set_state": "set",
         "node_id": "valve1",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 6,
         "fill_colour": "black",
         "arrowhead": {
            "shape": "diamond",
            "gap": 1,
            "width": 10,
            "front": 10,
            "back": -6
         }
      },
      "flow2": {
         "id": "flow2",
         "type": "flow",
         "label": "flow2",
         "start_node_id": "stock2",
         "end_node_id": "stock3",
         "curvature": 0.0006311537490532418,
         "along": 0.556172683665741,
         "select_state": "normal",
         "set_state": "set",
         "node_id": "valve2",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 6,
         "fill_colour": "black",
         "arrowhead": {
            "shape": "diamond",
            "gap": 1,
            "width": 10,
            "front": 10,
            "back": -6
         }
      },
      "flow3": {
         "id": "flow3",
         "type": "flow",
         "label": "flow3",
         "start_node_id": "stock1",
         "end_node_id": "stock3",
         "curvature": 0.4526647660963021,
         "along": 0.5720610350173315,
         "select_state": "normal",
         "set_state": "set",
         "node_id": "valve3",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 6,
         "fill_colour": "black",
         "arrowhead": {
            "shape": "diamond",
            "gap": 1,
            "width": 10,
            "front": 10,
            "back": -6
         }
      },
      "flow4": {
         "id": "flow4",
         "type": "flow",
         "label": "flow4",
         "start_node_id": "stock3",
         "end_node_id": "stock1",
         "curvature": 0.5887102795763155,
         "along": 0.5294829811517989,
         "select_state": "normal",
         "set_state": "set",
         "node_id": "valve4",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 6,
         "fill_colour": "black",
         "arrowhead": {
            "shape": "diamond",
            "gap": 1,
            "width": 10,
            "front": 10,
            "back": -6
         }
      },
      "flow6": {
         "id": "flow6",
         "type": "flow",
         "label": "flow6",
         "start_node_id": "stock1",
         "end_node_id": "cloud2",
         "curvature": 0.02249344361508979,
         "along": 0.5751462578172282,
         "select_state": "normal",
         "set_state": "set",
         "node_id": "valve6",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 6,
         "fill_colour": "black",
         "arrowhead": {
            "shape": "diamond",
            "gap": 1,
            "width": 10,
            "front": 10,
            "back": -6
         }
      },
      "flow7": {
         "id": "flow7",
         "type": "flow",
         "label": "flow7",
         "start_node_id": "stock2",
         "end_node_id": "cloud3",
         "curvature": -0.532329350139139,
         "along": 0.7761499427074806,
         "select_state": "normal",
         "set_state": "set",
         "node_id": "valve7",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 6,
         "fill_colour": "black",
         "arrowhead": {
            "shape": "diamond",
            "gap": 1,
            "width": 10,
            "front": 10,
            "back": -6
         }
      },
      "flow8": {
         "id": "flow8",
         "type": "flow",
         "label": "flow8",
         "start_node_id": "stock3",
         "end_node_id": "cloud4",
         "curvature": 0,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "node_id": "valve8",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 6,
         "fill_colour": "black",
         "arrowhead": {
            "shape": "diamond",
            "gap": 1,
            "width": 10,
            "front": 10,
            "back": -6
         }
      },
      "influence1": {
         "id": "influence1",
         "type": "influence",
         "label": "influence1",
         "start_node_id": "stock1",
         "end_node_id": "variable1",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence2": {
         "id": "influence2",
         "type": "influence",
         "label": "influence2",
         "start_node_id": "stock2",
         "end_node_id": "variable1",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence3": {
         "id": "influence3",
         "type": "influence",
         "label": "influence3",
         "start_node_id": "stock3",
         "end_node_id": "variable1",
         "curvature": -0.3868576705183558,
         "along": 0.3809054381192443,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence5": {
         "id": "influence5",
         "type": "influence",
         "label": "influence5",
         "start_node_id": "stock1",
         "end_node_id": "valve6",
         "curvature": -0.22673049517218494,
         "along": 0.6354723406815203,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence6": {
         "id": "influence6",
         "type": "influence",
         "label": "influence6",
         "start_node_id": "stock1",
         "end_node_id": "valve1",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence8": {
         "id": "influence8",
         "type": "influence",
         "label": "influence8",
         "start_node_id": "stock2",
         "end_node_id": "valve2",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence9": {
         "id": "influence9",
         "type": "influence",
         "label": "influence9",
         "start_node_id": "stock3",
         "end_node_id": "valve8",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence10": {
         "id": "influence10",
         "type": "influence",
         "label": "influence10",
         "start_node_id": "stock3",
         "end_node_id": "valve4",
         "curvature": 0.44096223376341503,
         "along": 0.8064743454419641,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence11": {
         "id": "influence11",
         "type": "influence",
         "label": "influence11",
         "start_node_id": "stock2",
         "end_node_id": "valve7",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence13": {
         "id": "influence13",
         "type": "influence",
         "label": "influence13",
         "start_node_id": "variable2",
         "end_node_id": "valve2",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence18": {
         "id": "influence18",
         "type": "influence",
         "label": "influence18",
         "start_node_id": "stock2",
         "end_node_id": "variable6",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence19": {
         "id": "influence19",
         "type": "influence",
         "label": "influence19",
         "start_node_id": "variable1",
         "end_node_id": "variable6",
         "curvature": 0.12703123130309912,
         "along": 0.4296637549359818,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence20": {
         "id": "influence20",
         "type": "influence",
         "label": "influence20",
         "start_node_id": "variable7",
         "end_node_id": "valve8",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence21": {
         "id": "influence21",
         "type": "influence",
         "label": "influence21",
         "start_node_id": "variable7",
         "end_node_id": "valve6",
         "curvature": 0.11734133299800523,
         "along": -0.12648767899474772,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence23": {
         "id": "influence23",
         "type": "influence",
         "label": "influence23",
         "start_node_id": "variable12",
         "end_node_id": "valve1",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence24": {
         "id": "influence24",
         "type": "influence",
         "label": "influence24",
         "start_node_id": "variable11",
         "end_node_id": "valve1",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence25": {
         "id": "influence25",
         "type": "influence",
         "label": "influence25",
         "start_node_id": "variable13",
         "end_node_id": "valve1",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence26": {
         "id": "influence26",
         "type": "influence",
         "label": "influence26",
         "start_node_id": "variable14",
         "end_node_id": "valve1",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence27": {
         "id": "influence27",
         "type": "influence",
         "label": "influence27",
         "start_node_id": "variable15",
         "end_node_id": "variable11",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence28": {
         "id": "influence28",
         "type": "influence",
         "label": "influence28",
         "start_node_id": "variable6",
         "end_node_id": "variable11",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence29": {
         "id": "influence29",
         "type": "influence",
         "label": "influence29",
         "start_node_id": "variable16",
         "end_node_id": "valve4",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "flow9": {
         "id": "flow9",
         "type": "flow",
         "label": "flow9",
         "start_node_id": "cloud5",
         "end_node_id": "stock1",
         "curvature": 0,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "node_id": "valve9",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 6,
         "fill_colour": "black",
         "arrowhead": {
            "shape": "diamond",
            "gap": 1,
            "width": 10,
            "front": 10,
            "back": -6
         }
      },
      "influence30": {
         "id": "influence30",
         "type": "influence",
         "label": "influence30",
         "start_node_id": "variable8",
         "end_node_id": "valve9",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence31": {
         "id": "influence31",
         "type": "influence",
         "label": "influence31",
         "start_node_id": "variable1",
         "end_node_id": "valve9",
         "curvature": -0.03304741738182381,
         "along": 0.5592550692828073,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence32": {
         "id": "influence32",
         "type": "influence",
         "label": "influence32",
         "start_node_id": "variable17",
         "end_node_id": "valve7",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "flow10": {
         "id": "flow10",
         "type": "flow",
         "label": "flow10",
         "start_node_id": "cloud6",
         "end_node_id": "stock4",
         "curvature": 0,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "node_id": "valve10",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 6,
         "fill_colour": "black",
         "arrowhead": {
            "shape": "diamond",
            "gap": 1,
            "width": 10,
            "front": 10,
            "back": -6
         }
      },
      "flow11": {
         "id": "flow11",
         "type": "flow",
         "label": "flow11",
         "start_node_id": "stock4",
         "end_node_id": "cloud7",
         "curvature": 0,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "node_id": "valve11",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 6,
         "fill_colour": "black",
         "arrowhead": {
            "shape": "diamond",
            "gap": 1,
            "width": 10,
            "front": 10,
            "back": -6
         }
      },
      "flow12": {
         "id": "flow12",
         "type": "flow",
         "label": "flow12",
         "start_node_id": "stock4",
         "end_node_id": "stock5",
         "curvature": 0,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "node_id": "valve12",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 6,
         "fill_colour": "black",
         "arrowhead": {
            "shape": "diamond",
            "gap": 1,
            "width": 10,
            "front": 10,
            "back": -6
         }
      },
      "flow13": {
         "id": "flow13",
         "type": "flow",
         "label": "flow13",
         "start_node_id": "stock5",
         "end_node_id": "stock6",
         "curvature": 0,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "node_id": "valve13",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 6,
         "fill_colour": "black",
         "arrowhead": {
            "shape": "diamond",
            "gap": 1,
            "width": 10,
            "front": 10,
            "back": -6
         }
      },
      "flow14": {
         "id": "flow14",
         "type": "flow",
         "label": "flow14",
         "start_node_id": "stock6",
         "end_node_id": "cloud8",
         "curvature": 0,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "node_id": "valve14",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 6,
         "fill_colour": "black",
         "arrowhead": {
            "shape": "diamond",
            "gap": 1,
            "width": 10,
            "front": 10,
            "back": -6
         }
      },
      "flow15": {
         "id": "flow15",
         "type": "flow",
         "label": "flow15",
         "start_node_id": "stock6",
         "end_node_id": "stock4",
         "curvature": 0.4298303591099361,
         "along": 0.3691341705221414,
         "select_state": "normal",
         "set_state": "set",
         "node_id": "valve15",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 6,
         "fill_colour": "black",
         "arrowhead": {
            "shape": "diamond",
            "gap": 1,
            "width": 10,
            "front": 10,
            "back": -6
         }
      },
      "flow16": {
         "id": "flow16",
         "type": "flow",
         "label": "flow16",
         "start_node_id": "stock5",
         "end_node_id": "cloud9",
         "curvature": 0,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "node_id": "valve16",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 6,
         "fill_colour": "black",
         "arrowhead": {
            "shape": "diamond",
            "gap": 1,
            "width": 10,
            "front": 10,
            "back": -6
         }
      },
      "influence33": {
         "id": "influence33",
         "type": "influence",
         "label": "influence33",
         "start_node_id": "stock4",
         "end_node_id": "valve10",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence34": {
         "id": "influence34",
         "type": "influence",
         "label": "influence34",
         "start_node_id": "stock4",
         "end_node_id": "valve11",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence35": {
         "id": "influence35",
         "type": "influence",
         "label": "influence35",
         "start_node_id": "stock4",
         "end_node_id": "valve12",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence36": {
         "id": "influence36",
         "type": "influence",
         "label": "influence36",
         "start_node_id": "stock5",
         "end_node_id": "valve13",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence37": {
         "id": "influence37",
         "type": "influence",
         "label": "influence37",
         "start_node_id": "stock6",
         "end_node_id": "valve14",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence38": {
         "id": "influence38",
         "type": "influence",
         "label": "influence38",
         "start_node_id": "variable18",
         "end_node_id": "valve14",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence39": {
         "id": "influence39",
         "type": "influence",
         "label": "influence39",
         "start_node_id": "variable18",
         "end_node_id": "valve11",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence40": {
         "id": "influence40",
         "type": "influence",
         "label": "influence40",
         "start_node_id": "stock6",
         "end_node_id": "valve15",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence41": {
         "id": "influence41",
         "type": "influence",
         "label": "influence41",
         "start_node_id": "stock5",
         "end_node_id": "valve16",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence42": {
         "id": "influence42",
         "type": "influence",
         "label": "influence42",
         "start_node_id": "variable23",
         "end_node_id": "variable22",
         "curvature": 1.2786713743951876,
         "along": -0.014319340918007063,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence43": {
         "id": "influence43",
         "type": "influence",
         "label": "influence43",
         "start_node_id": "variable24",
         "end_node_id": "variable22",
         "curvature": 0.3118719578607954,
         "along": 0.3315600982099453,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence44": {
         "id": "influence44",
         "type": "influence",
         "label": "influence44",
         "start_node_id": "variable19",
         "end_node_id": "variable24",
         "curvature": -0.2567427911406514,
         "along": 0.5868305335467789,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence45": {
         "id": "influence45",
         "type": "influence",
         "label": "influence45",
         "start_node_id": "stock4",
         "end_node_id": "variable19",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence46": {
         "id": "influence46",
         "type": "influence",
         "label": "influence46",
         "start_node_id": "stock5",
         "end_node_id": "variable19",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence47": {
         "id": "influence47",
         "type": "influence",
         "label": "influence47",
         "start_node_id": "stock6",
         "end_node_id": "variable19",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence48": {
         "id": "influence48",
         "type": "influence",
         "label": "influence48",
         "start_node_id": "variable21",
         "end_node_id": "valve12",
         "curvature": 0.41167063201016085,
         "along": 0.5131768662456844,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence49": {
         "id": "influence49",
         "type": "influence",
         "label": "influence49",
         "start_node_id": "variable22",
         "end_node_id": "valve12",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence50": {
         "id": "influence50",
         "type": "influence",
         "label": "influence50",
         "start_node_id": "variable20",
         "end_node_id": "valve10",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence51": {
         "id": "influence51",
         "type": "influence",
         "label": "influence51",
         "start_node_id": "variable25",
         "end_node_id": "variable14",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence52": {
         "id": "influence52",
         "type": "influence",
         "label": "influence52",
         "start_node_id": "variable24",
         "end_node_id": "variable14",
         "curvature": 0.31992153114861294,
         "along": 0.6595583612082191,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence53": {
         "id": "influence53",
         "type": "influence",
         "label": "influence53",
         "start_node_id": "stock5",
         "end_node_id": "variable24",
         "curvature": -0.12916026267989375,
         "along": 0.751529970658097,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence54": {
         "id": "influence54",
         "type": "influence",
         "label": "influence54",
         "start_node_id": "variable26",
         "end_node_id": "valve13",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      },
      "influence55": {
         "id": "influence55",
         "type": "influence",
         "label": "influence55",
         "start_node_id": "variable27",
         "end_node_id": "valve16",
         "curvature": 0.3,
         "along": 0.5,
         "select_state": "normal",
         "set_state": "set",
         "shape": "curved",
         "line_colour": "black",
         "line_width": 2,
         "fill_colour": "#505050",
         "arrowhead": {
            "shape": "diamond",
            "gap": 2,
            "width": 8,
            "front": 11,
            "back": -7
         }
      }
   },
   "scenarios": {
      "default": {
         "simulation_settings": {
            "start_time": 0,
            "end_time": 30,
            "nstep": 1,
            "display_interval": 1,
            "integration_method": "euler2"
         }
      }
   }
};