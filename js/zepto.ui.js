/**
 * @file ����UI����Ļ��࣬ͨ�������Լ򵥵Ŀ��ٵĴ����µ������
 * @name zepto.ui
 * @short zepto.ui
 * @desc ����UI����Ļ��࣬ͨ�������Լ򵥵Ŀ��ٵĴ����µ������
 * @import core/zepto.js, core/zepto.extend.js
 */
(function($, undefined) {
    var id = 1,
        _blankFn = function(){},
        tpl = '<%=name%>-<%=id%>',
        record = (function(){
            var data = {},
                id = 0,
                iKey = "GMUWidget"+(+ new Date()); //internal key.

            return function( obj, key, val){
                var dkey = obj[ iKey ] || ( obj[ iKey ] = ++id ),
                    store = data[dkey] || (data[dkey] = {});

                !$.isUndefined(val) && (store[key] = val);
                $.isNull(val) && delete store[key];

                return store[ key ];
            }
        })();

    $.ui = $.ui || {
            version: '2.0.5',

            guid: _guid,

            /**
             * @name $.ui.define
             * @grammar $.ui.define(name, data[, superClass]) ? undefined
             * @desc �������,
             * - ''name'' �������
             * - ''data'' �������ô������prototype������������Ի򷽷�
             * - ''superClass'' ���ָ࣬������������ĸ����������Ĭ��ΪWidget����
             * **ʾ��:**
             * <code type="javascript">
             * $.ui.define('helloworld', {
         *     _data: {
         *         opt1: null
         *     },
         *     enable: function(){
         *         //...
         *     }
         * });
             * </code>
             *
             * **������󣬾Ϳ���ͨ�����·�ʽʹ����**
             *<code type="javascript">
             * var instance = $.ui.helloworld({opt1: true});
             * instance.enable();
             *
             * //����
             * $('#id').helloworld({opt1:true});
             * //...later
             * $('#id').helloworld('enable');
             * </code>
             *
             * **Tips**
             * 1. ͨ��Zepto�����ϵ��������������ֱ��ʵ�������, ��: $('#btn').button({label: 'abc'});
             * 2. ͨ��Zepto�����ϵ���������������ַ���this, ���Ի�����ʵ�����磺var btn = $('#btn').button('this');
             * 3. ͨ��Zepto�����ϵ��������������ֱ�ӵ��������������һ����������ָ����������֮��Ĳ�����Ϊ������������: $('#btn').button('setIcon', 'home');
             * 4. �������У��縲д��ĳ�������������ڷ�����ͨ��this.$super()�������ø����������磺this.$super('enable');
             */
            define: function(name, data, superClass) {
                if(superClass) data.inherit = superClass;
                var Class = $.ui[name] = _createClass(function(el, options) {
                    var obj = _createObject(Class.prototype, {
                        _id: $.parseTpl(tpl, {
                            name: name,
                            id: _guid()
                        })
                    });

                    obj._createWidget.call(obj, el, options,Class.plugins);
                    return obj;
                }, data);
                return _zeptoLize(name, Class);
            },

            /**
             * @name $.ui.isWidget()
             * @grammar $.ui.isWidget(obj) ? boolean
             * @grammar $.ui.isWidget(obj, name) ? boolean
             * @desc �ж�obj�ǲ���widgetʵ��
             *
             * **����**
             * - ''obj'' ���ڼ��Ķ���
             * - ''name'' ��ѡ��Ĭ�ϼ���ǲ���''widget''(����)��ʵ�������Դ������������''button''�����ý���Ϊobj�ǲ���button���ʵ����
             * @param obj
             * @param name
             * @example
             *
             * var btn = $.ui.button(),
             *     dialog = $.ui.dialog();
             *
             * console.log($.isWidget(btn)); // => true
             * console.log($.isWidget(dialog)); // => true
             * console.log($.isWidget(btn, 'button')); // => true
             * console.log($.isWidget(dialog, 'button')); // => false
             * console.log($.isWidget(btn, 'noexist')); // => false
             */
            isWidget: function(obj, name){
                return obj instanceof (name===undefined ? _widget: $.ui[name] || _blankFn);
            }
        };

    /**
     * generate guid
     */
    function _guid() {
        return id++;
    };

    function _createObject(proto, data) {
        var obj = {};
        Object.create ? obj = Object.create(proto) : obj.__proto__ = proto;
        return $.extend(obj, data || {});
    }

    function _createClass(Class, data) {
        if (data) {
            _process(Class, data);
            $.extend(Class.prototype, data);
        }
        return $.extend(Class, {
            plugins: [],
            register: function(fn) {
                if ($.isObject(fn)) {
                    $.extend(this.prototype,fn);
                    return;
                }
                this.plugins.push(fn);
            }
        });
    }

    /**
     * handle inherit & _data
     */
    function _process(Class, data) {
        var superClass = data.inherit || _widget,
            proto = superClass.prototype,
            obj;
        obj = Class.prototype = _createObject(proto, {
            $factory: Class,
            $super: function(key) {
                var fn = proto[key];
                return $.isFunction(fn) ? fn.apply(this, $.slice(arguments, 1)) : fn;
            }
        });
        obj._data = $.extend({}, proto._data, data._data);
        delete data._data;
        return Class;
    }

    /**
     * ǿ��setupģʽ
     * @grammar $(selector).dialog(opts);
     */
    function _zeptoLize( name ) {
        $.fn[ name ] = function(opts) {
            var ret,
                obj,
                args = $.slice(arguments, 1);

            $.each( this, function( i, el ){

                obj = record( el, name ) || $.ui[name]( el, $.extend( $.isPlainObject(opts) ? opts : {}, {
                        setup: true
                    } ) );
                if ($.isString( opts )) {
                    if (!$.isFunction( obj[ opts ] ) && opts !== 'this') {
                        throw new Error(name + '���û�д˷���');    //������ȡ�����ǣ��׳�������Ϣ
                    }
                    ret = $.isFunction( obj[ opts ] ) ? obj[opts].apply(obj, args) : undefined;
                }
                if( ret !== undefined && ret !== obj || opts === "this" && ( ret = obj ) ) {
                    return false;
                }
                ret = undefined;
            });
            //ret Ϊ�����Ҫ����uiʵ��֮�������
            //obj 'this'ʱ����
            //�������Ƿ���zeptoʵ��
            //�޸ķ���ֵΪ�յ�ʱ������ֵ���Ե�����
            return ret !== undefined ? ret : this;
        };
    }
    /**
     * @name widget
     * @desc GMU���е�������Ǵ�������࣬�����´�������ķ��������������齨�е��á�
     */
    var _widget = function() {};
    $.extend(_widget.prototype, {
        _data: {
            status: true
        },

        /**
         * @name data
         * @grammar data(key) ? value
         * @grammar data(key, value) ? value
         * @desc ���û��߻�ȡoptions, ��������е����������ͨ���˷����õ���
         * @example
         * $('a#btn').button({label: '��ť'});
         * console.log($('a#btn').button('data', 'label'));// => ��ť
         */
        data: function(key, val) {
            var _data = this._data;
            if ($.isObject(key)) return $.extend(_data, key);
            else return !$.isUndefined(val) ? _data[key] = val : _data[key];
        },

        /**
         * common constructor
         */
        _createWidget: function(el, opts,plugins) {

            if ($.isObject(el)) {
                opts = el || {};
                el = undefined;
            }

            var data = $.extend({}, this._data, opts);
            $.extend(this, {
                _el: el ? $(el) : undefined,
                _data: data
            });

            //����plugins
            var me = this;
            $.each( plugins, function( i, fn ){
                var result = fn.apply( me );
                if(result && $.isPlainObject(result) ){
                    var plugins = me._data.disablePlugin;
                    if( !plugins || $.isString(plugins) && !~plugins.indexOf(result.pluginName) ){
                        delete result.pluginName;
                        $.each(result,function( key, val ){
                            var orgFn;
                            if((orgFn = me[key]) && $.isFunction( val ) ){
                                me[key] = function(){
                                    me[key + 'Org'] = orgFn;
                                    return val.apply(me,arguments);
                                }
                            }else
                                me[key] = val;
                        });
                    }
                }
            });
            // use setup or render
            if(data.setup) this._setup(el && el.getAttribute('data-mode'));
            else this._create();
            this._init();

            var me = this,
                $el = this.trigger('init').root();
            $el.on('tap', function(e) {
                (e['bubblesList'] || (e['bubblesList'] = [])).push(me);
            });

            record( $el[0], me._id.split('-')[0], me );
        },

        /**
         * @interface: use in render mod
         * @name _create
         * @desc �ӿڶ��壬��������Ҫ����ʵ�ִ˷������˷�����renderģʽʱ�����á�
         *
         * ��ν��render��ʽ������ͨ�����·�ʽ��ʼ�����
         * <code>
         * $.ui.widgetName(options);
         * </code>
         */
        _create: function() {},

        /**
         * @interface: use in setup mod
         * @name _setup
         * @desc �ӿڶ��壬��������Ҫ����ʵ�ִ˷������˷�����setupģʽʱ�����á���һ���в������ֱ�ʱfullsetup������setup
         *
         * <code>
         * $.ui.define('helloworld', {
         *     _setup: function(mode){
         *          if(mode){
         *              //Ϊfullsetupģʽ
         *          } else {
         *              //Ϊsetupģʽ
         *          }
         *     }
         * });
         * </code>
         *
         * ��ν��setup��ʽ����������dom��Ȼ��ͨ��ѡ��������ʼ��Zepto����Zepto����ֱ�ӵ������������ʵ�����������
         * <code>
         * //<div id="widget"></div>
         * $('#widget').widgetName(options);
         * </code>
         *
         * ���������ʼ����element��������data-mode="true"���������fullsetupģʽ��ʼ��
         */
        _setup: function(mode) {},

        /**
         * @name root
         * @grammar root() ? value
         * @grammar root(el) ? value
         * @desc ���û��߻�ȡ���ڵ�
         * @example
         * $('a#btn').button({label: '��ť'});
         * console.log($('a#btn').button('root'));// => a#btn
         */
        root: function(el) {
            return this._el = el || this._el;
        },

        /**
         * @name id
         * @grammar id() ? value
         * @grammar id(id) ? value
         * @desc ���û��߻�ȡ���id
         */
        id: function(id) {
            return this._id = id || this._id;
        },

        /**
         * @name destroy
         * @grammar destroy() ? undefined
         * @desc ע�����
         */
        destroy: function() {
            var me = this,
                $el;
            $el = this.trigger('destroy').off().root();
            $el.find('*').off();
            record( $el[0], me._id.split('-')[0], null);
            $el.off().remove();
            this.__proto__ = null;
            $.each(this, function(key) {
                delete me[key];
            });
        },

        /**
         * @name on
         * @grammar on(type, handler) ? instance
         * @desc ���¼������¼��󶨲�ͬ��zepto�ϰ��¼�����On��thisֻ�����ʵ��������zeptoʵ��
         */
        on: function(ev, callback) {
            this.root().on(ev, $.proxy(callback, this));
            return this;
        },

        /**
         * @name off
         * @grammar off(type) ? instance
         * @grammar off(type, handler) ? instance
         * @desc ����¼�
         */
        off: function(ev, callback) {
            this.root().off(ev, callback);
            return this;
        },

        /**
         * @name trigger
         * @grammar trigger(type[, data]) ? instance
         * @desc �����¼�, ��trigger�����Ȱ�options�ϵ��¼��ص�������ִ�У�Ȼ�����DOM�����¼���
         * options�ϻص���������ͨ��e.preventDefaualt()����֯�¼��ɷ���
         */
        trigger: function(event, data) {
            event = $.isString(event) ? $.Event(event) : event;
            var onEvent = this.data(event.type),result;
            if( onEvent && $.isFunction(onEvent) ){
                event.data = data;
                result = onEvent.apply(this, [event].concat(data));
                if(result === false || event.defaultPrevented){
                    return this;
                }
            }
            this.root().trigger(event, data);
            return this;
        }
    });
})(Zepto);
