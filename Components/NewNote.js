import React, {Component} from 'react'
import { AsyncStorage, } from 'react-native'
import { Container, Header, Left, Body, Title, Right, Content, Textarea, Form, Button, Text }from "native-base";
import {ActionCable} from 'react-actioncable-provider'

export default class NewNote extends Component {

  state={
    body: "",
    user_id: "",
    token: "",
    username:""
  }

  home = () => {
    this.props.notesIndex()
  }

  handleBody = (event) => {
    this.setState({body: event})
  }

  handleSubmit = () => {
    const { body } = this.state;
    const auth = { body };
    this.createNote(auth)
  }

  componentDidMount(){
    this.getId()
  }

  async getId() {
    try {
      const value = await AsyncStorage.multiGet(['user_id', 'token', 'username']);
      this.setState({user_id: value[0][1], token: value[1][1], username: value[2][1]})
    } catch (error) {
      console.log("Error retrieving data" + error);
    }
  }

  createNote = ({body}) => {
    this.getId()
      .then(() => {
        let data = {body, user_id: `${this.state.user_id}`, channel_id: 1}
        fetch('http://localhost:4000/notes/', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': "application/json",
            'accepts': 'application/json',
            'Authorization': this.state.token,
          }
        })
        .then(res => {
        this.props.notesIndex()
        }
      )
    })
  }

  async saveKey(json) {
    try {
      await AsyncStorage.multiSet([
        ['token', json.token],
        ['username', json.username],
        ['user_id', json.user_id.toString()]
      ])
    } catch (error) {
      console.log("Error saving data" + error);
    }
  }



  //
  //
  // sendMessage = () => {
  //     const note = this.state.body
  //     const room = this.props.userid
  //     // Call perform or send
  //     this.refs.noteChannel.send({note, room})
  // }






  // <ActionCable ref='noteChannel' channel={{channel: 'NoteChannel', room: this.props.userid, username: this.props.username }} />

  // const {navigate} = this.props.navigation
  render(){
    return(
    <Container>

         <Header>
           <Left />
           <Body>
             <Title>New Note</Title>
           </Body>
           <Right />

           <Button rounded danger onPress={this.home}>
             <Right/>
             <Text>
               Home
             </Text>
             <Left/>
           </Button>

         </Header>


         <Content padder>
           <Form>
             <Textarea onChangeText={this.handleBody} rowSpan={5} bordered placeholder="New Note" />
             <Button onPress={this.handleSubmit}>
               <Right/>
               <Text>
                 Create New Note
               </Text>
               <Left/>
             </Button>


           </Form>
         </Content>
       </Container>
    )
  }
}
