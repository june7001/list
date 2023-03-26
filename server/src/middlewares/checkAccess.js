const pool = require("../config/db");

const checkAccess = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const username = req.params.selectedUser;

    const [[friend]] = await pool.query(
      "select id from users where username = ?",
      [username]
    );
    if (!friend) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendId = friend.id;

    if (userId === friendId) {
      return next();
    }

    const [[friendship]] = await pool.query(
      "select * from friends where (user_id = ? and friend_id = ?) or (user_id = ? and friend_id = ?)",
      [userId, friendId, friendId, userId]
    );

    if (!friendship) {
      return res
        .status(403)
        .json({ message: "You are not friends with this person :(" });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = checkAccess;
