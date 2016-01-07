var React = require('react');
var Button = require('react-bootstrap').Button;

var HomeScreenButton = React.createClass({

        render() {

            return (
    <div>
    <Button>
        <img src="../src/img/logo.png" id="map-icon"/>
    </Button>
    </div>
            );
        }
});

module.exports = HomeScreenButton;