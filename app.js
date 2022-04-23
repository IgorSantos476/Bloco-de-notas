const express = require('express');
const app = express();
const {engine} = require('express-handlebars');
const bodyParser = require('body-parser');
const admin =  require('./routes/admin');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const db = require('./config/db');

// TEMPLATE ENGINE
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set("views", "./views");

	// BODY-PARSER
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

	// PATH - public
app.use(express.static(path.join(__dirname, '/public')));

	//SESSION
app.use(session({
	secret: "cursoDeNode",
	resave: true,
	saveUninitialized: true
}));

app.use(flash());


	//MIDDLEWARE - flash
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	next();
});

	//ROTAS
app.use('/admin', admin);

	//MONGOOSE
mongoose.promise = global.Promise
// mongoose.connect("mongodb://localhost/blocoNotas").then(() => {
// 	console.log('mongo conectado');
// }).catch(e => console.log('Ocorreu um erro na conexão' + e));
mongoose.connect(db.mongoURI).then(() => {
	console.log('mongo conectado');
}).catch(e => console.log('Ocorreu um erro na conexão' + e));


	// --> PORTA DA FORMA NORMAl ABAIXO -->
//app.listen(8080, () => console.log('Server Started!'));

	// --> PORTA PARA ACESSAR O HEROKU <--
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Server Started!'));