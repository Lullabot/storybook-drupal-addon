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

function createNewBody(htmlDoc: Document): Node {
  const sbWrapper = htmlDoc.getElementById('___cl-wrapper');
  // Extract the missing scripts and re-add them.
  const scripts = htmlDoc.body.getElementsByTagName('script');
  const newBody = htmlDoc.createElement('body');
  // Copy the body attributes from the old body to the new, in case there is
  // anything functionally relevant.
  htmlDoc.body.getAttributeNames()
    .map(htmlDoc.body.getAttributeNode.bind(htmlDoc.body))
    .forEach(newBody.setAttributeNode.bind(newBody));
  newBody.innerHTML = sbWrapper.innerHTML;
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

  const variant = context.parameters.options.variant;

  const fetchUrl = new URL(`${url}/_cl_server`);
  fetchUrl.search = new URLSearchParams({
    ...params,
    _storyFileName: context.parameters.fileName,
    _drupalTheme: context.globals.drupalTheme || context.parameters.drupalTheme,
    _variant: variant,
  }).toString();

  // Remove any basic auth embedded into the URL and remove it as it will cause
  // the OPTIONS pre-flight request to fail.
  fetchUrl.username = '';
  fetchUrl.password = '';

  try {
    const response = await fetch(fetchUrl.toString());
    const htmlContents = await response.text();
    // The HTML contents Drupal sends back includes regions, blocks, menus, etc.
    // We need to extract the HTML for the ___cl-wrapper.
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlContents, 'text/html');
    const newBody = createNewBody(htmlDoc);
    // Swap the old body for the new.
    htmlDoc.removeChild(htmlDoc.body);
    htmlDoc.appendChild(newBody);
    return htmlDoc.children[0].outerHTML;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export default fetchStoryHtml;
