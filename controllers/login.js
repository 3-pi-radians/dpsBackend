const handleLogin = (req, res, db, bcrypt) => { 
  const { username , password } = req.body;
	db('login').select('username', 'hash')
  .where('username', '=', username)
  .then(data =>{
    if(bcrypt.compareSync(password, data[0].hash)){
     return db('playerinfo').select('*')
      .where('username', '=', username)
      .then(user => {
        res.json(user[0])
      })
      .catch(err =>{
        console.log(err);
        res.status(400).json('error  logging in')
      })
    }
    else {
      console.log('error')
      res.status(400).json('invalid  password username or password');
    }
  })
  .catch(err =>{
    console.log(err);
    res.status(400).json('invalid username or password')
  });
}

module.exports = {
  handleLogin : handleLogin
}