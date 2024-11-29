import { linkToDrupal } from '../../helpers/access';

export default [
    {
        label: 'Media',
        list: [
            {
                label: 'Media team contacts',
                href: 'https://www.uq.edu.au/news/contacts',
            },
            {
                label: 'Find a subject matter expert',
                href: 'https://researchers.uq.edu.au/uqexperts',
            },
            {
                label: 'UQ news',
                href: 'https://www.uq.edu.au/news/',
            },
        ],
    },
    {
        label: 'Working at UQ',
        list: [
            {
                label: 'Current staff',
                href: 'https://staff.uq.edu.au',
            },
            {
                label: 'Careers at UQ',
                href: 'https://careers.uq.edu.au',
            },
            {
                label: 'Strategic plan',
                href: 'https://about.uq.edu.au/strategic-plan',
            },
            {
                label: 'Staff support',
                href: 'https://staff.uq.edu.au/information-and-services/health-safety-wellbeing',
            },
            {
                label: 'IT support for staff',
                href: 'https://staff.uq.edu.au/information-and-services/information-technology/it-support',
            },
        ],
    },
    {
        label: 'Current students',
        list: [
            {
                label: 'my.UQ',
                href: 'https://my.uq.edu.au',
            },
            {
                label: 'Programs and courses',
                href: 'https://my.uq.edu.au/programs-courses',
            },
            {
                label: 'Key dates',
                href: 'https://www.uq.edu.au/events/calendar_view.php?category_id=16',
            },
            {
                label: 'Student support',
                href: 'https://my.uq.edu.au/student-support',
            },
            {
                label: 'IT support for students',
                href: 'https://my.uq.edu.au/information-and-services/information-technology/student-it-support',
            },
        ],
    },
    {
        label: 'Library',
        list: [
            {
                label: 'Library',
                href: 'https://www.library.uq.edu.au',
                dataTestid: 'uqfooter-nav-library-homepage',
            },
            {
                label: 'Locations and hours',
                href: `${linkToDrupal('/visit')}`,
                dataTestid: 'uqfooter-nav-library-locations',
            },
            {
                label: 'Library services',
                href: `${linkToDrupal('/library-services')}`,
                dataTestid: 'uqfooter-nav-library-services',
            },
            {
                label: 'Research tools',
                href: `${linkToDrupal('/research-and-publish')}`,
                dataTestid: 'uqfooter-nav-library-research',
            },
        ],
    },
    {
        label: 'Contact',
        list: [
            {
                label: 'Contact UQ',
                href: 'https://contacts.uq.edu.au/contacts',
            },
            {
                label: 'Make a complaint',
                href: 'https://www.uq.edu.au/complaints-appeals/',
            },
            {
                label: 'Faculties, schools, institutes and centres',
                href: 'https://about.uq.edu.au/faculties-schools-institutes-centres',
            },
            {
                label: 'Divisions and departments',
                href: 'https://www.uq.edu.au/departments/',
            },
            {
                label: 'Campuses, maps and transport',
                href: 'https://campuses.uq.edu.au',
            },
        ],
    },
];
