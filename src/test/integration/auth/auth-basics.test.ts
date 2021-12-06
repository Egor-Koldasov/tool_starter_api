import { db } from '../../../database/db-connection';
import { cleanupIntegrationTests, setupIntegrationTests } from '../../util/setup-test-server';
import { apiUrl, makeClient } from '../../util/testApi';

const testUsers = [
  {
    "email": "test1@test.com",
    "password": "test1pass"
  },
  {
    "email": "test2@test.com",
    "password": "test2pass"
  },
  {
    "email": "test3invalidtest.com",
    "password": "test3pass"
  }
]
const clearTestUsers = async () => {
  return db('app_user').modify((query) => testUsers.map(({ email }) => query.orWhere({ email }))).del()
}
describe('Auth basics', () => {
  const client = makeClient()
  beforeAll(async () => {
    await setupIntegrationTests()
    await clearTestUsers();
  })
  afterAll(async () => {
    await clearTestUsers();
    await cleanupIntegrationTests()
  })
  test('sign up success', async () => {
    const response = await client.post(apiUrl('/signup'), testUsers[0]);
    expect(response).toHaveProperty('status', 200)
    expect(response).toHaveProperty('data.user.email', testUsers[0].email)
    expect(response).toHaveProperty('data.user.id')
  })

  test('sign up error, existing email', async () => {
    const promise = client.post(apiUrl('/signup'), testUsers[0]);
    await expect(promise).rejects.toHaveProperty('response.status', 400)
    await expect(promise).rejects.toHaveProperty('response.data.message', 'This email is already in use')
  })

  test('me success', async () => {
    const response = await client.get(apiUrl('/me'));
    expect(response).toHaveProperty('data.user.email', testUsers[0].email)
  })

  test('logout', async () => {
    const logoutResponse = await client.post(apiUrl('/logout'));
    expect(logoutResponse).toHaveProperty('status', 200)
    const meResponse = await client.get(apiUrl('/me'));
    expect(meResponse).toHaveProperty('data.user', null)
  })

  test('login error, email not found', async () => {
    const response = client.post(apiUrl('/login'), testUsers[1]);
    await expect(response).rejects.toHaveProperty('response.status', 400)
    await expect(response).rejects.toHaveProperty('response.data.message', 'Email not found')
    await expect(response).rejects.not.toHaveProperty('response.data.user')
  })

  test('login error, invalid email', async () => {
    const response = client.post(apiUrl('/login'), testUsers[2]);
    await expect(response).rejects.toHaveProperty('response.status', 400)
    await expect(response).rejects.toHaveProperty('response.data.message', 'email: Invalid email')
    await expect(response).rejects.not.toHaveProperty('response.data.user')
  })

  test('login error, no password', async () => {
    const response = client.post(apiUrl('/login'), {email: testUsers[0].email});
    await expect(response).rejects.toHaveProperty('response.status', 400)
    await expect(response).rejects.toHaveProperty('response.data.message', 'password: Required')
    await expect(response).rejects.not.toHaveProperty('response.data.user')
  })

  test('login error, wrong pass', async () => {
    const response = client.post(apiUrl('/login'), {...testUsers[0], password: 'wrongpass'});
    await expect(response).rejects.toHaveProperty('response.status', 400)
    await expect(response).rejects.toHaveProperty('response.data.message', 'Email or password is incorrect')
    await expect(response).rejects.not.toHaveProperty('response.data.user')
  })

  test('login', async () => {
    const loginResponse = await client.post(apiUrl('/login'), testUsers[0]);
    expect(loginResponse).toHaveProperty('status', 200)
    expect(loginResponse).toHaveProperty('data.user.email', testUsers[0].email)
    expect(loginResponse).toHaveProperty('data.user.id')

    const meResponse = await client.get(apiUrl('/me'));
    expect(meResponse).toHaveProperty('data.user.email', testUsers[0].email)
    expect(meResponse).toHaveProperty('data.user.id')
  })
})