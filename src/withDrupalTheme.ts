import {
  StoryContext,
  StoryFn as StoryFunction,
  useCallback,
  useEffect,
  useGlobals,
  useState,
} from '@storybook/addons';

export const withDrupalTheme = (
  StoryFn: StoryFunction,
  context: StoryContext,
) => {
  const [globals, updateGlobals] = useGlobals();
  const [hash, setHash] = useState<string>('');
  const refresh = useCallback(() => {
    window.document.location.reload();
  }, []);
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
  }, [globals]);

  useEffect(() => {
    const sourceWrapper =
      // @ts-ignore
      window?.__whmEventSourceWrapper['/__webpack_hmr'];
    if (!sourceWrapper) {
      return;
    }
    sourceWrapper.addMessageListener(handleMessage);

    function handleMessage(event: MessageEvent) {
      if (event.data == '\uD83D\uDC93') {
        return;
      }
      let data;
      try {
        data = JSON.parse(event.data);
      } catch (ex) {
        console.warn('Invalid HMR message: ' + event.data + '\n' + ex);
        return;
      }
      if (!data?.hash) {
        return;
      }
      if (hash.length === 0 || hash !== data?.hash) {
        setHash(data?.hash);
      } else {
        // If nothing changed in the Webpack hash, it may mean changes in the
        // server components.
        refresh();
      }
    }
  }, [globals]);

  return StoryFn(undefined, undefined);
};
