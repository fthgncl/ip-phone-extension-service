const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const files = {
  createToken: require('./routing/createToken'),
  tokenControl: require('./routing/tokenControl'),
  extensionScripts: require('./routing/extensionScriptsRouter'),
  phoneScripts: require('./routing/phoneScripts')
}
app.use(bodyParser.json());
app.use(cors({origin: '*'}));
app.use(files.tokenControl);

app.use("/extensionScripts", files.extensionScripts);
app.use("/phoneScripts", files.phoneScripts);
app.use("/createToken", files.createToken);


app.listen(3000);

