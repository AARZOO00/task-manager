const User = require('../models/user.model');
const Task = require('../models/task.model');
const { AppError } = require('../utils/appError');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, total: users.length, data: users });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User deleted
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('User not found.', 404));

    await Task.deleteMany({ user: req.params.id });
    await user.deleteOne();

    res.status(200).json({ success: true, message: 'User and their tasks deleted.' });
  } catch (err) {
    next(err);
  }
};
