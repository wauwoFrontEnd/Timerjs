//IE9以下有兼容问题


var Timer = function(interval, obj){
	"use strict";
	
	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback){
			window.setTimeout(callback, 1000 / 60);
		};
	})();
	
	var count = 0,
		
		delay = 0,
		pause = true,
		
		onProgress,
		onPlay,
		onPause,
		onStop,
		
		timerfn,
		stepfn;
	
	interval = interval * 60 || 1;
	if(obj){
		onProgress = obj.onProgress || null;
		onPlay = obj.onPlay || null;
		onPause = obj.onPause || null;
		onStop = obj.onStop || null;
	}
	
	var timer = function(){
		if(pause){
			return;
		}
		if(count % interval === 0){
			onProgress(count / 60);
		}
		count ++;
		
		timerfn = requestAnimFrame(function(){
			timer();
		});
	};
	
	var clearfn = function(val){
		if(window.cancelAnimationFrame){
			cancelAnimationFrame(val);
		}else{
			clearTimeout(val);
		}
	};
	
	//时间间隔
	this.interval = function(val){
		interval = val || interval;
	};
	
	//开始，继续
	this.play = function(){
		var dfn,
			delayfn = function(d){
			d = d || 0;
			if(d <= 0){
				pause = false;
				onPlay();
				timer();
				
				clearfn(dfn);
				dfn = null;
				return;
			}
				d --;
			dfn = requestAnimFrame(function(){
				delayfn(d);
			});
		};
		delayfn(delay);
	};
	
	//暂停
	this.pause = function(){
		var dfn,
			delayfn = function(d){
			d = d || 0;
			if(d <= 0){
				pause = true;
				clearfn(timerfn);
				onPause();
				
				clearfn(dfn);
				dfn = null;
				return;
			}
				d --;
			dfn = requestAnimFrame(function(){
				delayfn(d);
			});
		};
		delayfn(delay);
	};
	
	//停止
	this.stop = function(){
		var dfn,
			delayfn = function(d){
			d = d || 0;
			if(d <= 0){
				pause = true;
				count = 0;
				clearfn(timerfn);
				onStop();
				
				clearfn(dfn);
				dfn = null;
				return;
			}
				d --;
			dfn = requestAnimFrame(function(){
				delayfn(d);
			});
		};
		delayfn(delay);
	};
	
	//延迟
	this.delay = function(val){
		delay = val * 60 || delay;
		return this;
	};
	
	//清除
	this.clear = function(){
		timer = null;
	};
	
	this.on = function(type, fn){
		if(type === 'progress'){
			onProgress = fn;
		}else if(type === 'play'){
			onPlay = fn;
		}else if(type === 'pause'){
			onPause = fn;
		}else if(type === 'stop'){
			onStop = fn;
		}
	};
};