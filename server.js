 const express = require('express'); //express module
 const app = express(); //create server 'app'
 const bcrypt = require('bcrypt'); //to hash passwords
 const knex = require('knex'); // to connect to db
 const cors = require('cors'); // middleware for cors allows cross domain communication
 const multer = require('multer'); // middleware for formdata
 const jwt = require('jsonwebtoken'); // json web token for authentication
 const register = require('./controllers/register');
 const signin = require('./controllers/signin');
 const home = require('./controllers/home');

 const storage = multer.diskStorage({
     destination: function(req, file, cb){
         cb(null, './images/');
     },
     filename: function(req, file, cb){
         cb(null, file.originalname);
     }
 })

//check types of files 
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

//configure multer middleware
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

//configure knex - connect to postgres depik  db
 const db = knex({
    client: 'pg',
    connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
    }
 })


 //environmental variables - PORT
 const PORT = process.env.PORT || 3000;

//need to use built-in express json middleware
//json also excepts some params - limit specifies the max size of request
app.use(express.json({limit: '1MB'}));
app.use(cors());
app.use('/images', express.static('images'));// stores image files in public folder
//app.use((req, res) => res.sendFile(INDEX, { root: __dirname }))

  //listens for http requests on PORT and prints a message
 app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
})

/* app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
 }); */
app.get('/', (req, res) => {res.send('it\'s working!')});
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)});
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt, jwt)});
app.get('/images', (req, res) => {home.handleImages(req, res, db)});
app.get('/images/search', (req, res) => {home.handleImageSearch(req, res, db)})
app.post('/upload', upload.single('blob'), (req, res) => {home.handleImageUpload(req, res, db)});
app.post('/delete', (req, res) => {home.handleDelete(req,res, db)});
/* app.get('/checkUser', verifyToken, (req, res) => {

    jwt.verify(req.token, 'secretKey', (err, authData) => {
        if(err){
            res.senStatus(403)
        }else{
            res.json({
                isValid: true,
                authData
            });
        }
    })

}) */


/*  function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403);
    }
 } */


