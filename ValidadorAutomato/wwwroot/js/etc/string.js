String.prototype.format = function () {
    var ret = this.toString();

    var parms = arguments;

    var pLength = parms.length;
    for (var i = 0; i < pLength; ++i) {
        ret = ret.replace(new RegExp("\\{" + i + "\\}", "gi"), parms[i]);
    }

    return ret;
};