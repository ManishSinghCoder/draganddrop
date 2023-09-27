import "./App.css";
import React, { useState } from "react";

const taskList = [
  { title: "Task", filterStatus: "todo", myClassName: "todoTask" },
  {
    title: "In Progress",
    filterStatus: "inProgress",
    myClassName: "inProgressTodoTask"
  },
  { title: "Done", filterStatus: "done", myClassName: "doneTodoTask" }
];

export default function App() {
  const [todo, setTodo] = useState("");
  const [tasks, setTasks] = useState([]);

  const handleSubmit = () => {
    setTasks([...tasks, { todo, status: "todo", timeStamp: Date.now() }]);
    setTodo("");
  };

  const updateTaskStatus = (taskIndex, newStatus) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].status = newStatus;
    setTasks(updatedTasks);
  };

  return (
    <div className="App">
      <input
        type="text"
        onChange={(e) => setTodo(e.target.value)}
        value={todo}
        className="inputfield"
      />
      <button
        className="btnSubmit"
        disabled={todo.length <= 0}
        onClick={handleSubmit}
      >
        Submit
      </button>

      <div className="container">
        {taskList.map((item, index) => (
          <TaskList
            title={item.title}
            tasks={tasks}
            updateTaskStatus={updateTaskStatus}
            filterStatus={item.filterStatus}
            filterClassName={item.myClassName}
            timeStamp={item.timeStamp}
            setTasks={setTasks}
          />
        ))}
      </div>
    </div>
  );
}

function TaskList({
  title,
  tasks,
  updateTaskStatus,
  filterStatus,
  filterClassName,
  setTasks
}) {
  const onDragStart = (evt) => {
    let element = evt.currentTarget;
    element.classList.add("dragged");
    console.log(evt.currentTarget);
    evt.dataTransfer.setData("text/plain", evt.currentTarget.id);
    evt.dataTransfer.effectAllowed = "move";
  };

  const onDragEnd = (evt) => {
    evt.currentTarget.classList.remove("dragged");
  };

  const onDragEnter = (evt) => {
    evt.preventDefault();
    let element = evt.currentTarget;
    element.classList.add("dragged-over");
    evt.dataTransfer.dropEffect = "move";
  };

  const onDragLeave = (evt) => {
    let currentTarget = evt.currentTarget;
    let newTarget = evt.relatedTarget;
    if (newTarget.parentNode === currentTarget || newTarget === currentTarget)
      return;
    evt.preventDefault();
    let element = evt.currentTarget;
    element.classList.remove("dragged-over");
  };

  const onDragOver = (evt) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "move";
  };

  const onDrop = (evt) => {
    evt.preventDefault();
    evt.currentTarget.classList.remove("dragged-over");
    let data = evt.dataTransfer.getData("text/plain");
    let updated = tasks.map((task) => {
      if (task.todo === data) {
        task.status = filterStatus;
      }
      return task;
    });
    setTasks(updated);
  };

  return (
    <div className="subContainer">
      <h1 className="heading">{title}</h1>
      <div
        onDragLeave={(e) => onDragLeave(e)}
        onDragEnter={(e) => onDragEnter(e)}
        onDragEnd={(e) => onDragEnd(e)}
        onDragOver={(e) => onDragOver(e)}
        onDrop={(e) => onDrop(e, false, filterStatus)}
        className="myContainer"
      >
        {tasks.map(
          (task, index) =>
            (filterStatus === undefined || task.status === filterStatus) && (
              <div
                draggable
                onDragStart={(e) => onDragStart(e)}
                onDragEnd={(e) => onDragEnd(e)}
                className={filterClassName}
                key={index}
                id={task.todo}
              >
                <p className="title">{task.todo}</p>
                <div className="buttonSection">
                  <button className="prevButton" disabled={task.status === "todo"} onClick={() => updateTaskStatus(index, task.status === "inProgress" ? "todo" : "inProgress")} >
                    Prev
                  </button>
                  <button
                    className="nextButton"
                    disabled={task.status === "done"}
                    onClick={() => updateTaskStatus(index, task.status === "todo" ? "inProgress" : "done")}
                  >
                    Next
                  </button>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}
