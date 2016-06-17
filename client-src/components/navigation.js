const ReactRouter = require('react-router');
const Link = ReactRouter.Link;
const React = require('react');

const links = [
  {
    label: 'Problems',
    url: '/problems',
    auth: true
  },
  {
    label: 'New Problem',
    url: '/problems/new',
    auth: true
  },
  {
    label: 'Login',
    url: '/login',
    hideLoggedIn: true
  },
];

const pickLinks = loggedIn => {
  return links
    .filter(link => (loggedIn && link.auth) || (!loggedIn && link.hideLoggedIn))
    .map((link, i) => <Link className="mr3" key={i} to={link.url}>{link.label}</Link>);
}

const logoutBtn = (loggedIn, main) => {
  if(loggedIn) {
    return <a onClick={main.logout.bind(main)}>Logout</a>
  }
}

module.exports = (props) => {
  return (
    <nav className="m0 p2 border-bottom navy">
      {pickLinks(props.loggedIn)}
      {logoutBtn(props.loggedIn, props.main)}
    </nav>
  );
}