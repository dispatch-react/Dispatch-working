var React = require('react');
var ReactDOM = require('react-dom');
var Parse = require('parse');
var ParseReact = require('parse-react');
Parse.initialize("ttJuZRLZ5soirHP0jetkbsdqSGR3LUzO0QXRTwFN", "BDmHQzYoQ87Dpq0MdBRj9er20vfYytoh3YF5QXWd");

var Geolocation = require('./components/Geolocation.jsx');
var Login = require('./components/Login.jsx');
var Inbox = require('./components/Inbox.jsx');
var Settings = require('./components/Settings.jsx');
var ShowMissions = require('./components/ShowMissions.jsx');
var Profile = require('./components/Profile.jsx');
var Menu = require('./components/Menu.jsx');

var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Well = require('react-bootstrap').Well;
var Navbar = require('react-bootstrap').Navbar;
var Autocomplete = require('./components/Autocomplete.jsx');
require("./components/OverlayCluster.jsx");

var App = React.createClass({
    
    mixins: [ParseReact.Mixin],
    observe: function() {
        return {
            user: ParseReact.currentUser
        };
    },
    getInitialState: function() {
        return {
            location: 'home'
        }
    },
    navChanged: function(newValue) {
        this.setState({
            location: newValue
        });
    },
    logOut: function() {
      Parse.User.logOut();  
    },
    render: function() {
        if (this.data.user) {
            
            return (
        <Grid>
            <Row className="show-grid">
              <Col xs={10} xsOffset={1} md={6} mdOffset={3}>
                 <Well id="appView">
                    {
                        this.state.location === 1 ? <Profile user={this.data.user}/> :
                        this.state.location === 2 ? <Inbox user={this.data.user}/> :
                        this.state.location === 3 ? <ShowMissions user={this.data.user}/> :
                        this.state.location === 4 ? <Settings user={this.data.user} logOut={this.logOut}/> :
                        <Geolocation user={this.data.user}/>
                        
                    }
                        <Menu onChange={this.navChanged} location={this.state.location} user={this.data.user}/>
                                
                 </Well>
              </Col>
            </Row>
            
        </Grid>
            );
        }
        else {
            return (
        <Grid>
            <Row>
                <Col xs={8} xsOffset={2}>  
                    <Well id="appView" className="loginPage">
                             <Login onChange={this.navChanged} />
                    </Well>
                </Col>
            </Row>
        </Grid>)
        }
    }
});



ReactDOM.render(<App />, document.getElementById('app'));
    
    