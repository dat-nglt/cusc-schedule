"use strict";

var _dotenv = _interopRequireDefault(require("dotenv"));
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _router = _interopRequireDefault(require("./routes/router.js"));
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _database = _interopRequireDefault(require("./config/database.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Load environment variables first
_dotenv.default.config();
const app = (0, _express.default)();
const PORT = process.env.PORT || 3000;
app.use((0, _cors.default)());
app.use(_express.default.json());

//connect database
(0, _database.default)();

//body parser
app.use(_bodyParser.default.urlencoded({
  extended: false
}));
app.use(_bodyParser.default.json());

//router
(0, _router.default)(app);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is running on port ".concat(port));
});