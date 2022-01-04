import { addons, types } from '@storybook/addons';

import { ADDON_ID, PANEL_ID, TOOL_ID } from '../constants';
import { Tool } from '../Tool';
import { Panel } from '../Panel';

// Register the addon
addons.register(ADDON_ID, () => {
  // Register the tool
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Theme',
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: Tool,
  });
  // Register the panel
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Drupal',
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: Panel,
  });
});
