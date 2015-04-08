/* 
 * author : fang yongbao
 * data : 2014.07.14
 * model : 刮刮乐模块
 * info ：知识在于积累，每天一小步，成功永远属于坚持的人。
 */

/*
 *
 * @param {type} option
 * {
 *   @param node: document.getElementById("scretch"),
 *   @param width: 520,
 *   @param height: 520,
 *   @param backImgSrc: "images/backimage1.jpg",
 *   @param frontImgSrc: "images/backimage2.jpg",
 *   @param percentPar: 10, //1-100表示
 *   @param backFun: "backFun"
 * }
 *
 */
function Scretch(option) {

	this.mouseDown = false;
	this.percentPar = option.percentPar;

	/***********回调函数*********/
	this.backFun = option.backFun;

	/***********宽高*********/
	this.width = option.width;
	this.height = option.height;

	/******蒙版和背景类别（text，img， color）******************/
	this.backImgType = option.backImgType;
	this.frontImgType = option.frontImgType;

	/***********蒙版和背景图片*********/
	this.backImgSrc = option.backImgSrc;
	this.frontImgSrc = option.frontImgSrc;


	/***********定义外出样式*********/
	this.parentNode = option.node;
	this.parentNode.style.width = this.width + "px";
	this.parentNode.style.height = this.height + "px";

	this.init();

}

