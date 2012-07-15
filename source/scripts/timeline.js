/**
 * a easy timeline manager
 * @version 0.9
 * @author dron
 */

var Ucren = require("lib/ucren");

/**
 * initialize timeline
 */
exports.init = function(){
	var me = this;
	me.startTime = now();
	me.count = 0;

 //    var interval = function(){
	// 	me.count ++;
	//     update( now() );
	//     requestAnimationFrame( interval );
	// };

	// interval();
	
	var time = 1;

	// if( Ucren.isSafari )
	//     time = 10;

	setInterval( function(){
	    me.count ++;
	    update( now() );
	}, time );
};

/**
 * create a task
 * @param  {Object} conf 	the config
 * @return {Task} 			a task instance
 */
exports.createTask = function( conf ){
	/* e.g. createTask({
		start: 500, duration: 2000, data: [a, b, c,..],
		object: module, onTimeUpdate: fn(time, a, b, c,..), onTimeStart: fn(a, b, c,..), onTimeEnd: fn(a, b, c,..),
		recycle: []
	}); */
	var task = createTask(conf);
    addingTasks.unshift( task );
    adding = 1;

    if( conf.recycle )
    	this.taskList( conf.recycle, task );

    return task;
};

/**
 * use a array to recycle the task
 * @param  {Array} queue	be use for recycling task
 * @param  {Task} task 		a task instance		
 * @return {Array}			this queue
 */
exports.taskList = function( queue, task ){
	if( !queue.clear )
		queue.clear = function(){
			for(var task, i = this.length - 1; i >= 0; i --)
				task = this[i],
				task.stop(),
				this.splice( i, 1 );
			return this;
		};

	if( task )
	    queue.unshift( task );

	return queue;
};

/**
 * create a timer for once callback
 * @param {Function} fn 	callback function
 * @param {Number}   time 	time, unit: ms
 */
exports.setTimeout = function( fn, time ){
    // e.g. setTimeout(fn, time);
    return this.createTask({ start: time, duration: 0, onTimeStart: fn });
};

/**
 * create a timer for ongoing callback
 * @param {Function} fn 	callback function
 * @param {Number}   time 	time, unit: ms
 */
exports.setInterval = function( fn, time ){
    // e.g. setInterval(fn, time);
    var timer = setInterval( fn, time );
    return {
    	stop: function(){
    	    clearInterval( timer );
    	}
    };
};

/**
 * get the current fps
 * @return {Number} fps number
 */
exports.getFPS = function(){
	var t = now(), fps = this.count / (t - this.startTime) * 1e3;
	if(this.count > 1e3)
		this.count = 0,
		this.startTime = t;
	return fps;
};

/**
 * @private
 */

var Ucren = require("lib/ucren");
var tasks = [], addingTasks = [], adding = 0;

var now = function(){
	return new Date().getTime();
};

// var requestAnimationFrame = function( glob ){
// 	return glob.requestAnimationFrame ||
// 		glob.mozRequestAnimationFrame ||
// 		glob.webkitRequestAnimationFrame ||
// 		glob.msRequestAnimationFrame ||
// 		glob.oRequestAnimationFrame || function( callback ) {
// 			setTimeout( callback, 1 );
// 		};
// }( window );

var createTask = function( conf ){
	var object = conf.object || {};
	conf.start = conf.start || 0;
	return {
		start: conf.start + now(),
		duration: conf.duration == -1 ? 86400000 : conf.duration,
		data: conf.data ? [0].concat( conf.data ) : [0],
		started: 0,
		object: object,
		onTimeStart: conf.onTimeStart || object.onTimeStart || Ucren.nul,
		onTimeUpdate: conf.onTimeUpdate || object.onTimeUpdate || Ucren.nul,
		onTimeEnd: conf.onTimeEnd || object.onTimeEnd || Ucren.nul,
		stop: function(){
		    this.stopped = 1;
		}
	}
};

var updateTask = function( task, time ){
	var data = task.data;
	data[0] = time;
	task.onTimeUpdate.apply( task.object, data );
};

var checkStartTask = function( task ){
	if( !task.started ){
		task.started = 1;
	    task.onTimeStart.apply( task.object, task.data.slice(1) );
	    updateTask( task, 0 );
	}
};

var update = function(time){
	var i = tasks.length, t, task, start, duration, data;

	// TODO: 三八五时检查一下 tasks 有没有释放完成
	// document.title = i;

	while( i -- ){
    	task = tasks[i];
    	start = task.start;
    	duration = task.duration;

    	if( time >= start ){

    		if( task.stopped ){
    		    tasks.splice( i, 1 );
    		    continue;
    		}

	    	checkStartTask( task );
	    	if( ( t = time - start ) < duration )
	    	    updateTask( task, t );
	    	else
	    		updateTask( task, duration ),
	    		task.onTimeEnd.apply( task.object, task.data.slice(1) ),
	    		tasks.splice( i, 1 );
    	}
	}

    if( adding ){
    	tasks.unshift.apply( tasks, addingTasks );
    	addingTasks.length = adding = 0;        
    }
};