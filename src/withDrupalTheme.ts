const globalWindow = require('global/window');
import {
  StoryContext,
  StoryFn as StoryFunction,
  useCallback,
  useEffect,
  useGlobals,
  useState,
} from '@storybook/addons';

const  defaultDebounceTimeout = 300;

export const withDrupalTheme = (
  StoryFn: StoryFunction,
  context: StoryContext,
) => {
  const [globals, updateGlobals] = useGlobals();
  const [hash, setHash] = useState<string>('');
  const [isLocked, setLock] = useState<boolean>(false);
  const delay = globals?.debounceTimeout || defaultDebounceTimeout;
  const refresh = useCallback(() => {
    if (!isLocked) {
      // Lock the refresh procedure.
      setLock(true);
      globalWindow.document.location.reload();
      // Unlock it again soon.
      setTimeout(() => setLock(false), delay);
    }
  }, [isLocked, setLock, delay]);
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
    const hmr = globalWindow?.__whmEventSourceWrapper?.['/__webpack_hmr'];
    if (!hmr) {
      return;
    }
    hmr.addMessageListener(handleMessage);

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
  }, [hash, setHash]);

  return StoryFn(undefined, undefined);
};
