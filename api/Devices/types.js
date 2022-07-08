export default `
  type Device {
    _id: ID!
    mac: String
    name: String
    ownerId: String
    followerIds: [String]
    createdAt: String
  }

  type DeviceUser {
    _id: ID!
    name: Name
    email: String
  }

`;
