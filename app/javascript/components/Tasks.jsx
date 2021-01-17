import React from "react";
import { Link } from "react-router-dom";

class Tasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: []
    };
  }

  componentDidMount() {
    const url = "/api/v1/tasks/index";
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(response => this.setState({ tasks: response }))
      .catch(() => this.props.history.push("/"));
  }

  deleteTask(id){
    
    const url = `/api/v1/destroy/${id}`;
    const token = document.querySelector('meta[name="csrf-token"]').content;

    fetch(url, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json"
      }
    })

    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok.");
    })
    .then(() => this.props.history.push("/tasks"))
    .catch(error => console.log(error.message));

    this.setState((prevState) => ({
      tasks: prevState.tasks.filter(task => task.id !== id),
    }))
  }

  render() {
    const { tasks } = this.state;
    const allTasks = tasks.map((task, index) => (
      <div key={index} className="w-100">
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">{task.title}
              <Link to={`/task/${task.id}`} className="btn custom-button float-right">
                View Task
              </Link>
              <Link to={`/${task.id}/edit`} className="btn custom-button ml-2">
                Edit Task
              </Link>
              <button type="button" className="btn btn-danger float-right" onClick={() => { this.deleteTask(task.id) }}>
                Delete Task
              </button>
            </h5>
          </div>
        </div>
      </div>
    ));
    const noTask = (
      <div className="vw-100 vh-50 d-flex align-items-center justify-content-center">
        <h4>
          No tasks yet. Why not <Link to="/new_task">create one</Link>
        </h4>
      </div>
    );

    return (
      <>
        <section className="jumbotron jumbotron-fluid text-center">
          <div className="container py-5">
            <h1 className="display-4">Put tasks here</h1>
            <p className="lead text-muted">
              Blah blah blah
            </p>
          </div>
        </section>
        <div className="py-5">
          <main className="container">
            <div className="text-right mb-3">
              <Link to="/new_task" className="btn custom-button">
                Create New Task
              </Link>
            </div>
            <div className="row">
              {tasks.length > 0 ? allTasks : noTask}
            </div>
            <Link to="/" className="btn btn-link">
              Home
            </Link>
          </main>
        </div>
      </>
    );
  }
}
export default Tasks;