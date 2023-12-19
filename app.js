const taskValue = document.getElementById('todoTask');
const showBox = document.querySelector('.showBox');

const updateBtn = document.querySelector('update-btn');
const API_URL = 'http://localhost:4000/api/todo';
// Update the URL to match your server
let currentNumber = 0;
let database = [];
// Fetch tasks from the server when the page loads

//POST
async function showData() {
  const newData = {
    id: ++currentNumber,
    value: taskValue.value,
    done: false,
  };

  database.push(newData);
  taskValue.value = '';

  const index = database.findIndex((todo) => todo.id === newData.id);
  const taskElement = createTaskElement(database[index]);
  showBox.appendChild(taskElement);

  // Make a POST request to the server to save the new data
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    });

    if (!response.ok) {
      console.error('Failed to add task to the server.');
    } // Handle the case where the server request failed
  } catch (error) {
    console.error('Error:', error);
  }
}

function createTaskElement(task) {
  const taskElement = document.createElement('div');
  taskElement.classList.add('showBox_title');
  taskElement.id = task.id;

  taskElement.innerHTML = `
    <span>${task.id}</span>
    <h1 id="heading-${task.id}">${task.value}</h1>
    <button class="update-btn" type="button">
        <span class="update material-symbols-outlined">
        settings
        </span>
    </button>
    <button class="finish-btn" type="button">
        <span class="finish material-symbols-outlined">
        check_small
        </span>
    </button>
    <button class="delete-btn" type="button">
        <span class="delete material-symbols-outlined">
        delete
        </span>
    </button>
    <hr />
   
  `;

  taskElement.addEventListener('click', (event) => {
    handleButtonClick(event, task);
  });
  return taskElement;
}

