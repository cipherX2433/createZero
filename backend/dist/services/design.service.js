"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDesign = generateDesign;
function generateDesign(niche) {
    const themes = {
        "tech / saas": {
            font: "Syne",
            primary: "#6366F1",
            accent: "#22D3EE",
            background: "dark"
        },
        "health & fitness": {
            font: "Oswald",
            primary: "#22C55E",
            accent: "#F97316",
            background: "dark"
        }
    };
    return themes[niche] ?? {
        font: "Inter",
        primary: "#6366F1",
        accent: "#22D3EE",
        background: "dark"
    };
}
