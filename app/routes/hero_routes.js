const { request, GraphQLClient } = require('graphql-request')

 function findUsers(nodes) {
   var users = {}
   for (let i = 0; i < nodes.length; i++) {
     let username = nodes[i].participants.nodes[0].login
     users[username] = 0
   }
   for (let i = 0; i < nodes.length; i++) {
     let username = nodes[i].participants.nodes[0].login
     let deletions = nodes[i].deletions
     let additions = nodes[i].additions
     users[username] += additions + deletions
   }
   return users
 }


const client = new GraphQLClient('https://api.github.com/graphql', {
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
  },
})

const query = `query heroQuery($owner: String!, $name: String!) {
	repository(owner: $owner, name: $name) {
		pullRequests(last:100, states:MERGED) {
      nodes {
        participants(first:10) {
          nodes {
            login
          }
        }
        additions
        deletions
      }
    }
  }
}`

client.request(query).then(data => console.log(data))
module.exports = function (app) {
  app.get('/heros', (req, res) => {
    // let variables = {
    //   owner: 'Axeleo',
    //   name: 'social_fretwork'  
    // }
    let variables = {
      owner: req.query.owner,
      name: req.query.repoName
    }
    client.request(query, variables).then(data => {
      console.log(data)
      let nodes = data.repository.pullRequests.nodes
      res.send(findUsers(nodes))
    }).catch(err => {
      console.log(err.response.errors) // GraphQL response errors
      console.log(err.response.data) // Response data if available
    })
    // console.log(req.body)
    // res.send('hello')
  })
}
