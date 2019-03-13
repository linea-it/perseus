import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
// import { FadeLoader } from 'halogenium';

import Centaurus from '../api';
// import moment from 'moment';

const styles = {
  fadeLoaderFull: {
    position: 'absolute',
    paddingLeft: 'calc((100vw - 40px) / 2)',
    paddingTop: 'calc(25vh)',
  },
  fadeLoader: {
    position: 'absolute',
    paddingLeft: 'calc((100vw - 13px) / 2)',
    paddingTop: 'calc(35vh)',
    zIndex: '999',
  },
};

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      optsFilter: [],
      selectFilter: '',
    };
  }

  static propTypes = {
    classes: PropTypes.object,
    saveStage: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.loadFilter();
  }

  handleChangeReleases = evt => {
    this.setState({ selectRelease: evt.target.value });
    if (evt.target.value !== '') {
      this.loadFields(evt.target.value);
      this.props.saveStage([]);
    } else {
      this.props.saveStage([]);
      this.clearFields();
    }
  };

  loadFilter = async currentProcessesList => {
    console.log(currentProcessesList);
    const processesList = await Centaurus.getAllProcessesList(
      currentProcessesList
    );

    if (
      processesList &&
      processesList.processesList &&
      processesList.processesList.edges
    ) {
      const processesListLocal = processesList.processesList.edges.map(row => {
        return {
          pipeline: row.node.name,
          owner: row.node.session.user.displayName,
        };
      });
      this.setState({
        processesList: processesListLocal,
      });
    } else {
      return null;
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel shrink>Filter:</InputLabel>
          <Select
            value={this.state.selectFilter}
            onChange={this.handleChangeDatePeriod}
            input={<Input />}
            displayEmpty
          >
            {this.state.optsFilter.map(opt => {
              return (
                <MenuItem key={opt.id} value={opt.tagId}>
                  {opt.releaseDisplayName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>
    );
  }
}

export default withStyles(styles)(Filter);
