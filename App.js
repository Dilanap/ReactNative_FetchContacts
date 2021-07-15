/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
 
} from "react-native";
import Contacts from "react-native-contacts";

import ListItem from "./components/ListItem";
import Avatar from "./components/Avatar";

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      typeText: null,
      loading: true
    };
    Contacts.iosEnableNotesUsage(false);
  }

  async componentDidMount() {
    if (Platform.OS === "android") {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: "Contacts",
        message: "This app would like to view your contacts."
      }).then(() => {
        this.loadContacts();
      });
    } else {
      this.loadContacts();
    }
  }

  loadContacts() {
    Contacts.getAll()
      .then(contacts => {
        this.setState({ contacts, loading: false });
      })
      .catch(e => {
        this.setState({ loading: false });
      });

    Contacts.checkPermission();
  }

  onPressContact(contact) {
    var text = this.state.typeText;
    this.setState({ typeText: null });
    if (text === null || text === '')
      Contacts.openExistingContact(contact)
    else {
      var newPerson = {
        recordID: contact.recordID,
        phoneNumbers: [{ label: 'mobile', number: text }]
      }
      Contacts.editExistingContact(newPerson).then(contact => {
        //contact updated
      });
    }
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            paddingLeft: 100,
            paddingRight: 100,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
        </View>
        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
        
        </View>
        {
          this.state.loading === true ?
            (
              <View style={styles.spinner}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ) : (
              <ScrollView style={{ flex: 1 }}>
                {this.state.contacts.map(contact => {
                  return (
                    <ListItem
                      leftElement={
                        <Avatar
                          img={
                            contact.hasThumbnail
                              ? { uri: contact.thumbnailPath }
                              : undefined
                          }
                          placeholder={getAvatarInitials(
                            `${contact.givenName} ${contact.familyName}`
                          )}
                          width={40}
                          height={40}
                        />
                      }
                      key={contact.recordID}
                      title={`${contact.givenName} ${contact.familyName}`}
                      description={`${contact.company}`}
                      onPress={() => this.onPressContact(contact)}
                      onDelete={() =>
                        Contacts.deleteContact(contact).then(() => {
                          this.loadContacts();
                        })
                      }
                    />
                  );
                })}
              </ScrollView>
            )
        }

      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  spinner: {
    flex: 1,
    flexDirection: 'column',
    alignContent: "center",
    justifyContent: "center"
  },
  inputStyle: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    textAlign: "center"
  }
});

const getAvatarInitials = textString => {
  if (!textString) return "";

  const text = textString.trim();

  const textSplit = text.split(" ");

  if (textSplit.length <= 1) return text.charAt(0);

  const initials =
    textSplit[0].charAt(0) + textSplit[textSplit.length - 1].charAt(0);

  return initials;
};
