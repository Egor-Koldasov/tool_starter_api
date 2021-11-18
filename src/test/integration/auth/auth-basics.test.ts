import { gql } from '@apollo/client/core';
import { db } from '../../../database/db-connection';
import { cleanupIntegrationTests, setupIntegrationTests } from '../../util/setup-test-server';
import { testApolloClient } from '../../util/testApolloClient';

const testUsers = [
  {
    "email": "test1@test.com",
    "password": "test1pass"
  },
  {
    "email": "test2@test.com",
    "password": "test2pass"
  }
]
const clearTestUsers = async () => {
  return db('app_user').modify((query) => testUsers.map(({email}) => query.orWhere({email}))).del()
}
describe('Auth basics', () => {
  beforeAll(async () => {
    await setupIntegrationTests()
    await clearTestUsers();
  })
  afterAll(async () => {
    await clearTestUsers();
    await cleanupIntegrationTests()
  })
  test('sign up success', async () => {
    await testApolloClient(async (client) => {
      const result = await client
        .mutate(
          {
            mutation: gql`
              mutation Mutation($email: String, $password: String) {
                signup(email: $email, password: $password) {
                  success
                  me {
                    email
                  }
                }
              }
            `,
            variables: testUsers[0]
          }
        )
      expect(result).toHaveProperty('data.signup.success', true)
      expect(result).toHaveProperty('data.signup.me.email', testUsers[0].email)
    })
  })

  test('sign up error, existing email', async () => {
    await testApolloClient(async (client) => {
      const result = await client
        .mutate(
          {
            mutation: gql`
              mutation Mutation($email: String, $password: String) {
                signup(email: $email, password: $password) {
                  success
                  message
                  me {
                    email
                  }
                }
              }
            `,
            variables: testUsers[0]
          }
        )
      expect(result).toHaveProperty('data.signup.success', false)
      expect(result).toHaveProperty('data.signup.message', 'This email is already in use')
      expect(result).toHaveProperty('data.signup.me', null)
    })
  })

  test('me success', async () => {
    await testApolloClient(async (client) => {

      const result = await client
        .query({
          query: gql`
            query Query {
              me {
                email              }
            }
          `
        })
      expect(result).toHaveProperty('data.me.email', testUsers[0].email)
    });
  })

  test('logout', async () => {
    await testApolloClient(async (client) => {
      const logoutResult = await client
        .mutate(
          {
            mutation: gql`
              mutation Mutation {
                logout {success}
              }
            `,
          }
        )
      expect(logoutResult).toHaveProperty('data.logout.success', true)

      const meResult = await client
        .query({
          query: gql`
            query Query {
              me {
                email
              }
            }
          `
        })
      expect(meResult).toHaveProperty('data.me', null)
    })
  })

  test('login error, email not found', async () => {
    await testApolloClient(async (client) => {
      const logoutResult = await client
        .mutate(
          {
            mutation: gql`
              mutation Mutation($email: String, $password: String) {
                login(email: $email, password: $password) {
                  success
                  message
                  me {
                    email
                  }
                }
              }
            `,
            variables: testUsers[1]
          }
        )
      expect(logoutResult).toHaveProperty('data.login.success', false)
      expect(logoutResult).toHaveProperty('data.login.message', 'Email not found')
      expect(logoutResult).toHaveProperty('data.login.me', null)
    })
  })

  test('login error, wrong pass', async () => {
    await testApolloClient(async (client) => {
      const logoutResult = await client
        .mutate(
          {
            mutation: gql`
              mutation Mutation($email: String, $password: String) {
                login(email: $email, password: $password) {
                  success
                  message
                  me {
                    email
                  }
                }
              }
            `,
            variables: {...testUsers[0], password: 'wrongpass'}
          }
        )
      expect(logoutResult).toHaveProperty('data.login.success', false)
      expect(logoutResult).toHaveProperty('data.login.message', 'Email or password is incorrect')
      expect(logoutResult).toHaveProperty('data.login.me', null)
    })
  })

  test('login', async () => {
    await testApolloClient(async (client) => {
      const logoutResult = await client
        .mutate(
          {
            mutation: gql`
              mutation Mutation($email: String, $password: String) {
                login(email: $email, password: $password) {
                  success
                  me {
                    email
                  }
                }
              }
            `,
            variables: testUsers[0]
          }
        )
      expect(logoutResult).toHaveProperty('data.login.success', true)

      const meResult = await client
        .query({
          query: gql`
            query Query {
              me {
                email
              }
            }
          `
        })
        expect(meResult).toHaveProperty('data.me.email', testUsers[0].email)
    })
  })
})