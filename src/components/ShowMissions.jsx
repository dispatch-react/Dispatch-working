var React = require('react');
var Parse = require('parse');
var ParseReact = require('parse-react');

var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Panel = require('react-bootstrap').Panel;
var Label = require('react-bootstrap').Label;
var Badge = require('react-bootstrap').Badge;
var ListGroup = require('react-bootstrap').ListGroup;
var ButtonGroup = require('react-bootstrap').ButtonGroup;
var Button = require('react-bootstrap').Button;
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var Pagination = require('react-bootstrap').Pagination;
var Pager = require('react-bootstrap').Pager;
var PageItem = require('react-bootstrap').PageItem;

var ShowMissions = React.createClass({
    mixins: [ParseReact.Mixin],
    //Check parse-react documentation
    //Pass the state to observe
    //https://github.com/ParsePlatform/ParseReact/blob/master/docs/api/Mixin.md
    observe: function(currentProps, currentState) {
        const skip = currentState.limit * (currentState.activePage - 1);
        return {
            userOwnMissions: (new Parse.Query("Missions")).equalTo("createdBy", this.props.user).ascending('createdAt').skip(skip).limit(this.state.limit),
            userActiveMissions: (new Parse.Query("Missions")).equalTo("activeAgent", this.props.user).ascending('createdAt').skip(skip).limit(this.state.limit),
            userCompletedMissions: (new Parse.Query("Missions")).equalTo("completedBy", this.props.user).ascending('createdAt').skip(skip).limit(this.state.limit),
            userOwnMissionsTotal: (new Parse.Query("Missions")).equalTo("createdBy", this.props.user).ascending('createdAt'),
            userActiveMissionsTotal: (new Parse.Query("Missions")).equalTo("activeAgent", this.props.user),
            userCompletedMissionsTotal: (new Parse.Query("Missions")).equalTo("completedBy", this.props.user).ascending('createdAt')
        };
    },
    getInitialState(){
        return {
            limit: 5,
            activePage: 1
        }
    },
    handleSelect(event, selectedEvent) {
        if (selectedEvent.eventKey !== this.state.activePage) {
            this.setState({
                activePage: selectedEvent.eventKey
            });
        }
    },
    renderPagination(missionType){
        return (
            <Pagination
                prev
                next
                first
                last
                bsSize="medium"
                ellipsis
                items={Math.ceil((missionType.length)/5)}
                maxButtons={5}
                activePage={this.state.activePage}
                onSelect={this.handleSelect} />
        )
    },
    setButtonValueR: function() {this.setState({buttonValue: "Reject"})},
    setButtonValueA: function() {
        this.setState({buttonValue: "Accept"})},
    confirmMission: function(missionLink, e) {
        var nthis = this;
        e.preventDefault();

        // delete Messages Related to this mission
        var relatedMessages = new Parse.Query("Messages");
        relatedMessages.equalTo("missionLink", missionLink)
        relatedMessages.find().then(function(relMsg){
            relMsg.forEach(function(m){
                m.destroy();
            })
        })

        if (this.state.buttonValue === "Accept") {
            ParseReact.Mutation.Set(missionLink, {status: 'active', activeAgent: this.props.user}).dispatch()
             ParseReact.Mutation.Create('Messages', {
               content: 'Mission is active! Go for it',
               createdBy: nthis.props.user,
               writtenTo: missionLink.createdBy,
               authorUserName: nthis.props.user.userName,
               authorEmail: nthis.props.user.email,
               type: 'applicationAccepted',
               missionLink: missionLink,
               read: false
            }).dispatch()
            alert('Mission is set to active!')
        }
        else {
            ParseReact.Mutation.Create('Messages', {
               content: 'Application rejected',
               createdBy: nthis.props.user,
               writtenTo: message.createdBy,
               authorUserName: nthis.props.user.userName,
               authorEmail: nthis.props.user.email,
               type: 'applicationRejected',
               missionLink: missionLink,
               read: false
            }).dispatch()
            alert('Application Rejected')
        }
    },
    render: function() {
        var self = this;
        var activeTitle = (<h1 className="panelTitle">Active Missions</h1>);
        var ownMissionsTitle = (<h1 className="panelTitle">Your Missions</h1>);
        var completedMissionsTitle = (<h1 className="panelTitle">Complete Missions</h1>);
        var applicantsBadge = '';
        var applicants = null;

        return (
            <div id="viewContent">
        <Panel collapsible defaultExpanded header={ownMissionsTitle} bsStyle="info">
            <Row>
                <Col xs={12}>
                        {this.data.userOwnMissions.map(function(c) {
                        if (c.applicants) {
 
                            applicants = (c.applicants.map(function(a){
                                return <ListGroupItem>
                                            <Label bsStyle="warning">Applicant:</Label>
                                            <span id="missionInfo"><Label bsStyle="info">{a.userName}</Label></span>
                                        <Row><Col xs={6} xsOffset={6}>
                                        <form onSubmit={self.confirmMission.bind(self, c)}>
                                        <ButtonGroup>
                                            <Button bsStyle="success" onClick={self.setButtonValueA} type="submit" value="Accept" pullRight>Accept</Button>
                                            <Button bsStyle="danger" onClick={self.setButtonValueR} type="submit" value="Reject" pullRight>Reject</Button>
                                        </ButtonGroup>
                                        </form>
                                        </Col></Row>
                                        </ListGroupItem>
                            }))
                        }
                          return(
    <Panel collapsible key={c.objectId} header={c.title}>
        <ListGroup fill>
            <ListGroupItem><Label bsStyle="info">Brief:</Label> <span id="missionInfo">{c.description}</span></ListGroupItem>
            <ListGroupItem><Label bsStyle="danger">Value:</Label> <span id="missionInfo">{c.value}</span></ListGroupItem>
            {applicants}
        </ListGroup>
    </Panel>
                            );
                        })}
                    {this.renderPagination(this.data.userOwnMissionsTotal)}
                </Col>
            </Row>
        </Panel>

        <Panel collapsible header={activeTitle} bsStyle="danger">
            <Row>
                <Col xs={12}>
                        {this.data.userActiveMissions.map(function(c) {
                          return(
    <Panel collapsible key={c.objectId} header={c.title}>
        <ListGroup fill>
            <ListGroupItem><Label bsStyle="info">Brief:</Label> <span id="missionInfo">{c.description}</span></ListGroupItem>
            <ListGroupItem><Label bsStyle="danger">Value:</Label> <span id="missionInfo">{c.value}</span></ListGroupItem>
            <ListGroupItem><Label bsStyle="warning">Final Score:</Label> <span id="missionInfo">{c.score}</span></ListGroupItem>
        </ListGroup>
    </Panel>
                            );
                        })}
                    {this.renderPagination(this.data.userActiveMissionsTotal)}
                </Col>
            </Row>
        </Panel>

        <Panel collapsible header={completedMissionsTitle} bsStyle="success">
            <Row>
                <Col xs={12}>
                        {this.data.userCompletedMissions.map(function(c) {
                          return(
    <Panel collapsible key={c.objectId} header={c.title}>
        <ListGroup fill>
            <ListGroupItem><Label bsStyle="info">Brief:</Label> <span id="missionInfo">{c.description}</span></ListGroupItem>
            <ListGroupItem><Label bsStyle="danger">Value:</Label> <span id="missionInfo">{c.value}</span></ListGroupItem>
            <ListGroupItem><Label bsStyle="warning">Final Score:</Label> <span id="missionInfo">{c.score}</span></ListGroupItem>
        </ListGroup>
    </Panel>
                            );
                        })}
                    {this.renderPagination(this.data.userCompletedMissionsTotal)}
                </Col>
            </Row>
        </Panel>
    </div>
        );
    }
});

module.exports = ShowMissions;