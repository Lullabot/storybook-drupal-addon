import {
  StoryContext,
  StoryFn as StoryFunction,
  useEffect,
  useGlobals,
} from '@storybook/addons';

export const withDrupalTheme = (StoryFn: StoryFunction, context: StoryContext) => {
  const [{drupalTheme}] = useGlobals();
  if (drupalTheme) {
    console.log(`Rendering component using: ${drupalTheme}`)
  }

  const [globals, updateGlobals] = useGlobals();
  useEffect(() => {
    const {
      parameters: {drupalTheme, supportedDrupalThemes},
    } = context;
    if (supportedDrupalThemes && !globals.locales) {
      if (drupalTheme && !globals.locale) {
        updateGlobals({drupalTheme, supportedDrupalThemes});
      } else {
        updateGlobals({supportedDrupalThemes});
      }
    }
  }, []);
  return StoryFn(undefined, undefined);
};

