import fs from 'fs';
let database = [];

// GET ALL
function getAllTodos(req, res) {
  res.status(200).json(database);
}

// POST
function postTodo(req, res) {
  const newData = req.body;
  database.push(newData);
  res.status(200).json(newData);
}

// PUT METHOD
function upDate(req, res) {
  const reqID = req.params.id;
  const updatedTodoData = req.body;

  // Find the index of the todo with the given ID in the 'database' array
  const indexToUpdate = database.findIndex(
    (todo) => todo.id === parseInt(reqID)
  );

  if (indexToUpdate !== -1) {
    // Update the todo data in the 'database' array
    database[indexToUpdate] = {
      ...database[indexToUpdate],
      ...updatedTodoData,
    };
    res.status(200).json(database[indexToUpdate]);
  } else {
    // Todo with the given ID not found
    res.status(404).json({ error: 'Todo not found' });
  }
}

// DELETE
function deleteTodo(req, res) {
  const reqID = req.params.id;
  const todoIndex = database.findIndex((todo) => todo.id == reqID);

  if (todoIndex !== -1) {
    const deletedTodo = database.splice(todoIndex, 1)[0];
    res.status(200).send(deletedTodo);
  } else {
    res.status(404).send({ error: `Todo with id ${reqID} not found` });
  }
}
// DELETE ALL
function deleteAllTodo(req, res) {
  console.log('Deleting all todos...');

  // Save the current state to data.json
  fs.writeFile('data.json', JSON.stringify(database), (err) => {
    if (err) {
      console.error('Error saving data to data.json:', err);
    } else {
      console.log('Data saved to data.json');
    }
  });

  // Clear the in-memory database
  database = [];

  res.status(200).send({ message: 'All todos deleted successfully' });
}
export { getAllTodos, deleteTodo, upDate, postTodo, deleteAllTodo };
