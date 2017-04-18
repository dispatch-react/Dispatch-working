var React = require('react');
var ReactDOM = require('react-dom');
var Parse = require('parse');
var ParseReact = require('parse-react');
//Parse.initialize("ttJuZRLZ5soirHP0jetkbsdqSGR3LUzO0QXRTwFN", "BDmHQzYoQ87Dpq0MdBRj9er20vfYytoh3YF5QXWd");
Parse.initialize("dispatchrr");
Parse.serverURL("http://dispatchrr.herokuapp.com/parse");

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
var FullScreen = require('react-fullscreen');
require('./components/OverlayCluster.jsx');

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
        <div>
                    {
                        this.state.location === 1 ? <Profile user={this.data.user}/> :
                        this.state.location === 2 ? <Inbox user={this.data.user}/> :
                        this.state.location === 3 ? <ShowMissions user={this.data.user}/> :
                        this.state.location === 4 ? <Settings user={this.data.user} logOut={this.logOut}/> :
                        <Geolocation user={this.data.user}/>

                    }
                        <Menu onChange={this.navChanged} location={this.state.location} user={this.data.user}/>
        </div>

            );
        }
        else {
            return (
        <Grid className="loginScreen">
            <Row>
                <Col xs={9} xsOffset={2} sm={6} smOffset={3} md={5} mdOffset={4}>
                    <Well id="appView" className="loginPage">
                             <Login onChange={this.navChanged} />
                    </Well>
                </Col>
            </Row>
        </Grid>
           )
        }
    }
});



ReactDOM.render(<App style={{minHeight: "100%"}} />, document.getElementById('app'));
