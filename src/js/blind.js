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
    this.dots = options.dots && true;
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
    // 区分是否为手动操作
    let clickWork = false;
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
            dotsHtml += `<div data-num="${i}"><span></span></div>`;
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
        // 更改动画进行的阈值
        blindAnimation = true;

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
        // 更新导航点
        this.dotsPosition(num);
        // 计算出最后最后一个动画结束的时间然后执行回掉函数
        let lastBlindPic = this.blindEvent.eq((this.bladeNum - 1));
        let lastTime = this.bladeTime * this.bladeNum + this.animationSpeed;
        setTimeout(function() {
            than.blindEvent.css({'transition': 'none'});
            than.setA(num);
            blindPic.css('z-index', '1');
            than.blindEvent.css({'width': '0px'});
            // 更改动画进行的阈值
            blindAnimation = false;
            // 检查当前是否为手动状态
            if(clickWork && than.autoPlay){
                clickWork = false;
                than.autoPlayFun();
            }
        }, lastTime);
    }

    // 切换图片
    this.switchBlade = function(bool) {
        if(!blindAnimation) {
            // 更改当前状态为手动操作
            clickWork = true;
            // 停止自动播放并进入切换
            window.clearTimeout(clearGlobal);
            this.animationStart(than.countPosition(bool));
        }
    }

    // 按钮的控制
    this.buttonClickFun = function() {
        // 上一张
        $('#blindPrev').click(function() {
            than.switchBlade(false);
        });
        // 下一张
        $('#blindNext').click(function() {
            than.switchBlade(true);
        });
        // 任选一张
        $('.dots-box').children('div').click(function() {
            than.switchBlade($(this).data('num'));
        });
    }

    // 更新导航点
    this.dotsPosition = function(num) {
        if(this.dots){
            $('.dots-box').children('div').eq(num).addClass('active').siblings('div').removeClass('active');
        }   
    }

    // 计算轮播当前位置
    this.countPosition = function(e) {
        // 判断传进来的参数是否为布尔值
        if(typeof e == 'boolean'){
            // 判断true则是下一页
            if(e){
                if(blindPosition >= (this.arr.length - 1)){
                    blindPosition = -1;
                }
                blindPosition ++;
            }else{
            // 判断false则是上一页
                if(blindPosition <= 0){
                    blindPosition = this.arr.length;
                }
                blindPosition --;
            }
        }else{
            // 如果传进来的是数字就直接返回数字
            blindPosition = e;
        }
        
        return blindPosition;
    }
    
    // 鼠标置入停止轮播
    this.mouseFun = function() {
        if(this.mouseUp) {
            $('#blindSwiper').mouseenter(function() {
                if(than.autoPlay){
                    window.clearTimeout(clearGlobal);
                }
            }).mouseleave(function() {
                if(than.autoPlay){
                    than.autoPlayFun();
                }
            });
        }
    }

    // 自动播放
    this.autoPlayFun = function() {
        if(this.autoPlay) {
            (function autoPlayFunN() {
                clearGlobal = window.setTimeout(function() {
                    than.animationStart(than.countPosition(true));
                    autoPlayFunN();
                }, than.animationTime);
            })();
        }
    }

    this.init = function() {
        // 判断输入数组是否符合规范
        if(this.arr.length <= 2){
            console.log('数组长度不够，请确认后再次运行！');
            return;
        }
        for(let i = 0; i < this.arr.length; i++){
            if(this.arr[i][0] == ''){
                console.log('数组第'+(i + 1)+'段有空白图片！');
                return;
            }
            if(this.arr[i].length !== 3){
                console.log('数组不符合规范，请检查后重试！');
                return;
            }
        }
        // 判断是否显示导航点和控制器
        if(!this.dots){
            $('#blind-control').remove();
        }
        this.css();
        this.autoPlayFun();
        this.buttonClickFun();
        this.mouseFun();
    }

    this.init();
}