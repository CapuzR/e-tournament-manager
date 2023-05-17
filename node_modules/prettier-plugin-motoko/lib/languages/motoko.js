"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const motoko_tt_parse_1 = require("../parsers/motoko-tt-parse");
const motokoLanguage = {
    linguistLanguageId: 202937027,
    name: 'Motoko',
    // type: 'programming',
    // color: '#fbb03b',
    aceMode: 'text',
    tmScope: 'source.mo',
    extensions: ['.mo', '.did'],
    parsers: [motoko_tt_parse_1.MOTOKO_TT_PARSE],
    vscodeLanguageIds: ['motoko'],
    interpreters: [], // TODO?
};
exports.default = motokoLanguage;
//# sourceMappingURL=motoko.js.map