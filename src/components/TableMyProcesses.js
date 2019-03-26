import * as React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core/styles';
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
import moment from 'moment';

const styles = {
  btn: {
    textTransform: 'none',
    padding: '1px 5px',
    width: '5em',
    minHeight: '1em',
    display: 'block',
    textAlign: 'center',
    lineHeight: '2',
    boxShadow:
      '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  btnSuccess: {
    backgroundColor: 'green',
    color: '#fff',
  },
  btnFailure: {
    backgroundColor: 'red',
    color: '#fff',
  },
  btnRunning: {
    backgroundColor: '#ffba01',
    color: '#000',
  },
  iconCheck: {
    color: 'green',
  },
  itemLink: {
    color: 'blue',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

class TableMyProcesses extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'process_id', title: 'Process ID' },
        { name: 'start_time', title: 'Start Time' },
        { name: 'end_time', title: 'End Time' },
        { name: 'duration', title: 'Duration' },
        { name: 'name', title: 'Pipeline' },
        { name: 'release', title: 'Release' },
        { name: 'dataset', title: 'Dataset' },
        { name: 'owner', title: 'Owner' },
        { name: 'status_id', title: 'Status' },
        { name: 'saved', title: 'Saved' },
        { name: 'flag_published', title: 'Published' },
      ],
      defaultColumnWidths: [
        { columnName: 'process_id', width: 130 },
        { columnName: 'start_time', width: 180 },
        { columnName: 'end_time', width: 180 },
        { columnName: 'duration', width: 130 },
        { columnName: 'name', width: 200 },
        { columnName: 'release', width: 130 },
        { columnName: 'dataset', width: 130 },
        { columnName: 'owner', width: 180 },
        { columnName: 'status_id', width: 130 },
        { columnName: 'saved', width: 130 },
        { columnName: 'flag_published', width: 130 },
      ],
      data: [],
      sorting: [{ columnName: 'process_id', direction: 'asc' }],
      totalCount: 0,
      pageSize: 10,
      pageSizes: [5, 10, 15],
      currentPage: 0,
      loading: true,
      after: '',
      searchValue: '',
    };
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

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
    const processesList = await Centaurus.getAllProcessesListTotalCount();
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
    const processesList = await Centaurus.getAllProcessesList(
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
        const startTime = moment(row.node.startTime);
        const endTime = moment(row.node.endTime);

        return {
          process_id: row.node.processId,
          productLog: row.node.productLog,
          start_time: row.node.startTime !== null ? row.node.startTime : '-',
          end_time: row.node.endTime !== null ? row.node.endTime : '-',
          duration:
            row.node.startTime && row.node.endTime !== null
              ? moment(endTime.diff(startTime)).format('hh:mm:ss')
              : '-',
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
          status_id: row.node.processStatus.name,
          saved: row.node.flagPublished,
          flag_published: row.node.flagPublished,
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

  renderOpenProductLog = rowData => {
    window.open(rowData, 'Process ID');
  };

  renderButtonProcessId = rowData => {
    const { classes } = this.props;
    return (
      <span
        className={classes.itemLink}
        title={rowData.productLog}
        onClick={() => this.renderOpenProductLog(rowData.productLog)}
      >
        {rowData.process_id}
      </span>
    );
  };

  renderStatus = rowData => {
    const { classes } = this.props;
    if (rowData.status_id === 'failure') {
      return (
        <span className={classes.btn} style={styles.btnFailure}>
          Failure
        </span>
      );
    } else if (rowData.status_id === 'running') {
      return (
        <span className={classes.btn} style={styles.btnRunning}>
          Running
        </span>
      );
    } else {
      return (
        <span className={classes.btn} style={styles.btnSuccess}>
          Success
        </span>
      );
    }
  };

  renderButtonCheck = rowData => {
    const { classes } = this.props;

    if (rowData.saved !== null && rowData.flag_published !== null) {
      return <Icon className={classes.iconCheck}>check</Icon>;
    }
    return '-';
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

    data.map(row => {
      row.process_id = this.renderButtonProcessId(row);
      row.status_id = this.renderStatus(row);
      row.saved = this.renderButtonCheck(row);
      row.flag_published = this.renderButtonCheck(row);
      return row;
    });

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

export default withStyles(styles)(TableMyProcesses);
