import React, { Component } from "react";
import {AsyncStorage} from 'react-native'

import {
  Card, CardItem, Text, Body}
from "native-base";

export default class Note extends Component {

  editCard = () => {
    this.props.noteEdit(this.props.note)
  }

  render() {
    return (
        <Card>
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
