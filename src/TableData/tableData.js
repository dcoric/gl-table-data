import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import './tableData.css';
import {Pagination} from '../Pagination';
import {
  SORT_ASCENDING,
  SORT_DESCENDING,
  INDEX,
  TEXT_COLUMN_TRANSFORMATION_FUNCTION,
  TABLE_COLUMN_WIDTH,
  TEXT_COLUMN_STYLE
} from '../constants';

class TableData extends Component {
  constructor (props) {
    super(props);
    this.state = {
      paginatedList: [],
      sortDirection: SORT_ASCENDING,
      sortColumn: false,
      selectedPage: 0,
      itemsPerPage: 7,
      noPagination: false
    };

    this.renderTable = this.renderTable.bind(this);
    this.sortBy = this.sortBy.bind(this);
    this.sortClassName = this.sortClassName.bind(this);
    this.tableRowClickAction = this.tableRowClickAction.bind(this);
    this.setSelectedPage = this.setSelectedPage.bind(this);
    this.sortedTableItems = this.sortedTableItems.bind(this);
  }

  componentWillMount () {
    let {numberOfRows, tableItemsList} = this.props;
    let {itemsPerPage} = this.state;
    if (numberOfRows && !_.isNil(numberOfRows) && numberOfRows !== itemsPerPage) {
      let noPagination = false;
      if (numberOfRows < 0) {
        numberOfRows = tableItemsList.length;
        noPagination = true;
      }
      itemsPerPage = numberOfRows;
      this.setState({itemsPerPage, noPagination});
    }
  }

  tableRowClickAction (rowItem) {
    this.props.tableRowClick(rowItem);
  }

