import React from "react";
import { Link } from "react-router-dom";
import Clock from 'react-live-clock';

class Tasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      sortByDate: true,
      search: null,
      curTime : new Date()
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

  changeTitle(id, event) {
    event.preventDefault();
    const { tasks } = this.state;
    const taskId = tasks.findIndex((task) => task.id === id);
    tasks[taskId].title = event.target.value;
    this.setState({ tasks: tasks });
  }

  changeTag(id, event) {
    event.preventDefault();
    const { tasks } = this.state;
    const taskId = tasks.findIndex((task) => task.id === id);
    tasks[taskId].tag = event.target.value;
    this.setState({ tasks: tasks });
  }

  editStart(id) {
    this.setState(prevState => ({
      tasks: prevState.tasks.map(
        task => task.id === id ? { ...task, editToggle: !task.editToggle } : task
      )
    }))
  }

  editEnd(id, event) {
    event.preventDefault()
    const url = `/api/v1/edit/${id}`;
    const { tasks } = this.state;
    const taskId = tasks.findIndex((task) => task.id === id);
    const body = {
      title: tasks[taskId].title, 
      tag: tasks[taskId].tag
    };

    const token = document.querySelector('meta[name="csrf-token"]').content;
    fetch(url, {
      method: "PUT",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(() => this.props.history.push(`/tasks`))
      .catch(error => console.log(error.message));

    this.setState(prevState => ({
      tasks: prevState.tasks.map(
        task => task.id === id ? { ...task, editToggle: !task.editToggle } : task
      )
    }))
  }

  deleteTask(id) {
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
      tasks: prevState.tasks.filter(task => task.id !== id)
    }))
  }

  onSearch(event) {
    let keyword = event.target.value;
    this.setState({search: keyword})
  }

  onSort() {
    this.setState((prevState) => ({
      sortByDate: !prevState.sortByDate
    }))
  }

  render() {
    const { tasks, sortByDate } = this.state;

    const editing = (task) => (
      <div className="row">
        <div className="column">
          <button className="btn btn-light align-middle mr-1">
            <svg xmlns="https://www.w3.org/2000/svg" width="30" height="32" fill="green" className="bi bi-check2 float-right" viewBox="0 0 16 16" onClick={() => { this.deleteTask(task.id) }}>
              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
            </svg>
          </button>
        </div>                
        <div className="column">
          <button className="btn btn-light align-middle mr-1">
            <svg xmlns="https://www.w3.org/2000/svg" width="30" height="32" fill="currentColor" className="bi bi-pen float-right" viewBox="0 0 16 16" onClick={() => { this.editStart(task.id)}}>
              <path d="M13.498.795l.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
            </svg>
          </button>
        </div>
        <div className="column">
          <button className="btn btn-light align-middle ">
            <svg xmlns="https://www.w3.org/2000/svg" width="30" height="32" fill="red" className="bi bi-trash float-right" viewBox="0 0 16 16" onClick={() => { this.deleteTask(task.id) }}>
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
            </svg>
          </button>
        </div>
      </div>
    );

    const renderForm = (task) => (
      <form onSubmit={(event) => this.editEnd(task.id, event)}>
        <div className="form-group w-75">
          <label htmlFor="taskTitle">Task Title</label>
          <input
            type="text"
            defaultValue={task.title}
            name="title"
            id="taskTitle"
            className="form-control"
            required
            onBlur={(event) => { this.changeTitle(task.id, event)}}
          />
          <label htmlFor="taskTag">Tag</label>
          <input
            type="text"
            defaultValue={task.tag}                   
            name="tag"
            id="taskTag"
            className="form-control"
            required
            onBlur={(event) => { this.changeTag(task.id, event) }}
          />
        </div>
        <button type="submit" className="btn custom-button mt-3">
          Save
        </button>
      </form>
    );

    const renderRecord = (task) => (
      <div className="row w-75 ml-2">
         {task.title}
         <p className="badge rounded-pill bg-info text-white ml-3">{task.tag}</p>
      </div>
    );
    
    const search = (
        <input
            type="text"
            placeholder="Search by tag"
            onChange={(event) => { this.onSearch(event)}}
          />
    );

    const filteredData = tasks.filter((data) => {
      if (this.state.search == null) {
        return data;
      } else if (data.tag.toLowerCase().includes(this.state.search.toLowerCase())) {
        return data;
      }
    })

    const sortedTasks = (filteredData) => {
      let copy = [...filteredData];
      if (sortByDate) {
        return filteredData;
      } else {
        return copy.sort((a, b) => a.tag > b.tag ? 1 : -1);
      }
    };

    const allTasks = sortedTasks(filteredData).map((task, index) => (
      <div key={index} className="w-100">
        <div className="card mb-2 align-middle">
          <div className="card-body mb-0">
            <h5 className="card-text">
              <div className="row">
                <div className="column col-10">
                  {!task.editToggle
                    ? renderRecord(task)
                    : renderForm(task)}
                </div>
                {!task.editToggle ? editing(task) : <></>}
              </div>
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
      
    let day = this.state.curTime.getDate();
    let month = this.state.curTime.getMonth() + 1;
    let year = this.state.curTime.getFullYear();
    return (
      <>
        <section className="jumbotron jumbotron-fluid text-center">
          <div className="container py-3">
            <h1 className="display-4">Manual Task Manager</h1>
            <h2>{day}/{month}/{year}   <Clock format={'HH:mm:ss'} ticking={true} timezone={'Singapore'} /></h2>
          </div>
        </section>
        <div className="py-5">
          <main className="container">
            <div className="row mb-3">
              <div className="col-2 text-left mr-1">
              { search }
              </div>
              <div className="col-8">
              {sortByDate
              ? <button className="btn custom-button custom" onClick={() => this.onSort()}>
                  Sort by Tag
                </button>
              : <button className="btn btn-secondary custom" onClick={() => this.onSort()}>
                  Sort by Date Created
                </button>
              }</div>
              <div className="col text-right">
              <Link to="/new_task">
                <svg xmlns="https://www.w3.org/2000/svg" height="32" fill="black" className="bi bi-plus-square-fill" viewBox="0 0 16 16">
                  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z" />
                </svg>
              </Link>
              </div>
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