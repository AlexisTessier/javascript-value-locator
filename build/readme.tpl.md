{{formatedName}}
================

![Project Status : experimental](https://img.shields.io/badge/Project%20status-experimental-orange.svg)

[![version](https://img.shields.io/badge/version-{{{version}}}-blue.svg)]({{{homepage}}})
[![npm version](https://badge.fury.io/js/%40{{{author.login.npm}}}%2F{{{name}}}.svg)](https://badge.fury.io/js/%40{{{author.login.npm}}}%2F{{{name}}})

[![Build Status](https://travis-ci.org/{{{author.login.github}}}/{{{name}}}.svg?branch={{{currentBranch}}})](https://travis-ci.org/{{{author.login.github}}}/{{{name}}})
[![Coverage Status](https://coveralls.io/repos/{{{author.login.github}}}/{{{name}}}/badge.svg?branch={{{currentBranch}}}&service=github)](https://coveralls.io/github/{{{author.login.github}}}/{{{name}}}?branch={{{currentBranch}}})

{{description}}

{{#menu}}
+ [{{{label}}}](#{{{anchor}}})
{{/menu}}

{{#content}}

{{#section}}
## {{{section}}}
{{/section}}

{{#title}}
### {{{title}}}
{{/title}}

{{#subtitle}}
#### {{{subtitle}}}
{{/subtitle}}

{{#p}}
{{{p}}}
{{/p}}

{{#li}}
+ {{{li}}}
{{/li}}

{{#cli}}
```
{{{cli}}}
```
{{/cli}}

{{#js}}
```javascript
{{{js}}}
```
{{/js}}

{{/content}}