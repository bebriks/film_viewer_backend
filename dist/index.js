"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerOptions_1 = require("./swaggerOptions");
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
dotenv_1.default.config({ path: './.env' });
app.set("port", process.env.PORT || 3001);
/** middlewares **/
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.disable('x-powered-by');
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions_1.swaggerOptions);
app.use(users_routes_1.default);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
