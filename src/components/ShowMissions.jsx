var React = require('react');
var Parse = require('parse');
var ParseReact = require('parse-react');

var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Panel = require('react-bootstrap').Panel;
var Label = require('react-bootstrap').Label;
var Badge = require('react-bootstrap').Badge;
var Input = require('react-bootstrap').Input;
var ListGroup = require('react-bootstrap').ListGroup;
var ButtonGroup = require('react-bootstrap').ButtonGroup;
var Button = require('react-bootstrap').Button;
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var Pagination = require('react-bootstrap').Pagination;
var Pager = require('react-bootstrap').Pager;
var PageItem = require('react-bootstrap').PageItem;

var MsgUser = require('./MsgUser.jsx');

var ShowMissions = React.createClass({
    mixins: [ParseReact.Mixin],
    //Check parse-react documentation
    //Pass the state to observe
    //https://github.com/ParsePlatform/ParseReact/blob/master/docs/api/Mixin.md
    observe: function(currentProps, currentState) {
        const skip = currentState.limit * (currentState.activePage - 1);
        var myCompleted = (new Parse.Query("Missions")).equalTo("createdBy", this.props.user).equalTo('status', 'complete')
        var iCompleted = (new Parse.Query("Missions")).equalTo("completedBy", this.props.user).equalTo('status', 'complete')
            
        return {
            
            userCompletedMissions: Parse.Query.or(myCompleted, iCompleted).skip(skip).limit(this.state.limit),
            userCompletedMissionsTotal: Parse.Query.or(myCompleted, iCompleted),
            
            userOwnMissions: (new Parse.Query("Missions")).equalTo("createdBy", this.props.user).notEqualTo('status', 'complete').ascending('createdAt').skip(skip).limit(this.state.limit),
            userActiveMissions: (new Parse.Query("Missions")).equalTo("activeAgent", this.props.user).notEqualTo('status', 'complete').ascending('createdAt').skip(skip).limit(this.state.limit),
            userCompletedMissions: (new Parse.Query("Missions")).equalTo("createdBy", this.props.user).equalTo('status', 'complete').ascending('createdAt').skip(skip).limit(this.state.limit),
            userOwnMissionsTotal: (new Parse.Query("Missions")).equalTo("createdBy", this.props.user).notEqualTo('status', 'complete').ascending('createdAt'),
            userActiveMissionsTotal: (new Parse.Query("Missions")).equalTo("activeAgent", this.props.user).notEqualTo('status', 'complete'),
            userCompletedMissionsTotal: (new Parse.Query("Missions")).equalTo("completedBy", this.props.user).equalTo('status', 'complete').ascending('createdAt')
        };
    },
    getInitialState(){
        return {
            limit: 5,
            activePage: 1,
            score: 5,
            toggle: true
        }
    },
    setScore: function(e){
      this.setState({score: Number(e.target.value)})  
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
    setButtonValueA: function() {this.setState({buttonValue: "Accept"})},
    confirmMission: function(missionLink, activeAgent, e) {
        var nthis = this;
        e.preventDefault();
        var Msg = Parse.Object.extend('Messages');
        var completeMsg = new Msg();
            completeMsg.set('content', 'Mission completed! Score: ' + nthis.state.score + '. Well done (' + missionLink.title + ')');
            completeMsg.set('createdBy', { __type: "Pointer", className: "_User", objectId: this.props.user.objectId });
            completeMsg.set('writtenTo', { __type: "Pointer", className: "_User", objectId: activeAgent.objectId });
            completeMsg.set('authorUserName', this.props.user.userName)
            completeMsg.set('missiongLink', { __type: "Pointer", className: "Missions", objectId: missionLink.objectId })
            completeMsg.set('type', 'missionComplete');
            completeMsg.save();
        
        var missionObj = (new Parse.Query('Missions').get(missionLink.objectId).then(function(res){
            res.set('status', 'complete');
            res.set('completedBy', { __type: "Pointer", className: "_User", objectId: activeAgent.objectId });
            res.set('score', nthis.state.score);
            res.save().then(function(){
                nthis.refreshQueries();
            });
        })
        );
        alert('Mission marked complete. Thanks for playing')

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
                        var style = {display: 'inline'}
                        if (c.activeAgent) {
                            var inputRef = c.objectId
                            var agent = (<ListGroupItem><Label bsStyle="danger">Active Agent:</Label> 
                                            <MsgUser missionLink={c} recipient={c.activeAgent} recipientUsername={c.acceptedAgentUsername} user={self.props.user}/>
                                        </ListGroupItem>)
                            var badge = (<Badge pullRight>Active!</Badge>)
                            var confirmButton = (
                                <form onSubmit={self.confirmMission.bind(self, c, c.activeAgent)} className="form-horizontal">
                                    <div>
                                        <Col xs={6} xsOffset={2}>
                            <Input type="select" placeholder="Set Score" onChange={self.setScore} label="Set Score" labelClassName="col-xs-6" wrapperClassName="col-xs-6" className="ratingInput">
                              <option value={1}>1</option>
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                              <option value={4}>4</option>
                              <option value={5}>5</option>
                            </Input>
                                        </Col>
                                        <Col xs={4}>
                            <Button bsStyle="success" type="submit">Mark as Completed</Button>
                                        </Col>
                                </div>
                            </form>)
                        }
                        else {
                            agent = (<span></span>)
                            badge = (<span></span>)
                            confirmButton = (<span></span>)
                        }
                          return(
                         
    <Panel collapsible key={c.objectId} header={[c.title, badge]}>
            <Label bsStyle="info">Mission Brief:</Label> <span id="missionInfo">{c.description}</span>
        <ListGroup fill>
            <ListGroupItem><Label bsStyle="warning">Value:</Label> <span id="missionInfo">{c.value}</span></ListGroupItem>
            {agent}
            <Row style={{padding: '10px 15px 0px 0px'}}>
            {confirmButton}
            </Row>
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
            <Label bsStyle="info">Mission Brief:</Label> <span id="missionInfo">{c.description}</span>
        <ListGroup fill>
            <ListGroupItem><Label bsStyle="danger">Value:</Label> <span id="missionInfo">{c.value}</span></ListGroupItem>
            <ListGroupItem>
                <Label bsStyle="warning">Dispatchr:</Label>
                <MsgUser missionLink={c} recipient={c.createdBy} recipientUsername={c.createdByUsername} user={self.props.user} />
            </ListGroupItem>
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
            <Label bsStyle="info">Msssion Brief:</Label> <span id="missionInfo">{c.description}</span>
        <ListGroup fill>
            <ListGroupItem><Label bsStyle="danger">Value:</Label> <span id="missionInfo">{c.value}</span></ListGroupItem>
            <ListGroupItem><Label bsStyle="success">Agent:</Label> <span id="missionInfo">{c.acceptedAgentUsername}</span></ListGroupItem>
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