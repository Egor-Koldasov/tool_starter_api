import { getResolvers } from "../../schema/resolvers"


describe('Resolvers', () => {
  const resolvers = getResolvers()
  test('props exist', () => {
    expect(resolvers).toHaveProperty('Query')
    expect(resolvers.Query).toHaveProperty('me')
  })
})