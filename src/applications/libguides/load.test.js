import { getIncludeFullPathGuides } from './load';

describe('Guides load file', () => {
    beforeEach(() => {
        delete window.location; // seetup to override the current browser address
    });
    it('includes the load file from the correct place when in production', () => {
        window.location = new URL('https://guides.library.uq.edu.au');
        const actualProd = getIncludeFullPathGuides('applications/libguides/subload.js');
        const expectedProd =
            'https://assets.library.uq.edu.au/reusable-webcomponents/applications/libguides/subload.js';
        expect(actualProd).toEqual(expectedProd);
    });
    it('includes the load file from the correct place when testing from assets in staging', () => {
        window.location = new URL('https://assets.library.uq.edu.au/reusable-webcomponents-staging/index-guides.html');
        const actualStaging = getIncludeFullPathGuides('uq-lib-reusable.min.js');
        const expectedStaging =
            'https://assets.library.uq.edu.au/reusable-webcomponents-staging/uq-lib-reusable.min.js';
        expect(actualStaging).toEqual(expectedStaging);
    });
    it('includes the load file from the correct place when testing from assets in master branch', () => {
        window.location = new URL(
            'https://assets.library.uq.edu.au/reusable-webcomponents-development/master/index-guides.html',
        );
        const actualMaster = getIncludeFullPathGuides('applications/libguides/something.js');
        const expectedMaster =
            'https://assets.library.uq.edu.au/reusable-webcomponents-development/master/applications/libguides/something.js';
        expect(actualMaster).toEqual(expectedMaster);
    });
    it('includes the load file from the correct place when testing from assets in a feature branch', () => {
        window.location = new URL(
            'https://assets.library.uq.edu.au/reusable-webcomponents-development/feature-leadegroot/index-guides.html',
        );
        const actualOverride = getIncludeFullPathGuides('applications/libguides/subload.js');
        const expectedOverride =
            'https://assets.library.uq.edu.au/reusable-webcomponents-development/feature-leadegroot/applications/libguides/subload.js';
        expect(actualOverride).toEqual(expectedOverride);
    });
    it('includes the load file from the correct place when testing from guides when overriding to pull staging', () => {
        // guides does not provide a staging environment - fake it with parameters
        window.location = new URL('https://guides.library.uq.edu.au?override=on&useAlternate=staging');
        const overrideActual = getIncludeFullPathGuides('applications/libguides/custom-styles.css');
        const expected =
            'https://assets.library.uq.edu.au/reusable-webcomponents-staging/applications/libguides/custom-styles.css';
        expect(overrideActual).toEqual(expected);
    });
    it('includes the load file from the correct place when testing from a subpage on guides when overriding to pull staging', () => {
        // guides does not provide a staging environment - fake it with parameters
        window.location = new URL(
            'https://guides.library.uq.edu.au/how-to-find/company-industry-information/public-or-private?override=on&useAlternate=staging',
        );
        const overrideActual = getIncludeFullPathGuides('applications/libguides/custom-styles.css');
        const expected =
            'https://assets.library.uq.edu.au/reusable-webcomponents-staging/applications/libguides/custom-styles.css';
        expect(overrideActual).toEqual(expected);
    });
});
