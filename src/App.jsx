var React = require('react');
var ReactDOM = require('react-dom');
var Parse = require('parse');
var ParseReact = require('parse-react');
Parse.initialize("ttJuZRLZ5soirHP0jetkbsdqSGR3LUzO0QXRTwFN", "BDmHQzYoQ87Dpq0MdBRj9er20vfYytoh3YF5QXWd");

var Home = require('./components/Home.jsx');
var Login = require('./components/Login.jsx');
var Inbox = require('./components/Inbox.jsx');
var Settings = require('./components/Settings.jsx');
var ShowMissions = require('./components/ShowMissions.jsx');
var Profile = require('./components/Profile.jsx');
var Nav = require('./components/Nav.jsx');
var Autocomplete = require('./components/Autocomplete.jsx');

var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Well = require('react-bootstrap').Well;

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
              <Col xs={12} md={6} mdOffset={3}>
                 <Well>
                    {
                        this.state.location === 1 ? <Profile user={this.data.user}/> :
                        this.state.location === 2 ? <Inbox user={this.data.user}/> :
                        this.state.location === 3 ? <ShowMissions user={this.data.user}/> :
                        this.state.location === 4 ? <Settings user={this.data.user}/> :
                        <Home user={this.data.user}/>
                    }

                    <Nav onChange={this.navChanged} location={this.state.location} user={this.data.user}/>
                    </div>
                   
                </div>

                   
                 </Well>
              </Col>
            </Row>
        </Grid>

            );
        }
        else {
            return <Login />;
        }
    }
});



ReactDOM.render(<App />, document.getElementById('app'));
    
    