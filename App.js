import React, { Component} from 'react';
import { AsyncStorage, } from 'react-native'
import {Container} from 'native-base'
import Home from './Components/Home'
import Login from './Components/Login'
import NoteContainer from './Components/NoteContainer'
import Registration from './Components/Registration'
import NewNote from './Components/NewNote'
import EditNote from './Components/EditNote'
// import ScreenManager from './Components/ScreenManager'
// export default ScreenManager

type Props = {};
export default class App extends Component<Props> {
  state={showing: "Home",
  note: {},
  }

  async clearAsyncStorage() {
    try {
      const value = await AsyncStorage.clear()
    } catch (error) {
      console.log("Error retrieving data" + error);
    }
  }


  logOut = () => {
    this.clearAsyncStorage()
      .then(this.setState({showing:"Home"}))
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
        return <NoteContainer noteEdit={this.noteEdit} logOut={this.logOut} newNote={this.newNote}></NoteContainer>
        break;
      case "Home":
        return <Login registration={this.registration} notesIndex={this.notesIndex}></Login>
        break;
      case "Registration":
        return <Registration logOut={this.logOut} notesIndex={this.notesIndex}></Registration>
        break;
      case "New Note":
        return <NewNote notesIndex={this.notesIndex}></NewNote>
        break;
      case "Edit Note":
        return <EditNote notesIndex={this.notesIndex} note={this.state.note}></EditNote>
        break;
    }
  }

  render() {
    return (
      <Container>
        {this.showing()}
      </Container>
    );
  }
}
