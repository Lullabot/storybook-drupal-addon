import type {Preview} from '@storybook/react';

const preview: Preview = {
  globals: {
    localDev: false,
    drupalTheme: 'umami',
    supportedDrupalThemes: {
      umami: {title: 'Umami'},
      bartik: {title: 'Bartik'},
      claro: {title: 'Claro'},
      seven: {title: 'Seven'},
    },
  },
  parameters: {
    server: {
      url: 'https://local.contrib.com'
    },
    backgrounds: {
      default: 'light',
    },
    actions: {argTypesRegex: '^on[A-Z].*'},
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
