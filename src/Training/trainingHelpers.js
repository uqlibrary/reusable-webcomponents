export const getLocationLabel = (data) => {
    let venue = data;
    if (data.startsWith('http')) {
        // hide the url - we don't want them clicking straight through, we want them to go through studenthub
        venue = 'Online';
        if (data.includes('zoom.us')) {
            venue += ', Zoom';
        }
    }
    return venue;
};
