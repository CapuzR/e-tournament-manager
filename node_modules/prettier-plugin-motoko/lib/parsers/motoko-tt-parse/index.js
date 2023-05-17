"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MOTOKO_TT_PARSE = void 0;
const motoko_tt_ast_1 = require("../../printers/motoko-tt-ast");
const location_1 = require("./location");
const parse_1 = __importDefault(require("./parse"));
exports.MOTOKO_TT_PARSE = 'motoko-tt-parse';
const parser = {
    astFormat: motoko_tt_ast_1.MOTOKO_TT_AST,
    parse: parse_1.default,
    locStart: location_1.locStart,
    locEnd: location_1.locEnd,
};
exports.default = parser;
//# sourceMappingURL=index.js.map