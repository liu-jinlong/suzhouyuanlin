/**
 * @name zepto.extend
 * @file ��Zepto����Щ��չ����������JS����������ļ�
 * @desc ��ZeptoһЩ��չ�������������
 * @import core/zepto.js
 */

(function($){
    $.extend($, {
        contains: function(parent, node) {
            /**
             * modified by chenluyang
             * @reason ios4 safari�£��޷��жϰ������ֽڵ�����
             * @original return parent !== node && parent.contains(node)
             */
            return parent.compareDocumentPosition
                ? !!(parent.compareDocumentPosition(node) & 16)
                : parent !== node && parent.contains(node)
        }
    });
})(Zepto);


//Core.js
;(function($, undefined) {
    //��չ��Zepto��̬����
    $.extend($, {
        /**
         * @grammar $.toString(obj)  ? string
         * @name $.toString
         * @desc toStringת��
         */
        toString: function(obj) {
            return Object.prototype.toString.call(obj);
        },

        /**
         * @desc �Ӽ����н�ȡ�������ݣ�����˵�ļ��ϣ����������飬Ҳ�����Ǹ��������ʺ���Ķ��󣬱���arguments
         * @name $.slice
         * @grammar $.slice(collection, [index])  ? array
         * @example (function(){
         *     var args = $.slice(arguments, 2);
         *     console.log(args); // => [3]
         * })(1, 2, 3);
         */
        slice: function(array, index) {
            return Array.prototype.slice.call(array, index || 0);
        },

        /**
         * @name $.later
         * @grammar $.later(fn, [when, [periodic, [context, [data]]]])  ? timer
         * @desc �ӳ�ִ��fn
         * **����:**
         * - ***fn***: ��Ҫ��ʱִ�еķ���
         * - ***when***: *��ѡ(Ĭ�� 0)* ʲôʱ���ִ��
         * - ***periodic***: *��ѡ(Ĭ�� false)* �趨�Ƿ��������Ե�ִ��
         * - ***context***: *��ѡ(Ĭ�� undefined)* �������趨������
         * - ***data***: *��ѡ(Ĭ�� undefined)* �������趨�������
         * @example $.later(function(str){
         *     console.log(this.name + ' ' + str); // => Example hello
         * }, 250, false, {name:'Example'}, ['hello']);
         */
        later: function(fn, when, periodic, context, data) {
            return window['set' + (periodic ? 'Interval' : 'Timeout')](function() {
                fn.apply(context, data);
            }, when || 0);
        },

        /**
         * @desc ����ģ��
         * @grammar $.parseTpl(str, data)  ? string
         * @name $.parseTpl
         * @example var str = "<p><%=name%></p>",
         * obj = {name: 'ajean'};
         * console.log($.parseTpl(str, data)); // => <p>ajean</p>
         */
        parseTpl: function(str, data) {
            var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' + 'with(obj||{}){__p.push(\'' + str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/<%=([\s\S]+?)%>/g, function(match, code) {
                    return "'," + code.replace(/\\'/g, "'") + ",'";
                }).replace(/<%([\s\S]+?)%>/g, function(match, code) {
                    return "');" + code.replace(/\\'/g, "'").replace(/[\r\n\t]/g, ' ') + "__p.push('";
                }).replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t') + "');}return __p.join('');";
            var func = new Function('obj', tmpl);
            return data ? func(data) : func;
        },

        /**
         * @desc ����ִ��Ƶ��, ��ε��ã���ָ����ʱ���ڣ�ֻ��ִ��һ�Ρ�
         * **options:**
         * - ***delay***: ��ʱʱ��
         * - ***fn***: ��ϡ�͵ķ���
         * - ***debounce_mode***: �Ƿ�������ģʽ, true:start, false:end
         *
         * <code type="text">||||||||||||||||||||||||| (����) |||||||||||||||||||||||||
         * X    X    X    X    X    X      X    X    X    X    X    X</code>
         *
         * @grammar $.throttle(delay, fn) ? function
         * @name $.throttle
         * @example var touchmoveHander = function(){
         *     //....
         * }
         * //���¼�
         * $(document).bind('touchmove', $.throttle(250, touchmoveHander));//Ƶ��������ÿ250ms��ִ��һ��touchmoveHandler
         *
         * //����¼�
         * $(document).unbind('touchmove', touchmoveHander);//ע��������unbind����touchmoveHander,������$.throttle���ص�function, ��Ȼunbind�Ǹ�Ҳ��һ����Ч��
         *
         */
        throttle: function(delay, fn, debounce_mode) {
            var last = 0,
                timeId;

            if (typeof fn !== 'function') {
                debounce_mode = fn;
                fn = delay;
                delay = 250;
            }

            function wrapper() {
                var that = this,
                    period = Date.now() - last,
                    args = arguments;

                function exec() {
                    last = Date.now();
                    fn.apply(that, args);
                };

                function clear() {
                    timeId = undefined;
                };

                if (debounce_mode && !timeId) {
                    // debounceģʽ && ��һ�ε���
                    exec();
                }

                timeId && clearTimeout(timeId);
                if (debounce_mode === undefined && period > delay) {
                    // throttle, ִ�е���delayʱ��
                    exec();
                } else {
                    // debounce, �����start��clearTimeout
                    timeId = setTimeout(debounce_mode ? clear : exec, debounce_mode === undefined ? delay - period : delay);
                }
            };
            // for event bind | unbind
            wrapper._zid = fn._zid = fn._zid || $.proxy(fn)._zid;
            return wrapper;
        },

        /**
         * @desc ����ִ��Ƶ��, ��ָ����ʱ����, ��ε��ã�ֻ��ִ��һ�Ρ�
         * **options:**
         * - ***delay***: ��ʱʱ��
         * - ***fn***: ��ϡ�͵ķ���
         * - ***t***: ָ�����ڿ�ʼ��ִ�У����ǽ�����ִ��, true:start, false:end
         *
         * ��at_beginģʽ
         * <code type="text">||||||||||||||||||||||||| (����) |||||||||||||||||||||||||
         *                         X                                X</code>
         * at_beginģʽ
         * <code type="text">||||||||||||||||||||||||| (����) |||||||||||||||||||||||||
         * X                                X                        </code>
         *
         * @grammar $.debounce(delay, fn[, at_begin]) ? function
         * @name $.debounce
         * @example var touchmoveHander = function(){
         *     //....
         * }
         * //���¼�
         * $(document).bind('touchmove', $.debounce(250, touchmoveHander));//Ƶ��������ֻҪ���ʱ�䲻����250ms, ��һϵ���ƶ���ֻ��ִ��һ��
         *
         * //����¼�
         * $(document).unbind('touchmove', touchmoveHander);//ע��������unbind����touchmoveHander,������$.debounce���ص�function, ��Ȼunbind�Ǹ�Ҳ��һ����Ч��
         */
        debounce: function(delay, fn, t) {
            return fn === undefined ? $.throttle(250, delay, false) : $.throttle(delay, fn, t === undefined ? false : t !== false);
        }
    });

    /**
     * ��չ�����ж�
     * @param {Any} obj
     * @see isString, isBoolean, isRegExp, isNumber, isDate, isObject, isNull, isUdefined
     */
    /**
     * @name $.isString
     * @grammar $.isString(val)  ? Boolean
     * @desc �жϱ��������Ƿ�Ϊ***String***
     * @example console.log($.isString({}));// => false
     * console.log($.isString(123));// => false
     * console.log($.isString('123'));// => true
     */
    /**
     * @name $.isBoolean
     * @grammar $.isBoolean(val)  ? Boolean
     * @desc �жϱ��������Ƿ�Ϊ***Boolean***
     * @example console.log($.isBoolean(1));// => false
     * console.log($.isBoolean('true'));// => false
     * console.log($.isBoolean(false));// => true
     */
    /**
     * @name $.isRegExp
     * @grammar $.isRegExp(val)  ? Boolean
     * @desc �жϱ��������Ƿ�Ϊ***RegExp***
     * @example console.log($.isRegExp(1));// => false
     * console.log($.isRegExp('test'));// => false
     * console.log($.isRegExp(/test/));// => true
     */
    /**
     * @name $.isNumber
     * @grammar $.isNumber(val)  ? Boolean
     * @desc �жϱ��������Ƿ�Ϊ***Number***
     * @example console.log($.isNumber('123'));// => false
     * console.log($.isNumber(true));// => false
     * console.log($.isNumber(123));// => true
     */
    /**
     * @name $.isDate
     * @grammar $.isDate(val)  ? Boolean
     * @desc �жϱ��������Ƿ�Ϊ***Date***
     * @example console.log($.isDate('123'));// => false
     * console.log($.isDate('2012-12-12'));// => false
     * console.log($.isDate(new Date()));// => true
     */
    /**
     * @name $.isObject
     * @grammar $.isObject(val)  ? Boolean
     * @desc �жϱ��������Ƿ�Ϊ***Object***
     * @example console.log($.isObject('123'));// => false
     * console.log($.isObject(true));// => false
     * console.log($.isObject({}));// => true
     */
    /**
     * @name $.isNull
     * @grammar $.isNull(val)  ? Boolean
     * @desc �жϱ��������Ƿ�Ϊ***null***
     * @example console.log($.isNull(false));// => false
     * console.log($.isNull(0));// => false
     * console.log($.isNull(null));// => true
     */
    /**
     * @name $.isUndefined
     * @grammar $.isUndefined(val)  ? Boolean
     * @desc �жϱ��������Ƿ�Ϊ***undefined***
     * @example
     * console.log($.isUndefined(false));// => false
     * console.log($.isUndefined(0));// => false
     * console.log($.isUndefined(a));// => true
     */
    $.each("String Boolean RegExp Number Date Object Null Undefined".split(" "), function( i, name ){
        var fn;

        if( 'is' + name in $ ) return;//already defined then ignore.

        switch (name) {
            case 'Null':
                fn = function(obj){ return obj === null; };
                break;
            case 'Undefined':
                fn = function(obj){ return obj === undefined; };
                break;
            default:
                fn = function(obj){ return new RegExp(name + ']', 'i').test( toString(obj) )};
        }
        $['is'+name] = fn;
    });

    var toString = $.toString;

})(Zepto);

//Support.js
(function($, undefined) {
    var ua = navigator.userAgent,
        na = navigator.appVersion,
        br = $.browser;

    /**
     * @name $.browser
     * @desc ��չzepto�ж�browser�ļ��
     *
     * **��������**
     * - ***qq*** ���qq�����
     * - ***chrome*** ���chrome�����
     * - ***uc*** ���uc�����
     * - ***version*** ���������汾
     *
     * @example
     * if ($.browser.qq) {      //��qq������ϴ����log
     *     console.log('this is qq browser');
     * }
     */
    $.extend( br, {
        qq: /qq/i.test(ua),
        uc: /UC/i.test(ua) || /UC/i.test(na)
    } );

    br.uc = br.uc || !br.qq && !br.chrome && !br.firefox && !/safari/i.test(ua);

    try {
        br.version = br.uc ? na.match(/UC(?:Browser)?\/([\d.]+)/)[1] : br.qq ? ua.match(/MQQBrowser\/([\d.]+)/)[1] : br.version;
    } catch (e) {}


    /**
     * @name $.support
     * @desc ����豸��ĳЩ���Ի򷽷���֧�����
     *
     * **��������**
     * - ***orientation*** ����Ƿ�֧��ת���¼���UC�д���orientaion����ת�����ᴥ�����¼�����UC���ڲ�֧��ת���¼�(iOS 4��qq, chrome�����������)
     * - ***touch*** ����Ƿ�֧��touch����¼�
     * - ***cssTransitions*** ����Ƿ�֧��css3��transition
     * - ***has3d*** ����Ƿ�֧��translate3d��Ӳ������
     *
     * @example
     * if ($.support.has3d) {      //��֧��3d���豸��ʹ��
     *     console.log('you can use transtion3d');
     * }
     */
    $.support = $.extend($.support || {}, {
        orientation: !(br.uc || (parseFloat($.os.version)<5 && (br.qq || br.chrome))) && !($.os.android && parseFloat($.os.version) > 3) && "orientation" in window && "onorientationchange" in window,
        touch: "ontouchend" in document,
        cssTransitions: "WebKitTransitionEvent" in window,
        has3d: 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix()
    });

})(Zepto);

//Event.js
(function($) {
    /**
     * @name $.matchMedia
     * @grammar $.matchMedia(query)  ? MediaQueryList
     * @desc ��ԭ����window.matchMedia������polyfill�����ڲ�֧��matchMedia�ķ���ϵͳ�������������[w3c window.matchMedia](http://www.w3.org/TR/cssom-view/#dom-window-matchmedia)�Ľӿ�
     * ���壬��matchMedia���������˷�װ��ԭ������css media query��transitionEnd�¼�����ɵġ���ҳ���в���media query��ʽ��Ԫ�أ���query��������ʱ�ı��Ԫ����ʽ��ͬʱ�����ʽ��transition���õ����ԣ�
     * ���������󼴻ᴥ��transitionEnd���ɴ˴���MediaQueryList���¼�����������transition��duration timeΪ0.001ms������ֱ��ʹ��MediaQueryList�����matchesȥ�жϵ�ǰ�Ƿ���queryƥ�䣬���в����ӳ٣�
     * ����ע��addListener�ķ�ʽȥ����query�ĸı䡣$.matchMedia����ϸʵ��ԭ�����ø÷���ʵ�ֵ�ת��ͳһ����������
     * [GMU Pages: ת���������($.matchMedia)](https://github.com/gmuteam/GMU/wiki/%E8%BD%AC%E5%B1%8F%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88$.matchMedia)
     *
     * **MediaQueryList�������������**
     * - ***matches*** �Ƿ�����query
     * - ***query*** ��ѯ��css query������\'screen and (orientation: portrait)\'
     * - ***addListener*** ���MediaQueryList��������������ջص��������ص�����ΪMediaQueryList����
     * - ***removeListener*** �Ƴ�MediaQueryList���������
     *
     * @example
     * $.matchMedia('screen and (orientation: portrait)').addListener(fn);
     */
    $.matchMedia = (function() {
        var mediaId = 0,
            cls = 'gmu-media-detect',
            transitionEnd = $.fx.transitionEnd,
            cssPrefix = $.fx.cssPrefix,
            $style = $('<style></style>').append('.' + cls + '{' + cssPrefix + 'transition: width 0.001ms; width: 0; position: relative; bottom: -999999px;}\n').appendTo('head');

        return function (query) {
            var id = cls + mediaId++,
                $mediaElem = $('<div class="' + cls + '" id="' + id + '"></div>').appendTo('body'),
                listeners = [],
                ret;

            $style.append('@media ' + query + ' { #' + id + ' { width: 100px; } }\n') ;   //ԭ��matchMediaҲ��Ҫ��Ӷ�Ӧ��@media������Ч
            // if ('matchMedia' in window) {
            //     return window.matchMedia(query);
            // }

            $mediaElem.on(transitionEnd, function() {
                ret.matches = $mediaElem.width() === 100;
                $.each(listeners, function (i,fn) {
                    $.isFunction(fn) && fn.call(ret, ret);
                });
            });

            ret = {
                matches: $mediaElem.width() === 100 ,
                media: query,
                addListener: function (callback) {
                    listeners.push(callback);
                    return this;
                },
                removeListener: function (callback) {
                    var index = listeners.indexOf(callback);
                    ~index && listeners.splice(index, 1);
                    return this;
                }
            };

            return ret;
        };
    }());

    $(function () {
        var handleOrtchange = function (mql) {
                if ( state !== mql.matches ) {
                    $( window ).trigger( 'ortchange' );
                    state = mql.matches;
                }
            },
            state = true;
        $.mediaQuery = {
            ortchange: 'screen and (width: ' + window.innerWidth + 'px)'
        };
        $.matchMedia($.mediaQuery.ortchange).addListener(handleOrtchange);
    });

    /**
     * @name Trigger Events
     * @theme event
     * @desc ��չ���¼�
     * - ***scrollStop*** : scrollͣ����ʱ����, ����ǰ�����ߺ��˺�scroll�¼������������
     * - ***ortchange*** : ��ת����ʱ�򴥷�������uc��������֧��orientationchange���豸������css media queryʵ�֣������ת����ʱ��orientation�¼��ļ���������
     * @example $(document).on('scrollStop', function () {        //scrollͣ����ʱ��ʾscrollStop
     *     console.log('scrollStop');
     * });
     *
     * $(window).on('ortchange', function () {        //��ת����ʱ�򴥷�
     *     console.log('ortchange');
     * });
     */
    /** dispatch scrollStop */
    function _registerScrollStop(){
        $(window).on('scroll', $.debounce(80, function() {
            $(document).trigger('scrollStop');
        }, false));
    }
    //���뿪ҳ�棬ǰ������˻ص�ҳ������°�scroll, ��Ҫoff�����е�scroll������scrollʱ�䲻����
    function _touchstartHander() {
        $(window).off('scroll');
        _registerScrollStop();
    }
    _registerScrollStop();
    $(window).on('pageshow', function(e){
        if(e.persisted) {//����Ǵ�bfcache�м���ҳ��
            $(document).off('touchstart', _touchstartHander).one('touchstart', _touchstartHander);
        }
    });
})(Zepto);

