import React, { Component } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';

import TableClasses from '../components/workspace/TableClasses';

export default class Workspace extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
    };
  }

  render() {
    return (
      <div>
        <TabView
          activeIndex={this.state.activeIndex}
          onTabChange={e => this.setState({ activeIndex: e.index })}
        >
          <TabPanel header="TAB I">
            <TableClasses />
          </TabPanel>
          <TabPanel header="TAB II">
            Francis Ford Coppolas legendary continuation and sequel to his
            landmark 1972 film, The_Godfather parallels the young Vito Corleones
            rise with his son Michaels spiritual fall, deepening The_Godfathers
            depiction of the dark side of the American dream. In the early
            1900s, the child Vito flees his Sicilian village for America after
            the local Mafia kills his family. Vito struggles to make a living,
            legally or illegally, for his wife and growing brood in Little
            Italy.
          </TabPanel>
          <TabPanel header="TAB III">
            The Godfather Part III is set in 1979 and 1980. Michael has moved
            back to New York and taken great strides to remove the family from
            crime. He turns over his New York criminal interests to longtime
            enforcer Joey Zasa. He uses his wealth in an attempt to rehabilitate
            his reputation through numerous philanthropic acts, administered by
            a foundation named after his father. A decade earlier, he gave
            custody of his two children to Kay, who has since remarried.
          </TabPanel>
          <TabPanel header="TAB IV" disabled={true} />
        </TabView>
      </div>
    );
  }
}
