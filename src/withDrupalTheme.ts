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
  if (globals?.drupalTheme) {
    console.log(
      `Rendering component using Drupal theme: ${globals?.drupalTheme}`,
    );
  }

  useEffect(() => {
    const {
      parameters: { drupalTheme, supportedDrupalThemes },
    } = context;
    if (supportedDrupalThemes && !globals?.supportedDrupalThemes) {
      if (drupalTheme && !globals?.drupalTheme) {
        updateGlobals({ drupalTheme, supportedDrupalThemes });
      } else {
        updateGlobals({ supportedDrupalThemes });
      }
    }
  }, []);
  return StoryFn(undefined, undefined);
};
