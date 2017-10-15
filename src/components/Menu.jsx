var React = require('react');
var Parse = require('parse');

var CreateMissionForm = require('./CreateMissionForm.jsx');
var HomeScreenButton = require('./HomeScreenButton.jsx');

var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Navbar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;
var NavItem = require('react-bootstrap').NavItem;
var Badge = require('react-bootstrap').Badge;
var TimerMixin = require("react-timer-mixin");

var Menu = React.createClass({
    render: function() {

        return (
                <Nav bsStyle="pills" justified onSelect={this.props.onChange}>
                  <NavItem className="hvr-float navButtons" eventKey={1}><span className="navIcons fa fa-user fa-3x"></span><span className="iconText">Profile</span></NavItem>
                  <NavItem className="hvr-float navButtons" eventKey={2}><span className="navIcons fa fa-comments fa-3x"></span><span className="iconText">Inbox</span></NavItem>
                  <NavItem className="hvr-float" eventKey={'home'}>
                  {
                      this.props.location === 'home' ? <CreateMissionForm user={this.props.user}/> :
                      <HomeScreenButton className="hvr-float" />
                  }
                  </NavItem>
                  <NavItem  className="hvr-float navButtons" eventKey={3}><span className="navIcons fa fa-map-marker fa-3x"></span><span className="iconText">Missions</span></NavItem>
                  <NavItem  className="hvr-float navButtons" eventKey={4}><span className="navIcons fa fa-gear fa-3x"></span><span className="iconText">Settings</span></NavItem>
                </Nav>
        )
    }
})

module.exports = Menu;
