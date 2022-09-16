const globalWindow = require('global/window');
import {
  StoryContext,
  StoryFn as StoryFunction,
  useCallback,
  useEffect,
  useGlobals,
  useState,
} from '@storybook/addons';

const defaultDebounceTimeout = 300;
const heartBeatEmoji = '\uD83D\uDC93';

export const withDrupalTheme = (
  StoryFn: StoryFunction,
  context: StoryContext,
) => {
  const [globals, updateGlobals] = useGlobals();
  const refresh = useCallback(() => {
    const delay = globals?.debounceTimeout || defaultDebounceTimeout;
    const isLocked = globals?.debounceTimeout || false;
    if (!isLocked) {
      // Lock the refresh procedure.
      updateGlobals({isLocked: true})
      globalWindow.document.location.reload();
      // Unlock it again soon.
      setTimeout(() => updateGlobals({isLocked: false}), delay);
    }
  }, [globals]);
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

  useEffect(() => {
    const hmr = globalWindow?.__whmEventSourceWrapper?.['/__webpack_hmr'];
    if (!hmr) {
      return;
    }
    hmr.addMessageListener(handleMessage);

    function handleMessage(event: MessageEvent) {}
  }, [globals]);

  return StoryFn(undefined, undefined);
};
