var React = require("react");
var reactGoogleMaps = require("react-google-maps");
var GoogleMap = reactGoogleMaps.GoogleMap;
var GoogleMapLoader = reactGoogleMaps.GoogleMapLoader;
var Circle = reactGoogleMaps.Circle;
var InfoWindow = reactGoogleMaps.InfoWindow;
var canUseDOM = require("can-use-dom");
var raf = require("raf");
var MarkerClusterer = require("react-google-maps/lib/addons/MarkerClusterer");
var Marker = reactGoogleMaps.Marker;
var SearchBox = reactGoogleMaps.SearchBox;


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
Parse.initialize("ttJuZRLZ5soirHP0jetkbsdqSGR3LUzO0QXRTwFN", "BDmHQzYoQ87Dpq0MdBRj9er20vfYytoh3YF5QXWd");


const geolocation = (
    canUseDOM && navigator.geolocation || {
        getCurrentPosition: (success, failure) => {
            failure("Geolocation not supported.");
        }
    }
);


var Geolocation = React.createClass({
    mixins: [ParseReact.Mixin],
    observe: function () {
        return {
            Missions: new Parse.Query('Missions').ascending('createdAt')
        };
    },
    getInitialState(){
        return {
            userPosition: null,
            center: null,
            content: null,
            radius: 4000,
            //These are the markers created by user. Mission markers.
            markers: [],
            bounds: null,
            openedMissions: []
        }
    },
    handleBoundsChanged(){
        this.setState({
            bounds: this.refs.map.getBounds(),
            center: this.refs.map.getCenter()
        })
    },
    handlePlacesChanged(){
        const places = this.refs.searchBox.getPlaces();
        const markers = [];

        //Add marker for every found place
        places.forEach(function (place) {
            markers.push({
                position: place.geometry.location
            });
        });

        //Set markers; set map center to first search result
        const mapCenter = markers.length > 0 ? markers[0].position : this.state.userPosition;
        this.setState({
            center: mapCenter,
            markers: markers
        });
        return
    },
    handleMarkerClick(marker){
        var missions = this.state.openedMissions;
        if(missions.indexOf(marker.id.objectId) < 0){
            this.setState({
                openedMissions: this.state.openedMissions.concat([marker.id.objectId])
            });
        }
    },
    handleCloseClick(marker){
        console.log(marker);
        var missions = this.state.openedMissions;
        if(missions.indexOf(marker.id.objectId) > -1){
            missions.splice(missions.indexOf(marker.id.objectId),1);
            this.setState({
                openedMissions: missions
            });
        }
    },
    renderInfoWindow(ref, marker){
        return (
            <InfoWindow key={ref}
                        onCloseclick={this.handleCloseClick.bind(this, marker)}
            >
                <div>
                    <strong>{marker.description}</strong>
                </div>

            </InfoWindow>
        )
    },
    componentDidMount(){
        geolocation.getCurrentPosition((position) => {
            this.setState({
                userPosition: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                },
                content: "Your are here!",
                missions: this.data.Missions
            });

            //This function will animate the circle.
            const tick = () => {
                this.setState({
                    //Return the largest number between 0 and this.state.radius - 20
                    radius: Math.max(this.state.radius - 120, 0)
                });

                if (this.state.radius > 150) {
                    raf(tick);
                }
            };
            raf(tick);
        }, (reason) => {
            this.setState({
                center: {
<<<<<<< HEAD
                    lat: 45,
                    lng: -73
=======
                    lat: 45.5017,
                    lng: -73.5673
>>>>>>> 17e7db09acf702522199a974725aba25c4b171db
                },
                content: `Error: The Geolocation service failed (${ reason }).`
            })
        })
    },
    render: function () {

        const {center, content, radius, markers, userPosition} = this.state;
        let contents = [];

        if (userPosition) {
            contents = contents.concat([
                (<InfoWindow key="info" position={userPosition} content={content}/>),
                (<Circle key="circle" center={userPosition} radius={radius} options={{
                    fillColor: "#4259ee",
                    fillOpacity: 0.20,
                    strokeColor: "blue",
                    strokeOpacity: 1,
                    strokeWeight: 1
                }}/>)
            ])
        }

        return (
            <div>
                <GoogleMapLoader
                    containerElement={<div {...this.props} style={{height: "70vh"}} />}
                    googleMapElement={
                        <GoogleMap
                            ref="map"
                            onBoundsChanged={this.handleBoundsChanged}
                            defaultZoom={12}
                            center={
                                center ? center: userPosition
                            }
                        >{contents}
                          <MarkerClusterer
                            averageCenter={true}
                            enableRetinaIcons={true}
                            gridSize={20}>

                                {this.data.Missions.map((marker, index) => {
    const ref = `${marker.id.objectId}_info`;

    return (
        <Marker key={ref} ref={ref}
                position={{lat:marker.startLocationGeo.latitude, lng: marker.startLocationGeo.longitude}}
                title={marker.title}
                onClick={this.handleMarkerClick.bind(this, marker)}>
            {this.state.openedMissions.indexOf(marker.id.objectId) > -1 ? this.renderInfoWindow(ref, marker) : null}
        </Marker>
    );
})}
                            </MarkerClusterer>
                            <SearchBox
                                bounds={this.state.bounds}
                                controlPosition={google.maps.ControlPosition.TOP_LEFT}
                                onPlacesChanged={this.handlePlacesChanged}
                                ref="searchBox"
                                placeholder="Search address"
                                style={inputStyle}
                            />
                            {this.state.markers.map((marker, index) =>(
                                <Marker
                                    position={marker.position}
                                    key={index}
                                />
                            ))}
                        </GoogleMap>
                    }
                />
            </div>
        )
    }
});


module.exports = Geolocation;







