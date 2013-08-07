### jquery.pep.js

*kinetic drag for mobile & desktop*, read more at [http://pep.briangonzalez.org](http://pep.briangonzalez.org)

-------


## Getting Started
In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/jquery.pep.min.js"></script>
<script>
  jQuery(function($) {
    $('#pep').pep(); // yup, that simple.
  });
</script>
```

## Usage
Pep has many options. Here they are in their entirety, with their defaults.
```javascript
defaults = {

   // Options with their defaults
   // --------------------------------------------------------------------------------

    // debug via a small div in the lower-righthand corner of the document  
    debug:                  false,  

    // class to add to the DOM el while dragging                                      
    activeClass:            'pep-active',   

    // +/- this number to modify to 1:1 ratio of finger/mouse movement to el movement                                  
    multiplier:             1,     
    
    // +/- this number to modify the springiness of the object as your release it                            
    velocityMultiplier:     1.9, 
                                         
   // in some cases, we don't want to prevent the default on our Pep object, your call
    shouldPreventDefault:   true,
    
    // space delimited set of events which programmatically cause the object to stop
    stopEvents:             '',                                           
    
    // apply the CSS3 silver bullet method to accelerate the pep object: http://indiegamr.com/ios6-html-hardware-acceleration-changes-and-how-to-fix-them/
    hardwareAccelerate:     true,                                         
    
    // use CSS transform translations as opposed to top/left
    useCSSTranslation:      true,                                         
    
    // apply `user-select: none` (CSS) to the object
    disableSelect:          true,                                         
    
    // get more css ease params from [ http://matthewlein.com/ceaser/ ]
    cssEaseString:          "cubic-bezier(0.190, 1.000, 0.220, 1.000)",   
    
    // how long should it take (in ms) for the object to get from stop to rest?
    cssEaseDuration:        750,                                          
    
    // disable/enable easing
    shouldEase:             true,                                         
    
    // CSS selector that this element can be dropped on, false to disable
    droppable:              false,                                        
    
    // class to add to active droppable parents, default to pep-dpa (droppable parent active)
    droppableActiveClass:   'pep-dpa',                                    
    
    // override pep's default overlap function; takes two args: a & b and returns true if they overlap
    overlapFunction:        false,                                        
    
    // constrain object to 'window' || 'parent' || [top, right, bottom, left]; works best w/ useCSSTranslation set to false
    constrainTo:            false,                                        

    // remove margins for better object placement
    removeMargins:          true,                                         

    // bypass pep's object placement logic
    place:                  true,                                         

    // defer object placement until start event occurs
    deferPlacement:         false,                                        
    
    // constrain object to either 'x' or 'y' axis
    axis:                   null,                                         
    
    // DO NOT USE: this is subject to come/go. Use at your own risk
    forceNonCSS3Movement:   false,                                                                      

    // how far past should the object move in the [x,y] direction before users 'start' function is called 
    startThreshold:         [0,0],

    // called when first touch / mousedown event is triggered on the object 
    initiate:               function(){},
    
    // called when dragging starts; dx || dy must be greater than startThreshold ([x,y])
    start:                  function(){},                                 
    
     // called continuously while the object is dragging 
    drag:                   function(){},  

    // called when dragging stops
    stop:                   function(){},                                 
    
    // called after dragging stops, and object has come to rest
    rest:                   function(){}                                  
}; 
```

## API
```javascript
// Toggle functionality of all Pep objects on the page
$.pep.toggleAll()

// Explicitly disable all Pep objects on the page
$.pep.toggleAll(false)

// Explicitly enable all Pep objects on the page
$.pep.toggleAll(true)

// Unbind Pep completely from the object
var $pep = $('.pep');
$pep.pep();               // bind
$.pep.unbind( $pep );     // unbind
$pep.pep();               // bind

````

## Class Applications
The following classes are applied corresponding to events that are happening on the pep object:

  - `pep-active` -- applied when initiate event is triggered; removed when ease has finished
  - `pep-start` -- applied when start event is triggered; removed when stop event occurs
  - `pep-ease` -- applied when stop event is triggered; removed when ease has finished

## Installation
Grab Pep via bower:

```shell
bower install jquery.pep
````

or grab from CDN:

````
// Guaranteed to be up-to-date
//rawgithub.com/briangonzalez/jquery.pep.js/master/src/jquery.pep.js
````
````
// This is likely to get out of sync from master
//cdnjs.cloudflare.com/ajax/libs/jquery.pep/0.4.0/jquery.pep.min.js
````

## Examples
Checkout the examples in the `demos` folder, which cover a wide array of test cases and options. Or you can check out other examples at http://pep.briangonzalez.org/ (which can also be found in more detail on Codepen: http://codepen.io/briangonzalez/tag/pep-demo)

## On the web
Visit us at http://pep.briangonzalez.org or follow me on Twitter: [@brianmgonzalez](https://twitter.com/brianmgonzalez).

## Support

| IE6 | IE7 | IE8 | IE9 | IE10 | Chrome | Firefox | Opera | Safari |
|---|---|---|---|---|---|---|---|---|
| <img width=64 src="https://raw.github.com/paulirish/browser-logos/master/ie6/ie6_64x64.png"></a> | <img width=64 src="https://raw.github.com/paulirish/browser-logos/master/ie7-8/ie7-8_64x64.png"></a> | <img width=64 src="https://raw.github.com/paulirish/browser-logos/master/ie7-8/ie7-8_64x64.png"></a> | <img width=64 src="https://raw.github.com/paulirish/browser-logos/master/ie9-10/ie9-10_64x64.png"></a> | <img width=64 src="https://raw.github.com/paulirish/browser-logos/master/ie9-10/ie9-10_64x64.png"></a> | <img width=64 src="https://raw.github.com/paulirish/browser-logos/master/chrome/chrome_64x64.png"></a> | <img width=64 src="https://raw.github.com/paulirish/browser-logos/master/firefox/firefox_64x64.png"></a> | <img width=64 src="https://raw.github.com/paulirish/browser-logos/master/opera/opera_64x64.png"></a> | <img width=64 src="https://raw.github.com/paulirish/browser-logos/master/safari/safari_64x64.png"></a> 

See it in action in [IE6](http://www.youtube.com/watch?v=acc92L-Lhes&feature=youtu.be), [IE7](http://www.youtube.com/watch?v=8Qxo4q4ofVU&feature=youtu.be), [IE8](http://www.youtube.com/watch?v=WWKq3ovMbOQ&feature=youtu.be), and [IE9](http://www.youtube.com/watch?v=xYxQdkyzDnI&feature=youtu.be).

## Milestones
  - 08/06/13  -   Added in user-provided `initiate` function, which is fired during touchstart or mousedown; `start` is now called after object has moved past threshold    
  - 05/01/13  -   Added in `droppable` functionality
  - 12/02/12  -   Complete rewrite with support for movement using CSS3 Transforms (`translate()` function)
  - 05/30/12  -   Initial version

## License

Pep is licensed under the [Eclipse Public License](http://www.eclipse.org/legal/epl-v10.html)
