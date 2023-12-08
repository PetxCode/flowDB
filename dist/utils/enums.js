"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP = void 0;
var HTTP;
(function (HTTP) {
    HTTP[HTTP["OK"] = 200] = "OK";
    HTTP[HTTP["CREATED"] = 201] = "CREATED";
    HTTP[HTTP["BAD"] = 404] = "BAD";
})(HTTP || (exports.HTTP = HTTP = {}));
