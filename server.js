const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(bodyParser.json());

const sequelize = new Sequelize('postgres://postgres:password@postgres:5432/mydatabase', {
  dialect: 'postgres'
});

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  hashedPassword: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

app.post('/signup', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    await User.create({
      username: req.body.username,
      hashedPassword
    });
    res.status(201).send({ message: 'User registered!' });
  } catch (error) {
    res.status(400).send({ message: 'Error registering user.' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: 'No such user found' });
    }

    const validPassword = await bcrypt.compare(password, user.hashedPassword);

    if (validPassword) {
      // Login successful
      // At this point, you might generate a JWT or another authentication token and send it back
      return res.json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ message: 'Incorrect password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log('Server started on http://localhost:3001');
  });
});


