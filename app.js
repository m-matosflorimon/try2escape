var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('mongodb://127.0.0.1/Try2Escape', ['clients','missions', 'reservations','history','availability']);
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
    res.render('index.ejs');
    /*db.Missions.find(function (err, docs) {
        console.log(docs);
    });*/
});

app.get('/form/load', function(req, res){
   
    var date = req.query.date.split(",");
        date = new Date(date[2], date[1], date[0]);
    db.availability.findOne(
        {
            "date": date},
            {"_id": 0, "missions": 1, "time": 1},
            function(err,docs){
        var response = [];
        var i = 0
        if(err){
            console.log(err);
            return;
        }
        if(!docs){
            res.send(null);
            console.log("vacio");
            return;
        }
        console.log("available");
        console.log(docs);
        var missionTime = [];
        var missionsIds = [];
        
        for( i ; i<docs.missions.length;i++){
            var missionId = docs.missions[i].name;
            missionsIds.push(missionId);
            /*missionTime.push(docs.missions[i].time);
            console.log("missionTime");
            console.log(missionTime);*/
           // if(docs.missions[i].time.indexOf() != -1)
            response.push({
                name : missionId,
                //times : missionTime[i],
                times : docs.missions[i].time,
                people : null
            });
        
    }
        console.log("Response");
        console.log(response);
        
        db.missions.find({"_id": {$in: missionsIds}}, function(err, doc){
            if(err){
                console.log(err);
                return;
            }
            if(!docs){
                res.send(null);
                console.log("vacio");
                return;
            }
            //console.log(doc);

            for(var i = 0; i<response.length; i++){
                //console.log("response: " + response[i].name);
                for(var o = 0; o<doc.length; o++){
                    //console.log("doc: " + doc[o]._id);
                    //console.log(typeof response[i].name);
                    //console.log(typeof doc[o]._id); 
                    if(response[i].name.toString() == doc[o]._id.toString()){
                        //console.log("llegue aqui");
                        response[i].name = doc[o].name;
                        response[i].people = doc[o].people;
                        break; 
                    }
                }
            }
            //console.log(response);
            console.log("success");
            response.push(docs.time);
            console.log(response);
            res.send(response);

        });
    });
    //console.log(result);
   
    //console.log(addresses);


});

app.post('/form/submitted', function(req, res){
    
    //Validating name
    var patt = /^[a-zA-Z \'\-]+$/;
    req.checkBody('name', 'El nombre es requerido').notEmpty();
    if(!patt.test(req.body.name)){
        console.log('errors in name');
    }
    

    //Validating phone
    req.checkBody('phone', 'El telefono es requerido').notEmpty();
    req.checkBody('phone', 'El telefono no es valido').isInt();
    req.checkBody('phone', 'El telefono no es valido').isLength({min: 10, max: 10});


    //Validating email
    req.checkBody('email', 'El email es requerido').notEmpty();
    req.checkBody('email', 'El email no es valido').isEmail();

    var errors = req.validationErrors();

    if(errors){
        console.log('errors in submission');
        console.log(errors);
    }else{
        console.log("no errors in submission");

        var email = req.body.email;

        db.clients.findOne({"email": email},{"_id":1}, function(err, doc){
            if(err){ //Db error
                console.log(err);
            }else if(!doc){ //New User
                console.log("no existe el usuario submitted");
                //console.log(doc);
            }else{ //Old User
                console.log("existe el usuario submitted");
                req.body.client = doc._id.toString();
                
                db.missions.findOne({"name": req.body.mission},{"_id":1},function(err,doc){
                   
                    req.body.mission = doc._id.toString();
                    validateSubmission(req.body);
                    
                });
               
                

                
            }
        });

    }




    //console.log(req.body);
    res.redirect('/');
    
    /*var submit = new Date();
    var newUser = {
        submission_date : submit,
        mision : req.body.mision,
        hora : req.body.hora,
        personas : req.body.personas,
        nombre : req.body.nombre,
        telefono : req.body.telefono,
        correo : req.body.correo
    }
    db.users.insert(newUser, function(err,result){
        if(err){
            console.log(err);
        }else{*/

            /*app.mailer.send('email', {
                to: 'juan.luis_05@hotmail.com', // REQUIRED. This can be a comma delimited string just like a normal email to field. 
                subject: 'Test Email', // REQUIRED.
                //otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables.
              }, function (err) {
                if (err) {
                  // handle error
                  //console.log(err);
                  //res.send('There was an error sending the email');
                  //return;
                }
                res.redirect('/');
              });*/
         /*   res.redirect('/');
        }
    });*/
    //console.log(newUser);
    
    
});

function validateSubmission(reservation){
    var date = reservation.reservDate.split(",");
    date = new Date(date[2], date[1], date[0]);

    db.reservations.findOne({
    "date": date,
    "time": reservation.time,
    "client": mongojs.ObjectId(reservation.client.toString()),
    "mission":mongojs.ObjectId(reservation.mission.toString())},
    {"date": 1,"client":1,"mission":1},
    function(err,doc){
        /*console.log("checking reserv");
        console.log(doc);
        console.log(reservation);*/
        if(err){ //Db error
            console.log(err);
        }else if(doc){ //Not available
            
                /*console.log(doc);
                console.log(reservation);*/
                console.log("la reserva ya existe");
            

        }else{ //Reservation does not exist
            console.log("no existe la reserv");
            db.availability.findOne({"date": date,
            "time": {$elemMatch: {"time":reservation.time,"available":{$gte:1}}},
            "missions": {$elemMatch: {"name": mongojs.ObjectId(reservation.mission.toString()),"time": {$elemMatch: {$eq:reservation.time}}}}},
            function(err,response){
                console.log("Checking mission");
                /*console.log(response);*/
                if(err){
                    console.log(err);
                }else if(!response){
                    console.log("mission not available");
                }else{//Mission does exist and time is available
                    console.log("mission available");
                    console.log(reservation);//Hasta aqui (now update DB)
                    updateReservDb(date, reservation, response._id);
                }
            });
        }
    });
}

function updateReservDb(date, reservation, reservId){
    db.reservations.insert({
        "date" : date,
        "time" : reservation.time,
        "dateSubmitted" : new Date(),
        "client" : mongojs.ObjectId(reservation.client.toString()),
        "mission" : mongojs.ObjectId(reservation.mission.toString()),
        "people" : reservation.people,
        "status" : "reserved"
    },function(err,doc){
        console.log(err);
        console.log(doc);
        console.log("we did it!");//Hasta aqui
        db.availability.update({"_id": mongojs.ObjectId(reservId.toString()), "time": { $elemMatch: { "time": { $eq: reservation.time }}}}, //Check so it only updates the right time
        {
          $inc: { "time.$.available": -1},
          $currentDate: { lastModified: true },
          $pull: {"missions.time": "5:00pm"}
        },function(err,doc){
            console.log(err);
            console.log("Update Result");
            console.log(doc);

            /*db.availability.findOneAndUpdate({}, {$pull: {"missions.time": "5:00pm"}}, function(err, data){
                if(err) {
                  return res.status(500).json({'error' : 'error in deleting address'});
                }
        
                res.json(data);
        
              });*/

        });
    });
}



app.listen(8000, function(){
    console.log('Server started on Port 8000...');
});