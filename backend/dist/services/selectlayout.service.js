"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectLayout = selectLayout;
function selectLayout(script) {
    if (script.key_points && script.key_points.length === 3)
        return "bullet";
    if (script.hook_quote)
        return "quote";
    return "headline";
}
