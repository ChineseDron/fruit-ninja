/**
 * a simple state manager
 * @author 	dron
 * @date 	2012-06-28
 */
var Ucren = require("lib/ucren");
var timeline = require("timeline");

/**
 * usage:
 * state( key ).is( value )		->	determine if the value of key is the given value
 * state( key ).isnot( value )	->	determine if the value of key is not given value
 * state( key ).ison()			->	determine if the value of key is the boolean value 'true'
 * state( key ).isoff()			->	determine if the value of key is the boolean value 'false'
 * state( key ).isunset()		->	determine if the value of key is undefined
 * state( key ).set( value )	->	set the value of key to a given value
 * state( key ).get()			->	get the value of key
 * state( key ).on()			->	set the value of key to boolean value 'true'
 * state( key ).off()			->	set the value of key to boolean value 'false'
 */

var stack = {};
var cache = {};

exports = function( key ){

	if( cache[ key ] )
	    return cache[ key ];

	return cache[ key ] = {
		is: function( value ){
		    return stack[key] === value;
		},

		isnot: function( value ){
		    return stack[key] !== value;
		},

		ison: function(){
			return this.is( true );
		},

		isoff: function(){
			return this.isnot( true );
		},

		isunset: function(){
			return this.is( undefined );
		},

		set: function( value ){
		    return stack[key] = value;
		},

		get: function(){
		    return stack[key];
		},

		on: function(){
			var me = this;
			me.set( true );
			return {
				keep: function( time ){
					timeline.setTimeout( me.set.saturate( me, false ), time );
				}
			}
		},

		off: function(){
			var me = this;
		    me.set( false );
		    return {
		    	keep: function( time ){
		    		timeline.setTimeout( me.set.saturate( me, true ), time );
		    	}
		    }
		}
	}
};