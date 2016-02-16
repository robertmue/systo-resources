SYSTO.gojsModelSources.two_species_sir = {
    "class": "go.GraphLinksModel",
    "linkLabelKeysProperty": "labelKeys",
    "modelData": {
        "id": "two_species_sir",
        "name": "two_species_sir",
        "language": "system_dynamics",
        "author": "robertm",
        "title": "Animal-human disease model",
        "description": "This is a Systo re-implementation of the Sysdea model \"Disease model for One Health Vet College LSHTM\" - https://app.sysdea.com/shared/VLiZDzT7WAB2LV4jCGqbxY3DCWB. "
    },
    "nodeDataArray": [
        {
            "key": "stock1",
            "category": "stock",
            "label": "human_susceptible",
            "loc": "221 249",
            "text_shift": "0.5 0.5 -5 52",
            "equation": "100",
            "has_equation": true
        },
        {
            "key": "stock2",
            "category": "stock",
            "label": "human_infected",
            "loc": "422 248",
            "text_shift": "0.5 0.5 -45 46",
            "equation": "1",
            "has_equation": true
        },
        {
            "key": "stock3",
            "category": "stock",
            "label": "human_resistant",
            "loc": "634 249",
            "text_shift": "0.5 0.5 1 42",
            "equation": "0",
            "has_equation": true
        },
        {
            "key": "valve1",
            "category": "valve",
            "label": "human_becoming_infected",
            "loc": "327.33862433862436 245.9041045176502",
            "text_shift": "0.5 0.5 26 -17",
            "equation": "human_susceptible*(1-pow(1-human_pinf_from_human, human_contacts_with_human)*pow(1-human_pinf_from_animal, human_contacts_with_animal))",
            "has_equation": true
        },
        {
            "key": "valve2",
            "category": "valve",
            "label": "human_recovering",
            "loc": "533.9546200454431 248.44807969080367",
            "text_shift": "0.5 0.5 4 45",
            "equation": "human_infected/human_recovery_time",
            "has_equation": true
        },
        {
            "key": "valve3",
            "category": "valve",
            "label": "human_vaccination",
            "loc": "443.37555960701854 149.27472580111362",
            "text_shift": "0.5 0.5 -29 -10",
            "equation": "human_percent_infected<percent_infected_at_which_to_increase_vaccination_rate? min(human_susceptible,normal_vaccination_rate): min(human_susceptible,max_vaccination_rate)",
            "has_equation": true
        },
        {
            "key": "valve4",
            "category": "valve",
            "label": "human_newly_vulnerable_to_new_strain",
            "loc": "419.0544403394041 345.77337295112903",
            "text_shift": "0.5 0.5 6 53",
            "equation": "human_resistant*resistant_strain_emergence",
            "has_equation": true
        },
        {
            "key": "cloud2",
            "category": "cloud",
            "label": "human_newly_vulnerable_to_new_strain",
            "loc": "43 362",
            "text_shift": "0.5 0.5 0 -5",
            "equation": "",
            "has_equation": false
        },
        {
            "key": "valve6",
            "category": "valve",
            "label": "human_uninfected_dying",
            "loc": "126.43607871600179 312.40970412140314",
            "text_shift": "0.5 0.5 -38 -8",
            "equation": "human_death_rate/52*human_susceptible",
            "has_equation": true
        },
        {
            "key": "cloud3",
            "category": "cloud",
            "label": "human_uninfected_dying",
            "loc": "454 327",
            "text_shift": "0.5 0.5 0 -5",
            "equation": "",
            "has_equation": false
        },
        {
            "key": "valve7",
            "category": "valve",
            "label": "human_infected_dying",
            "loc": "438.253164556962 288.125",
            "text_shift": "0.5 0.5 52 28",
            "equation": "human_death_rate_infected*human_infected",
            "has_equation": true
        },
        {
            "key": "cloud4",
            "category": "cloud",
            "label": "human_infected_dying",
            "loc": "759 255",
            "text_shift": "0.5 0.5 0 -5",
            "equation": "",
            "has_equation": false
        },
        {
            "key": "valve8",
            "category": "valve",
            "label": "human_resistant_dying",
            "loc": "697.25 252.036",
            "text_shift": "0.5 0.5 2 -2",
            "equation": "human_death_rate/52*human_resistant",
            "has_equation": true
        },
        {
            "key": "variable1",
            "category": "variable",
            "label": "human_total",
            "loc": "182 149",
            "text_shift": "0.5 0.5 0 20",
            "equation": "human_susceptible+human_infected+human_resistant",
            "has_equation": true
        },
        {
            "key": "variable2",
            "category": "variable",
            "label": "human_recovery_time",
            "loc": "501 187",
            "text_shift": "0.5 0.5 0 20",
            "equation": "10",
            "has_equation": true
        },
        {
            "key": "variable6",
            "category": "variable",
            "label": "human_percent_infected",
            "loc": "391 25",
            "text_shift": "0.5 0.5 0 20",
            "equation": "100*human_infected/human_total",
            "has_equation": true
        },
        {
            "key": "variable7",
            "category": "variable",
            "label": "human_death_rate",
            "loc": "745 314",
            "text_shift": "0.5 0.5 0 20",
            "equation": "0.02",
            "has_equation": true
        },
        {
            "key": "variable8",
            "category": "variable",
            "label": "human_birth_rate",
            "loc": "40 176",
            "text_shift": "0.5 0.5 0 20",
            "equation": "0.05",
            "has_equation": true
        },
        {
            "key": "variable11",
            "category": "variable",
            "label": "human_pinf_from_human",
            "loc": "167 70",
            "text_shift": "0.5 0.5 0 20",
            "equation": "human_to_human_transmissability*human_percent_infected",
            "has_equation": true
        },
        {
            "key": "variable12",
            "category": "variable",
            "label": "human_contacts_with_human",
            "loc": "70 100",
            "text_shift": "0.5 0.5 0 20",
            "equation": "human_percent_infected<percent_infected_at_which_to_cut_contact_rate?normal_human_contacts_with_human:constrained_human_contacts_with_human",
            "has_equation": true
        },
        {
            "key": "variable13",
            "category": "variable",
            "label": "human_contacts_with_animal",
            "loc": "242 438",
            "text_shift": "0.5 0.5 0 20",
            "equation": "5",
            "has_equation": true
        },
        {
            "key": "variable14",
            "category": "variable",
            "label": "human_pinf_from_animal",
            "loc": "140 380",
            "text_shift": "0.5 0.5 0 20",
            "equation": "animal_to_human_transmissability*animal_percent_infected",
            "has_equation": true
        },
        {
            "key": "variable15",
            "category": "variable",
            "label": "human_to_human_transmissability",
            "loc": "271 15",
            "text_shift": "0.5 0.5 0 20",
            "equation": "0.002",
            "has_equation": true
        },
        {
            "key": "cloud5",
            "category": "cloud",
            "label": "human_to_human_transmissability",
            "loc": "32 232",
            "text_shift": "0.5 0.5 0 -5",
            "equation": "",
            "has_equation": false
        },
        {
            "key": "valve9",
            "category": "valve",
            "label": "human_births",
            "loc": "125.75 240.4325396825397",
            "text_shift": "0.5 0.5 -26 -11",
            "equation": "human_birth_rate/52*human_total",
            "has_equation": true
        },
        {
            "key": "variable17",
            "category": "variable",
            "label": "human_death_rate_infected",
            "loc": "350 305",
            "text_shift": "0.5 0.5 0 20",
            "equation": "human_fatality_rate/human_recovery_time",
            "has_equation": true
        },
        {
            "key": "stock4",
            "category": "stock",
            "label": "animal_susceptible",
            "loc": "222 664",
            "text_shift": "0.5 0.5 1 55",
            "equation": "90",
            "has_equation": true
        },
        {
            "key": "stock5",
            "category": "stock",
            "label": "animal_infected",
            "loc": "412 667",
            "text_shift": "0.5 0.5 1 42",
            "equation": "10",
            "has_equation": true
        },
        {
            "key": "stock6",
            "category": "stock",
            "label": "animal_resistant",
            "loc": "598 666",
            "text_shift": "0.5 0.5 1 42",
            "equation": "0",
            "has_equation": true
        },
        {
            "key": "cloud6",
            "category": "cloud",
            "label": "animal_resistant",
            "loc": "13 628",
            "text_shift": "0.5 0.5 0 -5",
            "equation": "",
            "has_equation": false
        },
        {
            "key": "valve10",
            "category": "valve",
            "label": "animal_births",
            "loc": "116.75 645.8708133971292",
            "text_shift": "0.5 0.5 0 1",
            "equation": "animal_birth_rate/52*animal_susceptible",
            "has_equation": true
        },
        {
            "key": "cloud7",
            "category": "cloud",
            "label": "animal_births",
            "loc": "30 740",
            "text_shift": "0.5 0.5 0 -5",
            "equation": "",
            "has_equation": false
        },
        {
            "key": "valve11",
            "category": "valve",
            "label": "animal_uninfected_dying",
            "loc": "125.25 702.296875",
            "text_shift": "0.5 0.5 0 1",
            "equation": "animal_death_rate/52*animal_susceptible",
            "has_equation": true
        },
        {
            "key": "valve12",
            "category": "valve",
            "label": "animal_becoming_infected",
            "loc": "317 665.5",
            "text_shift": "0.5 0.5 9 51",
            "equation": "animal_susceptible*(1-pow(1-animal_pinf_from_animal,animal_contact_with_animals))",
            "has_equation": true
        },
        {
            "key": "valve13",
            "category": "valve",
            "label": "animal_recovering",
            "loc": "505 666.5",
            "text_shift": "0.5 0.5 -4 48",
            "equation": "animal_infected/animal_recovery_time",
            "has_equation": true
        },
        {
            "key": "cloud8",
            "category": "cloud",
            "label": "animal_recovering",
            "loc": "763 669",
            "text_shift": "0.5 0.5 0 -5",
            "equation": "",
            "has_equation": false
        },
        {
            "key": "valve14",
            "category": "valve",
            "label": "animal_resistant_dying",
            "loc": "681.25 667.5136363636364",
            "text_shift": "0.5 0.5 0 1",
            "equation": "animal_death_rate/52*animal_resistant",
            "has_equation": true
        },
        {
            "key": "variable18",
            "category": "variable",
            "label": "animal_death_rate",
            "loc": "703 741",
            "text_shift": "0.5 0.5 0 20",
            "equation": "0.2",
            "has_equation": true
        },
        {
            "key": "valve15",
            "category": "valve",
            "label": "animal_newly_vulnerable_to_new_strain",
            "loc": "435.9947781736162 752.1889733421458",
            "text_shift": "0.5 0.5 1 45",
            "equation": "animal_resistant*resistant_strain_emergence",
            "has_equation": true
        },
        {
            "key": "cloud9",
            "category": "cloud",
            "label": "animal_newly_vulnerable_to_new_strain",
            "loc": "571 571",
            "text_shift": "0.5 0.5 -5 -38",
            "equation": "",
            "has_equation": false
        },
        {
            "key": "valve16",
            "category": "valve",
            "label": "animal_infected_dying",
            "loc": "492.484375 618.4056603773585",
            "text_shift": "0.5 0.5 0 1",
            "equation": "animal_death_rate_infected*animal_infected",
            "has_equation": true
        },
        {
            "key": "variable19",
            "category": "variable",
            "label": "animal_total",
            "loc": "338 586",
            "text_shift": "0.5 0.5 0 20",
            "equation": "animal_susceptible+animal_infected+animal_resistant",
            "has_equation": true
        },
        {
            "key": "variable20",
            "category": "variable",
            "label": "animal_birth_rate",
            "loc": "60 581",
            "text_shift": "0.5 0.5 0 20",
            "equation": "0.2",
            "has_equation": true
        },
        {
            "key": "variable21",
            "category": "variable",
            "label": "animal_contact_with_animals",
            "loc": "95 522",
            "text_shift": "0.5 0.5 0 20",
            "equation": "5",
            "has_equation": true
        },
        {
            "key": "variable22",
            "category": "variable",
            "label": "animal_pinf_from_animal",
            "loc": "213 512",
            "text_shift": "0.5 0.5 0 20",
            "equation": "animal_to_animal_transmissability*animal_percent_infected",
            "has_equation": true
        },
        {
            "key": "variable23",
            "category": "variable",
            "label": "animal_to_animal_transmissability",
            "loc": "362 492",
            "text_shift": "0.5 0.5 0 20",
            "equation": "0.1",
            "has_equation": true
        },
        {
            "key": "variable24",
            "category": "variable",
            "label": "animal_percent_infected",
            "loc": "435 530",
            "text_shift": "0.5 0.5 0 20",
            "equation": "animal_infected/animal_total",
            "has_equation": true
        },
        {
            "key": "variable25",
            "category": "variable",
            "label": "animal_to_human_transmissability",
            "loc": "124 441",
            "text_shift": "0.5 0.5 0 20",
            "equation": "0.1",
            "has_equation": true
        },
        {
            "key": "variable26",
            "category": "variable",
            "label": "animal_recovery_time",
            "loc": "623 613",
            "text_shift": "0.5 0.5 0 20",
            "equation": "10",
            "has_equation": true
        },
        {
            "key": "variable27",
            "category": "variable",
            "label": "animal_death_rate_infected",
            "loc": "635 507",
            "text_shift": "0.5 0.5 0 20",
            "equation": "animal_fatality_rate/animal_recovery_time",
            "has_equation": true
        },
        {
            "key": "variable28",
            "category": "variable",
            "label": "human_fatality_rate",
            "loc": "308 375",
            "text_shift": "0.5 0.5 0 20",
            "equation": "0.2",
            "has_equation": true
        },
        {
            "key": "variable29",
            "category": "variable",
            "label": "animal_fatality_rate",
            "loc": "725 560",
            "text_shift": "0.5 0.5 0 20",
            "equation": "0.2",
            "has_equation": true
        },
        {
            "key": "variable30",
            "category": "variable",
            "label": "normal_human_contacts_with_human",
            "loc": "-58 77",
            "text_shift": "0.5 0.5 0 20",
            "equation": "10",
            "has_equation": true
        },
        {
            "key": "variable31",
            "category": "variable",
            "label": "constrained_human_contacts_with_human",
            "loc": "-37 5",
            "text_shift": "0.5 0.5 0 20",
            "equation": "4",
            "has_equation": true
        },
        {
            "key": "variable32",
            "category": "variable",
            "label": "percent_infected_at_which_to_cut_contact_rate",
            "loc": "101 1",
            "text_shift": "0.5 0.5 0 20",
            "equation": "50",
            "has_equation": true
        },
        {
            "key": "variable33",
            "category": "variable",
            "label": "max_vaccination_rate",
            "loc": "732 68",
            "text_shift": "0.5 0.5 0 20",
            "equation": "3",
            "has_equation": true
        },
        {
            "key": "variable35",
            "category": "variable",
            "label": "normal_vaccination_rate",
            "loc": "631 64",
            "text_shift": "0.5 0.5 0 20",
            "equation": "0",
            "has_equation": true
        },
        {
            "key": "variable36",
            "category": "variable",
            "label": "percent_infected_at_which_to_increase_vaccination_rate",
            "loc": "526 73",
            "text_shift": "0.5 0.5 0 20",
            "equation": "50",
            "has_equation": true
        },
        {
            "key": "variable37",
            "category": "variable",
            "label": "threshold_percent_resistant_to_trigger_new_strain",
            "loc": "716 391",
            "text_shift": "0.5 0.5 0 20",
            "equation": "60",
            "has_equation": true
        },
        {
            "key": "variable38",
            "category": "variable",
            "label": "resistant_strain_emergence",
            "loc": "579 434",
            "text_shift": "0.5 0.5 0 20",
            "equation": "animal_percent_resistant>threshold_percent_resistant_to_trigger_new_strain? 1: 0",
            "has_equation": true
        },
        {
            "key": "variable39",
            "category": "variable",
            "label": "animal_percent_resistant",
            "loc": "536 509",
            "text_shift": "0.5 0.5 0 20",
            "equation": "100*animal_resistant/animal_total",
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
            "from": "stock1",
            "to": "stock3",
            "labelKeys": [
                "valve3"
            ]
        },
        {
            "key": "flow4",
            "category": "flow",
            "from": "stock3",
            "to": "stock1",
            "labelKeys": [
                "valve4"
            ]
        },
        {
            "key": "flow6",
            "category": "flow",
            "from": "stock1",
            "to": "cloud2",
            "labelKeys": [
                "valve6"
            ]
        },
        {
            "key": "flow7",
            "category": "flow",
            "from": "stock2",
            "to": "cloud3",
            "labelKeys": [
                "valve7"
            ]
        },
        {
            "key": "flow8",
            "category": "flow",
            "from": "stock3",
            "to": "cloud4",
            "labelKeys": [
                "valve8"
            ]
        },
        {
            "category": "influence",
            "from": "stock1",
            "to": "variable1"
        },
        {
            "category": "influence",
            "from": "stock2",
            "to": "variable1"
        },
        {
            "category": "influence",
            "from": "stock3",
            "to": "variable1"
        },
        {
            "category": "influence",
            "from": "stock1",
            "to": "valve6"
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
            "to": "valve8"
        },
        {
            "category": "influence",
            "from": "stock3",
            "to": "valve4"
        },
        {
            "category": "influence",
            "from": "stock2",
            "to": "valve7"
        },
        {
            "category": "influence",
            "from": "variable2",
            "to": "valve2"
        },
        {
            "category": "influence",
            "from": "stock2",
            "to": "variable6"
        },
        {
            "category": "influence",
            "from": "variable1",
            "to": "variable6"
        },
        {
            "category": "influence",
            "from": "variable7",
            "to": "valve8"
        },
        {
            "category": "influence",
            "from": "variable7",
            "to": "valve6"
        },
        {
            "category": "influence",
            "from": "variable12",
            "to": "valve1"
        },
        {
            "category": "influence",
            "from": "variable11",
            "to": "valve1"
        },
        {
            "category": "influence",
            "from": "variable13",
            "to": "valve1"
        },
        {
            "category": "influence",
            "from": "variable14",
            "to": "valve1"
        },
        {
            "category": "influence",
            "from": "variable15",
            "to": "variable11"
        },
        {
            "category": "influence",
            "from": "variable6",
            "to": "variable11"
        },
        {
            "key": "flow9",
            "category": "flow",
            "from": "cloud5",
            "to": "stock1",
            "labelKeys": [
                "valve9"
            ]
        },
        {
            "category": "influence",
            "from": "variable8",
            "to": "valve9"
        },
        {
            "category": "influence",
            "from": "variable1",
            "to": "valve9"
        },
        {
            "category": "influence",
            "from": "variable17",
            "to": "valve7"
        },
        {
            "key": "flow10",
            "category": "flow",
            "from": "cloud6",
            "to": "stock4",
            "labelKeys": [
                "valve10"
            ]
        },
        {
            "key": "flow11",
            "category": "flow",
            "from": "stock4",
            "to": "cloud7",
            "labelKeys": [
                "valve11"
            ]
        },
        {
            "key": "flow12",
            "category": "flow",
            "from": "stock4",
            "to": "stock5",
            "labelKeys": [
                "valve12"
            ]
        },
        {
            "key": "flow13",
            "category": "flow",
            "from": "stock5",
            "to": "stock6",
            "labelKeys": [
                "valve13"
            ]
        },
        {
            "key": "flow14",
            "category": "flow",
            "from": "stock6",
            "to": "cloud8",
            "labelKeys": [
                "valve14"
            ]
        },
        {
            "key": "flow15",
            "category": "flow",
            "from": "stock6",
            "to": "stock4",
            "labelKeys": [
                "valve15"
            ]
        },
        {
            "key": "flow16",
            "category": "flow",
            "from": "stock5",
            "to": "cloud9",
            "labelKeys": [
                "valve16"
            ]
        },
        {
            "category": "influence",
            "from": "stock4",
            "to": "valve10"
        },
        {
            "category": "influence",
            "from": "stock4",
            "to": "valve11"
        },
        {
            "category": "influence",
            "from": "stock4",
            "to": "valve12"
        },
        {
            "category": "influence",
            "from": "stock5",
            "to": "valve13"
        },
        {
            "category": "influence",
            "from": "stock6",
            "to": "valve14"
        },
        {
            "category": "influence",
            "from": "variable18",
            "to": "valve14"
        },
        {
            "category": "influence",
            "from": "variable18",
            "to": "valve11"
        },
        {
            "category": "influence",
            "from": "stock6",
            "to": "valve15"
        },
        {
            "category": "influence",
            "from": "stock5",
            "to": "valve16"
        },
        {
            "category": "influence",
            "from": "variable23",
            "to": "variable22"
        },
        {
            "category": "influence",
            "from": "variable24",
            "to": "variable22"
        },
        {
            "category": "influence",
            "from": "variable19",
            "to": "variable24"
        },
        {
            "category": "influence",
            "from": "stock4",
            "to": "variable19"
        },
        {
            "category": "influence",
            "from": "stock5",
            "to": "variable19"
        },
        {
            "category": "influence",
            "from": "stock6",
            "to": "variable19"
        },
        {
            "category": "influence",
            "from": "variable21",
            "to": "valve12"
        },
        {
            "category": "influence",
            "from": "variable22",
            "to": "valve12"
        },
        {
            "category": "influence",
            "from": "variable20",
            "to": "valve10"
        },
        {
            "category": "influence",
            "from": "variable25",
            "to": "variable14"
        },
        {
            "category": "influence",
            "from": "variable24",
            "to": "variable14"
        },
        {
            "category": "influence",
            "from": "stock5",
            "to": "variable24"
        },
        {
            "category": "influence",
            "from": "variable26",
            "to": "valve13"
        },
        {
            "category": "influence",
            "from": "variable27",
            "to": "valve16"
        },
        {
            "category": "influence",
            "from": "variable2",
            "to": "variable17"
        },
        {
            "category": "influence",
            "from": "variable28",
            "to": "variable17"
        },
        {
            "category": "influence",
            "from": "variable26",
            "to": "variable27"
        },
        {
            "category": "influence",
            "from": "variable29",
            "to": "variable27"
        },
        {
            "category": "influence",
            "from": "variable30",
            "to": "variable12"
        },
        {
            "category": "influence",
            "from": "variable31",
            "to": "variable12"
        },
        {
            "category": "influence",
            "from": "variable32",
            "to": "variable12"
        },
        {
            "category": "influence",
            "from": "variable6",
            "to": "variable12"
        },
        {
            "category": "influence",
            "from": "stock1",
            "to": "valve3"
        },
        {
            "category": "influence",
            "from": "variable6",
            "to": "valve3"
        },
        {
            "category": "influence",
            "from": "variable36",
            "to": "valve3"
        },
        {
            "category": "influence",
            "from": "variable35",
            "to": "valve3"
        },
        {
            "category": "influence",
            "from": "variable33",
            "to": "valve3"
        },
        {
            "category": "influence",
            "from": "variable19",
            "to": "variable39"
        },
        {
            "category": "influence",
            "from": "stock6",
            "to": "variable39"
        },
        {
            "category": "influence",
            "from": "variable39",
            "to": "variable38"
        },
        {
            "category": "influence",
            "from": "variable37",
            "to": "variable38"
        },
        {
            "category": "influence",
            "from": "variable38",
            "to": "valve4"
        },
        {
            "category": "influence",
            "from": "variable38",
            "to": "valve15"
        }
    ]
};
