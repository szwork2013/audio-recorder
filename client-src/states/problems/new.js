const React = require('react');
const update = require('react-addons-update');
const NormalLayout = require('../../components/normalLayout');
const ProblemEndpoint = require('../../models/problem');
const stateHelper = require('../../stateHelper');

class NewProject extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      problem: {
        title: '',
        description: ''
      }
    };
  }

  submit(evt) {
    evt.preventDefault();
    return ProblemEndpoint.create(this.state.problem)
      .then(problem => {
        stateHelper.goTo(problem);
      })
      .catch(e => this.props.main.addError(e));
  }

  changeTitle(evt) {
    this.setState(update(this.state, {
      problem: { title: {$set: evt.target.value }}
    }));
  }

  changeDescription(evt) {
    this.setState(update(this.state, {
      problem: { description: {$set: evt.target.value }}
    }));
  }

  render() {
    return (
      <NormalLayout>

        <form onSubmit={this.submit.bind(this)}>
          <div>
            <label className="label" for="title">Title</label>
            <input
              autofocus
              type="text"
              name="title"
              className="input"
              onChange={this.changeTitle.bind(this)}
              value={this.state.problem.title}/>
          </div>

          <div>
            <label className="label" for="description">Description</label>
            <textarea
              className="textarea"
              name="description"
              onChange={this.changeDescription.bind(this)}
              value={this.state.problem.description}/>
          </div>

          <div>
            <button type="submit" className="btn btn-outline">Get Recording</button>
          </div>
        </form>
      </NormalLayout>
    );
  }
}

module.exports = NewProject;