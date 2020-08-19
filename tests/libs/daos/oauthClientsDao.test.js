import { resetAndMockDB } from 'utils/testUtils';
import { mockData } from 'utils/mockData';
import { SCOPE_TYPE, GRANT_TYPE } from 'utils/constants';

describe('oauthClients Dao tests', () => {
    let spy;
    const grantType = GRANT_TYPE.CLIENT_CREDENTIALS;
    const clientId = mockData.MOCK_OAUTH_CLIENTS.clientId;
    let clientSecret = 'TEST';
    const resources = mockData.MOCK_OAUTH_CLIENT_RESOURCES;
    const scope = SCOPE_TYPE.ADMIN;
    const transaction = 1;

    describe('findOneOauthClient', () => {
        const attributes = ['id', 'grant_type', 'client_id', 'client_secret'];

        it('should call findOne of oauthClients', async () => {
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.oauth_clients, 'findOne');
            });
            const { findOneOauthClient } = require('daos/oauthClientsDao');
            await findOneOauthClient(grantType, clientId, clientSecret);

            expect(spy).toBeCalledWith(
                expect.objectContaining({
                    attributes,
                    where: {
                        grantType,
                        clientId,
                        clientSecret
                    },
                    raw: true
                })
            );
        });
    });
    describe('getMetaDataByOAuthClientId', () => {
        let spy;
        it('should get the metadata of an oauthclient by Id', async () => {
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.oauth_clients, 'findOne');
            });
            const {
                getMetaDataByOAuthClientId
            } = require('daos/oauthClientsDao');
            await getMetaDataByOAuthClientId(clientId);
            expect(spy).toBeCalledWith(
                expect.objectContaining({
                    where: { id: clientId },
                    include: expect.anything()
                })
            );
        });
    });

    describe('createOauthClient', () => {
        it('should throw an error if secret is not provided', async () => {
            const { createOauthClient } = require('daos/oauthClientsDao');
            clientSecret = null;
            await expect(
                createOauthClient(
                    {
                        clientId,
                        clientSecret,
                        grantType,
                        scope,
                        resources
                    },
                    transaction
                )
            ).rejects.toThrow();
        });
        it('should call create mutation of oauthClients create', async () => {
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.oauth_clients, 'create');
            });
            clientSecret = 'TEST';
            const { createOauthClient } = require('daos/oauthClientsDao');
            await createOauthClient(
                {
                    clientId,
                    clientSecret,
                    grantType,
                    scope,
                    resources
                },
                transaction
            );
            expect(spy).toBeCalledWith(
                expect.objectContaining({
                    clientId,
                    clientSecret,
                    grantType
                }),
                expect.objectContaining({ transaction })
            );
        });
    });
    describe('findAllOauthClients', () => {
        const page = 1;
        const limit = 10;
        const offset = (page - 1) * limit;
        const attributes = ['clientId', 'grantType'];

        it('should call findAll of oauthClients', async () => {
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.oauth_clients, 'findAll');
            });
            const { findAllOauthClients } = require('daos/oauthClientsDao');
            await findAllOauthClients(page, limit);
            expect(spy).toBeCalledWith(
                expect.objectContaining({
                    attributes,
                    include: expect.anything(),
                    offset,
                    limit,
                    order: [['id', 'ASC']]
                })
            );
        });
    });
});
