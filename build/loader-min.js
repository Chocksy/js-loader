

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());


//@codekit-prepend "json2.js"
//@codekit-append "loader-code.js"


// Generated by CoffeeScript 1.8.0

/*
Copyright (c) 2012 James Frasca

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */


/*
A self-contained modal library
 */

(function() {
  window.picoModal = (function(window, document) {
    "use strict";
    var cssNumber, make, observable, overlay;
    cssNumber = {
      "columnCount": true,
      "fillOpacity": true,
      "flexGrow": true,
      "flexShrink": true,
      "fontWeight": true,
      "lineHeight": true,
      "opacity": true,
      "order": true,
      "orphans": true,
      "widows": true,
      "zIndex": true,
      "zoom": true
    };
    observable = function() {
      var callbacks;
      callbacks = [];
      return {
        watch: function(callback) {
          callbacks.push(callback);
        },
        trigger: function() {
          var i;
          i = 0;
          while (i < callbacks.length) {
            window.setTimeout(callbacks[i], 1);
            i++;
          }
        }
      };
    };
    make = function(parent) {
      var elem, iface;
      elem = document.createElement("div");
      (parent || document.body).appendChild(elem);
      iface = {
        elem: elem,
        child: function() {
          return make(elem);
        },
        stylize: function(styles) {
          var prop, type;
          styles = styles || {};
          if (typeof styles.opacity !== "undefined") {
            styles.filter = "alpha(opacity=" + (styles.opacity * 100) + ")";
          }
          for (prop in styles) {
            if (styles.hasOwnProperty(prop)) {
              type = typeof styles[prop];
              if (type === "number" && !cssNumber[prop]) {
                styles[prop] += "px";
              }
              elem.style[prop] = styles[prop];
            }
          }
          return iface;
        },
        clazz: function(clazz) {
          elem.className += clazz;
          return iface;
        },
        html: function(content) {
          elem.innerHTML = content;
          return iface;
        },
        getWidth: function() {
          return elem.clientWidth;
        },
        onClick: function(callback) {
          if (elem.attachEvent) {
            elem.attachEvent("onclick", callback);
          } else {
            elem.addEventListener("click", callback);
          }
          return iface;
        },
        destroy: function() {
          document.body.removeChild(elem);
          return iface;
        }
      };
      return iface;
    };
    overlay = function(getOption) {
      var clickCallbacks, elem;
      clickCallbacks = observable();
      elem = make().clazz("pico-overlay").stylize({
        display: "block",
        position: "fixed",
        top: "0px",
        left: "0px",
        height: "100%",
        width: "100%",
        zIndex: 10000
      }).stylize(getOption("overlayStyles", {
        opacity: 0.5,
        background: "#000"
      })).onClick(clickCallbacks.trigger);
      return {
        elem: elem.elem,
        destroy: elem.destroy,
        onClick: clickCallbacks.watch
      };
    };
    return function(options) {
      var close, closeButton, closeCallbacks, elem, getOption, shadow, width;
      getOption = function(opt, defaultValue) {
        if (options[opt] === void 0) {
          return defaultValue;
        } else {
          return options[opt];
        }
      };
      if (typeof options === "string") {
        options = {
          content: options
        };
      }
      shadow = overlay(getOption);
      closeCallbacks = observable();
      elem = make().clazz("pico-content").stylize({
        display: "block",
        position: "fixed",
        zIndex: 10001,
        left: "50%",
        top: "50px"
      }).html(options.content);
      width = getOption("width", elem.getWidth());
      elem.stylize({
        width: width + "px",
        margin: "0 0 0 " + (-(width / 2) + "px")
      }).stylize(getOption("modalStyles", {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "5px"
      }));
      close = function() {
        closeCallbacks.trigger();
        shadow.destroy();
        elem.destroy();
      };
      if (getOption("overlayClose", true)) {
        shadow.onClick(close);
      }
      closeButton = void 0;
      if (getOption("closeButton", true)) {
        closeButton = elem.child().html(getOption("closeHtml", "&#xD7;")).clazz("pico-close").stylize(getOption("closeStyles", {
          borderRadius: "2px",
          cursor: "pointer",
          height: "15px",
          width: "15px",
          position: "absolute",
          top: "5px",
          right: "5px",
          fontSize: "16px",
          textAlign: "center",
          lineHeight: "15px",
          background: "#CCC"
        })).onClick(close);
      }
      return {
        modalElem: elem.elem,
        closeElem: (closeButton ? closeButton.elem : null),
        overlayElem: shadow.elem,
        close: close,
        onClose: closeCallbacks.watch
      };
    };
  })(window, document);


  /*
  Copyright (c) 2012 ElevenBlack
  Written by Ciocanel Razvan (chocksy.com)
   */


  /*
  A self-contained loader library
   */

  window.widgetLoader = (function(window, document) {
    "use strict";
    var $s, addSideButton, addWidget, addWidgetListeners, assignModal, cssNumber, defaults, elements, error, isMobile, loadModule, make, openModal, trace;
    defaults = {
      widget_domain: '//location.for.iframe.widget',
      domain: '//domain.for.iframe.widget',
      modal_width: false,
      modal_height: false,
      iframe_widget: false,
      iframe_width: "100%",
      iframe_height: "100%",
      side_btn: true
    };
    cssNumber = {
      "columnCount": true,
      "fillOpacity": true,
      "flexGrow": true,
      "flexShrink": true,
      "fontWeight": true,
      "lineHeight": true,
      "opacity": true,
      "order": true,
      "orphans": true,
      "widows": true,
      "zIndex": true,
      "zoom": true
    };
    elements = {
      side_btn_content: '<div id="WDG_sideBtn_ctn"><a href="#" id="WDG_sideBtn">Errors Widget</a></div>',
      side_btn: "#WDG_sideBtn"
    };
    assignModal = function() {
      return $s('.el-modal').on('click', (function(_this) {
        return function(e) {
          var element, moduleInfo, widget_token;
          e.preventDefault();
          element = e.currentTarget;
          widget_token = element.getAttribute('data-widget');
          moduleInfo = JSON.stringify({
            url: widget_token
          });
          return loadModule({
            data: moduleInfo
          });
        };
      })(this));
    };
    loadModule = function(e) {
      var info_received;
      info_received = JSON.parse(e.data);
      window.ELopts.widget_url = info_received.url;
      window.ELopts.domain = window.ELopts.widget_domain;
      if (info_received.domain !== void 0) {
        window.ELopts.domain = info_received.domain;
      }
      if (isMobile()) {
        return window.open(window.ELopts.domain + window.ELopts.widget_url, '_blank');
      } else {
        return openModal();
      }
    };
    openModal = function() {
      var current_height, current_width, outerHeight, outerWidth, widget_height, widget_width;
      current_height = make().getWindow('height');
      current_width = make().getWindow('width');
      widget_width = window.ELopts.modal_width ? window.ELopts.modal_width : current_width / 1.2;
      widget_height = window.ELopts.modal_height ? window.ELopts.modal_height : current_height / 1.6;
      outerWidth = typeof widget_width === "number" ? current_width - widget_width : current_width * parseInt(widget_width) / 100;
      outerHeight = typeof widget_height === "number" ? current_height - widget_height : current_height * parseInt(widget_height) / 100;
      return picoModal({
        content: '<iframe id="WDG_widgetIframe" src="' + window.ELopts.domain + window.ELopts.widget_url + '" class="iframe-class" style="width:100%;height:100%;" frameborder="0" allowtransparency="true"></iframe>',
        overlayStyles: {
          backgroundColor: "#333",
          opacity: "0.3"
        },
        modalStyles: {
          width: widget_width,
          height: widget_height,
          top: "20%",
          background: "#fff",
          boxShadow: "0px 0px 7px #444",
          border: "1px solid #444",
          borderRadius: "3px",
          marginLeft: -outerWidth / 2 + "px"
        }
      });
    };
    addSideButton = function() {
      var moduleInfo;
      $s('body').append(elements.side_btn_content);
      moduleInfo = JSON.stringify({
        url: window.ELopts.widget_url
      });
      $s(elements.side_btn).stylize({
        position: "fixed",
        top: "20%",
        left: "0",
        width: "50px",
        height: "157px",
        background: "url(//d1u2f2r665j4oh.cloudfront.net/side_button.png)",
        textIndent: "-9999px",
        boxShadow: "2px 1px 4px #ccc",
        borderRadius: "5px"
      });
      $s(elements.side_btn).on("click", (function(_this) {
        return function(event) {
          loadModule({
            data: moduleInfo
          });
          return event.preventDefault();
        };
      })(this));
      return false;
    };
    addWidget = function() {
      var $el, url, widget_iframe_html;
      url = window.ELopts.domain + window.ELopts.widget_url + ("?theme=" + window.ELopts.theme);
      widget_iframe_html = '<iframe id="iframe_widget" src="' + url + '" class="iframe-class" style="width:100%;height:100%;" frameborder="0" allowtransparency="true"></iframe>';
      $el = $s(window.ELopts.widget_container);
      return $el.html(widget_iframe_html);
    };
    isMobile = function() {
      return /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase());
    };
    $s = function(a, b) {
      var elem, fas;
      a = a.match(/^(\W)?(.*)/);
      elem = (b || document)["getElement" + (a[1] ? (a[1] === "#" ? "ById" : "sByClassName") : "sByTagName")](a[2]);
      fas = {
        elem: elem,
        data: function(dataAttr) {
          return elem.getAttribute("data-" + dataAttr);
        },
        html: function(content) {
          elem.innerHTML = content;
          return fas;
        },
        stylize: function(styles) {
          var prop, type;
          styles = styles || {};
          if (typeof styles.opacity !== "undefined") {
            styles.filter = "alpha(opacity=" + (styles.opacity * 100) + ")";
          }
          for (prop in styles) {
            if (styles.hasOwnProperty(prop)) {
              type = typeof styles[prop];
              if (type === "number" && !cssNumber[prop]) {
                styles[prop] += "px";
              }
              elem.style[prop] = styles[prop];
            }
          }
          return fas;
        },
        append: function(html) {
          var c, el;
          c = document.createElement("p");
          c.innerHTML = html;
          el = elem;
          if (elem.length) {
            el = elem[0];
          }
          el.appendChild(c.firstChild);
          return fas;
        },
        destroy: function() {
          if (!!elem) {
            document.body.removeChild(elem);
          }
          return fas;
        },
        on: function(eventName, handler) {
          var el, i;
          if (elem.length) {
            elements = elem;
          } else {
            elements = [elem];
          }
          if (elements.length > 0) {
            i = 0;
            while (i < elements.length) {
              el = elements[i];
              if (el.addEventListener) {
                el.addEventListener(eventName, handler);
              } else {
                el.attachEvent("on" + eventName, function() {
                  return handler.call(elem);
                });
              }
              i++;
            }
          }
        }
      };
      return fas;
    };
    make = function() {
      var fas;
      fas = {
        extend: function(out) {
          var i, key, obj;
          out = out || {};
          i = 1;
          while (i < arguments.length) {
            obj = arguments[i];
            if (!obj) {
              continue;
            }
            for (key in obj) {
              if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === "object") {
                  extend(out[key], obj[key]);
                } else {
                  out[key] = obj[key];
                }
              }
            }
            i++;
          }
          return out;
        },
        getWindow: function(type) {
          var d, e, g, w, x, y;
          w = window;
          d = document;
          e = d.documentElement;
          g = d.getElementsByTagName('body')[0];
          x = w.innerWidth || e.clientWidth || g.clientWidth;
          y = w.innerHeight || e.clientHeight || g.clientHeight;
          if (type === 'width') {
            return x;
          }
          if (type === 'height') {
            return y;
          }
        }
      };
      return fas;
    };
    addWidgetListeners = function() {
      var eventMethod, eventer, messageEvent;
      trace("adding listener for selecting the date for showing time");
      eventMethod = (window.addEventListener ? "addEventListener" : "attachEvent");
      eventer = window[eventMethod];
      messageEvent = (eventMethod === "attachEvent" ? "onmessage" : "message");
      return eventer(messageEvent, ((function(_this) {
        return function(e) {
          return loadModule(e);
        };
      })(this)), false);
    };
    trace = function(s) {
      if (window["console"] !== undefined) {
        return window.console.log("widgetLoader: " + s);
      }
    };
    error = function(s) {
      if (window["console"] !== undefined) {
        return window.console.error("widgetLoader: " + s);
      }
    };
    return function(options) {
      window.ELopts = make().extend({}, defaults, options);
      trace("constructor");
      if (window.ELopts.iframe_widget) {
        addWidget();
        addWidgetListeners();
      }
      if (window.ELopts.side_btn) {
        addSideButton();
      }
      assignModal();
      return false;
    };
  })(window, document);

  window.onload = function() {
    if (_lopts.widget_container === void 0) {
      _lopts.widget_container = 'body';
    }
    return widgetLoader(_lopts);
  };

}).call(this);


