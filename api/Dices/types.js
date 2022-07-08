export default `
  type Roll {
    _id: ID!
    device: String
    dice: String
    results: [Result]
    createdAt: String
  }

  type Result {
    coverImg: String
    name: String
    result: String
    calculation: String
    equation: String
  }
`;
