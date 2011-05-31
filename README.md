# nimgload

Dependency free javascript to help load images once they are above the fold (in view). At the moment, this is more of a small learning project.

## Installation

1. download the JS and CSS files and add them to your project
2. link them
3. modify your img tags: change 'src' to 'data-src' for images that you want to lazyload (do not leave src='').
4. any background images you want to hide, add the default 'nimg-bg-none' class. you can modify this by passing in a different class and providing your own css.
5. run this to initialize: 'NImgLoad.init();' or 'NImgLoad.init({bgImgClass:'i-like-turtles'});'

In future releases:

* will add ability to set 'threshold' of when images will start to load
* better browser support

### Usage/Examples

see example.html

### License

nimgload is under teh MIT and GPL license.