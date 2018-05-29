import React, { Component } from "react";
import {AsyncStorage, } from 'react-native'
import
  { Container, Header, Title, Content, Body, Right, Footer, Button, Text, Left}
from "native-base";
import Note from './Note'

export default class NoteContainer extends Component {
  state ={
    notes: [],
    user_id: "",
    token: ""
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

  render() {
    let notes = this.state.notes.map((note) => <Note noteEdit={this.props.noteEdit} key={note.id} note={note}></Note>)
    return (
      <Container>
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
