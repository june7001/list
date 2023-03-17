const pool = require('../config/db');

const listController = {
  createList: async (req, res) => {
    try {
      const { title } = req.body;
      const userId = req.user.id;

      // Todo: Validate the input data

      // Insert the new list into the database associated with the logged-in user
      const [result] = await pool.query('INSERT INTO lists (title, user_id) VALUES (?, ?)', [title, userId]);

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
      const [list] = await pool.query('SELECT * FROM lists WHERE id = ? AND user_id = ?', [listId, userId]);

      if (!list || list.length === 0) {
        return res.status(404).json({ message: 'List not found' });
      }

      res.status(200).json(list[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = listController;
