const React = require('react');

module.exports = (props) => (
  <div className="bg-navy main-container pt2">
    <div className="p3 mx-auto bg-white rounded navy" style={{ width: '900px' }}>
      {props.children}
    </div>
  </div>
);