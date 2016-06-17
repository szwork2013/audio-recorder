const React = require('react');
const Link = require('react-router').Link;

module.exports = props => (
  <div className="md-col-4 sm-col-6 p2 mb1">
    <div 
      className="rounded-top bg-image"
      style={{ backgroundImage: `url('http://placekitten.com/g/190/200')`}}></div>
    <div className="flex flex-column bg-silver navy rounded-bottom">
      <Link 
        className="mt2 mb1 px2 medium m0 black"
        to={`/problems/${props.problem.id}`}>
          {props.problem.title}
      </Link>
      <p className="px2 m0 small">{props.problem.description || 'No description.'}</p>
      <p className="px2 m0 mb2 small">By <Link to={`/problems`}>Zeke N</Link></p>
    </div>
  </div>
);