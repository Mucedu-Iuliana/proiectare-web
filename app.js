const cookieParser = require('cookie-parser');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')
const session = require("express-session");
const app = express();
app.use(cookieParser())
const fs = require('fs');

const port = 6789;

// directorul 'views' va conține fișierele .ejs (html + js executat la server)
app.set('view engine', 'ejs');
// suport pentru layout-uri - implicit fișierul care reprezintă template-ul site-ului este views/layout.ejs
app.use(expressLayouts);
// directorul 'public' va conține toate resursele accesibile direct de către client (e.g., fișiere css, javascript, imagini)
app.use(express.static('public'))
// corpul mesajului poate fi interpretat ca json; datele de la formular se găsesc în format json în req.body
app.use(bodyParser.json());
// utilizarea unui algoritm de deep parsing care suportă obiecte în obiecte
app.use(bodyParser.urlencoded({ extended: true }));


global.con = require('mysql').createConnection({
	host: "localhost",
	user: "iuliana",
	password: "alabala",
	connection: "cumparaturi"
});

app.use(session({
	secret: 'sesiune',
	resave: false,
	saveUninitialized: false

}))

app.get('/creare-bd', (req, res) => {
	con.connect(function (err) {
		if (err) throw err;
		console.log("Connected!");
		con.query("CREATE DATABASE IF NOT EXISTS cumparaturi", function (err, result) {
			if (err) throw err;
			console.log("Database created");
			con.query("USE cumparaturi", function (err, result) {
				if (err) throw err;
				console.log("Table created");
				con.query("CREATE TABLE IF NOT EXISTS produse ( id INT, nume_produs VARCHAR(100),  pret INT);", function (err, result) {
					if (err) throw err;
				});
			});
		});
		res.redirect('/meniu');
	});
});

app.get('/inserare-db1', (req, res) => {
	con.query("USE cumparaturi", function (err, result) {
		if (err) throw err;
		con.query("INSERT INTO produse(id, nume_produs,  pret) VALUES(null, 'Latte','7')", function (err, result) {
			if (err) throw err;
			console.log("Date inserate");
		});
	});
});


app.get('/inserare-db2', (req, res) => {
	con.query("USE cumparaturi", function (err, result) {
		if (err) throw err;
		con.query("INSERT INTO produse(id, nume_produs,  pret) VALUES(null, 'Scurt','5')", function (err, result) {
			if (err) throw err;
			console.log("Date inserate");
		});
	});
});


app.get('/inserare-db3', (req, res) => {
	con.query("USE cumparaturi", function (err, result) {
		if (err) throw err;
		con.query("INSERT INTO produse(id, nume_produs,  pret) VALUES(null, 'Dublu','8')", function (err, result) {
			if (err) throw err;
			console.log("Date inserate");
		});
	});
});


app.get('/inserare-db4', (req, res) => {
	con.query("USE cumparaturi", function (err, result) {
		if (err) throw err;
		con.query("INSERT INTO produse(id, nume_produs,  pret) VALUES(null, 'Capucino','10')", function (err, result) {
			if (err) throw err;
			console.log("Date inserate");
		});
	});
});


app.get('/inserare-db5', (req, res) => {
	con.query("USE cumparaturi", function (err, result) {
		if (err) throw err;
		con.query("INSERT INTO produse(id, nume_produs,  pret) VALUES(null, 'Decofein','15')", function (err, result) {
			if (err) throw err;
			console.log("Date inserate");
		});
	});
});


app.get('/inserare-db6', (req, res) => {
	con.query("USE cumparaturi", function (err, result) {
		if (err) throw err;
		con.query("INSERT INTO produse(id, nume_produs,  pret) VALUES(null, 'Dalgona','12')", function (err, result) {
			if (err) throw err;
			console.log("Date inserate");
		});
	});
});


app.get('/inserare-db7', (req, res) => {
	con.query("USE cumparaturi", function (err, result) {
		if (err) throw err;
		con.query("INSERT INTO produse(id, nume_produs,  pret) VALUES(null, 'Caramel','11')", function (err, result) {
			if (err) throw err;
			console.log("Date inserate");
		});
	});
});



app.get('/', (req, res) => {
	res.render('index.ejs',
		{
			titlu: 'Welcome',
			u: req.session.utilizator,
			log: req.session.prenume,
			errorMessage: req.session.mesajEroare
		})
});

app.get('/meniu', (req, res) => {
	res.render('meniu.ejs',
		{
			titlu: 'Welcome',
			u: req.session.utilizator,
			log: req.session.prenume,
			errorMessage: req.session.mesajEroare
		})
});

app.use('/assets', express.static('assets'));


app.get('/autentificare', (req, res) => {

	console.log(req.session);
	res.render('autentificare.ejs',
		{
			titlu: 'Autentificare',
			mesaj: req.session.mesajEroare,
			log: req.session.prenume,
			errorMessage: req.session.mesajEroare

		});

});

app.post('/verificare-autentificare', (req, res) => {
	fs.readFile('utilizatori.json', (err, data) => {

		if (err) console.error(err);

		let listaUtilizatori = JSON.parse(data);
		let flag = 0;

		for (let i = 0; i < listaUtilizatori.length; i++) {
			let user = listaUtilizatori[i].utilizator;
			let pass = listaUtilizatori[i].parola;

			if (req.body.utilizator === user && req.body.parola === pass) {
				req.session.utilizator = user;
				req.session.nume = listaUtilizatori[i].nume;
				req.session.prenume = listaUtilizatori[i].prenume;
				flag = 1;

				break;
			}
			else {
				req.session.mesajEroare = "User sau parola incorecte!";


			}
		}

		if (flag == 1) {
			req.session.mesajEroare = null;
			res.redirect('/meniu');
		}
		else if (flag == 0) {
			res.redirect('/autentificare');
		}
	});

});

app.get('/delogare', (req, res) => {
	req.session.destroy();
	res.redirect('/');
	console.log(req.session);

});

// la accesarea din browser adresei http://localhost:6789/chestionar se va apela funcția specificată
app.get('/chestionar', (req, res) => {
	fs.readFile('intrebari.json', (err, data) => {
		if (err) throw err;

		let listaIntrebari = JSON.parse(data);
		// în fișierul views/chestionar.ejs este accesibilă variabila 'intrebari' care conține vectorul de întrebări
		// în fișierul views/chestionar.ejs este accesibilă variabila 'intrebari' care conține vectorul de întrebări
		res.render('chestionar', {
			intrebari: listaIntrebari,
			titlu: 'Test!',
			log: req.session.prenume
		});
	});
});
app.post('/rezultat-chestionar', (req, res) => {
	console.log(req.body);
	let c = 0;
	fs.readFile('intrebari.json', (err, data) => {
		let listaIntrebari = JSON.parse(data);
		for (let i = 0; i < listaIntrebari.length; ++i) {
			if (listaIntrebari[i].corect == req.body["" + i]) {
				++c;
			}
		}
		res.render('rezultat-chestionar',
			{
				intrebari: listaIntrebari,
				raspunsuri_corecte: c,
				titlu: 'Rezultat',
				log: req.session.prenume
			});
	});
});
app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:`));
