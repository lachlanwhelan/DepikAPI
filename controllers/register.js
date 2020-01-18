const handleRegister = (req, res, db, bcrypt) => {
    const {name, email, password} = req.body;

     bcrypt.genSalt(function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            // Store hash in your password DB.
            db('user')
            .returning('*') // returns the user columns
            .insert({
                name: name,
                email: email,
                hash: hash
            })
            .then(user => {
                res.json({
                    status: 200,
                    user: user[0]
                })
            })
            .catch(err => {
                res.status(400).json(err);
            });
        });
    })
}

module.exports = {
    handleRegister: handleRegister
}