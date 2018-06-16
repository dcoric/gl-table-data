import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class Pagination extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0
    };
    this.paginatedResults = this.paginatedResults.bind(this);
    this.selectPage = this.selectPage.bind(this);
  }

  renderPages (current, total, selectPage) {
    let pages = [];
    const {pathname} = window.location;
    // for (let i = 1; i <= total; i++) {
    // if (current === i) {
    pages.push(
      <li key={(new Date()).getTime() + current} className='page-item active'>
        <Link key={current} className='page-link' to={pathname}>{current}/{total} <span className='sr-only'>(current)</span></Link>
      </li>
    );
    // } else {
    //   pages.push(<li key={(new Date()).getTime() + i} className='page-item' onClick={() => selectPage(i)}><Link className='page-link' to={pathname}>{i}</Link></li>);
    // }
    // }
    return pages;
  }

  paginatedResults () {
    const {itemsPerPage, items, renderResults} = this.props;
    const {totalPages, currentPage, totalItems} = this.state;
    if (items && items.length) {
      if (totalItems !== items.length) {
        this.setState({totalItems: items.length, currentPage: 1});
        renderResults(items, 0);
      } else {
        let pagesCount = _.ceil(items.length / itemsPerPage);
        if (pagesCount !== totalPages) {
          this.setState({totalPages: pagesCount});
        }
        let startingResult = (currentPage - 1) * itemsPerPage;
        let lastItem = startingResult + itemsPerPage;
        if (lastItem > items.length) {
          lastItem = items.length;
        }
        let displayList = [];
        for (let i = startingResult; i < lastItem; i++) {
          displayList.push(items[i]);
        }
        renderResults(displayList, currentPage);
      }
    } else {
      if (this.state.totalItems !== 0 && this.state.currentPage !== 0) {
        this.setState({totalItems: 0, currentPage: 0});
      }
      renderResults([], 0, false);
    }
  }

  selectPage (pageNumber) {
    const {currentPage} = this.state;
    if (pageNumber && currentPage !== pageNumber) {
      this.setState({currentPage: pageNumber});
    }
  }

  render () {
    const {totalPages, currentPage} = this.state;
    const {pathname} = window.location;
    const {items, noPaginationFlag} = this.props;
    this.paginatedResults();
    if (!items || !items.length || noPaginationFlag) {
      return '';
    }
    return (
      <nav className='nav mt-5 mb-5 justify-content-center'>
        <ul className='pagination'>
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`} onClick={() => {
            if (currentPage > 1) {
              this.selectPage(currentPage - 1);
            }
          }}>
            <Link className='page-link' to={pathname} tabIndex='-1'>Previous</Link>
          </li>
          {this.renderPages(currentPage, totalPages, this.selectPage)}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`} onClick={() => {
            if (currentPage < totalPages) {
              this.selectPage(currentPage + 1);
            }
          }}>
            <Link className='page-link' to={pathname}>Next</Link>
          </li>
        </ul>
      </nav>
    );
  }
}

Pagination.propTypes = {
  noPaginationFlag: PropTypes.boolean,
  itemsPerPage: PropTypes.number,
  items: PropTypes.array.isRequired,
  renderResults: PropTypes.function
};
