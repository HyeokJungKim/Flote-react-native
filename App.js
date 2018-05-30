import React, { Component} from 'react';
import { AsyncStorage, } from 'react-native'
import {Container} from 'native-base'
import Home from './Components/Home'
import Login from './Components/Login'
import NoteContainer from './Components/NoteContainer'
import Registration from './Components/Registration'
import NewNote from './Components/NewNote'
import EditNote from './Components/EditNote'
import ActionCable from 'react-native-actioncable'
import ActionCableProvider from 'react-actioncable-provider'

// import ScreenManager from './Components/ScreenManager'
// export default ScreenManager

type Props = {};
export default class App extends Component<Props> {
  state={showing: "Home",
  note: {},
  username: "",
  user_id: "",
  token: "",
  }

  async clearAsyncStorage() {
    try {
      const value = await AsyncStorage.clear()
    } catch (error) {
      console.log("Error retrieving data" + error);
    }
  }

  setStorage = (json) => {
    this.setState({username: json.username, user_id: json.user_id, token: json.token})
  }

  logOut = () => {
    this.clearAsyncStorage()
      .then(this.setState({showing:"Home", username: "", user_id: "", token:""}))
  }

  notesIndex = () => {
    this.setState({showing: "Notes"})
  }

  registration = () => {
    this.setState({showing: "Registration"})
  }

  newNote = () => {
    this.setState({showing:"New Note"})
  }

  noteEdit = (noteObj) => {
    this.setState({showing: "Edit Note", note: noteObj})
  }

  showing = () => {
    switch(this.state.showing){
      case "Notes":
        return <NoteContainer username={this.state.username} userid={this.state.user_id} token={this.state.token} noteEdit={this.noteEdit} logOut={this.logOut} newNote={this.newNote}></NoteContainer>
        break;
      case "Home":
        return <Login registration={this.registration} setStorage={this.setStorage} notesIndex={this.notesIndex}></Login>
        break;
      case "Registration":
        return <Registration logOut={this.logOut} notesIndex={this.notesIndex}></Registration>
        break;
      case "New Note":
        return <NewNote username={this.state.username} userid={this.state.user_id} token={this.state.token} notesIndex={this.notesIndex}></NewNote>
        break;
      case "Edit Note":
        return <EditNote notesIndex={this.notesIndex} note={this.state.note}></EditNote>
        break;
    }
  }

  render() {
    const cable = ActionCable.createConsumer("ws://localhost:4000/cable")
    return (
      <ActionCableProvider cable={cable}>
        <Container>
          {this.showing()}
        </Container>
      </ActionCableProvider>
    );
  }
}
