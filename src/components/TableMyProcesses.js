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

// import { Loading } from '../../../theme-sources/material-ui/components/loading';
// import { CurrencyTypeProvider } from '../../../theme-sources/material-ui/components/currency-type-provider';

import CircularProgress from '@material-ui/core/CircularProgress';

import Centaurus from '../api';

// const URL = 'https://js.devexpress.com/Demos/WidgetsGallery/data/orderItems';

export default class TableMyProcesses extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'process', title: 'Process ID' },
        { name: 'startTime', title: 'Start Time' },
        { name: 'startEnd', title: 'Start End' },
        { name: 'duration', title: 'Duration' },
        { name: 'pipeline', title: 'Pipeline' },
        { name: 'release', title: 'Release' },
        { name: 'dataset', title: 'Dataset' },
        { name: 'owner', title: 'Owner' },
        { name: 'status', title: 'Status' },
        { name: 'saved', title: 'Saved' },
        { name: 'published', title: 'Published' },
      ],
      //   currencyColumns: ['SaleAmount'],
      //   tableColumnExtensions: [
      //     { columnName: 'OrderNumber', align: 'right' },
      //     { columnName: 'SaleAmount', align: 'right' },
      //   ],
      rows: [],
      sorting: [{ columnName: 'StoreCity', direction: 'asc' }],
      totalCount: 0,
      pageSize: 10,
      pageSizes: [5, 10, 15],
      currentPage: 0,
      loading: true,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate() {
    this.loadData();
  }

  changeSorting = sorting => {
    this.setState({
      loading: true,
      sorting,
    });
  };

  changeCurrentPage = currentPage => {
    this.setState({
      loading: true,
      currentPage,
    });
  };

  changePageSize = pageSize => {
    const { totalCount, currentPage: stateCurrentPage } = this.state;
    const totalPages = Math.ceil(totalCount / pageSize);
    const currentPage = Math.min(stateCurrentPage, totalPages - 1);

    this.setState({
      loading: true,
      pageSize,
      currentPage,
    });
  };

  queryString = () => {
    const { sorting, pageSize, currentPage } = this.state;

    const API = async currentComments => {
      console.log(currentComments);
      const processesList = await Centaurus.getAllProcessesList(
        currentComments
      );

      if (processesList && processesList.processesList) {
        const processesListLocal = processesList.processesList.map(row => {
          return {
            OrderNumber: row.user.displayName,
            OrderData: row.comments,
          };
        });
        this.setState({
          processesList: processesListLocal,
        });
      } else {
        return null;
      }
    };

    let queryString = `${API}?take=${pageSize}&skip=${pageSize * currentPage}`;

    const columnSorting = sorting[0];
    if (columnSorting) {
      const sortingDirectionString =
        columnSorting.direction === 'desc' ? ' desc' : '';
      queryString = `${queryString}&orderby=${
        columnSorting.columnName
      }${sortingDirectionString}`;
    }

    return queryString;
  };

  loadData = () => {
    const queryString = this.queryString();
    if (queryString === this.lastQuery) {
      this.setState({ loading: false });
      return;
    }

    fetch(queryString)
      .then(response => response.json())
      .then(data =>
        this.setState({
          rows: data.items,
          totalCount: data.totalCount,
          loading: false,
        })
      )
      .catch(() => this.setState({ loading: false }));
    this.lastQuery = queryString;
  };

  render() {
    const {
      rows,
      columns,
      //   tableColumnExtensions,
      sorting,
      pageSize,
      pageSizes,
      currentPage,
      totalCount,
      loading,
    } = this.state;

    return (
      <Paper style={{ position: 'relative' }}>
        <Grid rows={rows} columns={columns}>
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
          <PagingPanel pageSizes={pageSizes} />
        </Grid>
        {loading && (
          <CircularProgress
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              margin: '-30px 0 0 -20px',
            }}
          />
        )}
      </Paper>
    );
  }
}
