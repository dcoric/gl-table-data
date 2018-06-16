import React, { Component } from 'react';

import TableData from 'gl-table-data';

export default class App extends Component {
  alertValue = (value) => {
    console.log(value);
  }
  render () {
    const data = [
      {id: 1, name: 'Test row 1', value: 11, date: new Date((new Date()).getTime() - 5000)},
      {id: 2, name: 'Test row 2', value: 31, date: new Date((new Date()).getTime() - 15000)},
      {id: 3, name: 'Test row 3', value: 17, date: new Date((new Date()).getTime() - 52000)},
      {id: 4, name: 'Test row 4', value: 35, date: new Date((new Date()).getTime() - 45000)},
      {id: 5, name: 'Test row 5', value: 22, date: new Date((new Date()).getTime() - 55000)},
      {id: 6, name: 'Test row 6', value: 8, date: new Date((new Date()).getTime() - 99000)},
      {id: 7, name: 'Test row 7', value: 6, date: new Date((new Date()).getTime() - 75000)},
      {id: 8, name: 'Test row 8', value: 44, date: new Date((new Date()).getTime() - 0)},
      {id: 9, name: 'Test row 9', value: 51, date: new Date((new Date()).getTime() - 4100)},
      {id: 10, name: 'Test row 10', value: 23, date: new Date((new Date()).getTime() - 15500)},
      {id: 11, name: 'Test row 11', value: 56, date: new Date((new Date()).getTime() - 22000)}
    ];
    return (
      <TableData numberOfRows={7} tableRowClick={value => this.alertValue(JSON.stringify(value))}
        tableItemsList={data}
        keyList={['id', 'name', 'value', 'date']}
        tableColumnData={
          {
            id: 'ID',
            id_width: 2,
            name: 'Name',
            name_width: 4,
            value: 'Amount $',
            value_width: 2,
            value_table_column_style: {fontWeight: 'bold'},
            date: 'Created at',
            date_width: 4,
            date_table_column_render_func: (date) => { return date.toLocaleString(); }
          }
        }
      />
    );
  }
}
