var React = require('react');
var Component = React.Component;
var reactGoogleMaps = require('react-google-maps');
var GoogleMap = reactGoogleMaps.GoogleMap;
var Marker = reactGoogleMaps.Marker;
var InfoWindow = reactGoogleMaps.InfoWindow;
var GoogleMapLoader = reactGoogleMaps.GoogleMapLoader;

var Info = React.createClass({
	getInitialState: function() {
		return {
			markers : []
		}
	},
	componentWillMount: function() {
		
			const southWest = new google.maps.LatLng(45.10, -70.24);
			const northEast = new google.maps.LatLng(45.96, -75.04);

			const lngSpan = northEast.lng() -southWest.lng();
			const latSpan = northEast.lat() -southWest.lat();

			let markers = [];

			for (let i = 0; i<10; i++) {
				const position = new google.maps.LatLng(
					southWest.lat() + latSpan * Math.random(),
					southWest.lng() + lngSpan * Math.random()	
					);
				markers.push({
					position: position,
					content: "This is the secret message".split(" ")[i],
					showInfo: false
				});
			}

			this.setState({
				markers: markers				//this one seems weird
			});  
	},
	handleMarkerClick: function(marker) {
			marker.showInfo = true;
			this.setState(this.state);
	},
	handleCloseClick: function(marker) {
			marker.showInfo = false;
			this.setState(this.state);
	},
	renderInfoWindow: function(ref, marker) {
			if (Math.random() > 0.5) {
				return (
					<InfoWindow key={`${ref}_info_window`} content={marker.content} 
					onCloseClick={this.handleCloseClick.bind(this, marker)}/>	
					)	

			} else {
				return (
					<InfoWindow key={`${ref}_info_window`}
					oncloseClick={this.handleCloseClick.bind(this, marker)}>
				<div>
				<strong>{marker.content}</strong>
				<br/>
				<em>This could be anything.</em>
				</div>
				</InfoWindow>
				)

			}
	},
	render: function() {
		const {markers} = this.state;

		return (

		
                <GoogleMapLoader
                    containerElement={<div {...this.props} style={{height: "90vh"}} />}
                    googleMapElement={
                        <GoogleMap
                            defaultZoom={12}
                            defaultCenter={{lat: 45.50, lng: -73.57}}>
                            {markers.map((marker,index) => {
				const ref = `marker_${index}`;

				return (
				<Marker key={ref} ref={ref} position={marker.position} title={(index+1).toString()}
				 onClick={this.handleMarkerClick.bind(this, marker)}>
				{marker.showInfo ? this.renderInfoWindow(ref, marker) : null}
				</Marker>
					);
				})
				}

                        </GoogleMap>
                 
                    }			
				</GoogleMapLoader>	
				);
				}
			})
				
				

module.exports = Info;
