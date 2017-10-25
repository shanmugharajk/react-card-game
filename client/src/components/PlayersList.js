import React, { Component } from "react";
import { Icon, Table } from "semantic-ui-react";

export default class PlayersList extends Component {
  getPlayers = () =>
    this.props.players.map(player => (
      <Table.Row key={player} positive={this.props.currentPlayer === player}>
        <Table.Cell>
          {this.props.currentPlayer === player ? (
            <Icon name="user circle outline" />
          ) : (
            <Icon name="user" />
          )}
          {player.toUpperCase()}
        </Table.Cell>
      </Table.Row>
    ));

  render() {
    return (
      <Table size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Players</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>{this.getPlayers()}</Table.Body>
      </Table>
    );
  }
}
