# Google Tag Manager

Please see this blog post regarding getting GTM to get event reports from elements within the shadow dom: https://www.simoahava.com/analytics/track-interactions-in-shadow-dom-google-tag-manager/#the-listener

TLDR; - In Google Tag Manager, create a Custom HTML tag, and type or copy-paste the following code.

```html
<script>
  (function() {
    // Set to the event you want to track
    var eventName = 'click',
    // Set to false if you don't want to use capture phase
        useCapture = true,
    // Set to false if you want to track all events and not just those in shadow DOM
        trackOnlyShadowDom = true;

    var callback = function(event) {
      if ('composed' in event && typeof event.composedPath === 'function') {
        // Get the path of elements the event climbed through, e.g.
        // [span, div, div, section, body]
        var path = event.composedPath();
        
        // Fetch reference to the element that was actually clicked
        var targetElement = path[0];
        
        // Check if the element is WITHIN the shadow DOM (ignoring the root)
        var shadowFound = path.length ? path.filter(function(i) {
          return !targetElement.shadowRoot && !!i.shadowRoot;
        }).length > 0 : false;
        
        // If only shadow DOM events should be tracked and the element is not within one, return
        if (trackOnlyShadowDom && !shadowFound) return;
        
        // Push to dataLayer
        window.dataLayer.push({
          event: 'custom_event_' + event.type,
          custom_event: {
            element: targetElement,
            elementId: targetElement.id || '',
            elementClasses: targetElement.className || '',
            elementUrl: targetElement.href || targetElement.action || '',
            elementTarget: targetElement.target || '',
            originalEvent: event,
            inShadowDom: shadowFound
          }
        });
      }
    };
    
    document.addEventListener(eventName, callback, useCapture);
  })();
</script>
```
You can attach a Page View trigger to this tag. After that, every single click on pages where the listener is active will be pushed into dataLayer with an object content.
