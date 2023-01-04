import React from "react";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css"

class Notes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: [],
      activeItem: {
        id: null,
        title: "",
        completed: false,
      },
      editing: false,
    };
    this.fetchTasks   = this.fetchTasks.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handelStirke = this.handelStirke.bind(this);
  }
  componentWillMount() {
    this.fetchTasks();
  }

  fetchTasks() {
    console.log("Fetching...");

    fetch("http://127.0.0.1:8000/api/task-list/")
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          todoList: data,
        })
      );
  }

  handleChange(e) {
    let title = e.target.value;
    this.setState({
      activeItem: {
        ...this.state.activeItem,
        title: title,
      },
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let url = "http://127.0.0.1:8000/api/task-list/";
    if (this.state.editing == true) {
      url = `http://127.0.0.1:8000/api/task-list/${this.state.activeItem.id}`;
      console.log(this.state.activeItem.id);
      this.setState({
        editing: false,
      });
      this.handleDelete(this.state.activeItem)
    }
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(this.state.activeItem),
    })
      .then(() => {
        this.fetchTasks();
        this.setState({
          activeItem: {
            id: null,
            title: "",
            completed: false,
          },
        });
      })
      .catch(function (error) {
        console.log("ERROR:", error);
      });
  }
  handleDelete(Task) {
    let url = `http://127.0.0.1:8000/api/task-list/${Task.id}`;
    fetch(url, {
      method: "delete",
      headers: {
        "Content-type": "application/json",
      },
    }).then(() => {
      this.fetchTasks();
    });
  }

  handelStirke(Task) {
    Task.completed = !Task.completed;
    let url = `http://127.0.0.1:8000/api/task-list/${Task.id}`
    fetch(url,{
      method:'put',
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ title : Task.title, completed: Task.completed})
    }).then((response) => {
      this.fetchTasks();
    });
  }

  startEditing(Task) {
    this.setState({
      activeItem: Task,
      editing: true,
    })
  }

  render() {
    let tasks = this.state.todoList;
    let self = this;
    return (
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form id="form" onSubmit={this.handleSubmit}>
              <div className="flex-wrapper">
                <div style={{ flex: 6 }}>
                  <input
                    onChange={this.handleChange}
                    value={this.state.activeItem.title}
                    className="form-control"
                    id="title"
                    type="text"
                    name="title"
                    placeholder="Add task.."
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <input
                    id="submit"
                    className="btn btn-warning"
                    type="submit"
                    name="Add"
                  />
                </div>
              </div>
            </form>
          </div>

          <div id="list-wrapper">
            {tasks.map(function (task, index) {
              return (
      
                <div key={index} className="task-wrapper flex-wrapper">
                  <div
                    onClick={() => self.handelStirke(task)}
                    style={{ flex: 7 }}
                  >
                    {task.completed == false ? (
                      <span>{task.title}</span>
                    ) : (
                      <strike>{task.title}</strike>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <button
                      onClick={() => self.startEditing(task)}
                      className="btn btn-sm btn-outline-info"
                    >
                      Edit
                    </button>
                  </div>

                  <div style={{ flex: 1 }}>
                    <button
                      onClick={() => self.handleDelete(task)}
                      className="btn btn-sm btn-outline-dark delete"
                    >
                      -
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Notes;
