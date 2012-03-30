# pep.jquery.js

_put a little pep in your step_

=====

[DEMO](http://pep.briangonzalez.org)

Pep is a lightweight plugin for kinetic drag on mobile/desktop.

Pep was built out of a need for kinetic drag support for both mobile and desktop devices (click & drag). It uses the best of jQuery's animate functions along with CSS3 animations to bring full-blown kinetic drag that works on all HTML5-ready devices. 

Pep has built-in support for custom start, stop, and drag events, a debugger, and the ability to customize your own kinetic easing functions from <a href='http://matthewlein.com/ceaser/'>Metthew Lein's Ceaser</a>.


## How to use

Select your jQuery element, then pep it: `$('#peppable').pep()`. 

Alternatively, you can pass a hash of parameters. Below are the defaults.

### Parameters

            debug:                  false,
            activeClass:            'active',
            multiplier:             1,
            stopEvents:             "", 
            cssEaseString:          "cubic-bezier(0.210, 1, 0.220, 1.000)",
            cssEaseDuration:        1000, 
            constrainToWindow:      false,
            drag:                   function(){ /* fire on drag */ },
            stop:                   function(){ /* fire on stop */ },
            start:                  function(){ /* fire on start */ }
            
So, for instance, you can log to the console, debug, and speed up the drag like so:
            
            var options = {
                debug:          true,
                drag:           function(){ console.log('we're dragging!') },
                multiplier:     1.2
            };
            $('#peppable').pep(options);
   
 
 Check out the demo over [here](http://pep.briangonzalez.org), and view the source for me tips 'n tricks.