var blind = function (options) {
    // autoplay
    this.autoPlay = options.autoPlay && true;
    // 数组
    this.arr = options.arr;
    // 叶片的数量
    this.bladeNum = options.bladeNum || 5;
    // 鼠标置入停止
    this.mouseUp = options.mouseUp || false;
    // 图片滚动的速度
    this.animationSpeed = options.animationSpeed || 500;
    // 每个叶片滚动相隔时间
    this.bladeTime = options.bladeTime || 100;
    // 图片滚动的间隔时间
    this.animationTime = options.animationTime || 2000;
    // 是否显示控制器
    this.dots = options.dots || true;
    // 定义叶片的DOM结构
    this.blindEvent;
    // 重新更改this指针指向
    let than = this;
    // 单个叶片的宽度定义
    let blindWidth;
    // 当前轮播的位置定义
    let blindPosition = 0;
    // 当前是否有动画在播放
    let blindAnimation = false;
    // 全局的定时器停止
    let clearGlobal;

    // 默认css和DOM结构的定义
    this.css = function() {
        // 循环出DOM结构
        let dotsHtml = '',
            bladeHtml = '';
        for(let i = 0; i < this.bladeNum; i ++){
            bladeHtml += `<div class="blade"><div class="blade-change"></div></div>`;
        }
        for(let i = 0; i < this.arr.length; i ++){
            dotsHtml += `<div><span></span></div>`;
        }
        $(dotsHtml).appendTo('.dots-box');
        $(bladeHtml).appendTo('.blind-pic');
        // 给第一个导航点添加选中样式
        $('.dots-box').children('div:eq(0)').addClass('active');
        // 设置滚动部位样式
        this.blindEvent = $('.blind-pic').children('div.blade');
        this.setBlindWidth();
        this.resizeWindowsSize();
        this.setA(0);
    }

    // 监听动画结束 - 辅助性函数
    this.animateEnd = function (event, fun) {
        function transitionSonEnd() {
            fun();
            event.off('transitionend',transitionSonEnd);
        }
        event.on('transitionend',transitionSonEnd);
    }

    // 设置背景图片
    this.setBg = function(num) {
        for(let i = 0; i < this.bladeNum; i++) {
            this.blindEvent.eq(i).children('div.blade-change').css('background-image', 'url('+ this.arr[num][0] +')');
        }
    }

    // 设置顶部a标签的内容
    this.setA = function(num) {
        $('.blind-url').attr({'title': this.arr[num][1],'href': this.arr[num][2]});
        $('.blind-url').css('background-image', 'url('+ this.arr[num][0] +')');
    }

    // 初始时和拖动窗口的时候设置单个叶片的宽度
    this.setBlindWidth = function() {
        // 计算出单个叶片的宽度和总体框体的宽度
        let allWidth = $('#blindSwiper').width();
        blindWidth = allWidth / this.bladeNum;
        // 设置单个叶片的宽度单个叶片内的图片宽度
        this.blindEvent.children('div.blade-change').css('width', allWidth);
        // 循环设置单个叶片的left值和单个叶片内的图片left值
        for(let i = 0; i < this.bladeNum; i ++){
            this.blindEvent.eq(i).css({'left': ''+ (blindWidth * i) +'px'});
            this.blindEvent.children('div.blade-change:eq('+i+')').css('left', -(blindWidth * i) +'px');
        }
    }

    // 改变窗口大小
    this.resizeWindowsSize = function() {
        $(window).resize(function() {
            than.setBlindWidth();
        });
    }

    // 执行动画
    this.animationStart = function(num) {
        let blindPic = $('.blind-pic');
        blindPic.css('z-index', '3');
        // 改变单个叶片的背景图
        this.setBg(num);
        // 先设置动画和延迟
        for(let i = 0; i < this.bladeNum; i ++){
            this.blindEvent.eq(i).css({'transition': 'width '+this.animationSpeed+'ms ease '+(i * this.bladeTime)+'ms'});
        }
        // 设置宽度 - 这里会出现动画效果
        setTimeout(function() {
            than.blindEvent.css({'width': ''+blindWidth+'px'});
        }, 10);
        
        // 计算出最后最后一个动画结束的时间然后执行回掉函数
        let lastBlindPic = this.blindEvent.eq((this.bladeNum - 1));
        let lastTime = this.bladeTime * this.bladeNum + this.animationSpeed;
        setTimeout(function() {
            than.blindEvent.css({'transition': 'none'});
            than.setA(num);
            blindPic.css('z-index', '1');
            than.blindEvent.css({'width': '0px'});
        }, lastTime);
        // let lastNum = num;
        // this.animateEnd(lastBlindPic, function() {
        //     than.setA(lastNum);
        //     blindPic.css('z-index', '1');
        //     than.blindEvent.css({'width': '0px'});
        // });
    }

    // 计算轮播当前位置
    this.countPosition = function() {
        if(blindPosition >= (this.arr.length - 1)){
            blindPosition = -1;
        }
        blindPosition ++;
        return blindPosition;
    }

    // 自动播放
    this.autoPlayFun = function() {
        if(this.autoPlay) {
            (function autoPlayFunN() {
                clearGlobal = window.setTimeout(function() {
                    than.animationStart(than.countPosition());
                    autoPlayFunN();
                }, than.animationTime);
            })();
        }
    }

    this.init = function() {
        this.css();
        this.autoPlayFun();
    }

    this.init();
}