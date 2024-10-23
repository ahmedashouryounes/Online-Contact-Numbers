const express = require('express');
const router = express.Router();
const { generateToken } = require('../../config/jwt');

const VALID_USERS = [
  { username: 'user1', password: 'user1' },
  { username: 'user2', password: 'user2' }
];

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = VALID_USERS.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user);
  res.json({ token, username: user.username });
});

module.exports = router;