$(function(){
//����ͼ
    TouchSlide({
        slideCell:"#slideBox",
        titCell:".hd ul", //�����Զ���ҳ autoPage:true ����ʱ���� titCell Ϊ����Ԫ�ذ�����
        mainCell:".bd ul",
        effect:"leftLoop",
        autoPage:true,//�Զ���ҳ
        autoPlay:true //�Զ�����
    });
    TouchSlide({
        slideCell:"#slideBox1",
        titCell:".hd ul", //�����Զ���ҳ autoPage:true ����ʱ���� titCell Ϊ����Ԫ�ذ�����
        mainCell:".bd ul",
        effect:"leftLoop",
        autoPage:true,//�Զ���ҳ
        autoPlay:true //�Զ�����
    });
    $.fn.extend({click:"tap"});
    var click = "tap";//�ж��Ƿ�֧��tap��click�¼�
    if (!navigator.userAgent.match(/mobile/i)) {
        click = "click";
    }
    $.fn.extend({
        click:click
    });



})/**
 * Created by 7 on 2016/8/12.
 */
