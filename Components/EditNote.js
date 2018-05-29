import React, {Component} from 'react'
import { AsyncStorage, } from 'react-native'
import { Container, Header, Left, Body, Title, Right, Content, Textarea, Form, Button, Text }from "native-base";

export default class EditNote extends Component {

  state={
    body: this.props.note.body,
    user_id: "",
    token: ""
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
    this.editNote(auth)
  }

  async getId() {
    try {
      const value = await AsyncStorage.multiGet(['user_id', 'token']);
      this.setState({user_id: value[0][1], token: value[1][1]})
    } catch (error) {
      console.log("Error retrieving data" + error);
    }
  }

  editNote = ({body}) => {
    this.getId()
      .then(() => {
        let data = {body, user_id: `${this.state.user_id}`, channel_id: 1}
        fetch(`http://localhost:4000/notes/${this.props.note.id}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': "application/json",
            'accepts': 'application/json',
            'Authorization': this.state.token,
          }
        })
        .then(res => {
        this.props.notesIndex()
        })
      })
  }

  delete = () => {
    this.getId()
      .then(() => {
        fetch(`http://localhost:4000/notes/${this.props.note.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': this.state.token,
          }
        })
        .then(res => {
          this.props.notesIndex()
        })
      })
  }

  render(){
    return(
      <Container>
         <Header>
           <Left />
           <Body>
             <Title>Edit Note</Title>
           </Body>
           <Right />

           <Button rounded danger onPress={this.home}>
             <Text>
               Home
             </Text>
             <Left/>
           </Button>

         </Header>
         <Content padder>
           <Form>
             <Textarea onChangeText={this.handleBody} rowSpan={5} bordered placeholder="Edit Note" value={this.state.body} />

           <Button onPress={this.handleSubmit}>
               <Right/>
               <Text>
                 Edit Note
               </Text>
               <Left/>
             </Button>

          <Button onPress={this.delete}>
              <Right/>
                <Text>
                  Delete Note
                </Text>
              <Left/>
            </Button>

           </Form>
         </Content>
       </Container>
    )
  }
}
