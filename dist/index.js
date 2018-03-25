"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var WHERE_PARAM_PREFIX = 'w_h_e_r_e_';
var SqliteExError = (function (_super) {
    __extends(SqliteExError, _super);
    function SqliteExError(message, innerError, sql, params) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        _this.sql = sql;
        _this.params = params;
        _this.innerError = innerError;
        var actualProto = _newTarget.prototype;
        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(_this, actualProto);
        }
        else {
            _this.__proto__ = _newTarget.prototype;
        }
        return _this;
    }
    return SqliteExError;
}(Error));
exports.SqliteExError = SqliteExError;
var SqliteEx = (function () {
    function SqliteEx(db) {
        this.db = db;
    }
    SqliteEx.prototype.run = function (sql, params) {
        var _this = this;
        if (params === void 0) { params = {}; }
        var $this = this;
        return new Promise(function (resolve, reject) {
            _this.db.run(sql, params, function (err) {
                if (err) {
                    var msg = "Error '" + err.message + "' - SQL: " + sql + " -- params = " + JSON.stringify(params);
                    reject(new SqliteExError(msg, err, sql, params));
                }
                else
                    resolve(this);
            });
        });
    };
    SqliteEx.prototype.query = function (sql, params) {
        var _this = this;
        if (params === void 0) { params = {}; }
        var $this = this;
        return new Promise(function (resolve, reject) {
            _this.db.all(sql, params, function (err, rows) {
                if (err) {
                    var msg = "Error '" + err.message + "' - SQL: " + sql + " -- params = " + JSON.stringify(params);
                    reject(new SqliteExError(msg, err, sql, params));
                }
                else
                    resolve(rows);
            });
        });
    };
    SqliteEx.prototype.upsert = function (table, doc) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.insert(table, doc, true)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    SqliteEx.prototype.insert = function (table, doc, upsert) {
        if (upsert === void 0) { upsert = false; }
        return __awaiter(this, void 0, void 0, function () {
            var params, sqlFields, sqlParams, key, sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {};
                        sqlFields = [];
                        sqlParams = [];
                        for (key in doc) {
                            sqlFields.push(key);
                            sqlParams.push('$' + key);
                            params['$' + key] = doc[key];
                        }
                        sql = "INSERT " + (upsert === true ? "OR REPLACE " : "") + "INTO " + table + "("
                            + sqlFields.join(",")
                            + ") VALUES("
                            + sqlParams.join(",")
                            + ");";
                        return [4, this.run(sql, params)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    SqliteEx.prototype.update = function (table, doc, where) {
        return __awaiter(this, void 0, void 0, function () {
            var params, sqlSets, whereSets, key, key, param, sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {};
                        sqlSets = [];
                        whereSets = [];
                        for (key in doc) {
                            sqlSets.push(key + "=$" + key);
                            params['$' + key] = doc[key];
                        }
                        for (key in where) {
                            param = WHERE_PARAM_PREFIX + key;
                            params['$' + param] = where[key];
                            whereSets.push(key + "=$" + param);
                        }
                        sql = "UPDATE " + table + " SET "
                            + sqlSets.join(", ")
                            + " WHERE "
                            + whereSets.join(" AND ")
                            + ";";
                        return [4, this.run(sql, params)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    return SqliteEx;
}());
exports.SqliteEx = SqliteEx;
//# sourceMappingURL=index.js.map