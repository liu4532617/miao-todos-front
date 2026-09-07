"use strict";const t=require("./request.js"),s=require("./urls.js"),e=require("./adapters.js");exports.getStatistics=function(){return t.get(s.API.statistics).then(e.mapStatistics)};
