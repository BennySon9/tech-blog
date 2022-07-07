const express = require("express");
const sequelize = require("./config/connection");
const session = require("express-session");

const SequelizeStore = require("connect-session-sequelize")(session.Store);

const sess = {
  secret: process.env.SESS_SECRET,
  cookie: {},
  resave: false,
  saveUnititialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

// const routes = require('./controllers);
const exhbs = require("express-handlebars");
const hbs = exhbs.create({});

const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(session(sess));

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

// app.use(routes);
sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
});
