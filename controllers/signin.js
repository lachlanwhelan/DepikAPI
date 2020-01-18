const handleSignin = (req, res, db, bcrypt, jwt) => {
    db.select('email', 'hash').from('user')
    .where('email', '=', req.body.email)
    .then(data => {
        //compare request password to db password - returns true if matches
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if(isValid){
            db.select('*').from('user')
            .where('email', '=', req.body.email)
            .then(user => {
                console.log(req.body);
                const currentUser = user[0]
                //creates token
                jwt.sign({currentUser}, 'secretKey', (err, token) => {
                   res.status(200).json({
                       status: 200,
                       token: token,
                       user: currentUser
                   });
                })
            })
            .catch(err => res.status(400).json('unable to get user'));
        }else{
           res.status(400).json('invalid'); 
        }
    })
    .catch(err => res.status(400).json('wrong credentials'));
}


module.exports = {
    handleSignin : handleSignin
}