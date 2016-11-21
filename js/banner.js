$(function(){
//焦点图
    TouchSlide({
        slideCell:"#slideBox",
        titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
        mainCell:".bd ul",
        effect:"leftLoop",
        autoPage:true,//自动分页
        autoPlay:true //自动播放
    });
    TouchSlide({
        slideCell:"#slideBox1",
        titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
        mainCell:".bd ul",
        effect:"leftLoop",
        autoPage:true,//自动分页
        autoPlay:true //自动播放
    });
    $.fn.extend({click:"tap"});
    var click = "tap";//判断是否支持tap或click事件
    if (!navigator.userAgent.match(/mobile/i)) {
        click = "click";
    }
    $.fn.extend({
        click:click
    });



})/**
 * Created by 7 on 2016/8/12.
 */
