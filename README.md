# blindScroll - 百叶窗轮播图

## 简介
<img src="./src/images/d.gif">

- 里面的动画大多是用CSS3写的，所以只兼容chrome等现代浏览器
- 基于jQuery
- 不要破坏下面的HTML结构，类名不可更改
- 预览地址：http://zytao.cc/demo/blindScroll/


## html结构
```
    <div id="blindSwiper">
        <a class="blind-url" href=""></a>
        <div class="blind-pic"></div>
        <div id="blind-control">
            <div class="blindpn" id="blindPrev"><span></span></div>
            <div class="dots-box"></div>
            <div class="blindpn" id="blindNext"><span></span></div>
        </div>
    </div>
```
  

## 用法
- 需要引入index.js和index.css
- arr为必须项
```
    let blindBox = new blind ({
        arr: blindArray
    });
```
以下为arr数组的结构
- 数组三项分别为：['图片路径','图片描述','跳转链接']
- blindArray的长度至少为2
- 数组内的三项为必须，除图片外，其他两项可以为空
- 如果插件没有正常运行请检查控制台是否有arr有误的提示
```
    let blindArray = [
        ['./src/images/1.jpg', '小行星', 'javascript:;'],
        ['./src/images/2.jpg', '红枫叶', 'javascript:;'],
        ['./src/images/3.jpg', '璀璨星空', 'javascript:;'],
        ['./src/images/4.jpg', '回家', 'javascript:;'],
        ['./src/images/5.jpg', '动物喝水', 'javascript:;'],
        ['./src/images/6.jpg', '山清水秀', 'javascript:;']
    ];
```
  
  
## API
api  | 类型 | 默认值 | 备注
---- | --- | --- | --- 
autoPlay | boolean | true | 是否开启自动播放
bladeNum |  number | 5 | 定义叶片的数量
mouseUp |  boolean | false | 鼠标放置到案例上停止自动播放
animationSpeed |  number | 500 | 图片滚动的速度（毫秒）
bladeTime |  number | 100 | 每个叶片滚动的相隔时间（毫秒）
animationTime |  number | 2000 | 每张图片切换的相隔时间（毫秒）
dots |  boolean | true | 是否显示控制器按钮
  
  
  
## 方法
方法 | 类型 | 默认值 | 备注
---- | --- | --- | --- 
blindBox.next(); | / | / | 切换至下一张图片
blindBox.prev(); | / | / | 切换至上一张图片
blindBox.dots(num); | number | / | 切换至指定图片（下标从0开始）
  
  
## 回调函数
```
    let blindBox = new blind ({
        arr: blindArray,
        callback: function(num) {
            console.log('返回当前是第多少页');
        }
    });
```