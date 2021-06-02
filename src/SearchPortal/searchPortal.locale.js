import React from 'react';

const primoPrefix = '&tab=61uq_all&search_scope=61UQ_All&sortby=rank&vid=61UQ&offset=0';

// index of the drop down in the search selection box
const PRIMO_ELEMENTS = [0, 1, 2, 3, 4, 5];
const DATABASES = 6;
const EXAMS = 7;
const READING_LISTS = 8;

export const searchPanelLocale = {
    typeSelect: {
        label: 'Search',
        items: [
            {
                name: 'Library',
                // PublicIcon
                iconPath:
                    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
                placeholder: 'Find books, articles, databases, Library guides & more',
                link:
                    'https://search.library.uq.edu.au/primo-explore/search?query=any,contains,[keyword]' +
                    primoPrefix +
                    '&facet=rtype,exclude,newspaper_articles,lk&facet=rtype,exclude,reviews,lk',
            },
            {
                name: 'Books',
                // ImportContactsIcon
                iconPath:
                    'M17.5 4.5c-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .65.73.45.75.45C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.41.21.75-.19.75-.45V6c-1.49-1.12-3.63-1.5-5.5-1.5zm3.5 14c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z',
                placeholder: 'Enter a keyword, title, author etc...',
                link:
                    'https://search.library.uq.edu.au/primo-explore/search?query=any,contains,[keyword]' +
                    primoPrefix +
                    '&facet=rtype,include,books',
            },
            {
                name: 'Journal articles',
                // SchoolIcon
                iconPath: 'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z',
                placeholder: 'Enter a keyword, article title, author, publication etc...',
                link:
                    'https://search.library.uq.edu.au/primo-explore/search?query=any,contains,[keyword]' +
                    primoPrefix +
                    '&facet=rtype,include,articles',
            },
            {
                name: 'Video & audio',
                // MovieIcon
                iconPath:
                    'M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z',
                placeholder: 'Enter a keyword, title, cast, crew, composer, artist etc...',
                link:
                    'https://search.library.uq.edu.au/primo-explore/search?query=any,contains,[keyword]' +
                    primoPrefix +
                    '&mfacet=rtype,include,videos,1&mfacet=rtype,include,audios,1',
            },
            {
                name: 'Journals',
                // DescriptionIcon
                iconPath:
                    'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
                placeholder: 'Enter a journal or newspaper title',
                link:
                    'https://search.library.uq.edu.au/primo-explore/search?query=title,contains,[keyword],AND' +
                    primoPrefix +
                    '&mfacet=rtype,include,newspapers,1&mfacet=rtype,include,journals,1&mode=advanced',
            },
            {
                name: 'Physical items',
                // InboxIcon
                iconPath:
                    'M19 3H4.99c-1.11 0-1.98.89-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z',
                placeholder: 'Enter a keyword, title, author etc...',
                link:
                    'https://search.library.uq.edu.au/primo-explore/search?query=any,contains,[keyword]' +
                    primoPrefix +
                    '&facet=tlevel,include,physical_items',
            },
            {
                name: 'Databases',
                // StorageIcon
                iconPath: 'M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z',
                placeholder: 'Enter a database title',
                link:
                    'https://search.library.uq.edu.au/primo-explore/dbsearch?query=any,contains,[keyword]&tab=jsearch_slot&vid=61UQ&offset=0&databases=any,[keyword]',
            },
            {
                name: 'Past exam papers',
                // FindInPageIcon
                iconPath:
                    'M20 19.59V8l-6-6H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c.45 0 .85-.15 1.19-.4l-4.43-4.43c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L20 19.59zM9 13c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z',
                placeholder: 'Enter a course code',
                link: 'https://www.library.uq.edu.au/exams/papers.php?stub=[keyword]',
            },
            {
                name: 'Course reading lists',
                // ListAltIcon
                iconPath:
                    'M19 5v14H5V5h14m1.1-2H3.9c-.5 0-.9.4-.9.9v16.2c0 .4.4.9.9.9h16.2c.4 0 .9-.5.9-.9V3.9c0-.5-.5-.9-.9-.9zM11 7h6v2h-6V7zm0 4h6v2h-6v-2zm0 4h6v2h-6zM7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7z',
                placeholder: 'Enter a course code',
                link: 'https://uq.rl.talis.com/search.html?q=[keyword]',
            },
        ],
    },
    links: [
        {
            label: 'Search help',
            link: 'https://web.library.uq.edu.au/research-tools-techniques/uq-library-search',
            display: [...PRIMO_ELEMENTS],
        },
        {
            label: 'Advanced search',
            link: 'https://search.library.uq.edu.au/primo-explore/search?vid=61UQ&mode=advanced',
            display: [...PRIMO_ELEMENTS],
        },
        {
            label: 'Database search',
            link: 'https://search.library.uq.edu.au/primo-explore/dbsearch?vid=61UQ',
            display: [...PRIMO_ELEMENTS],
        },
        {
            label: 'Database help',
            link:
                'https://web.library.uq.edu.au/research-tools-techniques/search-techniques/where-and-how-search/searching-databases',
            display: [DATABASES],
        },
        {
            label: 'Browse databases',
            link: 'https://search.library.uq.edu.au/primo-explore/dbsearch?vid=61UQ',
            display: [DATABASES],
        },
        {
            label: 'Browse search',
            link: 'https://search.library.uq.edu.au/primo-explore/browse?vid=61UQ',
            display: [...PRIMO_ELEMENTS],
        },
        {
            label: 'Browse courses',
            link: 'https://www.library.uq.edu.au/exams/',
            display: [EXAMS],
        },
        {
            label: 'Browse courses',
            link: 'https://uq.rl.talis.com/index.html',
            display: [READING_LISTS],
        },
    ],
};
