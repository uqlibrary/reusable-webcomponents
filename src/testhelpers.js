export function isAString(text) {
    expect(typeof text).toEqual('string');
    expect(text.length).not.toBe(0);
}

export function isAValidLink(link) {
    isAString(link);
    expect(link.startsWith('http:') || link.startsWith('https:') || link.startsWith('tel:')).toBe(true);
}
