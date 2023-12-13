/* eslint-disable max-len */
export default {
    menuhome: {
        dataTestid: 'menu-group-home-link',
        linkTo: 'http://www.library.uq.edu.au',
        primaryText: 'Library home',
    },
    responsiveClose: {
        dataTestid: 'close-action',
        primaryText: 'Close',
    },
    publicmenu: [
        // the parent items appears in the footer; the submenuItems appear in the megamenu
        {
            id: 'libraryServices',
            dataTestid: 'menu-group-services-link',
            linkTo: 'https://web.library.uq.edu.au/library-services',
            primaryText: 'Library services',
            columnCount: 2,
            submenuItems: [
                {
                    primaryText: 'for Students',
                    secondaryText: 'Reading lists, past exams ...',
                    linkTo: 'https://web.library.uq.edu.au/library-services/services-for-students',
                },
                {
                    primaryText: 'for Researchers',
                    secondaryText: 'Data, impact, publishing support',
                    linkTo: 'https://web.library.uq.edu.au/library-services/services-for-researchers',
                },
                {
                    primaryText: 'for HDR students',
                    secondaryText: 'Research support, training, tools',
                    linkTo: 'https://web.library.uq.edu.au/library-services/services-higher-degree-by-research',
                },
                {
                    primaryText: 'for Teaching staff',
                    secondaryText: 'Reading lists, Blackboard links ...',
                    linkTo: 'https://web.library.uq.edu.au/library-services/services-for-teaching-staff',
                },
                {
                    primaryText: 'for Professional staff',
                    secondaryText: 'Access, training, borrowing',
                    linkTo: 'https://web.library.uq.edu.au/library-services/services-for-professional-staff',
                },
                {
                    primaryText: 'for Hospital staff',
                    secondaryText: 'Membership, literature search',
                    linkTo: 'https://web.library.uq.edu.au/library-services/services-for-hospital-staff',
                },
                {
                    primaryText: 'for UQ alumni',
                    secondaryText: 'Membership, resources',
                    linkTo: 'https://web.library.uq.edu.au/library-services/services-for-uq-alumni',
                },
                {
                    primaryText: 'for Community',
                    secondaryText: 'Public access & services',
                    linkTo: 'https://web.library.uq.edu.au/library-services/services-for-community',
                },
                {
                    primaryText: 'for High schools',
                    linkTo: 'https://web.library.uq.edu.au/library-services/services-for-high-schools',
                },
                {
                    primaryText: 'for Clients with disabilities',
                    secondaryText: 'Accessibility, assistive technology',
                    linkTo: 'https://web.library.uq.edu.au/library-services/support-for-clients-disabilities',
                },
                {
                    primaryText: 'for Other libraries',
                    secondaryText: 'Document supply, off-air recordings',
                    linkTo: 'https://web.library.uq.edu.au/library-services/for-other-libraries',
                },
                {
                    primaryText: 'Contact the Librarian Team',
                    secondaryText: 'Expert advice for your discipline',
                    linkTo: 'https://web.library.uq.edu.au/library-services/contact-faculty-services-librarians',
                },
                {
                    primaryText: 'Book a room or desk',
                    secondaryText: 'Student meeting and study spaces',
                    linkTo: 'https://uqbookit.uq.edu.au/#/app/booking-types/77b52dde-d704-4b6d-917e-e820f7df07cb',
                },
                {
                    primaryText: 'Training',
                    secondaryText: 'Online & in-person classes',
                    linkTo: 'https://web.library.uq.edu.au/library-services/training',
                },
                {
                    primaryText: 'IT',
                    secondaryText: 'Printing, WiFi, available computers',
                    linkTo: 'https://web.library.uq.edu.au/library-services/it',
                },
                {
                    primaryText: 'Copyright',
                    secondaryText: 'For teaching, research, theses ...',
                    linkTo: 'https://web.library.uq.edu.au/library-services/copyright',
                },
                {
                    primaryText: 'Digitisation',
                    secondaryText: 'Convert material to digital format',
                    linkTo: 'https://web.library.uq.edu.au/library-services/digitisation',
                },
                {
                    primaryText: 'Special collections',
                    secondaryText: 'Search, request, access & copy',
                    linkTo: 'https://web.library.uq.edu.au/library-services/special-collections',
                },
                // extra fields force the menu to break where we want it to
                {},
                {},
                {},
                {},
                {},
            ],
        },
        {
            id: 'researchToolsTechniques',
            dataTestid: 'menu-group-research-link',
            linkTo: 'https://web.library.uq.edu.au/research-tools-techniques',
            primaryText: 'Research tools & techniques',
            columnCount: 2,
            submenuItems: [
                {
                    primaryText: 'Library Search',
                    secondaryText: 'What it is & how to use it',
                    linkTo: 'https://web.library.uq.edu.au/research-tools-techniques/library-search',
                },
                {
                    primaryText: 'Databases',
                    secondaryText: 'Browse or search by title',
                    linkTo: 'https://search.library.uq.edu.au/primo-explore/dbsearch?vid=61UQ',
                },
                {
                    primaryText: 'Google Scholar',
                    secondaryText: 'Enhanced access via the Library',
                    linkTo: 'https://web.library.uq.edu.au/research-tools-techniques/google-scholar',
                },
                {
                    primaryText: 'UQ eSpace',
                    secondaryText: 'Archive of UQ research & more',
                    linkTo: 'https://espace.library.uq.edu.au/',
                },
                {
                    primaryText: 'Fryer Library Manuscripts',
                    secondaryText: 'Search our unpublished collections',
                    linkTo: 'https://manuscripts.library.uq.edu.au/',
                },
                {
                    primaryText: 'Off-campus access',
                    secondaryText: 'Access full-text from anywhere',
                    linkTo: 'https://web.library.uq.edu.au/research-tools-techniques/campus-access',
                },
                // Extra blank entries to force the start of the next column
                {},
                {},
                {
                    primaryText: 'Search techniques',
                    secondaryText: 'Find the results you need',
                    linkTo: 'https://web.library.uq.edu.au/research-tools-techniques/search-techniques',
                },
                {
                    primaryText: 'Subject guides',
                    secondaryText: 'Law, medicine, management ...',
                    linkTo: 'https://guides.library.uq.edu.au/subject',
                },
                {
                    primaryText: 'Referencing style guides',
                    secondaryText: 'APA, AGLC, Chicago ...',
                    linkTo: 'https://guides.library.uq.edu.au/referencing',
                },
                {
                    primaryText: 'EndNote referencing software',
                    secondaryText: 'Download and support',
                    linkTo: 'https://web.library.uq.edu.au/research-tools-techniques/endnote-referencing-software',
                },
                {
                    primaryText: 'Digital Essentials',
                    secondaryText: 'Build your digital & assignment skills',
                    linkTo: 'https://web.library.uq.edu.au/research-tools-techniques/digital-essentials',
                },
                {
                    primaryText: 'Online learning',
                    secondaryText: 'Self-paced online modules & videos',
                    linkTo: 'https://web.library.uq.edu.au/library-services/training/online-learning',
                },
                {
                    primaryText: 'Digital Researcher Lab',
                    secondaryText: 'Projects, tools and support',
                    linkTo: 'https://web.library.uq.edu.au/research-tools-techniques/digital-researcher-lab',
                },
            ],
        },
        {
            id: 'collections',
            dataTestid: 'menu-group-collections-link',
            linkTo: 'https://web.library.uq.edu.au/collections',
            primaryText: 'Collections',
            columnCount: 1,
            submenuItems: [
                {
                    primaryText: 'Collection strength',
                    linkTo: 'https://web.library.uq.edu.au/collections/collection-strength',
                },
                {
                    primaryText: 'Stories from the collection',
                    linkTo: 'https://web.library.uq.edu.au/collections/stories-from-collection',
                },
                {
                    primaryText: 'Cultural & heritage collections',
                    linkTo: 'https://web.library.uq.edu.au/collections/cultural-heritage-collections',
                },
                {
                    primaryText: 'Collection Discovery',
                    linkTo: 'https://search.library.uq.edu.au/primo-explore/collectionDiscovery?vid=61UQ',
                },
                {
                    primaryText: 'Collection management',
                    linkTo: 'https://web.library.uq.edu.au/collections/collection-management',
                },
                {
                    primaryText: 'Culturally sensitive collections',
                    secondaryText: 'Flag a resource for review or takedown',
                    linkTo: 'https://web.library.uq.edu.au/collections/culturally-sensitive-collections',
                },
                {
                    primaryText: 'UQ Archives',
                    linkTo: 'https://web.library.uq.edu.au/collections/university-queensland-archives',
                },
            ],
        },
        {
            id: 'borrowingRequesting',
            dataTestid: 'menu-group-borrowing-link',
            linkTo: 'https://web.library.uq.edu.au/borrowing-requesting',
            primaryText: 'Borrowing & requesting',
            columnCount: 2,
            submenuItems: [
                {
                    primaryText: 'View your loans & requests',
                    linkTo:
                        'https://search.library.uq.edu.au/primo-explore/login?vid=61UQ&targetURL=https%3A%2F%2Fsearch.library.uq.edu.au%2Fprimo-explore%2Faccount%3Fvid%3D61UQ%26lang%3Den_US%26section%3Doverview',
                },
                {
                    primaryText: 'How to borrow',
                    secondaryText: 'Rules, finding items, returning',
                    linkTo: 'https://web.library.uq.edu.au/borrowing-requesting/how-to-borrow',
                },
                {
                    primaryText: 'Borrowing rules',
                    linkTo: 'https://web.library.uq.edu.au/borrowing-requesting/how-borrow/borrowing-rules',
                },
                {
                    primaryText: 'Overdue items',
                    linkTo: 'https://web.library.uq.edu.au/borrowing-requesting/overdue-items',
                    secondaryText: 'Pay library fines',
                },
                {
                    primaryText: 'Request items',
                    secondaryText: 'On loan, off-campus, or not at UQ',
                    linkTo: 'https://web.library.uq.edu.au/borrowing-requesting/request-items',
                },
                {
                    primaryText: 'Request document delivery',
                    linkTo: 'https://web.library.uq.edu.au/borrowing-requesting/request-document-delivery',
                },
                {
                    primaryText: 'Request a purchase',
                    linkTo: 'https://web.library.uq.edu.au/borrowing-requesting/request-purchase',
                },
            ],
        },
        {
            id: 'locationsHours',
            dataTestid: 'menu-group-locations-link',
            linkTo: 'https://web.library.uq.edu.au/locations-hours',
            primaryText: 'Locations & hours',
            columnCount: 3,
            submenuItems: [
                {
                    primaryText: 'Opening hours',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/opening-hours',
                },
                {
                    primaryText: 'Study space availability',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/study-space-availability',
                },
                {
                    primaryText: '24/7 spaces',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/247-study-spaces',
                },
                {
                    primaryText: 'Lost or stolen property',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/lost-or-stolen-property',
                },
                {
                    primaryText: 'Using & sharing library spaces',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/using-and-sharing-your-library-spaces',
                },
                {
                    primaryText: 'Lockers',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/lockers',
                },
                {
                    // force empty entry to space columns
                },
                {
                    primaryText: 'Architecture & Music',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/architecture-music-library',
                },
                {
                    primaryText: 'Biological Sciences',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/biological-sciences-library',
                },
                {
                    primaryText: 'Central Library',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/central-library',
                },
                {
                    primaryText: 'Duhig Tower',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/duhig-tower',
                },
                {
                    primaryText: 'DH Engineering & Sciences',
                    linkTo:
                        'https://web.library.uq.edu.au/locations-hours/dorothy-hill-engineering-and-sciences-library',
                },
                {
                    primaryText: 'FW Robinson Reading Room',
                    secondaryText: 'Fryer Library & UQ Archives',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/fw-robinson-reading-room',
                },
                {
                    primaryText: 'Gatton',
                    secondaryText: 'JK Murray Library',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/uq-gatton-library-jk-murray-library',
                },
                {
                    primaryText: 'Herston Health Sciences',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/herston-health-sciences-library',
                },
                {
                    primaryText: 'Law',
                    secondaryText: 'Walter Harrison Library',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/law-library-walter-harrison-library',
                },
                {
                    primaryText: 'PACE Health Sciences',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/pace-health-sciences-library',
                },
                {
                    primaryText: 'Rural Clinical School',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/rural-clinical-school',
                },
                {
                    primaryText: 'Warehouse',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/warehouse',
                },
            ],
        },
        {
            id: 'about',
            dataTestid: 'menu-group-about-link',
            linkTo: 'https://web.library.uq.edu.au/about-us',
            primaryText: 'About',
            columnCount: 2,
            submenuItems: [
                {
                    primaryText: 'Blog',
                    linkTo: 'https://web.library.uq.edu.au/blog',
                },
                {
                    primaryText: 'Events',
                    linkTo: 'https://web.library.uq.edu.au/about-us/events',
                },
                {
                    primaryText: 'Friends of the Library',
                    linkTo: 'https://web.library.uq.edu.au/about-us/friends-library',
                },
                {
                    primaryText: 'Membership',
                    linkTo: 'https://web.library.uq.edu.au/about-us/membership',
                },
                {
                    primaryText: 'Projects',
                    linkTo: 'https://web.library.uq.edu.au/about-us/projects',
                },
                {
                    primaryText: 'History of the Library',
                    linkTo: 'https://web.library.uq.edu.au/about-us/history-library',
                },
                {
                    primaryText: 'Give to the Library',
                    linkTo: 'https://alumni.uq.edu.au/uq-library',
                },
                {
                    primaryText: 'Library tours',
                    linkTo: 'https://web.library.uq.edu.au/about-us/library-tours',
                },
                {
                    primaryText: 'Organisational structure',
                    linkTo: 'https://web.library.uq.edu.au/about-us/organisational-structure',
                },
                {
                    primaryText: 'Policies & guidelines',
                    linkTo: 'https://web.library.uq.edu.au/about-us/policies-guidelines',
                },
                {
                    primaryText: 'Reports & publications',
                    linkTo: 'https://web.library.uq.edu.au/about-us/reports-and-publications',
                },
                {
                    primaryText: 'Employment',
                    linkTo: 'https://web.library.uq.edu.au/about-us/employment',
                },
                {
                    primaryText: 'Awards & fellowships',
                    linkTo: 'https://web.library.uq.edu.au/about-us/awards-fellowships',
                },
                {
                    primaryText: 'Mission',
                    linkTo: 'https://web.library.uq.edu.au/about-us/mission',
                },
            ],
        },
        {
            id: 'contactUs',
            dataTestid: 'menu-group-contact-link',
            linkTo: 'https://web.library.uq.edu.au/contact-us',
            primaryText: 'Contact us',
        },
    ],
};
