var React = require('react');
var Parse = require('parse');
var ParseReact = require('parse-react');
Parse.initialize("ttJuZRLZ5soirHP0jetkbsdqSGR3LUzO0QXRTwFN", "BDmHQzYoQ87Dpq0MdBRj9er20vfYytoh3YF5QXWd");

var CreateMission = require('./CreateMission.jsx');
var ShowMissions = require('./ShowMissions.jsx');
var Profile = require('./Profile.jsx');
var Inbox = require('./Inbox.jsx');
var Settings = require('./Settings.jsx');
var Map = require('./Map.jsx');
var Nav = require('./Nav.jsx');
var Geolocation = require("./Geolocation.jsx");

var Home = React.createClass({
    logOut: function() {
        console.log('calling logout');
        Parse.User.logOut();
    },
    render: function() {
        return (
            <div>
                <Geolocation />

            </div>
        );
    }
});

module.exports = Home;