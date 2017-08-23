import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Box, Fixed, Text } from 'rebass';
import FontAwesome from 'react-fontawesome';
import { PlainPanel, UnstyledList, ResinBtn } from '../shared';
import store from '../../store';
import { updateUrl } from '../../services/path';
import FilterDescription from './filter-description';

const Wrapper = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;

const Preview = styled(PlainPanel)`
  display: none;
  position: absolute;
  right: 230px;
  width: 400px;
  right: 302px;
  top: 2px;
  padding: 15px 15px 5px;
`;

const ViewListItem = styled.li`
  position: relative;
  padding: 7px 20px;
  &:hover {
    background-color: #f3f3f3;
  }
  & > ${Text} {
    padding-right: 20px;
  }
  & > button {
    position: absolute;
    top: 7px;
    right: 10px;
    padding: 8px;
    background: none;
    border: none;
    display: none;
  }
  &:hover > button {
    display: block;
  }
  &:hover ${Preview} {
    display: block;
  }
`;

const MenuPanel = styled(PlainPanel)`
  position: absolute;
  width: 300px;
  right: 0;
  top: 36px;
  z-index: 1;
`;

class ViewsMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showViewsMenu: false,
    };
  }

  loadView(view) {
    store.dispatch({ type: 'SET_RULES', value: view.rules });
    this.setState({ showViewsMenu: false });
    updateUrl(view.rules);
  }

  render() {
    return (
      <Wrapper>
        <ResinBtn onClick={() => this.setState({ showViewsMenu: !this.state.showViewsMenu })}>
          <FontAwesome style={{ marginRight: 10 }} name="pie-chart" />
          Views
          <FontAwesome style={{ float: 'right' }} name="caret-down" />
        </ResinBtn>
        {this.state.showViewsMenu &&
          <Fixed
            z={1}
            onClick={() => this.setState({ showViewsMenu: false })}
            top
            right
            bottom
            left
          />}
        {this.state.showViewsMenu &&
          <MenuPanel className="views-menu__panel">
            {!this.props.views.length &&
              <Box p={3}>
                {"You haven't created any views yet"}
              </Box>}
            {!!this.props.views.length &&
              <UnstyledList>
                {this.props.views.map(view =>
                  (<ViewListItem>
                    <Text onClick={() => this.loadView(view)}>
                      {view.name}
                      <br />
                      <Text fontSize={12}>
                        {view.rules.length} filter{view.rules.length > 1 && 's'}
                      </Text>
                    </Text>
                    <button>
                      <FontAwesome name="trash" onClick={() => this.props.deleteView(view)} />
                    </button>
                    <Preview>
                      {view.rules.map(rule =>
                        (<Box mb={10}>
                          <FilterDescription rule={rule} />
                        </Box>),
                      )}
                    </Preview>
                  </ViewListItem>),
                )}
              </UnstyledList>}
          </MenuPanel>}
      </Wrapper>
    );
  }
}

const mapStatetoProps = ({ rules, views }) => ({
  rules,
  views: views || [],
});

export default connect(mapStatetoProps)(ViewsMenu);
