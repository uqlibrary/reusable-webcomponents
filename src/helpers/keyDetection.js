export function isKeyPressed(e, charKeyInput, numericKeyInput) {
    console.log(
        'isKeyPressed: e.key = ',
        e.key,
        ' | e.code = ',
        e.code,
        ' | e.charCode = ',
        e.charCode,
        ' | e.keyCode = ',
        e.keyCode,
    );
    const keyNumeric = e.charCode || e.keyCode;
    const keyChar = e.key || e.code;
    return keyChar === charKeyInput || keyNumeric === numericKeyInput;
}
export function isEscapeKeyPressed(e) {
    return isKeyPressed(e, 'Escape', 27);
}
export function isArrowDownKeyPressed(e) {
    return isKeyPressed(e, 'ArrowDown', 40);
}
export function isArrowUpKeyPressed(e) {
    return isKeyPressed(e, 'ArrowUp', 38);
}
export function isReturnKeyPressed(e) {
    return isKeyPressed(e, 'Enter', 13);
}
export function isTabKeyPressed(e) {
    return isKeyPressed(e, 'Tab', 9);
}
