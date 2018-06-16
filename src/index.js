import React, {Component} from 'react';
import TableData from './TableData';

export default class ExampleComponent extends Component {
  render () {
    return (
      <TableData {...this.props} />
    );
  }
}
