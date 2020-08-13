const saltRounds = 10;
const handleSignup =  (req , res , db , bcrypt) => {
  const {email , fullname , password , username } = req.body;
  if(email !=='' && password !== '' && fullname !== '' && username !== ''){
     const hash = bcrypt.hashSync(password, saltRounds);
    db.transaction(trx =>{
      trx.insert({
        hash : hash,
        username : username 
      })
      .into('login')
      .returning('username')
      .then(loginUsername => {
        return  trx('users')
          .returning('*') 
          .insert({
            email : email,
            fullname : fullname,
            username : loginUsername[0],
            joined : new Date()
          })
          .returning('username')
          .then(infoUsername => {
            return trx('playerinfo')
            .returning('*')
            .insert({
              username : infoUsername[0]         
            })
            .returning('username')
            .then(serverUsername => {
              return trx('serverposition')
              .returning('*')
              .insert({
                username : serverUsername[0]
              })
            })
          })
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => res.status(400).json({constraint : '_email_property_clash'}))
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err =>res.status(400).json({constraint : '_username_property_clash'})); 
  }
}

module.exports ={
  handleSignup: handleSignup
};
