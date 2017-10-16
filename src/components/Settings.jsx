var React = require('react');
var Parse = require('parse');

var Button = require('react-bootstrap').Button;

var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;

var Settings = React.createClass({
    updateSetting: function(e) {
        var nthis= this;
        var target = {
                className: '_User',
                objectId: nthis.props.user.objectId
            };
            var changes = {
                column_name: "new_value"
            };
            // TODO: update local user document 
    },
    render: function() {
        return (
            <div id="viewContent">
                <Row>
                   <Col xs={6} xsOffset={3}>
                       <Button className="logOutBtn" bsStyle="warning" onClick={this.props.logOut}>Log Out</Button>
                   </Col>
                </Row>
            </div>
    )}
});

module.exports = Settings;
