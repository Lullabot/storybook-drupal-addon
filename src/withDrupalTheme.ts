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
      // globalWindow.document.location.reload();
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

    function handleMessage(event: MessageEvent) {
      if (event.data == heartBeatEmoji) {
        return;
      }
      let data;
      try {
        data = JSON.parse(event.data);
      } catch (ex) {
        console.warn('Invalid HMR message: ' + event.data + '\n' + ex);
        return;
      }
      const currentHash = globals?.hash;
      const newHash = data?.hash;
      if (!newHash) {
        return;
      }
      currentHash === newHash
        // If nothing changed in the Webpack hash, it may mean changes in the
        // server components.
        ? refresh()
        // Store the hash in the globals because state will reset every time.
        : updateGlobals({hash: newHash});
    }
  }, [globals]);

  return StoryFn(undefined, undefined);
};
