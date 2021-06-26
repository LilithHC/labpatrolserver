"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var Koa = require("koa");
var Router = require("koa-router");
var bodyParser = require("koa-bodyparser");
var logger_1 = require("./logger");
var cors = require("koa2-cors");
var BackendServer = /** @class */ (function () {
    function BackendServer(port) {
        this.name = '服务';
        this.port = port;
        this.routeCallList = [];
    }
    BackendServer.prototype.registRouteCall = function (routeCall) {
        this.routeCallList.push(routeCall);
    };
    BackendServer.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var app, router, ii;
            var _this = this;
            return __generator(this, function (_a) {
                app = new Koa();
                app.use(bodyParser());
                router = new Router();
                for (ii = 0; ii < this.routeCallList.length; ii++) {
                    if (this.routeCallList[ii].type == 'get') {
                        router.get(this.routeCallList[ii].route, this.routeCallList[ii].callBack);
                    }
                    else if (this.routeCallList[ii].type == 'post') {
                        router.post(this.routeCallList[ii].route, this.routeCallList[ii].callBack);
                    }
                    else {
                        logger_1["default"].error("unsupported type " + this.routeCallList[ii].type);
                    }
                }
                router.get('/', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        ctx.body = '<h1>^_^</h1>';
                        return [2 /*return*/];
                    });
                }); });
                router.get('/sender', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
                    var url, ctx_query, ctx_querystring;
                    return __generator(this, function (_a) {
                        ctx.status = 200;
                        url = ctx.url;
                        ctx_query = ctx.query;
                        ctx_querystring = ctx.querystring;
                        ctx.body = {
                            url: url,
                            query: ctx_query,
                            queryString: ctx_querystring
                        };
                        return [2 /*return*/];
                    });
                }); });
                router.get('/left', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/];
                    });
                }); });
                router.post('/login', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
                    var data, result;
                    return __generator(this, function (_a) {
                        ctx.set('Content-Type', 'application/json');
                        try {
                            data = ctx.request.body;
                            result = { result: 'OK' };
                            // ctx.set('set-cookie', _.get(result, 'cookies', []).map(cookie => typeof (cookie) === 'string' ? cookie : `${cookie.name}=${cookie.value}`).join('; '))
                            ctx.response.body = result;
                        }
                        catch (e) {
                            console.log('error handle post');
                        }
                        return [2 /*return*/];
                    });
                }); });
                app.use(router.routes());
                app.use(cors());
                app.listen(this.port, function () {
                    console.log("\u670D\u52A1\u5DF2\u8FD0\u884C\uFF1Ahttp://127.0.0.1:" + _this.port);
                });
                return [2 /*return*/];
            });
        });
    };
    return BackendServer;
}());
exports["default"] = BackendServer;
if (__filename === process.mainModule.filename) {
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        var bkend;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bkend = new BackendServer(3721);
                    return [4 /*yield*/, bkend.run()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); })();
}
