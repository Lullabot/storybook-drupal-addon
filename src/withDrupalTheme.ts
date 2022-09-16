const globalWindow = require('global/window');
import {
  StoryContext,
  StoryFn as StoryFunction,
  useEffect,
  useGlobals,
} from '@storybook/addons';

export const withDrupalTheme = (
  StoryFn: StoryFunction,
  context: StoryContext,
) => {
  const [globals, updateGlobals] = useGlobals();
  useEffect(() => {
    const {
      parameters: {drupalTheme, supportedDrupalThemes},
    } = context;
    if (supportedDrupalThemes && !globals?.supportedDrupalThemes) {
      if (drupalTheme && !globals?.drupalTheme) {
        updateGlobals({drupalTheme, supportedDrupalThemes});
      } else {
        updateGlobals({supportedDrupalThemes});
      }
    }
  }, [globals]);

  return StoryFn(undefined, undefined);
};
