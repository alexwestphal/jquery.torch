 /**
  * jquery.torch.js
  * 
  * jQuery plugin for a simple torch effect.
  * @author Alex Westphal
  * @version 18-Oct-2012
  * 
  * Usage: $.torch( ACTION [, OPTIONS])
  * 
  * ACTIONS:
  *   "on" ...... Turn the torch on (repeated call will only change the settings)
  *   "off" ..... Turn the torch off (repeated calls have no effect)
  * 
  * OPTIONS:
  *   scope ..... Show 'rifle scope' style cross hairs (true/false) 
  *   size ...... Diameter of the torch circle (in pixels)
  * 
  * Notes: Double clicking will turn the torch "off" if its currently on. 
  * HTML and CSS generation in javascript is dirty but it keeps the 
  * plugin to a single file. 
  */
 (function($) {
    $.extend({torch: function jquery_torch(action, options) {
         
         // Options
         var opt = { size: 200 };
         
         if(options) {
             if(options.size) opt.size = options.size;
             if(options.scope) opt.scope = true;
                     if(options.done) opt.done = options.done;
         }
         
         // Turn ON Torch
         if("on" == action) {
             
             // Tracking on state allows on to be called repeatedly
             if(this._on) $.torch("off");
             this._on = true;
             
             if(options.done) this._done = options.done;
             
             
             // Create required HTML
             var contents = $("body").contents().remove();
             $("body").html("<div id='torch_outer'><div id='torch_mask'><div id='torch_circle1'><div id='torch_circle2'><div id='torch_inner'></div></div></div></div>");
             $("#torch_inner").append(contents).width($(window).width()).height($(window).height());
         
             // Masking CSS
             $("body").css({margin: 0, padding: 0});
             $("#torch_outer").css({position: "fixed", width: "100%", height: "100%", overflowX: "hidden", overflowY: "hidden"});
             $("#torch_mask").css({position: "absolute", border: "2500px solid black", overflowX: "hidden", overflowY: "hidden", zIndex: 200});
             $("#torch_circle2").css({cursor: "none"});
             $("#torch_inner").css({position: "relative", zIndex: -150});
         
             // Sizing CSS
             var diameter = opt.size + "px", radius = opt.size/2  + "px";
             $("#torch_mask,#torch_circle1,#torch_circle2").css({width: diameter, height: diameter});
             $("#torch_circle1").css({borderRadius: radius, boxShadow: "0 0 "+radius+" "+diameter+" black"});
             $("#torch_circle2").css({borderRadius: radius, boxShadow: "inset 0 0 "+radius+" black"});
         
         
             // Add cross hairs if scope option is set
             if(opt.scope) {
                 $("#torch_mask").append("<div id='crosshair_h'/><div id='crosshair_v'/>");
                 $("#crosshair_h").css({position: "absolute", left: 0, top: radius, width: diameter, height: 0, borderTop: "1px solid black", opacity: 0.5, cursor: "none"});
                 $("#crosshair_v").css({position: "absolute", left: radius, top: 0, width: 0, height: diameter, borderLeft: "1px solid black", opacity: 0.5, cursor: "none"});
             }
         
             // Jquery object caching
             var $mask = $("#torch_mask"), $inner = $("#torch_inner");
         
             // Mouse movement handler
             function jquery_torch_mousemove(event) {
                 var rad = opt.size / 2;
                 $mask.css({top: event.pageY-2500-rad, left: event.pageX-2500-rad});
                 $inner.css({top: rad-event.pageY, left: rad-event.pageX});
             }
             // Mouse double click handler
             function jquery_torch_dbclick(event) {
                 $.torch("off");
             }
             // Bind events
             $("body")
             .on("mousemove", jquery_torch_mousemove)
             .on("dblclick", jquery_torch_dbclick);
             
             
         // Turn OFF Torch
         } else if("off" == action) {
             
             // Tracking on state allows off to be called repeatedly
             if(!this._on) return;
             this._on = false;
             
             // Unbind events
             $("body")
                        .off("mousemove", jquery_torch_mousemove)
                        .off("dblclick", jquery_torch_dbclick);
             
             
             // Reset html
             var contents = $("#torch_inner").contents().remove();
             $("body").empty("").append(contents);
             
             if(this._done) {
                 this._done();
                 delete this._done;
             }
         }
     }});
 })(jQuery);
