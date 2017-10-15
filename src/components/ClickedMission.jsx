var React = require('react');

var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Panel = require('react-bootstrap').Panel;
var Accordion = require('react-bootstrap').Accordion;
var Label = require('react-bootstrap').Label;
var ListGroup = require('react-bootstrap').ListGroup;
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var Parse = require('parse');
var Image = require('react-bootstrap').Image;

var ShowMissions = React.createClass({
    getInitialState(){
        return {
            dispatcher: ""
        }
    },
    componentWillMount(){
        var user = new Parse.Query(Parse.User);
        user.get(this.props.marker.createdBy.objectId).then((user) => {
            this.setState({
                dispatcher: user.get("userName")
            })
        });
    },
    renderMissionFiles(){
        if(this.props.marker.missionAttachment){
            return <Image id="missionFile" src={this.props.marker.missionAttachment._url}/>
        } else {
            return <div>No Mission Files</div>
        }
    },
    render: function() {
        var c = this.props.marker;
        return (
            <div>
                    <Row>
                        <Col xs={12}>
                                    <Panel header={c.title}>
                                        <ListGroup fill>
                                            <ListGroupItem><Label bsStyle="warning">Dispatcher:</Label> <span id="missionInfo">{this.state.dispatcher}</span></ListGroupItem>
                                            <ListGroupItem><Label bsStyle="danger">Value:</Label> <span id="missionInfo">{c.value}</span></ListGroupItem>
                                        </ListGroup>
                                            <Label bsStyle="info">Brief:</Label> <span id="missionInfo">{c.description}</span>
                                    </Panel>
                        </Col>
                        <Col xs={4} md={4} mdOffset={0}>
                            {this.renderMissionFiles()}
                        </Col>

                    </Row>
            </div>
        );
    }
});

module.exports = ShowMissions;
