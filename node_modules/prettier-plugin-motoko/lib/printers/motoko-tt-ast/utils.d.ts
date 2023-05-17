import { TokenTree, Token } from './../../parsers/motoko-tt-parse/parse';
import { Doc } from 'prettier';
export declare function getTokenTreeText(tree: TokenTree): string;
export declare function getTokenText(token: Token): string;
export declare function getToken(tree: TokenTree | undefined): Token | undefined;
export declare function withoutLineBreaks(doc: Doc): Doc;
//# sourceMappingURL=utils.d.ts.map