import React, {Component} from 'react'
import { AsyncStorage, } from 'react-native'
import {
  Container,
  Header,
  Button,
  Right,
  Text,
  Body,
  Form,
  Item as FormItem,
  Input,
  Label,
  Title,}
from 'native-base'

export default class Registration extends Component {

  state={
    name:"",
    username: "",
    password: "",
  }

  handleName = (event) => {
    this.setState({name: event})
  }

  handleUsername = (event) => {
    this.setState({username: event})
  }

  handlePassword = (event) => {
    this.setState({password: event})
  }

  handleSubmit = (event) => {
    const { name ,username, password } = this.state;
    const auth = { name ,username, password };
    this.register(auth)
  }

  register = ({name,username, password}) => {
    // const {navigate} = this.props.navigation
    fetch('http://localhost:4000/register', {
      method: 'POST',
      body:
        JSON.stringify({ name, username, password})
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
        alert("Invalid Name or Username")
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

  render(){
    // const {navigate} = this.props.navigation
    return(
      <Container>
        <Header>


          <Body>
            <Title>Flote Registration</Title>
          </Body>

          <Button rounded danger onPress={this.props.logOut}>
            <Text>
              Login
            </Text>
            <Right/>
          </Button>

        </Header>
        <Form>
          <FormItem floatingLabel>
            <Label>Name</Label>
            <Input onChangeText={this.handleName} autoFocus={true}/>
          </FormItem>
          <FormItem floatingLabel>
            <Label>Username</Label>
            <Input onChangeText={this.handleUsername} autoCapitalize={"none"}/>
          </FormItem>
          <FormItem floatingLabel last>
            <Label>Password</Label>
            <Input onChangeText={this.handlePassword} value={this.state.password} secureTextEntry={true} />
          </FormItem>



          <Button onPress={this.handleSubmit} full primary style={{ paddingBottom: 4 }}>
            <Text> Register </Text>
          </Button>
        </Form>
      </Container>
    )
  }
}
