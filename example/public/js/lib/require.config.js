var jam = {
    "packages": [
        {
            "name": "angularjs",
            "location": "js/lib/angularjs",
            "main": "angular.js"
        }
    ],
    "version": "0.2.15",
    "shim": {}
};

if (typeof require !== "undefined" && require.config) {
    require.config({
    "packages": [
        {
            "name": "angularjs",
            "location": "js/lib/angularjs",
            "main": "angular.js"
        }
    ],
    "shim": {}
});
}
else {
    var require = {
    "packages": [
        {
            "name": "angularjs",
            "location": "js/lib/angularjs",
            "main": "angular.js"
        }
    ],
    "shim": {}
};
}

if (typeof exports !== "undefined" && typeof module !== "undefined") {
    module.exports = jam;
}