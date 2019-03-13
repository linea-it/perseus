import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import {
  PagingState,
  SortingState,
  CustomPaging,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';

import CircularProgress from '@material-ui/core/CircularProgress';

import Centaurus from '../api';

// const URL = 'https://js.devexpress.com/Demos/WidgetsGallery/data/orderItems';

export default class TableMyProcesses extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'process_id', title: 'Process ID' },
        { name: 'start_time', title: 'Start Time' },
        { name: 'end_time', title: 'Start End' },
        { name: 'duration', title: 'Duration' },
        { name: 'pipeline', title: 'Pipeline' },
        { name: 'release', title: 'Release' },
        { name: 'dataset', title: 'Dataset' },
        { name: 'owner', title: 'Owner' },
        { name: 'status_id', title: 'Status' },
        { name: 'saved', title: 'Saved' },
        { name: 'flag_published', title: 'Published' },
      ],
      //   currencyColumns: ['SaleAmount'],
      //   tableColumnExtensions: [
      //     { columnName: 'OrderNumber', align: 'right' },
      //     { columnName: 'SaleAmount', align: 'right' },
      //   ],
      data: [],
      sorting: [{ columnName: 'process_id', direction: 'asc' }],
      totalCount: 0,
      pageSize: 10,
      pageSizes: [5, 10, 15],
      currentPage: 0,
      loading: true,
      cursor: '',
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
      () => this.loadData(sorting)
    );
  };

  changeCurrentPage = currentPage => {
    this.setState(
      {
        loading: true,
        currentPage,
      },
      () => this.loadData(currentPage)
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
      () => this.loadData(pageSize)
    );
  };

  changeCursor = cursor => {
    this.setState(
      {
        loading: true,
        cursor,
      },
      () => this.loadData(cursor)
    );
  };

  loadTotalCount = async () => {
    // Executa a api
    const processesList = await Centaurus.getAllProcessesListTotalCount();

    const processesListLocal = processesList.processesList.pageInfo.endCursor;

    const decodeString = window.atob(processesListLocal);

    const totalCount = decodeString.split(':')[1];

    this.setState({
      totalCount: totalCount,
    });
  };

  loadData = async () => {
    const { sorting, currentPage, pageSize, cursor } = this.state;
    const processesList = await Centaurus.getAllProcessesList(
      sorting,
      currentPage,
      pageSize,
      cursor
    );

    if (
      processesList &&
      processesList.processesList &&
      processesList.processesList.edges
    ) {
      const processesListLocal = processesList.processesList.edges.map(row => {
        return {
          process_id: row.node.processId,
          start_time: row.node.startTime,
          end_time: row.node.endTime,
          // duration: row.node.,
          pipeline: row.node.name,
          release: row.node.fields.edges.node
            ? row.node.fields.edges.node.releaseTag.releaseDisplayName
            : null,
          dataset: row.node.fields.edges.node
            ? row.node.fields.edges.node.fieldName
            : null,
          owner: row.node.session.user.displayName,
          status_id: row.node.processStatus.name,
          // saved: row.node.,
          flag_published: row.node.flagPublished,
        };
      });
      this.setState({
        data: processesListLocal,
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
      //   tableColumnExtensions,
      sorting,
      pageSize,
      pageSizes,
      currentPage,
      totalCount,
      loading,
      cursor,
    } = this.state;

    return (
      <Paper style={{ position: 'relative' }}>
        <Grid rows={data} columns={columns}>
          <SortingState
            sorting={sorting}
            onSortingChange={this.changeSorting}
          />
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={this.changeCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={this.changePageSize}
          />
          <CustomPaging totalCount={totalCount} />
          <Table />
          {/* columnExtensions={tableColumnExtensions} */}
          <TableHeaderRow showSortingControls />
          <PagingPanel pageSizes={pageSizes} cursor={cursor} />
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
