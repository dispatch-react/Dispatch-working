var customStyle = [{"featureType":"water","stylers":[{"saturation":43},{"lightness":-11},{"hue":"#0088ff"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"hue":"#ff0000"},{"saturation":-100},{"lightness":99}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#808080"},{"lightness":54}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ece2d9"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#ccdca1"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#767676"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#EBE5E0"}]},{"featureType":"poi.park","stylers":[{"visibility":"on"}]},{"featureType":"poi.sports_complex","stylers":[{"visibility":"on"}]}]

var React = require("react");

var reactGoogleMaps = require("react-google-maps");
var GoogleMap = reactGoogleMaps.GoogleMap;
var GoogleMapLoader = reactGoogleMaps.GoogleMapLoader;
var InfoWindow = reactGoogleMaps.InfoWindow;
var canUseDOM = require("can-use-dom");

var MarkerClusterer = require("react-google-maps/lib/addons/MarkerClusterer");
var Marker = reactGoogleMaps.Marker;
var SearchBox = reactGoogleMaps.SearchBox;
var OverlayView = reactGoogleMaps.OverlayView;
var TimerMixin = require("react-timer-mixin");
var _ = require("lodash");

var CreateMissionForm = require("./CreateMissionForm.jsx");
var ClickedMission = require("./ClickedMission.jsx");

var Modal = require('react-bootstrap').Modal;
var ButtonInput = require('react-bootstrap').ButtonInput;
var Col = require('react-bootstrap').Col;
var Alert = require('react-bootstrap').Alert;
var Image = require('react-bootstrap').Image;
var Media = require('react-bootstrap').Media;

var inputStyle = {
    "border": "1px solid transparent",
    "borderRadius": "1px",
    "boxShadow": "0 2px 6px rgba(0, 0, 0, 0.3)",
    "boxSizing": "border-box",
    "MozBoxSizing": "border-box",
    "fontSize": "14px",
    "height": "32px",
    "marginTop": "27px",
    "outline": "none",
    "padding": "0 12px",
    "textOverflow": "ellipses",
    "width": "400px"
};

var Parse = require('parse');
var ParseReact = require('parse-react');
// Parse.initialize("ttJuZRLZ5soirHP0jetkbsdqSGR3LUzO0QXRTwFN", "BDmHQzYoQ87Dpq0MdBRj9er20vfYytoh3YF5QXWd");
Parse.initialize("9fdf1f81-77f3-4a9e-b0a5-81e52bcc45d3", "TVr5WXdTpemNEMO68JexPGrqlOdv18yh");
const geolocation = (
    canUseDOM && navigator.geolocation || {
        getCurrentPosition: (success, failure) => {
            failure("Geolocation not supported.");
        }
    }
);
var CustomMarker = React.createClass({
    render() {
        return (
            <OverlayView mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET} position={this.props.position}>
                <div style={{backgroundImage: this.props.icon, width: 40, height: 40}}>
                </div>
            </OverlayView>
        );
    }
});
var Geolocation = React.createClass({
    mixins: [ParseReact.Mixin, TimerMixin],
    observe: function () {
        return {
            Missions: new Parse.Query('Missions').equalTo('status', 'open').limit(1000)
        }
    },
    getInitialState(){
        return {
            userPosition: null,
            center: null,
            //These are the markers created by user. Mission markers.
            bounds: null,
            //These are display tags above the markers
            openedMissions: [],
            showModal: false,
            clickedMission: {},
            clickedMissionTitle: '',
            clickedMissionDescription: ''
        }
    },
    handleBoundsChanged: _.debounce(function () {
        this.setState({
            center: this.refs.map.getCenter()
        })
    }, 50),
    handlePlacesChanged(){
        const places = this.refs.searchBox.getPlaces();
        this.setState({
            center: places[0].geometry.location
        });
    },
    handleMarkerClick(marker){
        var missions = this.state.openedMissions;
        if (missions.indexOf(marker.id.objectId) < 0) {
            this.setState({
                openedMissions: this.state.openedMissions.concat([marker.id.objectId])
            });
        }

    },
    componentDidMount(){
        this.setInterval(
            () => {
                this.refreshQueries();
            },
            15000
        );

        if (this.props.user.userName === 'demoUser') {
            this.setState({
                center: {
                    lat: 45.5017,
                    lng: -73.5673
                },
                showDemo: true
            });
        }

        else {

            geolocation.getCurrentPosition((position) => {

                this.setState({
                    userPosition: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    },
                });
            }, (reason) => {
                this.setState({
                    center: {
                        lat: 45.5017,
                        lng: -73.5673
                    },
                    content: `Error: The Geolocation service failed (${ reason }).`
                });
            });
        }
    },
    close() {
        this.setState({
            showModal: false
        });
    },
    dismissDemo() {
        this.setState({
            showDemo: false
        })
    },
    open(marker) {
        this.setState({
            showModal: true,
            clickedMission: marker
        })
    },
    acceptMission: function (e) {
        var self = this;
        e.preventDefault();
        var applicantObj = {
            userName: this.props.user.userName,
            missionLink: this.state.clickedMission,
            missionTitle: this.state.clickedMission.title,
            missionBrief: this.state.clickedMission.description,
            createdBy: this.props.user
        }

        var addApplicant = ParseReact.Mutation.AddUnique(self.state.clickedMission, 'applicants', applicantObj)

        var acceptedAlert = ParseReact.Mutation.Create('Messages', {
            writtenTo: self.state.clickedMission.createdBy,
            missionLink: self.state.clickedMission,
            missionTitle: self.state.clickedMission.title,
            missionDescription: self.state.clickedMission.description,
            content: ' ' + 'applied to your mission!' + ' (' + self.state.clickedMission.title + ')',
            type: 'missionAccepted',
            createdBy: self.props.user,
            authorUserName: self.props.user.userName,
            authorEmail: self.props.user.email,
            read: false
        });

        addApplicant.dispatch().then(function (res) {
                self.close();
                acceptedAlert.dispatch()
                alert('Mission is pending, watch your inbox!')
            },
            function (error) {
                alert('there was an error, check your self')
            });
    },
    render: function () {
        const {center, content, radius, markers, userPosition} = this.state;
        let contents = [];
        let positions = this.data.Missions.map((marker)=> {
            return marker;
        });
        positions.forEach((m1, i) => {
            positions.forEach((m2, j) => {
                if (i !== j && m1.startLocationGeo.latitude === m2.startLocationGeo.latitude && m1.startLocationGeo.longitude === m2.startLocationGeo.longitude) {
                    m2.startLocationGeo.latitude += 0.0001;
                    m2.startLocationGeo.longitude += 0.0001;
                }
            })
        });
        if (userPosition) {
            contents = contents.concat([

                (<Marker key={userPosition} position={userPosition}
                         icon={"https://www.dropbox.com/s/7zl8wl9a73o89hx/robbery.png?dl=1"} defaultAnimation={2}>
                </Marker>)
            ])
        }
        return (
            <div id="mapViewContent">
                <GoogleMapLoader
                    containerElement={<div {...this.props} style={{height: "100vh"}} />}
                    googleMapElement={
                        <GoogleMap
                            defaultOptions = {{
                            zoomControlOptions: {
                            position: google.maps.ControlPosition.RIGHT_CENTER
                               },
                            streetViewControlOptions: {
                            position: google.maps.ControlPosition.RIGHT_CENTER
                               },
                               styles:customStyle,
                               mapTypeControlOptions : {
                               style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                               position: google.maps.ControlPosition.RIGHT_CENTER
                               }
                            }}
                            containerProps={{...this.props}}
                            ref="map"
                            onBoundsChanged={this.handleBoundsChanged}
                            defaultZoom={12}
                            center={
                                center ? center: userPosition
                            }
                        >
                         <div id="loadingScreen"></div>
                        {contents}
                          <MarkerClusterer
                            minimumClusterSize={3}
                            title={"Click to view missions!"}
                            averageCenter={true}
                            enableRetinaIcons={true}
                            >
                                {positions.map((marker, index) => {
    const value = Number(marker.value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    const position = marker.startLocationGeo ? {lat:marker.startLocationGeo.latitude, lng: marker.startLocationGeo.longitude} : null;

    const ref = `marker_${index}`;

    if(position){
        let icon = '';
    switch (marker.category) {
        case "driver, delivery":
         icon = "https://www.dropbox.com/s/r22dfeh8lutpwv1/fourbyfour.png?dl=1";
         break;
         case "gigs":
         icon = "https://www.dropbox.com/s/fgg15qwebunmw5i/event-party.png?dl=1";
         break;
         case "housekeeping, childcare":
         icon = "https://www.dropbox.com/s/k6mv0xwx9e129li/house.png?dl=1";
         break;
         case "construction, trades":
         icon = "https://www.dropbox.com/s/cmkfb4cbsqkd65p/domestic-carpentry.png?dl=1";
         break;
         case "general labour":
         icon = "https://www.dropbox.com/s/1s36sjtppljktkl/manual-labour.png?dl=1";
         break;
         case "bar, food, hospitality":
         icon = "https://www.dropbox.com/s/e12js971ie5bifq/domestic-food-delivery.png?dl=1";
         break;
         default:
         icon = "https://www.dropbox.com/s/dfjpx65j5v3wlih/pirates.png?dl=1";
         break;
    }
    return (
        <OverlayView
            key={ref}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            position={position}>

            <div className="customMarkerInfo hvr-bob">
                <div className="customMarkerValue animated fadeIn">{value}$</div>
               <div className="customMarker animated fadeIn" onClick={this.open.bind(this, marker)} style={{backgroundImage: `url(${icon})`, width: 32, height: 37, backgroundSize: 'cover', cursor: 'pointer'}}>
                </div>
            </div>
        </OverlayView>

        );
        }
})}
                    </MarkerClusterer>
                        <SearchBox
                                bounds={this.state.bounds}
                                controlPosition={google.maps.ControlPosition.TOP_CENTER}
                                onPlacesChanged={this.handlePlacesChanged}
                                ref="searchBox"
                                placeholder="Search address"
                                style={inputStyle}
                            />
                        </GoogleMap>
                    }
                />
                <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Mission Brief</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        {<ClickedMission marker={this.state.clickedMission}/>}

                    </Modal.Body>
                    <Modal.Footer>
                        <Col xs={2} xsOffset={10}>
                            <form onSubmit={this.acceptMission}>
                                <ButtonInput type="submit" value="Apply" disabled={(this.state.clickedMission.createdByUsername === this.props.user.userName)}/>
                            </form>
                        </Col>
                    </Modal.Footer>
                </Modal>


                <Modal show={this.state.showDemo} onHide={this.dismissDemo} backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>Thanks for trying Dispatchr!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body id="demoModal">
                         <Media>
                             <Media.Left>
                                <img height={64} width={64} src="img/dispatchr-clear-bg-logo.png" alt="Dispatchr Logo"/>
                              </Media.Left>
                              <Media.Body>
                                <p>Use the Dispatchr button at the bottom of your screen to create a new mission.</p>
                              </Media.Body>
                        </Media>

                        <Media>
                              <Media.Body>
                                <p>The map displays missions created by users, click the icon to get details and apply.</p>
                              </Media.Body>
                              <Media.Right>
                                <img width={32} height={32} src="https://www.dropbox.com/s/e12js971ie5bifq/domestic-food-delivery.png?dl=1" alt="Food Mission Icon"/>
                              </Media.Right>
                        </Media>
                        <Media>
                              <Media.Body>
                                <p>Dispatchr is a demo application showcasing our knowledge of React.JS & GoogleMaps!</p>
                                <p>This app was built by <a href="github.com/dcodus" target="_blank">Codrin</a> and <a href="github.com/aplhanumeric0101" target="_blank">Alex</a> while at <a href="decodemtl.com" target="_blank">DecodeMTL</a></p>
                              </Media.Body>
                        </Media>

                    </Modal.Body>
                    <Modal.Footer>
                        <Col xs={4} xsOffset={4}>
                            <ButtonInput value="Roger that" onClick={this.dismissDemo} />
                        </Col>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
});

module.exports = Geolocation;
