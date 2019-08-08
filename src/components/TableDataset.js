import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  PagingState,
  IntegratedPaging,
  SortingState,
  IntegratedSorting,
  SearchState,
  IntegratedFiltering,
  SelectionState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  PagingPanel,
  Toolbar,
  SearchPanel,
} from '@devexpress/dx-react-grid-material-ui';
import CustomTableHeaderRowCell from './CustomTableHeaderRowCell';

export default class TableDataset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'release', title: 'Release' },
        { name: 'dataset', title: 'Dataset' },
      ],
      rows: this.props.rowsDatasetRunning,
      pageSize: 10,
      pageSizes: [5, 10, 15],
    };
  }
  static propTypes = {
    rowsDatasetRunning: PropTypes.array.isRequired,
  };

  render() {
    const { rows, columns, pageSize, pageSizes } = this.state;
    return (
      <Grid rows={rows} columns={columns}>
        <SearchState onValueChange={this.changeSearchValue} />
        <SortingState />
        <PagingState defaultCurrentPage={0} defaultPageSize={pageSize} />
        <PagingPanel pageSizes={pageSizes} />
        <IntegratedPaging />
        <IntegratedSorting />
        <IntegratedFiltering />
        <SelectionState />
        <Table />
        <CustomTableHeaderRowCell />
        <Toolbar />
        <SearchPanel />
      </Grid>
    );
  }
}
