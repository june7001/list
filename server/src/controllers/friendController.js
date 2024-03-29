const pool = require("../config/db");
const joi = require("joi");

const friendController = {
  addFriend: async (req, res, next) => {
    try {
      const userId = req.user.id;

      const schema = joi.object({
        username: joi.string().min(3).max(30).required(),
      });
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const friendUsername = req.body.username;

      const [[friend]] = await pool.query(
        "SELECT id FROM users WHERE username = ?",
        [friendUsername]
      );

      if (!friend) {
        return res.status(404).json({ message: "Friend not found" });
      }

      if (!friend.id) {
        return res.status(400).json({ message: "Invalid friend data" });
      }

      const [[existingFriend]] = await pool.query(
        "SELECT * FROM friends WHERE user_id = ? AND friend_id = ?",
        [userId, friend.id]
      );

      if (existingFriend) {
        return res.status(400).json({ message: "Friend already added" });
      }

      await pool.query(
        "INSERT INTO friends (user_id, friend_id) VALUES (?, ?)",
        [userId, friend.id]
      );
      await pool.query(
        "insert into friends (user_id, friend_id) values (?, ?)",
        [friend.id, userId]
      );
      res.status(201).json({ message: "Friend added successfully" });
    } catch (err) {
      next(err);
    }
  },

  getAllFriends: async (req, res, next) => {
    try {
      const schema = joi.object({
        userId: joi.number().integer().positive(),
      });
      const { error } = schema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const userId = req.user.id;

      const [friends] = await pool.query(
        "SELECT users.id, users.email, users.username FROM users INNER JOIN friends ON users.id = friends.friend_id WHERE friends.user_id = ?",
        [userId]
      );

      res.status(200).json({
        message: "User's friends",
        data: friends,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = friendController;
