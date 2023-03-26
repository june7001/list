const pool = require("../config/db");
const Joi = require("joi");

const addItemSchema = Joi.object({
  description: Joi.string().min(1).max(255).required(),
  list_id: Joi.number().integer().required(),
});

const updateItemSchema = Joi.object({
  id: Joi.number().integer().required(),
  completed: Joi.boolean().required(),
});

exports.addItem = async (req, res) => {
  try {
    const { error } = addItemSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { description, list_id } = req.body;
    const [result] = await pool.query(
      "INSERT INTO items (description, completed, list_id) VALUES (?, ?, ?)",
      [description, 0, list_id]
    );
    res
      .status(201)
      .json({ message: "Item added successfully", item_id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const [result] = await pool.query("DELETE FROM items WHERE id = ?", [
      itemId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { error } = updateItemSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { id, completed } = req.body;
    const [result] = await pool.query(
      "UPDATE items SET completed = ? WHERE id = ?",
      [completed, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getItemsByListId = async (req, res) => {
  try {
    const listId = req.params.list_id;
    const [items] = await pool.query("SELECT * FROM items WHERE list_id = ?", [
      listId,
    ]);
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
