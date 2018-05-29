import React, {Component} from 'react'
import { AsyncStorage, } from 'react-native'
import {
  Container,
  Header,
  Button,
  Text,
  Body,
  Form,
  Item as FormItem,
  Input,
  Label,
  Title,}
from 'native-base'

export default class Login extends Component {

  state={
    username: "",
    password: "",
  }

  handleUsername = (event) => {
    this.setState({username: event})
  }

  handlePassword = (event) => {
    this.setState({password: event})
  }

  handleSubmit = (event) => {
    const { username, password } = this.state;
    const auth = { username, password };
    this.login(auth)
  }

  login = ({username, password}) => {
    // const {navigate} = this.props.navigation
    fetch('http://localhost:4000/login', {
      method: 'POST',
      body:
      JSON.stringify({username, password})
      ,
      headers: {
        'Content-Type': "application/json",
        'accepts': 'application/json',
      }
    })
    .then(res => res.json())
    .then(json => {
      if(json.token){
        this.saveKey(json)
          .then(this.props.notesIndex())
      } else{
        alert("You've typed in the wrong username or password.")
      }
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
  // const {navigate} = this.props.navigation

  render(){
    return(
      <Container>
        <Header>

          <Body>
            <Title>Flote Login</Title>
          </Body>

          <Button rounded danger onPress={this.props.registration} >
            <Text> Sign Up </Text>
          </Button>

        </Header>

        <Form>
          <FormItem floatingLabel>
            <Label>Username</Label>
            <Input onChangeText={this.handleUsername} autoCapitalize={"none"} value={this.state.username} autoFocus={true}/>
          </FormItem>
          <FormItem floatingLabel last>
            <Label>Password</Label>
            <Input onChangeText={this.handlePassword} value={this.state.password} secureTextEntry={true} />
          </FormItem>

          <Button onPress={this.handleSubmit} full primary style={{ paddingBottom: 4 }}>
            <Text> Login </Text>
          </Button>

        </Form>
      </Container>
    )
  }
}
