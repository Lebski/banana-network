import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { Font } from "expo";

export default class App extends React.Component {
  state = {
    fontLoaded: false,
    bananasId: "Press the Button!"
  };
  async componentDidMount() {
    await Font.loadAsync({
      "open-sans-bold": require("./assets/fonts/Lobster-Regular.ttf")
    });

    this.setState({ fontLoaded: true });
  }

  postReady = () => {
    var id = Math.floor(Math.random() * Math.floor(999)).toString(10);
    var bodyObject = {
      $class: "sc.demonstrator.net.ProductCreation",
      ID: id,
      issuer: "sc.demonstrator.net.Company#BananasCorpSouthAmerica",
      next: "sc.demonstrator.net.Company#TruckfleetCo"
    };
    console.log(bodyObject);

    this.setState({ ...this.state, isFetching: true });
    fetch("http://34.73.109.142:3000/api/ProductCreation", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyObject)
    })
      .then(response => {
        this.setState({
          responseStatus: response.status,
          responseMessage: response.statusText,
          isFetching: false,
          bananasId: id
        });
        console.log(response);
      })
      .catch(e => console.log(e));
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.postReady} style={styles.divButton}>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            {this.state.fontLoaded ? (
              <React.Fragment>
                <Text style={{ fontSize: 56, fontFamily: "open-sans-bold" }}>
                  Get {"\n"}
                </Text>
                <Text style={{ fontSize: 56, fontFamily: "open-sans-bold" }}>
                  Me {"\n"}
                </Text>
                <Text style={{ fontSize: 56, fontFamily: "open-sans-bold" }}>
                  Bananas {"\n"}
                </Text>
              </React.Fragment>
            ) : null}
            <Text style={styles.resultText}>{this.state.bananasId}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "center"
  },
  divButton: {
    backgroundColor: "#fed330",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  resultText: {
    padding: 20,
    fontSize: 30,
    backgroundColor: "#f2c51f"
  }
});
