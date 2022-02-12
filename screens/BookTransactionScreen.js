import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Image,
} from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import db from "../config"

export default class TransactionScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      domState: 'normal',
      hasCameraPermissions: null,
      scanned: false,

      bookId: '',
      studentId: '',
    };
  }

  getCameraPermission = async (domState) => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({
      hasCameraPermissions: status === 'granted',
      scanned: false,
      domState: domState,
    });
  };

  handleBarCode = async ({ type, data }) => {
    const { domState } = this.state;
    if (domState === 'bookId') {
      this.setState({
        domState: 'normal',
        scanned: true,
        bookId: data,
      });
    } else if (domState === 'studentId') {
      this.setState({
        domState: 'normal',
        scanned: true,
        studentId: data,
      });
    }
  };
  initiateBookIssue = () => { console.log("Book Issued to the student") }
   initiateBookReturn = () => { console.log("Book Retuened to the library") } 
   handleTransactions = () => { const { bookId } = this.state; db.collection("Books")
    .doc(bookId) .get() 
    .then(doc => { var book = doc.data() 
      if (book.bookAvlbl === true) { this.initiateBookIssue(); }
       else { 
         this.initiateBookReturn();
         } }) }
  render() {
    const { domState, hasCameraPermissions, scanned, scannedData } = this.state;

    if (domState != 'normal') {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCode}
        />
      );
    }
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/background2.png')}
          style={styles.bgImage}>
          <View style={styles.upperContainer}>
            <Image
              source={require('../assets/appIcon.png')}
              style={styles.appIcon}
            />
            <Image
              source={require('../assets/appName.png')}
              style={styles.appName}
            />
          </View>
          <View style={styles.lowerContainer}>
            <View style={styles.textinputContainer}>
              <TextInput
                style={styles.textinput}
                placeholder={'Book Id'}
                value={this.state.bookId}
              />
              <TouchableOpacity
                style={styles.scanbutton}
                onPress={() => this.getCameraPermission('bookId')}>
                <Text style={styles.scanbuttonText}>Scan</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.textinputContainer, { marginTop: 25 }]}>
              <TextInput
                style={styles.textinput}
                placeholder={'Student Id'}
                value={this.state.studentId}
              />
              <TouchableOpacity
                style={styles.scanbutton}
                onPress={() => this.getCameraPermission('studentId')}>
                <Text style={styles.scanbuttonText}>Scan</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress ={()=> this.handleTransactions()}> <Text >Submit</Text>

            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  bgImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  upperContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appIcon: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: 80,
  },
  appName: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  lowerContainer: {
    flex: 0.5,
    alignItems: 'center',
  },
  scanbutton: {
    width: 100,
    height: 50,
    backgroundColor: '#9DFD24',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanbuttonText: {
    fontSize: 24,
    color: '#0A0101',
    fontFamily: 'Rajdhani_600SemiBold',
  },
  textinput: {
    width: '57%',
    height: 50,
    padding: 10,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 3,
    fontSize: 18,
    backgroundColor: '#5653D4',
    fontFamily: 'Rajdhani_600SemiBold',
    color: '#FFFFFF',
  },
  textinputContainer: {
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: '#9DFD24',
    borderColor: '#FFFFFF',
  },
});