//PUT
async function updateStyle(taskId) {
  const headingElement = document.getElementById(`heading-${taskId}`);
  const foundData = database.find((data) => data.id === taskId);
  foundData.done = true;

  if (foundData.done) {
    // Toggle the 'done' status
    headingElement.style.textDecoration = database[taskId - 1].done
      ? 'line-through'
      : ''; // Set style based on 'done' status
  }
  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: 'PUT', // Corrected method name to 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(foundData), // Send the found data in the request body
    });

    if (!response.ok) {
      console.error('Failed to update on the server.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function handleButtonClick(event, task) {
  const buttonType = event.target.className;

  switch (buttonType) {
    case 'update-btn': // Implement logic for update task
    case 'update material-symbols-outlined':
      updateData(task.id);
      break;
    case 'finish-btn': // Implement logic for task ist done
    case 'finish material-symbols-outlined':
      updateStyle(task.id);
      break;
    case 'delete-btn':
    case 'delete material-symbols-outlined':
      // Implement logic for deleting task
      deleteTask(task.id);
      break;
    default:
      break;
  }
}
//  OPEN BOX with OLD data (Render Old Data)
function updateData(taskId) {
  const updatebox = document.querySelector('.updatebox');
  updatebox.style.display =
    updatebox.style.display === 'none' || updatebox.style.display === ''
      ? 'flex'
      : 'none';

  const index = database.findIndex((todo) => todo.id === taskId);
  const html = `
  <div class="closeBar">
    <span id="closeBtn" onclick="closeTaskBarUpdate()" class="material-symbols-outlined">
      close
    </span>
  </div>
  <div class="titleUpdateBox">Update your data</div>
  <h1>Old Task:  ${database[index].value}</h1>
  <h1>Old Status:  ${database[index].done ? 'Done' : 'Not Done'}</h1>
  <div class="addNewData">
    <input id="newTaskValue" type="text" placeholder="Type please new task here:" />
    <input id="newTaskStatus" type="text" placeholder="Status done? YES/NO"/>
  </div>
  <button class="add" onclick="addNewData(${taskId})">Add new value</button>
  `;

  // Update the inner HTML of updatebox
  updatebox.innerHTML = html;
}
// CHANGE OLD data to a new data - ADD NEW VALUE (BUTTON)
async function addNewData(taskId) {
  const newTaskValue = document.getElementById('newTaskValue');
  const newTaskStatement = document.getElementById('newTaskStatus');
  const index = database.findIndex((todo) => todo.id === taskId);

  if (newTaskValue) {
    let doneValue;

    // Check the value of newTaskStatement and set doneValue accordingly
    if (newTaskStatement.value.toLowerCase() === 'yes') {
      doneValue = true;
    } else if (newTaskStatement.value.toLowerCase() === 'no') {
      doneValue = false;
    } else {
      // Default to false if the value is neither 'yes' nor 'no'
      doneValue = false;
    }

    const newData = {
      id: taskId,
      value: newTaskValue.value,
      done: doneValue,
    };
    database[index] = newData;

    // Update the HTML content
    const updatebox = document.querySelector('.updatebox');
    updatebox.innerHTML = `
    <div class="closeBar">
        <span
          id="closeBtn"
          onclick="closeTaskBarUpdate()"
          class="material-symbols-outlined"
        >
          close
        </span>
      </div>
      <div class="titleUpdateBox">Update your data</div>
      <h1>New Task:  ${database[index].value}</h1>
      <h1>New Status:  ${database[index].done ? 'Done' : 'Not Done'}</h1>
      <div class="addNewData">
        <input
          id="newTaskValue"
          type="text"
          placeholder="Type please new task here:"
        />
        <input
          id="newTaskStatus"
        
          type="text"
          placeholder="Status done? YES/NO"
        />
      </div>
      <button class="add" onclick="addNewData(${taskId})">Add new value</button>
    `;
    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT', // Corrected method name to 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData), // Send the found data in the request body
      });

      if (!response.ok) {
        console.error('Failed to update on the server.');
      }
    } catch (error) {
      console.error('Error:', error);
    }

    // render - rewriten a old data with a new data
    const showBoxTitles = document.querySelectorAll(`.showBox_title`);

    showBoxTitles.forEach((element, i) => {
      //index of elements (starting from 0 = zero)
      const databaseItem = database.find((item) => item.id === i + 1);

      if (databaseItem) {
        const spanElement = element.querySelector('span');
        const headingElement = element.querySelector(
          `#heading-${databaseItem.id}`
        );

        if (spanElement && headingElement) {
          spanElement.textContent = databaseItem.id;
          headingElement.textContent = databaseItem.value;

          // Toggle the 'completed' class based on the 'done' property
          headingElement.classList.toggle('completed', databaseItem.done);
        }
      }
    });
  }
}

function closeTaskBarUpdate() {
  const updatebox = document.querySelector('.updatebox');
  updatebox.style.display =
    updatebox.style.display === 'none' || updatebox.style.display === ''
      ? 'flex'
      : 'none';
}

async function deleteTask(taskId) {
  const taskElement = document.getElementById(taskId);

  if (taskElement) {
    // Mark the task as deleted visually
    taskElement.style.display = 'none';
  }

  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to delete todo with ID ' + taskId);
    } else {
      console.log(`Todo with ID ${taskId} deleted visually.`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function deleteAllTask() {
  database = [];
  updateUI(); // You may need to implement this function to refresh the UI
  const html = `<h1>Data deleted succesfully</h1>`;
  showBox.innerHTML = html;
  console.log(`All data deleted successfully.`);

  try {
    const response = await fetch(`${API_URL}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      console.error(error);
    } else {
      window.location.reload();
    }
  } catch (error) {
    console.error(error);
  }
}

function updateUI() {
  // Clear the existing tasks in the UI
  showBox.innerHTML = '';

  // Re-render all tasks in the UI
  database.forEach((task) => {
    if (!task.deleted) {
      const taskElement = createTaskElement(task);
      showBox.appendChild(taskElement);
      console.log(task);
    }
  });
}
