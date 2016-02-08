var React, inlineInject;

React = require('react');

window._ = require('lodash');

inlineInject = function() {
  var bindEvents, bindScrollEvent, edit, getElementOffset, getSelector, positionInDom;
  positionInDom = function(el, count) {
    var new_el;
    if (count == null) {
      count = 1;
    }
    if (new_el = el.previousElementSibling) {
      return positionInDom(new_el, count + 1);
    } else {
      return count;
    }
  };
  getSelector = function(el) {
    var c, e, names;
    names = [];
    while (el.parentNode) {
      if (el.id) {
        names.unshift('#' + el.id);
        break;
      } else {
        if (el === el.ownerDocument.documentElement) {
          names.unshift(el.tagName.toLowerCase());
        } else {
          c = 1;
          e = el;
          while (e.previousElementSibling) {
            e = e.previousElementSibling;
            c++;
          }
          names.unshift(el.tagName.toLowerCase() + ':nth-child(' + c + ')');
        }
        el = el.parentNode;
      }
    }
    return names.join(' > ');
  };
  bindScrollEvent = function() {
    return window.addEventListener('scroll', function(e) {
      return parent.postMessage({
        action: 'scroll',
        top: e.srcElement.body.scrollTop,
        left: e.srcElement.body.scrollLeft
      }, 'http://localhost:4000');
    });
  };
  edit = function(e) {
    return function() {
      var offsets, selector;
      e.preventDefault();
      selector = getSelector(e.target);
      offsets = getElementOffset(e.target);
      return parent.postMessage({
        action: 'edit',
        selector: selector,
        top: offsets.top,
        left: offsets.left,
        height: e.target.offsetHeight,
        width: e.target.offsetWidth,
        old_outline: e.target.outline,
        inner_text: e.target.innerText,
        style: JSON.stringify(window.getComputedStyle(e.target))
      }, 'http://1142649e.ngrok.com');
    };
  };
  bindEvents = function() {
    var hold_timeout_id;
    hold_timeout_id = 0;
    window.addEventListener('mousedown', function(e) {
      return hold_timeout_id = setTimeout(edit(e), 1000);
    });
    window.addEventListener('mouseup', function(e) {
      return clearTimeout(hold_timeout_id);
    });
    return window.addEventListener('mouseleave', function(e) {
      return clearTimeout(hold_timeout_id);
    });
  };
  getElementOffset = function(element) {
    var box, de, left, top;
    de = document.documentElement;
    box = element.getBoundingClientRect();
    top = box.top + window.pageYOffset - de.clientTop;
    left = box.left + window.pageXOffset - de.clientLeft;
    return {
      top: top,
      left: left
    };
  };
  bindEvents();
  return console.log('injected her');
};

module.exports = React.createClass({
  getInitialState: function() {
    window.addEventListener('message', this.props.onMessage, false);
    return {};
  },
  iframe: function() {
    return document.getElementById('browser');
  },
  refresh: function() {
    return this.iframe().src = this.props.browser_url;
  },
  componentDidMount: function() {
    return $(this.iframe()).load((function(_this) {
      return function() {
        return _this.inject();
      };
    })(this));
  },
  wrapEvalFunction: function(code) {
    return "evalFunction = " + code + "; evalFunction()";
  },
  inject: function() {
    console.log('inkecting');
    return this.evalInIframe(inlineInject.toString());
  },
  evalInIframe: function(code) {
    return this.iframe().contentWindow.postMessage(this.wrapEvalFunction(code), 'http://localhost:9000');
  },
  render: function() {
    return React.createElement("div", {
      "className": 'browser'
    }, React.createElement("iframe", {
      "id": 'browser',
      "name": 'browser-frame',
      "src": 'http://localhost:9000' || this.props.browser_url
    }));
  }
});
