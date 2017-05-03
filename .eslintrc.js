module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "rules": {
        "strict": ["error", "global"],
        "indent": ["error", "tab", {"SwitchCase": 1}],
        "no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
        "func-style": ["error", "declaration", {
            "allowArrowFunctions": true
        }],
        "func-names": ["error", "always"],
        "default-case": "error",
        "no-fallthrough": "error",
        "no-empty-function": "error",
        "max-params": ["error", 2],
        "no-lone-blocks": "error",
        "no-unused-expressions": "error"
    }
};