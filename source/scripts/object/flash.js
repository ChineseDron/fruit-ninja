/**
 *
 */

var layer = require("../layer");
var timeline = require("../timeline")
var tween = require("../lib/tween");
var Ucren = require("../lib/ucren");
var image, xDiff = 0, yDiff = 0;

var anim = tween.quadratic.cio;
var anims = [];
var dur = 100;

var switchOn = true;

// if( Ucren.isIe || Ucren.isSafari )
// 	switchOn = false;

exports.set = switchOn ? function(){
	image = layer.createImage( "flash", "images/flash.png", 0, 0, 358, 20 ).hide();
} : Ucren.nul;

exports.showAt = switchOn ? function( x, y, an ){

    image.rotate( an, true ).scale( 1e-5, 1e-5 ).attr({
    	x: x + xDiff,
    	y: y + yDiff
    }).show();

    anims.clear && anims.clear();

    timeline.createTask({
		start: 0, duration: dur, data: [ 1e-5, 1 ],
		object: this, onTimeUpdate: this.onTimeUpdate,
		recycle: anims
	});

	timeline.createTask({
		start: dur, duration: dur, data: [ 1, 1e-5 ],
		object: this, onTimeUpdate: this.onTimeUpdate,
		recycle: anims
	});
} : Ucren.nul;

exports.onTimeUpdate = switchOn ? function( time, a, b, z ){
    image.scale( z = anim( time, a, b - a, dur ), z );
} : Ucren.nul;