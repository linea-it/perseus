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
  PagingPanel,
  TableColumnResizing,
  Toolbar,
  SearchPanel,
  TableSelection,
  TableColumnVisibility,
} from '@devexpress/dx-react-grid-material-ui';

import CircularProgress from '@material-ui/core/CircularProgress';

import Centaurus from '../api';
import moment from 'moment';
import CustomColumnChooser from './CustomColumnChooser';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TableDataset from './TableDataset';
import CustomTableHeaderRowCell from './CustomTableHeaderRowCell';
import clsx from 'clsx';

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
    cursor: 'default',
    textAlign: 'center',
  },
  icoRemoved: {
    color: 'red',
    cursor: 'default',
    textAlign: 'center',
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
  statusFilter: {
    left: 228,
  },
};

class TableMyProcesses extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      columns: [
        { name: 'processes_process_id', title: 'Process ID' },
        { name: 'processes_start_time', title: 'Start Date' },
        { name: 'duration', title: 'Duration' },
        { name: 'processes_name', title: 'Pipeline' },
        { name: 'releasetag_release_display_name', title: 'Release' },
        { name: 'fields_display_name', title: 'Dataset' },
        { name: 'tguser_display_name', title: 'Owner' },
        { name: 'processstatus_display_name', title: 'Status' },
        { name: 'saved', title: 'Saved' },
        { name: 'processes_published_date', title: 'Published' },
        { name: 'processes_flag_removed', title: 'Removed' },
      ],
      defaultColumnWidths: [
        { columnName: 'processes_process_id', width: 140 },
        { columnName: 'processes_start_time', width: 140 },
        { columnName: 'processes_start_date', width: 120 },
        { columnName: 'duration', width: 110 },
        { columnName: 'processes_name', width: 180 },
        { columnName: 'releasetag_release_display_name', width: 180 },
        { columnName: 'fields_display_name', width: 180 },
        { columnName: 'tguser_display_name', width: 180 },
        { columnName: 'processstatus_display_name', width: 110 },
        { columnName: 'saved', width: 100 },
        { columnName: 'processes_published_date', width: 130 },
        { columnName: 'processes_flag_removed', width: 130 },
      ],
      data: [],
      sorting: [{ columnName: 'processes_process_id', direction: 'desc' }],
      totalCount: 0,
      pageSize: 10,
      pageSizes: [5, 10, 15],
      currentPage: 0,
      loading: true,
      after: '',
      selection: [],
      filter: 'complete',
      status: 'all',
      searchValue: '',
      visible: false,
      modalType: '',
      rowsDatasetRunning: [],
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
    this.clearData();
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
      currentPage: 0,
      after: '',
    });
  };

  loadData = async () => {
    const {
      sorting,
      pageSize,
      after,
      filter,
      status,
      searchValue,
    } = this.state;

    const processesList = await Centaurus.getAllProcessesList(
      sorting,
      pageSize,
      after,
      filter,
      status,
      searchValue
    );

    if (
      processesList &&
      processesList.processesList &&
      processesList.processesList.edges
    ) {
      const processesListLocal = processesList.processesList.edges.map(row => {
        const startDateSplit = row.node.startTime
          ? moment(row.node.startTime).format('HH:mm:ss')
          : null;
        const startTimeSplit = row.node.startTime
          ? moment(row.node.startTime).format('YYYY-MM-DD')
          : null;
        const startTime = moment(row.node.startTime);
        const endTime = moment(row.node.endTime);
        const diff = endTime.diff(startTime);
        const duration = moment.utc(diff).format('HH:mm:ss');

        return {
          processes_process_id: row.node.processId,
          productLog: row.node.productLog,
          processes_start_time: startDateSplit,
          processes_start_date: startTimeSplit,
          processes_end_time: row.node.endTime,
          duration:
            row.node.startTime && row.node.endTime !== null ? duration : '-',
          processes_name: row.node.name,
          releasetag_release_display_name:
            row.node.fields.edges.length !== 0
              ? row.node.fields.edges.map(edge => {
                  return edge.node.releaseTag.releaseDisplayName;
                })
              : '-',
          fields_display_name:
            row.node.fields.edges.length !== 0
              ? row.node.fields.edges.map(edge => {
                  return edge.node.displayName;
                })
              : '-',
          tguser_display_name: row.node.session.user.displayName,
          processstatus_display_name: row.node.processStatus.name,
          saved: row.node.savedProcesses,
          processes_published_date: row.node.publishedDate,
          processes_flag_removed: row.node.flagRemoved,
        };
      });
      this.setState({
        data: processesListLocal,
        totalCount: parseInt(processesList.processesList.totalCount),
        cursor: processesList.processesList.pageInfo,
        loading: false,
        filterOld: filter,
        statusOld: status,
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
        {rowData.processes_process_id}
      </span>
    );
  };

  renderStartDate = rowData => {
    if (rowData.processes_start_date) {
      return (
        <span title={rowData.processes_start_date}>
          {rowData.processes_start_date}
        </span>
      );
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
    if (rowData.processes_name) {
      return (
        <span title={rowData.processes_name}>{rowData.processes_name}</span>
      );
    } else {
      return '-';
    }
  };

  renderContentModal = () => {
    if (this.state.modalType === 'Datasets') {
      return (
        <TableDataset rowsDatasetRunning={this.state.rowsDatasetRunning} />
      );
    }
  };

  renderModal = () => {
    const title = this.state.modalType;
    return (
      <Dialog
        onClose={this.onHideModal}
        open={this.state.visible}
        aria-labelledby={title}
      >
        {this.renderContentModal()}
      </Dialog>
    );
  };

  onShowDatasets = rows => {
    this.onClickModal(rows, 'Datasets');
    this.setState({
      rowsDatasetRunning: rows,
    });
  };

  renderRelease = rowData => {
    if (rowData.releasetag_release_display_name) {
      return (
        <span title={rowData.releasetag_release_display_name}>
          {rowData.releasetag_release_display_name}
        </span>
      );
    } else {
      return '-';
    }
  };

  renderDataset = rowData => {
    if (
      rowData.fields_display_name &&
      rowData.releasetag_release_display_name &&
      rowData.releasetag_release_display_name.props
    ) {
      const releases = rowData.releasetag_release_display_name.props.title;
      const datasets = rowData.fields_display_name;
      if (datasets.length > 1 && releases.length > 1) {
        const rows = datasets.map((el, i) => {
          return {
            dataset: el,
            release: releases[i],
          };
        });

        return (
          <React.Fragment>
            <Button
              style={styles.btnIco}
              onClick={() => this.onShowDatasets(rows)}
            >
              <Icon>format_list_bulleted</Icon>
            </Button>
          </React.Fragment>
        );
      }

      return (
        <span title={rowData.fields_display_name}>
          {rowData.fields_display_name}
        </span>
      );
    } else {
      return '-';
    }
  };

  renderOwner = rowData => {
    if (rowData.tguser_display_name) {
      return (
        <span title={rowData.tguser_display_name}>
          {rowData.tguser_display_name}
        </span>
      );
    } else {
      return '-';
    }
  };

  renderStatus = rowData => {
    const { classes } = this.props;
    if (rowData.processstatus_display_name === 'failure') {
      return (
        <span
          className={classes.btn}
          style={styles.btnFailure}
          title={rowData.processstatus_display_name}
        >
          Failure
        </span>
      );
    } else if (rowData.processstatus_display_name === 'running') {
      return (
        <span
          className={classes.btn}
          style={styles.btnRunning}
          title={rowData.processstatus_display_name}
        >
          Running
        </span>
      );
    } else {
      return (
        <span
          className={classes.btn}
          style={styles.btnSuccess}
          title={rowData.processstatus_display_name}
        >
          Success
        </span>
      );
    }
  };

  renderSaved = rowData => {
    const { classes } = this.props;
    // console.log('Saved', rowData.saved)
    if (rowData.saved && rowData.saved.savedDateEnd) {
      const tooltDate = moment
        .utc(rowData.saved.savedDateEnd)
        .format('YYYY-MM-DD');
      if (rowData.saved.savedDateEnd === null) {
        return (
          <CircularProgress
            disableShrink
            style={{ width: '25px', height: '25px' }}
          />
        );
      } else {
        return (
          <Icon title={tooltDate} className={classes.iconCheck}>
            check
          </Icon>
        );
      }
    } else if (rowData.saved === null) {
      return '-';
    }
  };

  renderRemoved = rowData => {
    const { classes } = this.props;

    if (typeof rowData.processes_flag_removed !== 'undefined') {
      if (rowData.processes_flag_removed === true) {
        return (
          <Icon title="Removed" className={classes.iconCheck}>
            check
          </Icon>
        );
      } else {
        return (
          <Icon title="Not removed" className={classes.icoRemoved}>
            close
          </Icon>
        );
      }
    } else {
      return (
        <Icon title="Not removed" className={classes.icoRemoved}>
          close
        </Icon>
      );
    }
  };

  renderCheck = rowData => {
    const { classes } = this.props;
    if (rowData.processes_published_date) {
      const publishedDate = moment
        .utc(rowData.processes_published_date)
        .format('YYYY-MM-DD');
      return (
        <Icon title={publishedDate} className={classes.iconCheck}>
          check
        </Icon>
      );
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
    this.setState({
      status: filter !== 'incomplete' ? this.state.statusOld : 'running',
    });

    if (filter === 'incomplete') {
      this.setState({
        status: 'running',
      });
    } else if (filter === 'complete' && filterOld === 'incomplete') {
      this.setState({
        status: 'all',
      });
    }
  };

  handleChangeStatusFilter = evt => {
    const status = evt.target.value;
    const statusOld = this.state.statusOld;
    const totalCount = this.state.totalCount;

    const initialState = this.initialState;
    initialState.loading = true;
    initialState.status = status;
    initialState.statusOld = statusOld;
    initialState.totalCount = parseInt(totalCount);

    this.setState(initialState, () => this.loadData());
    this.setState({
      filter: this.state.filterOld,
    });
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
          <MenuItem value={'all'}>All</MenuItem>
          <MenuItem value={'complete'}>Complete</MenuItem>
          <MenuItem value={'incomplete'}>Incomplete</MenuItem>
          <MenuItem value={'published'}>Published</MenuItem>
          <MenuItem value={'saved'}>Saved</MenuItem>
          <MenuItem value={'unpublished'}>Unpublished</MenuItem>
          <MenuItem value={'unsaved'}>Unsaved</MenuItem>
          <MenuItem value={'removed'}>Removed</MenuItem>
        </Select>
      </FormControl>
    );
  };

  renderStatusFilter = () => {
    const { classes } = this.props;
    const { filter } = this.state;

    return (
      <FormControl className={clsx(classes.formControl, classes.statusFilter)}>
        <InputLabel shrink htmlFor="status-label-placeholder">
          Status
        </InputLabel>
        <Select
          value={this.state.status}
          onChange={this.handleChangeStatusFilter}
          input={<Input name="status" id="status-label-placeholder" />}
          displayEmpty
          name="status"
        >
          {filter !== 'incomplete' ? (
            <MenuItem value={'all'}>All</MenuItem>
          ) : null}
          {filter !== 'incomplete' ? (
            <MenuItem value={'failure'}>Failure</MenuItem>
          ) : null}
          {filter !== 'complete' ? (
            <MenuItem value={'running'}>Running</MenuItem>
          ) : null}
          {filter !== 'incomplete' ? (
            <MenuItem value={'success'}>Success</MenuItem>
          ) : null}
        </Select>
      </FormControl>
    );
  };

  onHideModal = () => {
    this.setState({ visible: false });
  };

  onClickModal = (rows, modalType) => {
    this.setState({
      visible: true,
      modalType: modalType,
    });
  };

  renderTable = rows => {
    const {
      columns,
      sorting,
      pageSize,
      pageSizes,
      currentPage,
      totalCount,
      defaultColumnWidths,
      selection,
    } = this.state;

    return (
      <React.Fragment>
        <Grid rows={rows} columns={columns}>
          <SearchState onValueChange={this.changeSearchValue} />
          <SortingState
            sorting={sorting}
            onSortingChange={this.changeSorting}
            columnExtensions={[
              // { columnName: 'processes_start_date', sortingEnabled: false },
              { columnName: 'duration', sortingEnabled: false },
              { columnName: 'saved', sortingEnabled: false },
              // Temporary sorting disabled:
              // { columnName: 'processes_name', sortingEnabled: false },
              // { columnName: 'fields_display_name', sortingEnabled: false },
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
          <Table />
          <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
          <CustomTableHeaderRowCell />
          <TableColumnVisibility />
          <TableSelection
            selectByRowClick
            highlightRow
            showSelectionColumn={false}
          />
          <PagingPanel pageSizes={pageSizes} />
          <Toolbar />
          <SearchPanel />
          <CustomColumnChooser />
        </Grid>
        {this.renderModal()}
      </React.Fragment>
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

    const rows = data.map(row => ({
      processes_process_id: this.renderButtonProcessId(row),
      processes_start_time: this.renderStartDate(row),
      duration: this.renderDuration(row),
      processes_name: this.renderName(row),
      fields_display_name: this.renderDataset(row),
      releasetag_release_display_name: this.renderRelease(row),
      tguser_display_name: this.renderOwner(row),
      processstatus_display_name: this.renderStatus(row),
      saved: this.renderSaved(row),
      processes_published_date: this.renderCheck(row),
      processes_flag_removed: this.renderRemoved(row),
    }));

    return (
      <Paper className={classes.wrapPaper}>
        {this.renderFilter()}
        {this.state.filter !== 'removed' && this.renderStatusFilter()}
        {this.renderTable(rows)}
        {loading && this.renderLoading()}
      </Paper>
    );
  }
}

export default withStyles(styles)(TableMyProcesses);
