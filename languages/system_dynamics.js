SYSTO.languages.system_dynamics = {
meta: {description: 'This defines the basic symbols for System Dynamics modelling: stocks, flows, variables and influences.',
       label: 'System Dynamics'},
NodeType: {
   stock: {
      counter: 0,
      has_button: true,
      button_label: 'Stock',
      button_icon: 'data:image/gif;base64,R0lGODlhEAAPAPcAAAAAAAAAQAAAgAAA/wAgAAAgQAAggAAg/wBAAABAQABAgABA/wBgAABgQABggABg/wCAAACAQACAgACA/wCgAACgQACggACg/wDAAADAQADAgADA/wD/AAD/QAD/gAD//yAAACAAQCAAgCAA/yAgACAgQCAggCAg/yBAACBAQCBAgCBA/yBgACBgQCBggCBg/yCAACCAQCCAgCCA/yCgACCgQCCggCCg/yDAACDAQCDAgCDA/yD/ACD/QCD/gCD//0AAAEAAQEAAgEAA/0AgAEAgQEAggEAg/0BAAEBAQEBAgEBA/0BgAEBgQEBggEBg/0CAAECAQECAgECA/0CgAECgQECggECg/0DAAEDAQEDAgEDA/0D/AED/QED/gED//2AAAGAAQGAAgGAA/2AgAGAgQGAggGAg/2BAAGBAQGBAgGBA/2BgAGBgQGBggGBg/2CAAGCAQGCAgGCA/2CgAGCgQGCggGCg/2DAAGDAQGDAgGDA/2D/AGD/QGD/gGD//4AAAIAAQIAAgIAA/4AgAIAgQIAggIAg/4BAAIBAQIBAgIBA/4BgAIBgQIBggIBg/4CAAICAQICAgICA/4CgAICgQICggICg/4DAAIDAQIDAgIDA/4D/AID/QID/gID//6AAAKAAQKAAgKAA/6AgAKAgQKAggKAg/6BAAKBAQKBAgKBA/6BgAKBgQKBggKBg/6CAAKCAQKCAgKCA/6CgAKCgQKCggKCg/6DAAKDAQKDAgKDA/6D/AKD/QKD/gKD//8AAAMAAQMAAgMAA/8AgAMAgQMAggMAg/8BAAMBAQMBAgMBA/8BgAMBgQMBggMBg/8CAAMCAQMCAgMCA/8CgAMCgQMCggMCg/8DAAMDAQMDAgMDA/8D/AMD/QMD/gMD///8AAP8AQP8AgP8A//8gAP8gQP8ggP8g//9AAP9AQP9AgP9A//9gAP9gQP9ggP9g//+AAP+AQP+AgP+A//+gAP+gQP+ggP+g///AAP/AQP/AgP/A////AP//QP//gP///yH5BAEAAP8ALAAAAAAQAA8AQAg7AP8JHEiw4D8AkhIqXLgQAEKGEBM6nEixosWLFyNGdKgRIgCDIEOKFPiwo0KOJk+WTIkypaSWLEcaDAgAOw==',
      has_label: true,
      default_label_root: 'stock',
      shape: 'rectangle',
      width: 41,
      height: 25,
      border_colour: {set:   {normal:'black',   selected:'blue',    highlight:'green'},
                      unset: {normal:'red',     selected:'blue',    highlight:'green'}},
      fill_colour:   {set:   {normal:'#e0e0e0', selected:'#e0e0e0', highlight:'#e0e0e0'},
                      unset: {normal:'#ffe0e0', selected:'#ffe0e0', highlight:'#e0e0e0'}},
      line_width:    {set:   {normal:1,         selected:3,         highlight:2},
                      unset: {normal:3,       selected:3,         highlight:2}},
      display_colour: 'black',
      text_shiftx: 1,
      text_shifty: -22,
      instructions:{
         diagram:'<b>To add a stock</b>: Move the mouse to the diagram area, then click.<br/><b>To re-label a stock</b>: Do a long-click (hold the mouse button down for a second or more) on the stock, then edit the label.<br/><b>To change the initial value or other properties</b>: Double-click on the stock.'},
      extras: {
         equation: {type:'long_text', default_value:''},
         units: {type:'short_text', default_value:''},
         min_value: {type:'short_text', default_value:'0'},
         max_value: {type:'short_text', default_value:'100'},
         description: {type:'short_text', default_value:''},
         documentation: {type:'long_text', default_value:''},
         comments: {type:'long_text', default_value:''}
      }
   },

   cloud: {
      counter: 0,
      has_button: false,
      has_label: false,
      default_label_root: 'cloud',
      shape: 'rectangle',
      width: 35,
      height: 20,
      border_colour: {set:   {normal:'transparent',   selected:'blue',    highlight:'green'},
                      unset: {normal:'transparent',   selected:'blue',    highlight:'green'}},
      fill_colour:   {set:   {normal:'#e8e8e8', selected:'#e8e8e8', highlight:'#e8e8e8'},
                      unset: {normal:'#e8e8e8', selected:'#e8e8e8', highlight:'#e8e8e8'}},
      line_width:    {set:   {normal:2,         selected:2,         highlight:2},
                      unset: {normal:2,         selected:2,         highlight:2}},
      display_colour: 'black',
      text_shiftx: 0,
      text_shifty: 25,
      equation: 8888},

   variable: {
      counter: 0,
      has_button: true,
      has_label: true,
      button_label: 'Variable',
      button_icon: 'data:image/gif;base64,R0lGODlhFAAUAKEAAAAAAP7//wAAAAAAACH5BAEKAAIALAAAAAAUABQAAAIglI+py+0Po5wUgYuz3qH7D3pXSIJjiW7qWrXuC8fyWwAAOw==',
      default_label_root: 'variable',
      shape: 'rectangle',
      width: 100,
      height: 15,
      no_separate_symbol: true,
      button_text:'var',
      border_colour: {set:   {normal:'transparent',   selected:'blue',    highlight:'green'},
                      unset: {normal:'red0',     selected:'blue',    highlight:'green'}},
      fill_colour:   {set:   {normal:'transparent', selected:'white', highlight:'#e0e0e0'},
                      unset: {normal:'#ffe8e8', selected:'white', highlight:'#e0e0e0'}},
      line_width:    {set:   {normal:0,         selected:3,         highlight:2},
                      unset: {normal:3,       selected:3,         highlight:2}},
      display_colour: 'black',
      text_shiftx: 0,
      text_shifty: 0,
      instructions:{
         diagram:'<b>To add a variable</b>: Move the mouse to the diagram area, then click.<br/><b>To re-label a variable</b>: Do a long-click (hold the mouse button down for a second or more) on the variable, then edit the label.<br/><b>To change the value, equation or other properties</b>: Double-click on the variable.'},
      extras: {
         equation: {type:'long_text', default_value:''},
         units: {type:'short_text', default_value:''},
         min_value: {type:'short_text', default_value:'0'},
         max_value: {type:'short_text', default_value:'1'},
         description: {type:'short_text', default_value:''},
         documentation: {type:'long_text', default_value:''},
         comments: {type:'long_text', default_value:''}
      }
   },

   valve: {
      counter: 0,
      has_button: false,
      has_label: true,
      default_label_root: 'flow',
      shape: 'oval',
      width: 15,
      height: 15,
      // path: [['moveto',-3,-3],['lineto',-3,3],['lineto',3,3],['lineto',3,-3],['lineto',-3,-3]],
      // path: [['moveto',20,20],['lineto',20,40],['lineto',40,40],['lineto',40,20],['lineto',20,20]],
      border_colour: {set:   {normal:'black',   selected:'blue',    highlight:'green'},
                      unset: {normal:'red',     selected:'blue',    highlight:'green'}},
      fill_colour:   {set:   {normal:'#e0e0e0', selected:'#e0e0e0', highlight:'#e0e0e0'},
                      unset: {normal:'#ffe0e0', selected:'#ffe0e0', highlight:'#e0e0e0'}},
      line_width:    {set:   {normal:1.5,       selected:5,         highlight:5},
                      unset: {normal:4,       selected:5,         highlight:5}},
      // Not sure why line_widths need to be increased for a circle for same visual effect.
      display_colour: 'black',
      text_shiftx: 0,
      text_shifty: 19,
      extras: {
         equation: {type:'long_text', default_value:''},
         units: {type:'short_text', default_value:''},
         min_value: {type:'short_text', default_value:'0'},
         max_value: {type:'short_text', default_value:'1'},
         description: {type:'short_text', default_value:''},
         documentation: {type:'long_text', default_value:''},
         comments: {type:'long_text', default_value:''}
      }
   },

   function: {
      counter: 0,
      has_button: false,   // Temporary measure, to stop it being used.
      button_label: 'Function',
      button_icon:'data:image/gif;base64,R0lGODlhFAAUAIAAAAAAAAAAACH5BAEKAAEALAAAAAAUABQAAAIljI+py+0PHZjRUAtgVrt19HHeyIQgWS5msq5sd0WTW9X2jedGAQA7',
      has_label: true,
      default_label_root: 'function',
      shape: 'oval',
      width: 15,
      height: 15,
      // path: [['moveto',-3,-3],['lineto',-3,3],['lineto',3,3],['lineto',3,-3],['lineto',-3,-3]],
      // path: [['moveto',20,20],['lineto',20,40],['lineto',40,40],['lineto',40,20],['lineto',20,20]],
      border_colour: {set:   {normal:'black',   selected:'blue',    highlight:'green'},
                      unset: {normal:'red',     selected:'blue',    highlight:'green'}},
      fill_colour:   {set:   {normal:'yellow',   selected:'white',   highlight:'white'},
                      unset: {normal:'red',   selected:'white',   highlight:'white'}},
      line_width:    {set:   {normal:1.5,       selected:5,         highlight:5},
                      unset: {normal:3.5,       selected:5,         highlight:5}},
      // Not sure why line_widths need to be increased for a circle for same visual effect.
      display_colour: 'black',
      text_shiftx: 0,
      text_shifty: 19,
      extras: {
         equation: {type:'long_text', default_value:'9999999'},
         min_value: {type:'short_text', default_value:'0'},
         max_value: {type:'short_text', default_value:'1'},
         documentation: {type:'long_text', default_value:''}
      }
   }
},

ArcType:{
   flow: {
      counter: 0,
      has_button: true,
      button_label: 'Flow',
      button_icon:'data:image/gif;base64,R0lGODlhFAAUAKECAAAAAGdnZ////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAAIALAAAAAAUABQAAAIylI+py+0PI5htWmSBoob3ewQaFmBghqaZoLbuixpiApTHeo+svns5+PE9gJGi8YhMOgoAOw==',
      has_label: false,
      default_label_root: 'flow',
      shape: 'curved',
      curvature: 0.0,      // This is the distance from the straight line to the control point,
                           // as a fraction of the distance between the start and end nodes.
      along: 0.5,          // This is the position of the control point along and normal to the line
                           // between the start node and the end node.  Can be <0 or >1.
      line_colour: {set:   {normal:'#a0a0a0',   selected:'blue',    highlight:'green'},
                      unset: {normal:'red',     selected:'blue',    highlight:'green'}},
      fill_colour: {set:   {normal:'#a0a0a0',   selected:'blue',    highlight:'green'},
                      unset: {normal:'red',     selected:'blue',    highlight:'green'}},
      line_width: {set:   {normal:4,   selected:4,    highlight:4},
                      unset: {normal:4,     selected:4,    highlight:4}},
      arrowhead:{shape:'diamond', gap:2, width:5, front:12, back:0},
      internode_type: 'valve',
      canvas_startnode_type: 'cloud',
      canvas_endnode_type: 'cloud',
      instructions:{
         diagram:'<b>To make a flow from one stock to another</b>: Move to the inside of the starting stock, mouse-down, drag to the inside of the destination stock, and mouse-up.<br/><b>To make a flow from outside the system to </b>: Move to a blank area of the diagram, mouse-down, drag to the inside of the destination stock, and mouse-up.<br/><b>To make a flow from one stock to outside the system</b>: Move to the inside of the starting stock, mouse-down, drag to a blank area of the screen, and mouse-up.<br/><br/>Currently, you cannot re-route the flow, or move the "valve" symbol.'},
      // The duplication of rules for 'cloud' and 'canvas' is to allow checking
      // that a flow arrow is valid both before and after it is created.
/*
      rules: [{from:'canvas',to:'stock',new_from_node:'cloud'}, 
              {from:'stock',to:'stock'}, 
              {from:'stock',to:'canvas',new_to_node:'cloud'},
              {from:'cloud',to:'stock'}, 
              {from:'stock',to:'cloud'}]
*/
        rules: {
            canvas:{
                stock:{new_from_node:'cloud'},
                stock:true},
            stock:{
                canvas:{new_to_node:'cloud'}, 
                stock:true},
            cloud:{
                stock:true}}
           
    },

   influence: {
      counter: 0,
      has_button: true,
      button_label: 'Influence',
      button_icon:'data:image/gif;base64,R0lGODlhEAAPAPcAAAAAAAAAQAAAgAAA/wAgAAAgQAAggAAg/wBAAABAQABAgABA/wBgAABgQABggABg/wCAAACAQACAgACA/wCgAACgQACggACg/wDAAADAQADAgADA/wD/AAD/QAD/gAD//yAAACAAQCAAgCAA/yAgACAgQCAggCAg/yBAACBAQCBAgCBA/yBgACBgQCBggCBg/yCAACCAQCCAgCCA/yCgACCgQCCggCCg/yDAACDAQCDAgCDA/yD/ACD/QCD/gCD//0AAAEAAQEAAgEAA/0AgAEAgQEAggEAg/0BAAEBAQEBAgEBA/0BgAEBgQEBggEBg/0CAAECAQECAgECA/0CgAECgQECggECg/0DAAEDAQEDAgEDA/0D/AED/QED/gED//2AAAGAAQGAAgGAA/2AgAGAgQGAggGAg/2BAAGBAQGBAgGBA/2BgAGBgQGBggGBg/2CAAGCAQGCAgGCA/2CgAGCgQGCggGCg/2DAAGDAQGDAgGDA/2D/AGD/QGD/gGD//4AAAIAAQIAAgIAA/4AgAIAgQIAggIAg/4BAAIBAQIBAgIBA/4BgAIBgQIBggIBg/4CAAICAQICAgICA/4CgAICgQICggICg/4DAAIDAQIDAgIDA/4D/AID/QID/gID//6AAAKAAQKAAgKAA/6AgAKAgQKAggKAg/6BAAKBAQKBAgKBA/6BgAKBgQKBggKBg/6CAAKCAQKCAgKCA/6CgAKCgQKCggKCg/6DAAKDAQKDAgKDA/6D/AKD/QKD/gKD//8AAAMAAQMAAgMAA/8AgAMAgQMAggMAg/8BAAMBAQMBAgMBA/8BgAMBgQMBggMBg/8CAAMCAQMCAgMCA/8CgAMCgQMCggMCg/8DAAMDAQMDAgMDA/8D/AMD/QMD/gMD///8AAP8AQP8AgP8A//8gAP8gQP8ggP8g//9AAP9AQP9AgP9A//9gAP9gQP9ggP9g//+AAP+AQP+AgP+A//+gAP+gQP+ggP+g///AAP/AQP/AgP/A////AP//QP//gP///yH5BAEAAP8ALAAAAAAQAA8AQAgyAP8JHEiwoEAABg0CQEhw4cKEDBNKnAhxIsOHFDNq3MixIMaDHxFGlChypEKHHztuDAgAOw==',
      has_label: true,
      default_label_root: 'influence',
      shape: 'curved',
      curvature: 0.3,      // This is the distance from the straight line to the control point,
                           // as a fraction of the distance between the start and end nodes.
      along: 0.5,          // This is the position of the control point along and normal to the line
                           // between the start node and the end node.  Can be <0 or >1.
      line_colour: {set:   {normal:'#505050',   selected:'blue',    highlight:'green'},
                      unset: {normal:'red',     selected:'blue',    highlight:'green'}},
      fill_colour: {set:   {normal:'#505050',   selected:'blue',    highlight:'green'},
                      unset: {normal:'red',     selected:'blue',    highlight:'green'}},
            // Note: line_width{{}} added June 2014, to provide more options for display.
            // linewidth left in to avoid need to go through code to replace with line_width{{}}.
            // TODO: replace linewidth with line_width{{}} throughout, and deprecate linewidth.
            // Incidentally, what *does* set/unset mean for arcs??
      line_width: {set:   {normal:1,   selected:2,    highlight:4},
                      unset: {normal:1,     selected:2,    highlight:4}},
      arrowhead:{shape:'diamond', gap:2, width:3, front:10, back:-2},
      internode_type: null,
      canvas_startnode_type: null,
      canvas_endnode_type: null,
      instructions:{
         diagram:'<b>To make an influence from one stock, variable or flow to another</b>: Move to the inside of the starting symbol, mouse-down, drag to the inside of the destination symbol, and mouse-up.<br/><br/><b>To re-route the influence arrow</b>: Mouse-down on it near the middle, drag to the required position, and mouse-up.'},
/*
      rules: [{from:'variable',to:'stock'}, 
              {from:'stock',to:'variable'}, 
              {from:'variable',to:'valve'}, 
              {from:'valve',to:'variable'},
              {from:'stock',to:'valve'}, 
              {from:'valve',to:'stock'},
              {from:'variable',to:'variable'}, 
              {from:'valve',to:'valve'}, 
              {from:'stock',to:'stock'}]
*/
        rules: {
            stock:{
                stock:true, 
                valve:true, 
                variable:true},
            variable:{
                stock:true, 
                valve:true, 
                variable:true},
            valve:{
                stock:true, 
                valve:true, 
                variable:true}
        }
    }
},

/*
ContainerType: {
    submodel:{
      counter: 0,
      has_button: true,
      button_label: 'Stock',
      button_icon: 'data:image/gif;base64,R0lGODlhEAAPAPcAAAAAAAAAQAAAgAAA/wAgAAAgQAAggAAg/wBAAABAQABAgABA/wBgAABgQABggABg/wCAAACAQACAgACA/wCgAACgQACggACg/wDAAADAQADAgADA/wD/AAD/QAD/gAD//yAAACAAQCAAgCAA/yAgACAgQCAggCAg/yBAACBAQCBAgCBA/yBgACBgQCBggCBg/yCAACCAQCCAgCCA/yCgACCgQCCggCCg/yDAACDAQCDAgCDA/yD/ACD/QCD/gCD//0AAAEAAQEAAgEAA/0AgAEAgQEAggEAg/0BAAEBAQEBAgEBA/0BgAEBgQEBggEBg/0CAAECAQECAgECA/0CgAECgQECggECg/0DAAEDAQEDAgEDA/0D/AED/QED/gED//2AAAGAAQGAAgGAA/2AgAGAgQGAggGAg/2BAAGBAQGBAgGBA/2BgAGBgQGBggGBg/2CAAGCAQGCAgGCA/2CgAGCgQGCggGCg/2DAAGDAQGDAgGDA/2D/AGD/QGD/gGD//4AAAIAAQIAAgIAA/4AgAIAgQIAggIAg/4BAAIBAQIBAgIBA/4BgAIBgQIBggIBg/4CAAICAQICAgICA/4CgAICgQICggICg/4DAAIDAQIDAgIDA/4D/AID/QID/gID//6AAAKAAQKAAgKAA/6AgAKAgQKAggKAg/6BAAKBAQKBAgKBA/6BgAKBgQKBggKBg/6CAAKCAQKCAgKCA/6CgAKCgQKCggKCg/6DAAKDAQKDAgKDA/6D/AKD/QKD/gKD//8AAAMAAQMAAgMAA/8AgAMAgQMAggMAg/8BAAMBAQMBAgMBA/8BgAMBgQMBggMBg/8CAAMCAQMCAgMCA/8CgAMCgQMCggMCg/8DAAMDAQMDAgMDA/8D/AMD/QMD/gMD///8AAP8AQP8AgP8A//8gAP8gQP8ggP8g//9AAP9AQP9AgP9A//9gAP9gQP9ggP9g//+AAP+AQP+AgP+A//+gAP+gQP+ggP+g///AAP/AQP/AgP/A////AP//QP//gP///yH5BAEAAP8ALAAAAAAQAA8AQAg7AP8JHEiw4D8AkhIqXLgQAEKGEBM6nEixosWLFyNGdKgRIgCDIEOKFPiwo0KOJk+WTIkypaSWLEcaDAgAOw==',
      has_label: true,
      default_label_root: 'submodel',
      shape: 'rectangle',
      border_colour: {set:   {normal:'black',   selected:'blue',    highlight:'green'},
                      unset: {normal:'black',     selected:'blue',    highlight:'green'}},
      fill_colour:   {set:   {normal:'#e0e0e0', selected:'#e0e0e0', highlight:'#e0e0e0'},
                      unset: {normal:'#ffe0e0', selected:'#ffe0e0', highlight:'#e0e0e0'}},
      line_width:    {set:   {normal:1,         selected:3,         highlight:2},
                      unset: {normal:1,       selected:3,         highlight:2}},
      display_colour: 'black',
      text_shiftx: 1,
      text_shifty: -22,
      instructions:{
         diagram:'<b>To add a submodel</b>: Move the mouse to the diagram area, then push the mouse button down, drag to the opposite corner of the submodel, the release the mouse button..<br/>'},
      extras: {
         description: {type:'short_text', default_value:''},
         documentation: {type:'long_text', default_value:''},
         comments: {type:'long_text', default_value:''}
      }
   }
}
*/
};

