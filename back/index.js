const database = require("./database")
const { ApolloServer, gql } = require("apollo-server")
const typeDefs = gql`
    type Query {
        teams: [Team]
        team(id: Int): Team
        equipments: [Equipment]
        supplies: [Supplie]
    }

    type Mutation {
        editEquipment(id: String, used_by: String, count: Int, new_or_used: String): Equipment

        insertEquipment(id: String, used_by: String, count: Int, new_or_used: String): Equipment

        deleteEquipment(id: String): Equipment
    }
    type Team {
        id: Int
        manager: String
        office: String
        extension_number: String
        mascot: String
        cleaning_duty: String
        project: String
        supplies: [Supplie]
    }
    type Equipment {
        id: String
        used_by: String
        count: Int
        new_or_used: String
    }
    type Supplie {
        id: String
        team: Int
    }
`
const resolvers = {
    Query: {
        teams: () =>
            database.teams.map((team) => {
                team.supplies = database.supplies.filter((supply) => {
                    return team.id === supply.team
                })
                return team
            }),
        team: (parent, args, context, info) =>
            database.teams.find((team) => {
                return team.id === args.id
            }),
        equipments: () => database.equipments,
        supplies: () => database.supplies,
    },

    Mutation: {
        editEquipment: (parent, args, context, info) => {
            return database.equipments
                .filter((equipment) => {
                    return equipment.id === args.id
                })
                .map((equipment) => {
                    Object.assign(equipment, args)
                    return equipment
                })[0]
        },
        insertEquipment: (parent, args, context, info) => {
            database.equipments.push(args)
            return args
        },

        deleteEquipment: (parent, args, context, info) => {
            const deleted = database.equipments.find((equipment) => {
                return equipment.id === args.id
            })
            database.equipments = database.equipments.filter((equipment) => {
                return equipment.id !== args.id
            })
            return deleted
        },
    },
}
const server = new ApolloServer({ typeDefs, resolvers })
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
})
