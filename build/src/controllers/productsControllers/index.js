"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCollection = exports.addVariation = exports.updateProduct = exports.insertIdImagesVariants = exports.getProductsForCategory = exports.deleteProductById = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const create_1 = require("./create");
Object.defineProperty(exports, "createProduct", { enumerable: true, get: function () { return create_1.createProduct; } });
Object.defineProperty(exports, "insertIdImagesVariants", { enumerable: true, get: function () { return create_1.insertIdImagesVariants; } });
const read_1 = require("./read");
Object.defineProperty(exports, "getAllProducts", { enumerable: true, get: function () { return read_1.getAllProducts; } });
Object.defineProperty(exports, "getProductById", { enumerable: true, get: function () { return read_1.getProductById; } });
Object.defineProperty(exports, "getProductsForCategory", { enumerable: true, get: function () { return read_1.getProductsForCategory; } });
const delete_1 = require("./delete");
Object.defineProperty(exports, "deleteProductById", { enumerable: true, get: function () { return delete_1.deleteProductById; } });
Object.defineProperty(exports, "removeCollection", { enumerable: true, get: function () { return delete_1.removeCollection; } });
const put_1 = require("./put");
Object.defineProperty(exports, "updateProduct", { enumerable: true, get: function () { return put_1.updateProduct; } });
Object.defineProperty(exports, "addVariation", { enumerable: true, get: function () { return put_1.addVariation; } });