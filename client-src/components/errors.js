const React = require('react');

module.exports = props => (
  <div>
    {props.errors.map((err, i) => { 
      const boundClick = props.main.removeError.bind(props.main, err);
      return <div key={i} className="bg-red rounded white">
        {err.message}
        <span onClick={boundClick} className="right-align">
          &times;
        </span>
      </div>
    })}
  </div>
)