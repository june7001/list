const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const pool = require("../config/db");

const authController = {
  register: async (req, res) => {
    try {
      const { username, password, email } = req.body;

      const schema = joi.object({
        username: joi.string().min(3).max(30).required(),
        password: joi.string().min(6).max(30).required(),
        email: joi.string().email().required(),
      });

      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert the user into the database
      const [result] = await pool.query(
        "INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)",
        [username, hashedPassword, email]
      );

      // Return the created user (excluding the password_hash)
      const newUser = {
        id: result.insertId,
        username,
        email,
      };
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(6).max(30).required(),
      });

      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);

      if (!user || user.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      // Compare the provided password with the hashed password from the database
      const isPasswordValid = await bcrypt.compare(
        password,
        user[0].password_hash
      );

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Generate the JWT token
      const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
      });

      res.cookie("jwt", token, {
        httpOnly: false,

        secure: false,
        sameSite: "strict",
        maxAge: 259200000,
      });

      res.status(200).json({
        message: "Login successful",
        token: token,
        username: user[0].username,
      });
    } catch (error) {
      res.status(500).json({ message: "An error occurred during login" });
    }
  },

  getUserById: async (req, res) => {
    try {
      const schema = joi.object({
        id: joi.number().integer().min(1).required(),
      });

      const { error } = schema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const userId = req.params.id;
      const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [
        userId,
      ]);

      if (!user || user.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      // Exclude the password_hash from the response
      const userData = {
        id: user[0].id,
        username: user[0].username,
        email: user[0].email,
      };

      res.status(200).json(userData);
    } catch (error) {
      res
        .status(500)
        .json({ message: "An error occurred while retrieving user data" });
    }
  },
};

module.exports = authController;
