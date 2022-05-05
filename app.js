const express = require('express');
const app = express();
const {engine} = require('express-handlebars');
const bodyParser = require('body-parser');
const admin = require('./routes/admin');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const db = require('./config/db');
const usuarios =  require('./routes/usuario');
const passport = require('passport');
require('./config/auth')(passport);

	//SESSION
app.use(session({
	secret: "cursoDeNode",
	resave: true,
	saveUninitialized: true
}));

app.use(passport.initialize())
app.use(passport.session())

app.use(flash());

	// TEMPLATE ENGINE
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set("views", "./views");

	// BODY-PARSER
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

	// PATH - public
app.use(express.static(path.join(__dirname, '/public')));

	//MIDDLEWARE - flash
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

	//ROTAS
app.use('/admin', admin);
app.use('/usuarios', usuarios);

	//MONGOOSE
mongoose.promise = global.Promise
// mongoose.connect("mongodb://localhost/blocoNotas").then(() => {
// 	console.log('mongo conectado');
// }).catch(e => console.log('Ocorreu um erro na conexão' + e));
mongoose.connect(db.mongoURI).then(() => {
	console.log('mongo conectado');
}).catch(e => console.log('Ocorreu um erro na conexão' + e));


app.get('/', (req, res) => {
	res.redirect('/admin/anotacoes/home');
});

	// --> PORTA PARA ACESSAR O HEROKU <--
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Server Started!'));