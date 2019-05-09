import * as React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import {
  PagingState,
  SortingState,
  CustomPaging,
  SearchState,
  SelectionState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  TableColumnResizing,
  Toolbar,
  SearchPanel,
  TableSelection,
  TableColumnVisibility,
  ColumnChooser,
} from '@devexpress/dx-react-grid-material-ui';

import CircularProgress from '@material-ui/core/CircularProgress';

import Centaurus from '../api';
import moment from 'moment';

const styles = {
  wrapPaper: {
    position: 'relative',
    paddingTop: '10px',
  },
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
  formControl: {
    width: '180px',
    position: 'absolute',
    top: '8px',
    left: '24px',
    zIndex: '999',
  },
};

const tableHeaderRowCell = ({ ...restProps }) => (
  <TableHeaderRow.Cell
    {...restProps}
    style={{
      color: '#555555',
      fontSize: '1em',
    }}
  />
);

class TableMyProcesses extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
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
      tableColumnExtensions: [
        { columnName: 'process_id', width: 140 },
        { columnName: 'duration', width: 110 },
        { columnName: 'status_id', width: 110 },
        { columnName: 'saved', width: 100 },
        { columnName: 'flag_published', width: 130 },
      ],
      data: [],
      sorting: [{ columnName: 'process_id', direction: 'desc' }],
      totalCount: 0,
      pageSize: 10,
      pageSizes: [5, 10, 15],
      currentPage: 0,
      loading: true,
      after: '',
      selection: [],
      filter: 'complete',
      searchValue: '',
    };
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  componentDidMount() {
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
    this.setState(
      {
        loading: true,
        searchValue,
      },
      () => this.loadData()
    );
  };

  clearData = () => {
    this.setState({
      data: [],
      loading: false,
    });
  };

  loadData = async () => {
    const { sorting, pageSize, after, filter, searchValue } = this.state;

    const processesList = await Centaurus.getAllProcessesList(
      sorting,
      pageSize,
      after,
      filter,
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
        const diff = endTime.diff(startTime);
        const duration = moment.utc(diff).format('HH:mm:ss');

        return {
          process_id: row.node.processId,
          productLog: row.node.productLog,
          start_time: row.node.startTime !== null ? row.node.startTime : '-',
          end_time: row.node.endTime !== null ? row.node.endTime : '-',
          duration:
            row.node.startTime && row.node.endTime !== null ? duration : '-',
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
          saved: row.node.savedProcesses,
          flag_published: row.node.flagPublished,
        };
      });
      this.setState({
        data: processesListLocal,
        totalCount: parseInt(processesList.processesList.totalCount),
        cursor: processesList.processesList.pageInfo,
        loading: false,
        filterOld: filter,
      });
    } else {
      this.clearData();
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

  renderStartTime = rowData => {
    if (rowData.start_time) {
      return <span title={rowData.start_time}>{rowData.start_time}</span>;
    } else {
      return '-';
    }
  };

  renderEndTime = rowData => {
    if (rowData.end_time) {
      return <span title={rowData.end_time}>{rowData.end_time}</span>;
    } else {
      return '-';
    }
  };

  renderDuration = rowData => {
    if (rowData.duration) {
      return <span title={rowData.duration}>{rowData.duration}</span>;
    } else {
      return '-';
    }
  };

  renderName = rowData => {
    if (rowData.name) {
      return <span title={rowData.name}>{rowData.name}</span>;
    } else {
      return '-';
    }
  };

  renderRelease = rowData => {
    if (rowData.release) {
      return <span title={rowData.release}>{rowData.release}</span>;
    } else {
      return '-';
    }
  };

  renderDataset = rowData => {
    if (rowData.dataset) {
      return <span title={rowData.dataset}>{rowData.dataset}</span>;
    } else {
      return '-';
    }
  };

  renderOwner = rowData => {
    if (rowData.owner) {
      return <span title={rowData.owner}>{rowData.owner}</span>;
    } else {
      return '-';
    }
  };

  renderStatus = rowData => {
    const { classes } = this.props;

    if (rowData.status_id === 'failure') {
      return (
        <span
          className={classes.btn}
          style={styles.btnFailure}
          title={rowData.status_id}
        >
          Failure
        </span>
      );
    } else if (rowData.status_id === 'running') {
      return (
        <span
          className={classes.btn}
          style={styles.btnRunning}
          title={rowData.status_id}
        >
          Running
        </span>
      );
    } else {
      return (
        <span
          className={classes.btn}
          style={styles.btnSuccess}
          title={rowData.status_id}
        >
          Success
        </span>
      );
    }
  };

  renderSaved = rowData => {
    const { classes } = this.props;

    if (rowData.saved) {
      if (rowData.saved.savedDateEnd === null) {
        return (
          <CircularProgress
            disableShrink
            style={{ width: '25px', height: '25px' }}
          />
        );
      } else {
        return <Icon className={classes.iconCheck}>check</Icon>;
      }
    } else if (rowData.saved === null) {
      return '-';
    }
  };

  renderCheck = rowData => {
    const { classes } = this.props;

    if (rowData.flag_published) {
      return <Icon className={classes.iconCheck}>check</Icon>;
    } else {
      return '-';
    }
  };

  handleChangeFilter = evt => {
    const filter = evt.target.value;
    const filterOld = this.state.filterOld;
    const totalCount = this.state.totalCount;

    const initialState = this.initialState;
    initialState.loading = true;
    initialState.filter = filter;
    initialState.filterOld = filterOld;
    initialState.totalCount = parseInt(totalCount);

    this.setState(initialState, () => this.loadData());
  };

  renderFilter = () => {
    const { classes } = this.props;
    return (
      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="filter-label-placeholder">
          Filter
        </InputLabel>
        <Select
          value={this.state.filter}
          onChange={this.handleChangeFilter}
          input={<Input name="filter" id="filter-label-placeholder" />}
          displayEmpty
          name="filter"
        >
          <MenuItem value={'complete'}>Complete</MenuItem>
          <MenuItem value={'incomplete'}>Incomplete</MenuItem>
          <MenuItem value={'saved'}>Saved</MenuItem>
          <MenuItem value={'unsaved'}>Unsaved</MenuItem>
          <MenuItem value={'all'}>All</MenuItem>
        </Select>
      </FormControl>
    );
  };

  renderTable = () => {
    const {
      data,
      columns,
      sorting,
      pageSize,
      pageSizes,
      currentPage,
      totalCount,
      tableColumnExtensions,
      selection,
    } = this.state;

    return (
      <Grid rows={data} columns={columns}>
        <SearchState onValueChange={this.changeSearchValue} />
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
        <SelectionState
          selection={selection}
          onSelectionChange={this.changeSelection}
        />
        <Table columnExtensions={tableColumnExtensions} />
        <TableColumnResizing />
        <TableHeaderRow
          cellComponent={tableHeaderRowCell}
          showSortingControls
        />
        <TableColumnVisibility />
        <TableSelection
          selectByRowClick
          highlightRow
          showSelectionColumn={false}
        />
        <PagingPanel pageSizes={pageSizes} />
        <Toolbar />
        <SearchPanel />
        <ColumnChooser />
      </Grid>
    );
  };

  renderLoading = () => {
    return (
      <CircularProgress
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          margin: '-30px 0 0 -20px',
          zIndex: '99',
        }}
      />
    );
  };

  render() {
    const { data, loading } = this.state;
    const { classes } = this.props;

    data.map(row => {
      row.process_id = this.renderButtonProcessId(row);
      row.start_time = this.renderStartTime(row);
      row.end_time = this.renderEndTime(row);
      row.duration = this.renderDuration(row);
      row.name = this.renderName(row);
      row.release = this.renderRelease(row);
      row.dataset = this.renderDataset(row);
      row.owner = this.renderOwner(row);
      row.status_id = this.renderStatus(row);
      row.saved = this.renderSaved(row);
      row.flag_published = this.renderCheck(row);
      return row;
    });

    return (
      <Paper className={classes.wrapPaper}>
        {this.renderFilter()}
        {this.renderTable()}
        {loading && this.renderLoading()}
      </Paper>
    );
  }
}

export default withStyles(styles)(TableMyProcesses);
