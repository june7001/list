const pool = require("../config/db");
const Joi = require("joi");

const createdListSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
});

const getListsByUsernameSchema = Joi.object({
  selectedUser: Joi.string().min(1).max(255).required(),
});

const listController = {
  createList: async (req, res) => {
    try {
      const { title } = req.body;
      const userId = req.user.id;

      const { error } = createdListSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      // Insert the new list into the database associated with the logged-in user
      const [result] = await pool.query(
        "INSERT INTO lists (title, user_id) VALUES (?, ?)",
        [title, userId]
      );

      // Return the created list
      const newList = {
        id: result.insertId,
        title,
        user_id: userId,
      };
      res.status(201).json(newList);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getListById: async (req, res) => {
    try {
      const listId = req.params.id;
      const userId = req.user.id;

      // Retrieve the list from the database
      const [list] = await pool.query(
        "SELECT * FROM lists WHERE id = ? AND user_id = ?",
        [listId, userId]
      );

      if (!list || list.length === 0) {
        return res.status(404).json({ message: "List not found" });
      }

      res.status(200).json(list[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getListsByUsername: async (req, res, next) => {
    try {
      const { error } = getListsByUsernameSchema.validate(req.params);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const username = req.params.selectedUser;
      const [user] = await pool.query(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );

      if (!user || user.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const userId = user[0].id;
      const [lists] = await pool.query(
        "SELECT * FROM lists WHERE user_id = ?",
        [userId]
      );

      res.status(200).json({
        message: "User's lists",
        data: lists,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = listController;
