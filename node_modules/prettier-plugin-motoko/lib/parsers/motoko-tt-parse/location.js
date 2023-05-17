"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locEnd = exports.locStart = void 0;
const locStart = (node) => {
    if (node === null || node === void 0 ? void 0 : node.token_tree_type) {
        if (node.token_tree_type === 'Token') {
            const [, loc] = node.data;
            return loc.span[1];
        }
        else if (node.token_tree_type === 'Group') {
            const [trees, _, pair] = node.data;
            if (pair) {
                const [, loc] = pair[0];
                return loc.span[0];
            }
            else {
                return trees.length ? (0, exports.locStart)(trees[0]) : 0;
            }
        }
    }
    throw new Error(`Unexpected token tree: ${JSON.stringify(node)}`);
};
exports.locStart = locStart;
const locEnd = (node) => {
    if (node === null || node === void 0 ? void 0 : node.token_tree_type) {
        if (node.token_tree_type === 'Token') {
            const [, loc] = node.data;
            return loc.span[1];
        }
        else if (node.token_tree_type === 'Group') {
            const [trees, _, pair] = node.data;
            if (pair) {
                const [, loc] = pair[1];
                return loc.span[1];
            }
            else {
                return trees.length ? (0, exports.locStart)(trees[trees.length - 1]) : 0;
            }
        }
    }
    throw new Error(`Unexpected token tree: ${JSON.stringify(node)}`);
};
exports.locEnd = locEnd;
//# sourceMappingURL=location.js.map