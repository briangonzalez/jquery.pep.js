<img src="http://s.cdpn.io/4629/pep-with-circles.svg" width=600 alt='jquery.pep.js'>
----
*kinetic drag for mobile & desktop; more at [http://pep.briangonzalez.org](http://pep.briangonzalez.org)*


## Getting Started
Getting started is simple: include jQuery, include pep, then:
```javascript
$('.pep').pep(); // yup, that simple.
```

## Usage
Pep has many options. Here they are in their entirety, with their defaults. This list can be a little daunting, but most of Pep's options are comparable to jQueryUI. Need a little help? [Just ask](http://twitter.com/brianmgonzalez).

| Name                            | Default                                         | Description                                                                                                                                         |
|---------------------------------|-------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| initiate                        | `function(){}`                                  | [≘ touchstart/mousedown] called when first touch / click event is triggered on the object                                                           |
| start                           | `function(){}`                                  | called when dragging starts; when `dx` or `dy` are greater than `startThreshold[0]` or `startThreshold[1]`                                          |
| drag                            | `function(){}`                                  | [≘ touchmove/mousemove] called continuously while the object is dragging                                                                            |
| stop                            | `function(){}`                                  | [≘ touchend/mouseup] called when dragging stops                                                                                                     |
| rest                            | `function(){}`                                  | called after dragging stops, and object has come to rest                                                                                            |
| moveTo                          | `false`                                         | custom method to override the default moveTo functionality.                                                                                         |
| callIfNotStarted                | `['stop', 'rest']`                              | if object has *not* moved outside of the `startThreshold`, call either the user-provided `stop` or `rest` fxn's anyway, or call both                |
| startThreshold                  | `[0,0]`                                         | how far past should the object move in the [x,y] direction before user 'start' function is called                                                   |
| grid                            | `[0,0]`                                         | define an [x,y] grid for the object to move along                                                                                                   |
| revert                          | `false`                                         | revert back to initial position                                                                                                                     |
| revertAfter                     | `stop`                                          | revert after given event - `'stop'` or `'ease'`                                                                                                     |
| revertIf                        | `function(){ return true; }`                    | return `false` / `true` from this function to conditionally revert an object                                                                        |
| droppable                       | `false`                                         | CSS selector that this element can be dropped on, false to disable                                                                                  |
| droppableActiveClass            | `'pep-dpa'`                                     | class to add to active droppable parents, default to pep-dpa (droppable parent active)                                                              |
| overlapFunction                 | `false`                                         | override pep's default overlap function; takes two args: a & b and returns true if they overlap                                                     |
| cssEaseString                   | *cubic-bezier(0.190, 1.000, 0.220, 1.000)*      | get more css ease params from [ http://matthewlein.com/ceaser/ ]                                                                                    |
| cssEaseDuration                 | `750`                                           | how long should it take (in ms) for the object to get from stop to rest?                                                                            |
| constrainTo                     | `false`                                         | constrain object to `'window'` or `'parent'` or `[top, right, bottom, left]`; works best w/ useCSSTranslation set to false                          |
| axis                            | `null`                                          | constrain object to either 'x' or 'y' axis                                                                                                          |
| debug                           | `false `                                        | show debug values and events in the lower-righthand corner of page                                                                                  |
| activeClass                     | `'pep-active'`                                  | class to add to the pep element while dragging                                                                                                      |
| multiplier                      | `1`                                             | +/- this number to modify to 1:1 ratio of finger/mouse movement to el movement                                                                      |
| velocityMultiplier              | `1.9`                                           | +/- this number to modify the springiness of the object as your release it                                                                          |
| shouldPreventDefault            | `true`                                          | in some cases, we don't want to prevent the default mousedown/touchstart on our Pep object, your call                                               |
| allowDragEventPropagation       | `true`                                          | set to false to stop drag events from bubbling up through the DOM tree                                                                              |
| stopEvents                      | `''`                                            | space delimited set of events which programmatically cause the object to stop                                                                       |
| hardwareAccelerate              | `true`                                          | apply the CSS3 silver bullet method to accelerate the pep object: http://indiegamr.com/ios6-html-hardware-acceleration-changes-and-how-to-fix-them/ |
| useCSSTranslation               | `true`                                          | use CSS transform translations as opposed to top/left                                                                                               |
| disableSelect                   | `true`                                          | apply `user-select: none` (CSS) to the object                                                                                                       |
| removeMargins                   | `true`                                          | remove margins for better object placement                                                                                                          |
| shouldEase                      | `true`                                          | disable/enable easing                                                                                                                               |
| place                           | `true`                                          | bypass pep's object placement logic                                                                                                                 |
| deferPlacement                  | `false`                                         | defer object placement until start event occurs                                                                                                     |
| forceNonCSS3Movement            | `false`                                         | DO NOT USE: this is subject to come/go. Use at your own risk                                                                                        |
| elementsWithInteraction         | `'input'`                                       | valid CSS/jQuery selector for elements within the Pep object that should allow user interaction, and thus propagate to allow movement               |



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
__Via Bower__

```shell
bower install jquery.pep
````

__From CDN__

Guaranteed to be up-to-date:

````
http://rawgithub.com/briangonzalez/jquery.pep.js/master/src/jquery.pep.js
````

This is likely to get out of sync from master:
````
http://cdnjs.cloudflare.com/ajax/libs/jquery.pep/0.4.0/jquery.pep.min.js
````

## Examples
Checkout the examples in the `demos` folder, which cover a wide array of test cases and options. Or you can check out other examples at http://pep.briangonzalez.org/ (which can also be found in more detail on Codepen: http://codepen.io/briangonzalez/tag/pep-demo)

## On the web
Visit us at http://pep.briangonzalez.org or follow me on Twitter: [@brianmgonzalez](https://twitter.com/brianmgonzalez).

## Support

| IE6 | IE7 | IE8 | IE9 | IE10/11 | Chrome | Firefox | Opera | Safari |
|---|---|---|---|---|---|---|---|---|
| <img width=64 src="https://raw.github.com/paulirish/browser-logos/master/ie6/ie6_64x64.png"></a> | <img width=64 src="https://raw.github.com/paulirish/browser-logos/master/ie7-8/ie7-8_64x64.png"></a> | <img width=64 src="https://raw.github.com/paulirish/browser-logos/master/ie7-8/ie7-8_64x64.png"></a> | <img width=64 src="https://raw.github.com/paulirish/browser-logos/master/ie/ie_64x64.png"></a> | <img width=64 src="https://raw.github.com/paulirish/browser-logos/master/ie-tile/ie-tile_64x64.png"></a> | <img width=64 src="https://raw.github.com/paulirish/browser-logos/master/chrome/chrome_64x64.png"></a> | <img width=64 src="https://raw.github.com/paulirish/browser-logos/master/firefox/firefox_64x64.png"></a> | <img width=64 src="https://raw.github.com/paulirish/browser-logos/master/opera/opera_64x64.png"></a> | <img width=64 src="https://raw.github.com/paulirish/browser-logos/master/safari/safari_64x64.png"></a>

See it in action in [IE6](http://www.youtube.com/watch?v=acc92L-Lhes&feature=youtu.be), [IE7](http://www.youtube.com/watch?v=8Qxo4q4ofVU&feature=youtu.be), [IE8](http://www.youtube.com/watch?v=WWKq3ovMbOQ&feature=youtu.be), and [IE9](http://www.youtube.com/watch?v=xYxQdkyzDnI&feature=youtu.be).

## Milestones
  - 08/08/13  -   Now with 100% IE coverage! That is, Pep now supports MSPointerEvents (IE10+)!
  - 08/06/13  -   Added in user-provided `initiate` function, which is fired during touchstart or mousedown; `start` is now called after object has moved past threshold
  - 05/01/13  -   Added in `droppable` functionality
  - 12/02/12  -   Complete rewrite with support for movement using CSS3 Transforms (`translate()` function)
  - 05/30/12  -   Initial version

## License

Pep is licensed under the [MIT License](http://www.tldrlegal.com/license/mit-license)
