export const isOnlineEvent = (event) => event?.venue?.startsWith('http') || !!event?.isOnlineClass;

export const getVenueLabel = (event) => {
    let venue = event.venue;
    if (event?.venue?.startsWith('http')) {
        // hide the url - we don't want them clicking straight through, we want them to go through studenthub
        venue = 'Online';
        if (event.venue.includes('zoom.us')) {
            venue += ', Zoom';
        }
    }
    return venue;
};
