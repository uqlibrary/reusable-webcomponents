import ApiAccess from './ApiAccess';

describe('ApiAccess', () => {
    it('should generate API URL with expected query strings', () => {
        const apiAccess = new ApiAccess();

        const fetchFn = jest.spyOn(apiAccess, 'fetchAPI');

        const fetch = window.fetch;
        delete window.fetch;
        window.fetch = jest.fn(() => ({
            ok: true,
            json: jest.fn(),
        }));

        apiAccess.loadTrainingEvents(10, 100);
        expect(fetchFn).toHaveBeenCalledWith('training_events?take=10&filterIds[]=100');

        window.fetch = fetch;
    });
});
