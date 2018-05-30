import React, { Component } from "react";
import {AsyncStorage, } from 'react-native'
import
  { Container, Header, Title, Content, Body, Right, Footer, Button, Text, Left}
from "native-base";
import Note from './Note'
import {ActionCable} from 'react-actioncable-provider'


export default class NoteContainer extends Component {
  state ={
    notes: [],
    user_id: "",
    token: "",
    username: ""
  }

  async getKey() {
    try {
      const value = await AsyncStorage.multiGet(['user_id', 'token', 'username']);
      this.setState({user_id: value[0][1], token: value[1][1], username: value[2][1]});
    } catch (error) {
      console.log("Error retrieving data" + error);
    }
  }


  componentDidMount = () => {
    this.getKey()
    .then(() => {
      fetch(`http://localhost:4000/user/${this.state.user_id}/notes`, {
        headers: {
          'Authorization': this.state.token,
          'Content-Type': 'application/json'
        }}
      )
      .then(res => res.json())
      .then(noteArr => {
        this.setState({notes: noteArr[0].notes})
      })
    })
  }




  onReceived = (note) => {
    console.log('hit')
      this.setState({
          notes: [note,
              ...this.state.notes
          ]
      })

  }




  render() {
    let notes = this.state.notes.map((note, index) => <Note noteEdit={this.props.noteEdit} index={index} key={note.id} note={note}></Note>)
    return (
      <Container>
        <ActionCable ref='noteChannel' channel={{channel: 'NoteChannel', room: this.props.userid, username: this.props.username}} onReceived={this.onReceived} />
        <Header>
          <Body>
            <Title> Notes </Title>
          </Body>
          <Right />

          <Button rounded warning onPress={this.props.logOut}>
            <Text>
              Logout
            </Text>
            <Left/>
          </Button>

        </Header>
        <Content padder>
          {notes}
        </Content>
        <Footer>
          <Button block onPress={this.props.newNote}>
            <Text>
              Add New Note
            </Text>
          </Button>
        </Footer>
      </Container>
    );
  }
}
