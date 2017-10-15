"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DBOperation;
(function (DBOperation) {
    DBOperation[DBOperation["create"] = 1] = "create";
    DBOperation[DBOperation["update"] = 2] = "update";
    DBOperation[DBOperation["delete"] = 3] = "delete";
})(DBOperation = exports.DBOperation || (exports.DBOperation = {}));
var PermissionLevel;
(function (PermissionLevel) {
    PermissionLevel[PermissionLevel["regular"] = 0] = "regular";
    PermissionLevel[PermissionLevel["userManager"] = 1] = "userManager";
    PermissionLevel[PermissionLevel["administrator"] = 2] = "administrator";
    PermissionLevel[PermissionLevel["undefined"] = 3] = "undefined";
})(PermissionLevel = exports.PermissionLevel || (exports.PermissionLevel = {}));
//# sourceMappingURL=enum.js.map