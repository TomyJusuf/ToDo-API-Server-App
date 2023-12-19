import express from 'express';
import {
  getAllTodos,
  deleteTodo,
  upDate,
  postTodo,
  deleteAllTodo,
} from './service.js';

const router = express.Router();

// Constants for route paths
const TODO_BASE_PATH = '/todo';
const TODO_ID_PARAM = '/:id';

// Middleware function for logging requests
router.use((req, res, next) => {
  console.log('Request received:', req.method, req.url);
  // console.log('Request body:', res.body);
  next();
});

// Define routes
router.get(TODO_BASE_PATH, getAllTodos);
// router.get(`${TODO_BASE_PATH}${TODO_ID_PARAM}`, getSingleTodo);
router.put(`${TODO_BASE_PATH}${TODO_ID_PARAM}`, upDate);
router.post(TODO_BASE_PATH, postTodo);
router.delete(`${TODO_BASE_PATH}${TODO_ID_PARAM}`, deleteTodo);
router.delete(TODO_BASE_PATH, deleteAllTodo);

export default router;
