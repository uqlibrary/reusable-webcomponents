export function removeClassFromElement(shadowRoot, elementId, removalClassName) {
    const element = shadowRoot.getElementById(elementId);
    !!element && element.classList.contains(removalClassName) && element.classList.remove(removalClassName);
}

export function addClassToElement(shadowRoot, elementId, newClassName) {
    const element = shadowRoot.getElementById(elementId);
    !!element && !element.classList.contains(newClassName) && element.classList.add(newClassName);
}
