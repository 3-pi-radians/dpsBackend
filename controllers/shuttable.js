
const setResults =  (req , res, db) => {
    const { username , matches, lost , won , rank , exp , winpercent , cash ,rating , averageten , serverpoints } = req.body;
    console.log(req.body);
    db.transaction(trx => {
      return trx('playerinfo')
       .returning('*')
       .where('username', '=', username)
       .update({
        matches : parseInt(matches),
        lost : parseInt(lost),
        won : parseInt(won),
        rank : rank,
        exp : parseFloat(exp),
        winpercent : parseFloat(winpercent),
        cash : parseFloat(cash),
        rating : parseFloat(rating),
        averageten : parseFloat(averageten)
       })
       .returning(['username','matches','rank','cash'])
       .then(arr =>{
        return trx('users')
        .returning('*')
        .where('username', '=', arr[0].username)
        .update({
          matches : arr[0].matches,
          rank : arr[0].rank,
          cash : arr[0].cash,
        })
        .returning('username')
        .then(username => {
          return trx('serverposition')
          .returning('*')
          .where('username', '=', username[0])
          .update({
            serverpoints : serverpoints
          })
        })
        .then(user =>{
          console.log('success', user);
          res.json(user);
        })
        .catch(err => console.log('some problem here', err));
       })
       .then(trx.commit)
       .catch(trx.rollback)
    })
    .catch(err => {
      console.log(err);
      res.status(400).json('cannot update info')
    });
  }
module.exports = {
 setResults : setResults
};