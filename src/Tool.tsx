import React, { ReactElement } from 'react';
import { useGlobals } from '@storybook/manager-api';
import {
  IconButton,
  TooltipLinkList,
  WithTooltip,
} from '@storybook/components';
import { EVENT_NAME, TOOL_ID } from './constants';
import {addons} from '@storybook/preview-api';

export interface Link {
  id: string;
  active: boolean;
  title: string;
  onClick: () => void
}

type ExpandedThemeValue = { title: string };
export type ThemeValue = string | ExpandedThemeValue;

const getValue = (value: ThemeValue): ExpandedThemeValue => {
  if (typeof value === 'string') {
    return { title: value };
  }
  return {
    title: value.title || '',
  };
};

const getDrupalThemes = (
  themes: Record<string, ThemeValue>,
  theme: string,
  onSelect: (selected: string) => void,
): Link[] =>
  themes
    ? Object.entries(themes).map(([key, value]) => ({
        ...getValue(value),
        id: key,
        active: key === theme,
        onClick: () => onSelect(key),
      }))
    : [
        {
          id: 'none',
          title: 'No themes in parameters',
          active: true,
          onClick: () => {},
        },
      ];

export const Tool = (): ReactElement => {
  const [{ drupalTheme, supportedDrupalThemes }, updateGlobals] = useGlobals();

  return (
    <WithTooltip
      placement="top"
      trigger="click"
      tooltip={({ onHide }) => (
        <TooltipLinkList
          links={getDrupalThemes(
            supportedDrupalThemes,
            drupalTheme,
            (selected) => {
              if (selected !== drupalTheme) {
                updateGlobals({ drupalTheme: selected });
                addons.getChannel().emit(EVENT_NAME, selected);
              }
              onHide();
            },
          )}
        />
      )}
    >
      <IconButton
        key={TOOL_ID}
        active={drupalTheme}
        title="Select Drupal Theme"
      >
        💧 Drupal Theme
      </IconButton>
    </WithTooltip>
  );
};
