import React from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class NewTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      tag: "",
      date: new Date()
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.stripHtmlEntities = this.stripHtmlEntities.bind(this);
  }

  stripHtmlEntities(str) {
    return String(str)
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleChange(event) {
    this.setState({
      date: event
    })
  }

  onSubmit(event) {
    event.preventDefault();
    const url = "/api/v1/tasks/create";
    const { title, tag, date } = this.state;

    if (title.length == 0)
      return;

    const body = {
      title, tag, date
    };

    const token = document.querySelector('meta[name="csrf-token"]').content;
    fetch(url, {
      method: "POST",
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
  }

  render() {
    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-12 col-lg-6 offset-lg-3">
            <h1 className="font-weight-normal mb-5">
              Add a new task.
            </h1>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label htmlFor="taskTitle">Task Title</label>
                <input
                  type="text"
                  name="title"
                  id="taskTitle"
                  className="form-control"
                  required
                  onChange={this.onChange}
                />
                <label htmlFor="taskTag">Tag</label>
                <input
                  type="text"
                  name="tag"
                  id="taskTag"
                  className="form-control"
                  required
                  onChange={this.onChange}
                />
                <label htmlFor="taskTag">End Date</label>
                <div></div>
                <DatePicker
                  selected={ this.state.date }
                  onChange={ this.handleChange }
                  selectsStart
                  name="date"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
              <button type="submit" className="btn custom-button mt-3">
                Create Task
              </button>
                <Link to="/tasks" className="btn btn-link mt-3">
                  Back to tasks
                </Link>
            </form>
            
          </div>
        </div>
      </div>
    );
  }

}
  
  export default NewTask;