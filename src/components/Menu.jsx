var React = require('react');
var Parse = require('parse');
var ParseReact = require('parse-react');

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
    mixins: [ParseReact.Mixin, TimerMixin],
    observe: function(){
        return {
            newMsgs: (new Parse.Query("Messages")).equalTo('writtenTo', this.props.user).equalTo('read', false)
        }
    },
    componentDidMount(){
        this.setInterval(
            () => {
                this.refreshQueries();
            },
            15000
        )
    },
    render: function() {
        
        var badge = (<Badge pullRight>{this.data.newMsgs.length}</Badge>);

        
        return (
                <Nav bsStyle="pills" justified onSelect={this.props.onChange}>
                  <NavItem className="hvr-float navButtons" eventKey={1}><span className="fa fa-user fa-3x"></span>Profile</NavItem>
                  <NavItem className="hvr-float navButtons" eventKey={2}>{badge}<span className="fa fa-comments fa-3x"></span>Inbox</NavItem>
                  <NavItem className="hvr-float" eventKey={'home'}>
                  {
                      this.props.location === 'home' ? <CreateMissionForm user={this.props.user}/> :
                      <HomeScreenButton className="hvr-float" />
                  }
                  </NavItem>
                  <NavItem  className="hvr-float navButtons" eventKey={3}><span className="fa fa-map-marker fa-3x"></span>Missions</NavItem>
                  <NavItem  className="hvr-float navButtons" eventKey={4}><span className="fa fa-gear fa-3x"></span>Settings</NavItem>
                </Nav>
        )
    }
})

module.exports = Menu;