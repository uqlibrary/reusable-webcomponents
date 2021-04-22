function ready(fn) {
  if (document.readyState !== 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function loadReusableComponentsOmeka() {
  loadUQFavicon();

  addAppleTouchIcon();

  addCss('//assets.library.uq.edu.au/reusable-webcomponents-development/feature-omeka/applications/omeka/custom-styles.css');
  // addCss('//assets.library.uq.edu.au/reusable-webcomponents/applications/omeka/custom-styles.css');
  // addCss('//assets.library.uq.edu.au/reusable-components/omeka/custom-styles.css');

  addResponsiveMeta();

  // insertScript('//assets.library.uq.edu.au/reusable-webcomponents-development/feature-omeka/uq-lib-reusable.min.js');
  // insertScript('//assets.library.uq.edu.au/reusable-webcomponents/uq-lib-reusable.min.js');

  //insert elements

  const firstElement = document.body.children[0];
  if (!firstElement) {
    return;
  }

  if (!document.querySelector('uq-header')) {
    const header = document.createElement('uq-header');
    !!header && header.setAttribute("hideLibraryMenuItem", "");
    // no 'skip to content' as drupal provides a 'skip to menu' on first click
    !!header && document.body.insertBefore(header, firstElement);
  }

  if (!document.querySelector('uq-site-header')) {
    const siteHeader = document.createElement('uq-site-header');

    const askusButton = createAskusButton();
    !!siteHeader && !!askusButton && siteHeader.appendChild(askusButton);

    !!siteHeader && document.body.insertBefore(siteHeader, firstElement);
  }

  if (!document.querySelector('alert-list')) {
    const alerts = document.createElement('alert-list');
    !!alerts && document.body.insertBefore(alerts, firstElement);
  }

  if (!document.querySelector('uq-footer')) {
    const subFooter = document.createElement('uq-footer');
    !!subFooter && document.body.appendChild(subFooter);
  }
}

function createSlotForButtonInUtilityArea(button, id=null) {
  const slot = document.createElement('span');
  !!slot && slot.setAttribute('slot', 'site-utilities');
  !!slot && !!id && slot.setAttribute('id', id);
  !!button && !!slot && slot.appendChild(button);

  return slot;
}

function createAskusButton() {
  if (!!document.querySelector('askus-button')) {
    return false;
  }

  const askusButton = document.createElement('askus-button');
  const slot = !!askusButton && createSlotForButtonInUtilityArea(askusButton, 'askus');

  return slot;
}

function loadUQFavicon() {
  var link = document.createElement('link'),
    href = '//assets.library.uq.edu.au/reusable-components/resources/favicon.ico';
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = href;
  document.getElementsByTagName('head')[0].appendChild(link);
  link.rel = 'icon'; //for IE
  document.getElementsByTagName('head')[0].appendChild(link);

}

function addAppleTouchIcon() {
  // replace apple-touch-icon
  var appleTouchIconlink = document.querySelector('link[rel="apple-touch-icon"]'),
    link = document.createElement('link'),
    sizes = ['152x152', '120x120', '76x76'],
    rel = 'apple-touch-icon',
    href = '//assets.library.uq.edu.au/reusable-components/resources/images/apple-touch-icon.png';

  if (appleTouchIconlink) {
    appleTouchIconlink.attr('href', href);
  } else {
    link.rel = rel;
    link.href = href;
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  for (var i = 0; i < sizes.length; i++) {
    var size = sizes[i],
      iconLink = document.createElement('link');
    iconLink.rel = rel;
    iconLink.sizes = size;
    iconLink.href = href.replace('icon.png','icon-' + size + '.png');
    document.getElementsByTagName('head')[0].appendChild(iconLink);
  }
}

function addResponsiveMeta() {
  // <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0">
  var meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0';
  document.getElementsByTagName('head')[0].appendChild(meta);
}

function addCss(fileName) {

  var head = document.head,
     link = document.createElement('link');

  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = fileName;

  head.appendChild(link);
}

function insertScript(url, defer) {
  var script = document.querySelector("script[src*='" + url + "']");
  if (!script) {
    var heads = document.getElementsByTagName("head");
    if (heads && heads.length) {
      var head = heads[0];
      if (head) {
        script = document.createElement('script');
        script.setAttribute('src', url);
        script.setAttribute('type', 'text/javascript');
        !!defer && script.setAttribute('defer', '');
        head.appendChild(script);
      }
    }
  }
}

function AddClassNameToBody(newclassName) {
  // this can be called in the footer to add a class name to the body so that we can target different themes or exhibits
  newclassName = ' '+newclassName;
  document.body.className+= newclassName;

}

ready(loadReusableComponentsOmeka);
