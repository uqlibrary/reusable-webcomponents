// Making changes? User settings need to be also created in repo homepage_react
const UNDERGRADUATE_GENERAL = 'UG';
const UNDERGRADUATE_REMOTE = 'REMUG';
const UNDERGRADUATE_TESOL = 'ICTE';
const UNDERGRADUATE_VOCATIONAL = 'VET';
const SHORT_FORM_CREDENTIAL_COURSE = 'SFC';
const SHORT_FORM_CREDENTIAL_COURSE_REMOTE = 'REMSFC';

const POSTGRAD_COURSEWORK = 'CWPG';
const POSTGRAD_COURSEWORK_REMOTE = 'REMCWPG';
const POSTGRAD_RESEARCH_REMOTE = 'REMRHD';
const POSTGRAD_RESEARCH = 'RHD';

const LIBRARY_STAFF = 'LIBRARYSTAFFB';
const OTHER_STAFF = 'STAFF';
const STAFF_AWAITING_AURION = 'AURION';

const EXTRAMURAL_COMMUNITY_PAID = 'COMMU';
const EXTRAMURAL_ALUMNI = 'ALUMNI';
const EXTRAMURAL_HOSPITAL = 'HOSP';
const EXTRAMURAL_ASSOCIATE = 'ASSOCIATE';
const EXTRAMURAL_FRYER = 'FRYVISITOR';
const EXTRAMURAL_HONORARY = 'HON';
const EXTRAMURAL_PROXY = 'PROXY';

export function canSeeLearningResources(storedUserDetails) {
    const account = !!storedUserDetails && storedUserDetails.account;
    return (
        !!account &&
        !!account.id &&
        !!account.user_group &&
        [
            UNDERGRADUATE_GENERAL,
            UNDERGRADUATE_REMOTE,
            OTHER_STAFF,
            LIBRARY_STAFF,
            POSTGRAD_COURSEWORK,
            POSTGRAD_COURSEWORK_REMOTE,
            EXTRAMURAL_HONORARY,
            SHORT_FORM_CREDENTIAL_COURSE,
            SHORT_FORM_CREDENTIAL_COURSE_REMOTE,
        ].includes(account.user_group)
    );
}

export function canSeeEspace(account) {
    return !!account && account.hasOwnProperty('currentAuthor') && !!account.currentAuthor.hasOwnProperty('aut_id');
}

// access controlled via Active Directory (AD)
export function canSeeTestTagAdmin(account) {
    const hasTestTagAdminAccess = (account) =>
        !!account && !!account.groups && account.groups.find((group) => group.includes('lib_libapi_TestTagUsers'));

    return !!account && !!hasTestTagAdminAccess(account);
}

// access controlled via Active Directory (AD)
function hasWebContentAdminAccess(account) {
    return (
        !!account && !!account.groups && account.groups.find((group) => group.includes('lib_libapi_SpotlightAdmins'))
    );
}

export function canSeeAlertsAdmin(account) {
    return !!account && !!hasWebContentAdminAccess(account);
}

export function canSeeSpotlightsAdmin(account) {
    return !!account && !!hasWebContentAdminAccess(account);
}

export function canSeePromopanelAdmin(account) {
    return !!account && !!hasWebContentAdminAccess(account);
}
