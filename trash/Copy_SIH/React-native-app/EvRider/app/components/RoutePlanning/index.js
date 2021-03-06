import React, { Component} from 'react';
import {  Text,Platform } from 'react-native';
import { Container, Header, View, Button, Icon, Fab } from 'native-base';
import SendSMS from 'react-native-sms'
import SmsAndroid  from 'react-native-get-sms-android';
import AwesomeAlert from 'react-native-awesome-alerts';
class RoutePlanning extends Component {
  constructor(props) {
    super(props)

    this.smsFunction=this.smsFunction.bind(this);
    this.state = {
      active: 'false',
      showAlert: false,
      lat:null,
      lon:null,
      errorMessage:"Location not found"
    };

  }



  showAlert = () => {
    this.setState({
      showAlert: true
    });
  };
 
  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  };

  // componentDidMount() {
  //   this.watchID = navigator.geolocation.watchPosition((position) => {
  //     // Create the object to update this.state.mapRegion through the onRegionChange function

  //       latitude:       position.coords.latitude;
  //       longitude:      position.coords.longitude;
  //       console.log(latitude);
      

  //   }, (error)=>console.log(error));
  // }
  // locationFunction(){

  // }

  smsFunction() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
          let latitude = JSON.stringify(position.coords.latitude);
          let longitude = JSON.stringify(position.coords.longitude);
          // console.log(latitude);
          // this.setState({lat:latitude,lon:longitude});
          // console.log(this.state.lat);
          SendSMS.send({
            body: 'LAPYT id=7945&coords='+latitude+','+longitude,
            recipients: ['+919220592205'],
            successTypes: ['sent', 'queued'],
            allowAndroidSendWithoutReadPermission: true
        }, (completed, cancelled, error) => {
     
            console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);
     
        });
      },
      (error) =>{
        console.log(JSON.stringify(error.message));
        this.setState({
          showAlert: true
        });
      },
      {enableHighAccuracy: Platform.OS != 'android', timeout: 2000}
  );


}
  render() {
    const {showAlert} = this.state;
    return (
      <View style={{ flex: 1 }}>
      <Fab
        active={this.state.active}
        direction="up"
        containerStyle={{ }}
        style={{ backgroundColor: '#5067FF' }}
        position="bottomRight" 
         onPress={ this.smsFunction}
        >
        <Icon name="mail" />

      </Fab>
      <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="No Location"
          message="Turn On Location Services"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          // showConfirmButton={true}
          cancelText="Cancel"
          confirmText="Yes, delete it"
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            this.hideAlert();
          }}
        />
    </View>
    );
  }
}

export default RoutePlanning;
