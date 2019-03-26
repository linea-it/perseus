import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import {
  PagingState,
  SortingState,
  CustomPaging,
  // SearchState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  VirtualTable,
  TableHeaderRow,
  PagingPanel,
  TableColumnResizing,
  Toolbar,
  // SearchPanel,
} from '@devexpress/dx-react-grid-material-ui';

import CircularProgress from '@material-ui/core/CircularProgress';

import Centaurus from '../api';

class TableRunning extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'process_id', title: 'Process ID' },
        { name: 'start_time', title: 'Start Time' },
        { name: 'name', title: 'Pipeline' },
        { name: 'release', title: 'Release' },
        { name: 'dataset', title: 'Dataset' },
        { name: 'owner', title: 'Owner' },
      ],
      defaultColumnWidths: [
        { columnName: 'process_id', width: 130 },
        { columnName: 'start_time', width: 180 },
        { columnName: 'name', width: 200 },
        { columnName: 'release', width: 130 },
        { columnName: 'dataset', width: 130 },
        { columnName: 'owner', width: 180 },
      ],
      data: [],
      sorting: [{ columnName: 'process_id', direction: 'desc' }],
      totalCount: 0,
      pageSize: 10,
      pageSizes: [5, 10, 15],
      currentPage: 0,
      loading: true,
      after: '',
      searchValue: '',
    };
  }

  componentDidMount() {
    this.loadTotalCount();
    this.loadData();
  }

  changeSorting = sorting => {
    this.setState(
      {
        loading: true,
        sorting,
      },
      () => this.loadData()
    );
  };

  changeCurrentPage = currentPage => {
    var offset = currentPage * this.state.pageSize;

    const after = window.btoa('arrayconnection:' + (offset - 1));
    this.setState(
      {
        loading: true,
        currentPage,
        after: after,
      },
      () => this.loadData()
    );
  };

  changePageSize = pageSize => {
    const { totalCount, currentPage: stateCurrentPage } = this.state;
    const totalPages = Math.ceil(totalCount / pageSize);
    const currentPage = Math.min(stateCurrentPage, totalPages - 1);

    this.setState(
      {
        loading: true,
        pageSize,
        currentPage,
      },
      () => this.loadData()
    );
  };

  changeSearchValue = searchValue => {
    const { columns } = this.state;

    searchValue = columns
      .reduce((acc, { name }) => {
        acc.push(`["${name}", "contains", "${searchValue}"]`);
        return acc;
      }, [])
      .join(',"or",');

    this.setState(
      {
        loading: true,
        searchValue,
      },
      () => this.loadData()
    );
  };

  loadTotalCount = async radix => {
    const processesList = await Centaurus.getAllProcessesListRunningTotalCount();
    if (processesList !== null) {
      const processesListLocal = processesList.processesList.pageInfo.endCursor;

      const decodeString = window.atob(processesListLocal);

      const totalCount = decodeString.split(':')[1];

      this.setState({
        totalCount: parseInt(totalCount, radix),
      });
    } else {
      this.setState({
        loading: false,
      });
    }
  };

  loadData = async () => {
    const { sorting, pageSize, after, searchValue } = this.state;
    const processesList = await Centaurus.getAllProcessesListRunning(
      sorting,
      pageSize,
      after,
      searchValue
    );

    if (
      processesList &&
      processesList.processesList &&
      processesList.processesList.edges
    ) {
      const processesListLocal = processesList.processesList.edges.map(row => {
        return {
          process_id: row.node.processId,
          start_time: row.node.startTime !== null ? row.node.startTime : '-',
          name: row.node.name,
          release:
            row.node.fields.edges.length !== 0
              ? row.node.fields.edges.map(edge => {
                  return edge.node.releaseTag.releaseDisplayName;
                })
              : '-',
          dataset:
            row.node.fields.edges.length !== 0
              ? row.node.fields.edges.map(edge => {
                  return edge.node.fieldName;
                })
              : '-',
          owner: row.node.session.user.displayName,
        };
      });
      this.setState({
        data: processesListLocal,
        cursor: processesList.processesList.pageInfo,
        loading: false,
      });
    } else {
      return null;
    }
  };

  render() {
    const {
      data,
      columns,
      sorting,
      pageSize,
      pageSizes,
      currentPage,
      totalCount,
      loading,
      defaultColumnWidths,
    } = this.state;

    return (
      <Paper style={{ position: 'relative' }}>
        <Grid rows={data} columns={columns}>
          {/* <SearchState onValueChange={this.changeSearchValue} /> */}
          <SortingState
            sorting={sorting}
            onSortingChange={this.changeSorting}
            columnExtensions={[
              { columnName: 'duration', sortingEnabled: false },
              { columnName: 'release', sortingEnabled: false },
              { columnName: 'dataset', sortingEnabled: false },
              { columnName: 'owner', sortingEnabled: false },
              { columnName: 'saved', sortingEnabled: false },
            ]}
          />
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={this.changeCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={this.changePageSize}
          />
          <CustomPaging totalCount={totalCount} />
          <VirtualTable />
          <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
          <TableHeaderRow showSortingControls />
          <PagingPanel pageSizes={pageSizes} />
          <Toolbar />
          {/* <SearchPanel /> */}
        </Grid>
        {loading && (
          <CircularProgress
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              margin: '-30px 0 0 -20px',
              zIndex: '99',
            }}
          />
        )}
      </Paper>
    );
  }
}

export default TableRunning;
