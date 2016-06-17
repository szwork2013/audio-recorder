const React = require('react');
const ProblemEndpoint = require('../../models/problem')


class ProblemView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      problem: {}
    };
  }

  componentDidMount() {
    return ProblemEndpoint.findById(this.props.params.id)
      .then(problem => this.setState({ problem }))
      .catch(this.props.main.addError);
  }

  render() {}
}