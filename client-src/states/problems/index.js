const React = require('react');
const ProblemEndpoint = require('../../models/problem')
const ProblemCard = require('../../components/problemCard');

class Problems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      problems: []
    }
  }
  componentDidMount() {
    ProblemEndpoint.find()
      .then(problems => {
        this.setState({ problems });
      });
  }

  render() {
    return (
      <div className="flex bg-navy blue p3 flex-wrap mxn2">
        {
          this.state.problems
            .map((problem, i) => <ProblemCard key={i} problem={problem}/>)
        }
      </div>
    );
  }
}

module.exports = Problems;