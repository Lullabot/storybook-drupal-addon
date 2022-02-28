type StorybookContext = {
  globals: {
    drupalTheme?: string;
  };
  parameters: {
    options: {
      variant: string;
    };
    fileName: string;
    drupalTheme?: string;
    supportedDrupalThemes?: Record<string, { title: string }>;
  };
};

function createNewBody(htmlDoc: Document): HTMLElement {
  const clWrapper = htmlDoc.getElementById('___cl-wrapper');
  // Extract the missing scripts and re-add them.
  const scripts = htmlDoc.getElementsByTagName('script');
  const newBody = htmlDoc.createElement('body');
  // Copy the body attributes from the old body to the new, in case there is
  // anything functionally relevant.
  htmlDoc.body.getAttributeNames().forEach(attrName => {
    newBody.setAttribute(attrName, htmlDoc.body.getAttribute(attrName));
  });
  newBody.innerHTML = clWrapper.innerHTML;
  // Include the Drupal "js footer" assets, i.e., all the <script> tags in
  // the <body>.
  newBody.append(...Array.from(scripts));
  return newBody;
}

const fetchStoryHtml = async (
  url: string,
  path: string,
  params: Record<string, unknown>,
  context: StorybookContext,
) => {
  // Remove trailing slash.
  url = url.replace(/\/$/, '');

  const variant = context.parameters?.options?.variant;

  const fetchUrl = new URL(`${url}/_cl_server`);
  const init: {
    _storyFileName: string;
    _drupalTheme: string;
    _variant?: string;
  } = {
    ...params,
    _storyFileName: context.parameters.fileName,
    _drupalTheme: context.globals.drupalTheme || context.parameters.drupalTheme,
  };
  if (variant) {
    init._variant = variant;
  }
  fetchUrl.search = new URLSearchParams(init).toString();

  // Remove any basic auth embedded into the URL and remove it as it will cause
  // the OPTIONS pre-flight request to fail.
  fetchUrl.username = '';
  fetchUrl.password = '';

  const response = await fetch(fetchUrl.toString());
  const htmlContents = await response.text();
  if (response.status >= 399) {
    const statusText = `${response.status} (${response.statusText})`;
    let headersText = '';
    response.headers.forEach((value, key) => {
      headersText += `${key}: ${value}\n`;
    });
    const requestedUrl = response.url;
    // There was an error. Storybook should show it.
    throw new Error(
      `There was an error while making the request to Drupal. Locate the request in the Network tab of your browser's developer tools for more information.\nRequested URL: ${requestedUrl}\nResponse code: ${statusText}\nResponse Headers:\n${headersText}\nResponse body: ${htmlContents}.`,
    );
  }
  try {
    // The HTML contents Drupal sends back includes regions, blocks, menus, etc.
    // We need to extract the HTML for the ___cl-wrapper.
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlContents, 'text/html');
    // Swap the old body for the new.
    htmlDoc.body = createNewBody(htmlDoc);
    return htmlDoc.children[0].outerHTML;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export default fetchStoryHtml;
