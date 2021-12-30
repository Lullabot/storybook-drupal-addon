import React from 'react';
import {useGlobals} from '@storybook/api';
import {
  IconButton,
  Link,
  TooltipLinkList,
  WithTooltip
} from '@storybook/components';
import {TOOL_ID} from './constants';

export interface Link {
  id: string;
  active: boolean;
  onClick: () => void;
  title: string;
  machineName: string;
}

type ExpandedThemeValue = { title: string; machineName: string; };
export type ThemeValue =
  | string
  | ExpandedThemeValue;

const getValue = (value: ThemeValue): ExpandedThemeValue => {
  if (typeof value === 'string') {
    return {title: value, machineName: value};
  }
  return {
    title: value.title || '',
    machineName: value.machineName || '',
  };
};

const getDrupalThemes = (
  themes: Record<string, ThemeValue>,
  theme: string,
  onSelect: (selected: string) => void
): Link[] =>
  themes
    ? Object.entries(themes).map(([key, value]) => ({
      ...getValue(value),
      id: key,
      active: key === theme,
      onClick: () => onSelect(key)
    }))
    : [
      {
        id: 'none',
        title: 'No themes in parameters',
        machineName: 'No themes in parameters',
        active: true,
        onClick: () => {
        },
      }
    ]

export const Tool = () => {
  const [{drupalTheme, supportedDrupalThemes}, updateGlobals] = useGlobals();

  return (
    <WithTooltip
      closeOnClick={true}
      placement="top"
      trigger="click"
      tooltip={({onHide}) => (
        <TooltipLinkList
          links={getDrupalThemes(
            supportedDrupalThemes,
            drupalTheme,
            (selected) => {
              if (selected !== drupalTheme) {
                updateGlobals({drupalTheme: selected});
              }
              onHide();
            })}
        />
      )}>
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
