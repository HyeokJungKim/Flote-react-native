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


  onDelete = (index, id) =>{
      const i = parseInt(index)
      const ego = parseInt(id)
      if (
        this.state.notes
        && this.state.notes[i]
        && this.state.notes[i].id === ego
      ) {
        this.setState({
          notes: [...this.state.notes.slice(0,i),
            ...this.state.notes.slice(i+1)]
        })
        // const act = 'delete'
        // this.refs.noteChannel.send({id, index, act})
      }
    }

    onReceived = (message) => {
      console.log('received')
      if (message.act !== "delete") {
        this.setState({
            notes: [message,
                ...this.state.notes
            ]
        })
        // console.log("notestatemessage", message)
      } else {
        this.onDelete(message.index, message.id)
        // console.log("deletemessage", message)
      }

    }

  onEdit = (note) => {
      console.log('rt', note);
      // if (note.user !== localStorage.getItem('username'))
      this.setState({
          notes:  [...this.state.notes.slice(0, note.index),
             note,
             ...this.state.notes.slice(note.index + 1)]
        }
      )
    }


  render() {
    let notes = this.state.notes.map((note, index) => <Note onEdit={this.onEdit} username = {this.state.username} noteEdit={this.props.noteEdit} index={index} key={note.id} note={note}></Note>)
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