  renderTable () {
    const {keyList, tableColumnData} = this.props;
    const {itemsPerPage} = this.state;
    const tableItemsList = this.state.paginatedList;
    if (tableItemsList && tableItemsList.length) {
      let renderItems = [];
      for (let index = 0; index < itemsPerPage; index++) {
        const tableItem = tableItemsList[index];
        if (!tableItem) {
          renderItems.push(
            <div className={`row border-bottom pb-2 pt-2 padding-margin ${index % 2 === 0 ? 'bg-light' : 'bg-white'}`}
              key={`${index}${TEXT_COLUMN_TRANSFORMATION_FUNCTION}`}
              style={{cursor: 'pointer', alignItems: 'center'}} >&nbsp;{' '}
            </div>
          );
        } else {
          renderItems.push(
            <div className={`row border-bottom pb-2 pt-2 padding-margin ${index % 2 === 0 ? 'bg-light' : 'bg-white'}`}
              key={`${index}${TEXT_COLUMN_TRANSFORMATION_FUNCTION}`}
              onClick={() => this.tableRowClickAction(tableItem)} style={{cursor: 'pointer', alignItems: 'center'}}>
              {
                keyList.map(columnName => {
                  let transformation = (input) => { return input; };
                  if (_.get(tableColumnData, columnName + TEXT_COLUMN_TRANSFORMATION_FUNCTION)) {
                    transformation = _.get(tableColumnData, columnName + TEXT_COLUMN_TRANSFORMATION_FUNCTION, (param) => { return param; });
                  }
                  const externalStyle = _.get(tableColumnData, columnName + TEXT_COLUMN_STYLE, {});
                  const style = {whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', ...externalStyle};
                  let columnWidth = _.get(tableColumnData, columnName + TABLE_COLUMN_WIDTH) ? `-${_.get(tableColumnData, columnName + TABLE_COLUMN_WIDTH)}` : '';
                  return (
                    <div className={`col-lg${_.get(tableColumnData, columnName) === INDEX ? '-1' : columnWidth}`}
                      style={style} key={`${index}_${columnName}`} title={_.get(tableItem, columnName)}>
                      {transformation(_.get(tableItem, columnName))}
                    </div>
                  );
                })
              }
            </div>
          );
        }
      }
      return renderItems;
    }
    return <div />;
  }

  sortBy (name) {
    const tableItemsList = this.state.paginatedList;
    if (tableItemsList && tableItemsList.length) {
      let {sortColumn, sortDirection} = this.state;
      if (name === sortColumn) {
        if (sortDirection === SORT_ASCENDING) {
          sortDirection = SORT_DESCENDING;
        } else {
          sortDirection = SORT_ASCENDING;
        }
        this.setState({sortDirection, selectedPage: 0});
      } else {
        sortColumn = name;
        sortDirection = SORT_ASCENDING;
        this.setState({sortColumn, sortDirection, selectedPage: 0});
      }
    }
  }

  sortedTableItems (tableItemsList) {
    const {sortColumn, sortDirection} = this.state;
    if (sortColumn) {
      const sortedList = _.orderBy(tableItemsList, [sortColumn], [sortDirection]);
      return sortedList;
    }
    return tableItemsList;
  }

  sortClassName (name) {
    const {sortColumn, sortDirection} = this.state;
    if (sortColumn === name) {
      if (sortDirection === SORT_ASCENDING) {
        return 'sort-asc';
      } else {
        return 'sort-desc';
      }
    }
    return 'sort-by';
  }

  setSelectedPage (vehiclesPaginated, selectedPage, forceUpdate) {
    if ((this.state.selectedPage !== selectedPage) || forceUpdate) {
      this.setState({
        paginatedList: vehiclesPaginated,
        selectedPage: selectedPage
      });
    }
  }

  /** tableColumnData structure:
    {
      fieldName: Display name for column
      fieldValue: column value name
      fieldName_table_column_render_func: function for custom column rendering - not required
    }
   */
  render () {
    const {tableItemsList, tableColumnData, keyList, noHeader} = this.props;
    const {noPagination} = this.state;
    const headStyle = {cursor: 'pointer'};
    return (
      <div className='col-lg-12 middle-section-style'>
        {!noHeader && <div className='row' style={{backgroundColor: 'lightgray', padding: '0px 15px 0px 15px', margin: '0px'}}>
          {keyList.map((itemName, index) => {
            if (_.get(tableColumnData, itemName) === INDEX || _.get(tableColumnData, itemName) === '') {
              return (
                <div className={'col-lg-1'} style={headStyle} key={`${itemName}_${index}`} />
              );
            }
            if (_.get(tableColumnData, itemName + TABLE_COLUMN_WIDTH, '')) {
              return (
                <div className={`col-lg-${_.get(tableColumnData, itemName + TABLE_COLUMN_WIDTH)} ${this.sortClassName(itemName)}`} style={headStyle} key={`${itemName}_${index}`} onClick={() => this.sortBy(itemName)}>
                  {_.get(tableColumnData, itemName, '')}
                </div>
              );
            }
            return (
              <div className={`col-lg ${this.sortClassName(itemName)}`} style={headStyle} key={`${itemName}_${index}`} onClick={() => this.sortBy(itemName)}>
                {_.get(tableColumnData, itemName, '')}
              </div>
            );
          })}
        </div>}
        {this.renderTable()}
        <Pagination
          itemsPerPage={this.state.itemsPerPage}
          items={this.sortedTableItems(tableItemsList)}
          renderResults={this.setSelectedPage}
          noPaginationFlag={noPagination}
        />
      </div>
    );
  }
}

TableData.propTypes = {
  tableRowClick: PropTypes.func.isRequired, // Function executed on row click
  tableItemsList: PropTypes.array.isRequired, // Array of object for rendering (prefiltered)
  tableColumnData: PropTypes.object.isRequired, // Column name/value pairs { table_item: 'Table item name', second_column: 'Second column formatted' }
  keyList: PropTypes.array.isRequired, // sorted list of table column keys
  numberOfRows: PropTypes.number,
  noHeader: PropTypes.boolean
};

export default TableData;
