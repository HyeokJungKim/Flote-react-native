import React, { Component } from "react";
import {AsyncStorage} from 'react-native'
import {ActionCable} from 'react-actioncable-provider'
import {
  Card, CardItem, Text, Body}
from "native-base";

export default class Note extends Component {

  editCard = () => {

    this.props.noteEdit(this.props.note, this.props.index)
  }

  render() {
    return (

        <Card>
          <ActionCable ref='realTimeTypingChannel' channel={{channel: 'RealTimeTypingChannel', room: this.props.note.id, username: `${this.props.username}`}} onReceived={this.props.onEdit} />
          <CardItem button onPress={this.editCard}>
            <Body>
              <Text>
                {this.props.note.body}
              </Text>
            </Body>
          </CardItem>
        </Card>

    );
  }
}
