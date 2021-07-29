const express = require('express');
const app = express();
const cors = require('cors');

const files = {
  users: require('./users.json'),
  login: require('./routing/login'),
  extensionScripts: require('./routing/extensionScriptsRouter'),
  phoneScripts: require('./routing/phoneScripts')
}

app.use(cors({origin: '*'}));
app.use("/extensionScripts", files.extensionScripts);
app.use("/*", files.login);
app.use("/phoneScripts", files.phoneScripts);


app.listen(3000);

