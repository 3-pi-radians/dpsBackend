
const getPlayerPos = (req, res, db) => {
  const { username } = req.params;
   console.log('username ', username)
   db.raw('SELECT position.* FROM (SELECT serverposition.*, RANK() OVER (ORDER BY serverpoints DESC) FROM serverposition) position WHERE username = ?', username)
   .then(result => {
    console.log('result ', result.rows)
    res.json(result.rows);
   })
   .catch(err => console.log(err));
 }

const getServerPos = (req, res, db) => {
  db.raw(`SELECT position.* FROM (
      SELECT serverposition.*,
      RANK() OVER ( ORDER BY serverpoints DESC)
      FROM serverposition) position
      WHERE rank <=5`)
  .then(result => {
    console.log(result.rows)
    res.json(result.rows);
  })
  .catch(err => {
    console.log('some error occured')
    res.status(400).json('bad');
  })
 }

 module.exports = {
 	getPlayerPos : getPlayerPos,
 	getServerPos : getServerPos
 };