/**
 * 简易声效控制
 */

/**
 * 使用方法：
 * 
 * var sound = require("sound/main");
 * 
 * var snd = sound.create("sounds/myfile");
 * snd.play();
 */

var buzz = require("buzz");

function ClassBuzz( src ){
    this.sound = new buzz.sound( src, { formats: [ "ogg", "mp3" ], preload: true, autoload: true, loop: false });
}

ClassBuzz.prototype.play = function(){
	this.sound.setPercent( 0 );
	this.sound.setVolume( 100 );
	this.sound.play();
};

ClassBuzz.prototype.stop = function(){
	this.sound.fadeOut( 1e3, function(){
	    this.pause();
	} );
};

exports.create = function( src ){
    return new ClassBuzz( src );
}