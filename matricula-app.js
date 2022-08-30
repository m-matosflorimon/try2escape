var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('Try2Escape', ['clients','missions', 'reservations','history','availability','preClients']);
var mailer = require('express-mailer');

var app = express();

//Mailer
mailer.extend(app, {
    from: 'mem23798@gmail.com',
    host: 'smtp.gmail.com', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
      user: 'mem23798@gmail.com',
      pass: ''
    }
  });

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//mongodb events
db.on('error', function (err) {
	console.log('database error', err)
})

db.on('connect', function () {
	console.log('database connected')
})

//View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Set static path
app.use(express.static(path.join(__dirname, 'public')));

//Express validator MiddleWare
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return{
            patgfcram : formParam,
            msg : msg,
            value : value
        };
    }
}));

app.get('/', function(req, res){
    res.render('matricula.ejs');
});

app.post('/form/submitted', function(req, res){

    //Validating email
    req.checkQuery('email', 'El email es requerido').notEmpty();
    req.checkQuery('email', 'El email no es valido').isEmail();

    var errors = req.validationErrors();
    // console.log(req.body.email);
    // console.log(req.query);
    var response = {msg : ""};
    if(errors){
        response.msg = "validation error";
        res.send(response);
        //Submission error
        console.log('errors in submission');
        console.log(errors);
    }else{
        console.log("no errors in submission");

        var email = req.query.email;
        console.log(email);

        db.preClients.findOne({"email": email},{"_id":1}, function(err, doc){
            if(err){ //Db error
                response.msg = "unsuccessful";
                res.send(response);
                console.log(err);
            }else if(!doc){ //New User
                console.log("no existe el usuario submitted");
                db.preClients.insert({'email':email},function(err,doc){
                    if(err){
                        response.msg = "unsuccessful";
                        //DB error
                        console.log('no se pudo insertar');
                    }else{
                        response.msg = "successful";
                         //Succesful
                        console.log('bye');
                    }
                    
                    res.send(response);
                });
            }else{ 
                response.msg = "old user";
                //Old User
                console.log("existe el usuario submitted");
                
                res.send(response);
            }
        });
        
    }


    
});

app.listen(8000, function(){
    console.log('Server started on Port 8000...');
});