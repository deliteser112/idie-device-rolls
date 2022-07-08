export default `
  type Action {
    _id: ID!
    action: String!
    name: String!
    equation: String!
    user: User
    createdAt: String
  }
`;
