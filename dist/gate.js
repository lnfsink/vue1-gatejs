(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=g||self,g.Gate=f());}(this,(function(){'use strict';function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}var HandleStatus;

(function (HandleStatus) {
  HandleStatus[HandleStatus["REJECT"] = 0] = "REJECT";
  HandleStatus[HandleStatus["RESOLVED"] = 1] = "RESOLVED";
  HandleStatus[HandleStatus["PENDING"] = 2] = "PENDING";
  HandleStatus[HandleStatus["UNRESOLVED"] = 3] = "UNRESOLVED";
})(HandleStatus || (HandleStatus = {}));

var HandlerTansition = /*#__PURE__*/function () {
  function HandlerTansition(transition, context) {
    _classCallCheck(this, HandlerTansition);

    this.context = JSON.parse(JSON.stringify(context));
    this.transition = transition;
  }

  _createClass(HandlerTansition, [{
    key: "next",
    value: function next() {
      if (this.isNotResolved) {
        this.status = HandleStatus.RESOLVED;
        this.transition.next();
      }
    }
  }, {
    key: "abort",
    value: function abort(reason) {
      if (this.isNotResolved) {
        this.status = HandleStatus.REJECT;
        reason ? this.transition.abort(reason) : this.transition.abort();
      }
    }
  }, {
    key: "redirect",
    value: function redirect(route) {
      if (this.isNotResolved) {
        this.status = HandleStatus.REJECT;
        this.transition.redirect(route);
      }
    }
  }, {
    key: "pending",
    value: function pending() {
      if (this.isNotResolved) {
        this.status = HandleStatus.PENDING;
      }
    }
  }, {
    key: "to",
    get: function get() {
      return this.transition.to;
    }
  }, {
    key: "from",
    get: function get() {
      return this.transition.from;
    }
  }, {
    key: "isNotResolved",
    get: function get() {
      return this.status === HandleStatus.UNRESOLVED;
    }
  }]);

  return HandlerTansition;
}();var Handler = /*#__PURE__*/function () {
  function Handler(gate, transition) {
    var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, Handler);

    this.gate = gate;
    this.transition = new HandlerTansition(transition, context);
  }

  _createClass(Handler, [{
    key: "handle",
    value: function () {
      var _handle = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(guard, iterator) {
        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return guard.canActivate(this.transition);

              case 3:
                result = _context.sent;
                return _context.abrupt("return", this.handleResult(result, iterator));

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](0);
                return _context.abrupt("return", this.gate.error(this.transition, _context.t0));

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 7]]);
      }));

      function handle(_x, _x2) {
        return _handle.apply(this, arguments);
      }

      return handle;
    }()
  }, {
    key: "handleResult",
    value: function () {
      var _handleResult = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(result, iterator) {
        var status, _iterator$next, nextGuard, done;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                status = this.transition.status;

                if (!(status === HandleStatus.UNRESOLVED)) {
                  _context2.next = 13;
                  break;
                }

                if (!iterator) {
                  _context2.next = 12;
                  break;
                }

                _iterator$next = iterator.next(), nextGuard = _iterator$next.value, done = _iterator$next.done;

                if (!done) {
                  _context2.next = 8;
                  break;
                }

                _context2.t0 = result;
                _context2.next = 11;
                break;

              case 8:
                _context2.next = 10;
                return this.handle(nextGuard, iterator);

              case 10:
                _context2.t0 = _context2.sent;

              case 11:
                return _context2.abrupt("return", _context2.t0);

              case 12:
                return _context2.abrupt("return", result);

              case 13:
                _context2.t1 = status;
                _context2.next = _context2.t1 === HandleStatus.RESOLVED ? 16 : _context2.t1 === HandleStatus.REJECT ? 17 : _context2.t1 === HandleStatus.PENDING ? 18 : 19;
                break;

              case 16:
                return _context2.abrupt("return", true);

              case 17:
                return _context2.abrupt("return", false);

              case 18:
                return _context2.abrupt("return");

              case 19:
                return _context2.abrupt("return", result);

              case 20:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function handleResult(_x3, _x4) {
        return _handleResult.apply(this, arguments);
      }

      return handleResult;
    }()
  }, {
    key: "exec",
    value: function exec(guards) {
      var defaultResult = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var iterator = guards[Symbol.iterator]();
      return this.handleResult(defaultResult, iterator);
    }
  }]);

  return Handler;
}();var Guard = /*#__PURE__*/function () {
  function Guard(gate, canActivate) {
    var _this = this;

    _classCallCheck(this, Guard);

    this.equals = new Map();

    this.canActivate = function () {
      return true;
    };

    this.gate = gate;
    this.equals = new Map();

    this.cb.is = function () {
      return true;
    };

    this.cb.not = function () {
      return true;
    };

    this.cb.error = gate.error;

    this.cb.equal = function (transition, val) {
      if (_this.equals.has(val)) {
        return _this.equals.get(val)(transition, val);
      } else if (_this.equals.has(Guard.DEFAULT_EQUAL)) {
        return _this.equals.get(Guard.DEFAULT_EQUAL)(transition, val);
      } else {
        return true;
      }
    };

    canActivate && (this.canActivate = canActivate);
  }

  _createClass(Guard, [{
    key: "is",
    value: function is(cb) {
      this.cb.is = this._bind(cb);
      return this;
    }
  }, {
    key: "not",
    value: function not(cb) {
      this.cb.not = this._bind(cb);
      return this;
    }
  }, {
    key: "equal",
    value: function equal() {
      var _this2 = this;

      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Guard.DEFAULT_EQUAL;
      var cb = arguments.length > 1 ? arguments[1] : undefined;
      cb = this._bind(cb);

      if (Array.isArray(value)) {
        value.forEach(function (val) {
          return _this2.equals.set(val, cb);
        });
      } else {
        this.equals.set(value, cb);
      }

      return this;
    }
  }, {
    key: "error",
    value: function error(cb) {
      this.cb.error = this._bind(cb);
      return this;
    }
  }, {
    key: "end",
    value: function end() {
      return this.gate;
    }
  }, {
    key: "_bind",
    value: function _bind(cb) {
      if (!cb || typeof cb !== 'function') {
        throw new Error("".concat(cb, " is not a function"));
      }

      return cb.bind(this.gate);
    }
  }]);

  return Guard;
}();
Guard.DEFAULT_EQUAL = Symbol('default equal callback');var Gate = /*#__PURE__*/function () {
  function Gate(options) {
    _classCallCheck(this, Gate);

    this.guards = [];
    this.name = options.name;
    this.context = options.context || {};

    this.error = options.error || function (transition, error) {
      console.error(error);
      transition.abort(error);
    };

    this.options = options;
  }

  _createClass(Gate, [{
    key: "build",
    value: function build() {
      var _this = this;

      var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var pipelines = this.guards;
      this.guards = [];
      var beforeActions = [];
      var afterActions = [];

      var processor = function processor(transition) {
        var handler = new Handler(_this, transition, _objectSpread2({}, _this.context, {}, context));
        var guards = beforeActions.concat(pipelines).concat(afterActions);
        return handler.exec(guards);
      };

      processor.before = function (callback) {
        beforeActions.push(new Guard(_this, callback));
        return processor;
      };

      processor.after = function (callback) {
        afterActions.push(new Guard(_this, callback));
        return processor;
      };

      return processor;
    }
  }], [{
    key: "register",
    value: function register(name, Ctor) {
      Object.defineProperty(Gate.prototype, name, {
        get: function get() {
          var guard = new Ctor(this);
          this.guards.push(guard);
          return guard;
        }
      });
    }
  }]);

  return Gate;
}();
Gate.Guard = Guard;return Gate;})));