Scretch.prototype = {
	init: function() {

		//mainCanvas;
		this.mainCanvas = this.createElement("canvas", {
			style: "position:absolute;width:100%;heigth:0;left:0;top:0;right:0;bottom:0;z-index:20;background-color:transparent;"
		});
		this.mainCtx = this.mainCanvas.getContext("2d");
		this.mainCanvas.width = this.width;
		this.mainCanvas.height = this.height;

		//backCanvas;
		this.backCanvas = this.createElement("canvas", {
			style: "position:absolute;width:100%;heigth:0;left:0;top:0;right:0;bottom:0;z-index:1;background-color:transparent;"
		});
		this.backCtx = this.backCanvas.getContext("2d");
		this.backCanvas.width = this.width;
		this.backCanvas.height = this.height;

		this.parentNode.appendChild(this.mainCanvas);
		this.parentNode.appendChild(this.backCanvas);

		//绑定事件
		this.bindEvent();

		//加载蒙版
		this.loadfrontImg();





	},
	// 创建元素
	createElement: function(tagName, attributes) {
		var ele = document.createElement(tagName);
		for (var key in attributes) {
			ele.setAttribute(key, attributes[key]);
		}
		return ele;
	},
	loadbackImg: function() {

		var backImgType = this.backImgType;
		var _this = this;

		if (backImgType == "text") {
			_this.backCtx.font = "16px Georgia";
			_this.backCtx.fillStyle = "#000000";
			_this.backCtx.fillText(_this.backImgSrc, 40, 25);
			
		} else if (backImgType == "img") {
			var backImgObj = new Image();
			var _this = this;
			backImgObj.onload = function() {
				_this.backCtx.drawImage(this, 0, 0, _this.width, _this.height);

			};
			backImgObj.src = _this.backImgSrc;
			//this.backCanvas.style.zIndex = (this.backCanvas.style.zIndex == 1) ? 2 : 1;
		}





	},
	loadfrontImg: function() {

		var frontImgType = this.frontImgType;
		var _this = this;

		if (frontImgType == "text") {
			_this.mainCtx.fillStyle = "#cccccc";
			_this.mainCtx.fillRect(0, 0, _this.width, _this.height);
			_this.mainCtx.font = "16px Georgia";
			_this.mainCtx.fillStyle = "#ffffff";
			_this.mainCtx.fillText(_this.frontImgSrc, 40, 25);
			_this.mainCtx.globalCompositeOperation = 'destination-out';
			//加载背景
			_this.loadbackImg();
			
		} else if (frontImgType == "img") {
			var frontImgObj = new Image();
			frontImgObj.onload = function() {

				_this.resetCanvas();
				_this.mainCtx.drawImage(this, 0, 0, _this.width, _this.height);
				_this.mainCtx.globalCompositeOperation = 'destination-out';

				//加载背景
				_this.loadbackImg();

			};
			frontImgObj.src = _this.frontImgSrc;
			//this.mainCanvas.style.zIndex = (this.mainCanvas.style.zIndex == 20) ? 21 : 20;
		}


	},
	bindEvent: function() {
		var _this = this;
		var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
		var mousedown = device ? 'touchstart' : 'mousedown';
		var mousemove = device ? 'touchmove' : 'mousemove';
		var mouseup = device ? 'touchend' : 'mouseup';

		this.mainCanvas.addEventListener(mousedown, function(ev) {
			_this.mousedown_handler(ev, _this);
		}, false);
		this.mainCanvas.addEventListener(mousemove, function(ev) {
			_this.mousemove_handler(ev, _this);
		}, false);
		this.mainCanvas.addEventListener(mouseup, function(ev) {
			_this.mouseup_handler(ev, _this);
		}, false);
	},
	getLocalCoords: function(ev) {
		var elem = this.mainCanvas;
		var ox = 0,
			oy = 0;
		var first;
		var pageX, pageY;
		while (elem !== null) {
			ox += elem.offsetLeft;
			oy += elem.offsetTop;
			elem = elem.offsetParent;
		}
		if (ev.hasOwnProperty('changedTouches')) {
			first = ev.changedTouches[0];
			pageX = first.pageX;
			pageY = first.pageY;
		} else {
			pageX = ev.pageX;
			pageY = ev.pageY;
		}
		return {
			'x': pageX - ox,
			'y': pageY - oy
		};
	},
	scratchLine: function(x, y, fresh) {
		//定义画笔样式
		//var gradient = this.mainCtx.createLinearGradient(0, 0, this.width, 0);
		//gradient.addColorStop(0, 'rgba(0,0,0,0.6)');
		//gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
		//this.mainCtx.lineWidth = 1;
		//this.mainCtx.lineCap = this.mainCtx.lineJoin = 'round';
		//this.mainCtx.strokeStyle = this.gradient;

		this.mainCtx.lineWidth = 4;
		this.mainCtx.lineCap = this.mainCtx.lineJoin = 'round';

		if (fresh) {
			this.mainCtx.beginPath();
			this.mainCtx.moveTo(x + 0.01, y);
		}
		this.mainCtx.lineTo(x, y);
		this.mainCtx.stroke();
		this.mainCanvas.style.zIndex = (this.mainCanvas.style.zIndex == 20) ? 21 : 20;

	},
	mousedown_handler: function(ev, _this) {
		ev.preventDefault();
		var local = _this.getLocalCoords(ev);
		_this.mouseDown = true;
		_this.scratchLine(local.x, local.y, true);

	},
	mousemove_handler: function(ev, _this) {
		ev.preventDefault();
		if (!_this.mouseDown) {
			return;
		}
		var local = _this.getLocalCoords(ev);
		_this.scratchLine(local.x, local.y, false);
		if (_this.getTransparentPercent(_this.mainCtx, _this.width, _this.height) > _this.percentPar) {
		        _this.backFun();
		}

	},
	mouseup_handler: function(ev, _this) {
		ev.preventDefault();
		if (_this.mouseDown) {
			_this.mouseDown = false;
			
			

		}

	},
	// 获取当前canvas透明像素的百分比
	getTransparentPercent: function(ctx, width, height) {
		// 获取画布的像素点
		var imgData = ctx.getImageData(0, 0, width, height),
			pixles = imgData.data,
			transPixs = [];

		// 计算画布中，透明程度（第四个值为透明度0-255）
		for (var i = 0, j = pixles.length; i < j; i += 4) {
			var a = pixles[i + 3];
			if (a < 128) {
				transPixs.push(i);
			}
		}
		return ((transPixs.length / (pixles.length / 4) * 100).toFixed(2));

	},
	// 重置画布
	resetCanvas: function() {
		this.mainCanvas.width = this.width;
		this.mainCanvas.height = this.height;
		this.mainCtx.clearRect(0, 0, this.width, this.height);
	}
};