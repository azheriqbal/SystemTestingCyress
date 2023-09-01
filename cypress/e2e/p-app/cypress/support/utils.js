// Utility to match GraphQL mutation based on the operation name
export const hasOperationName = (req, operationName) => {
  const { body } = req;
  return (
    body.hasOwnProperty('operationName') && body.operationName === operationName
  );
};

// Alias query if operationName matches
export const aliasQuery = (req, operationName) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Query`;
  }
};

// Alias mutation if operationName matches
export const aliasMutation = (req, operationName) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Mutation`;
  }
};

export const setupGQLIntercepts = (queriesAndMutations) => {
  cy.intercept(
    'POST',
    'https://api.development.betterpt.com/v0/graphql',
    (req) => {
      queriesAndMutations.forEach(({ name, fixture, body, isQuery = true }) => {
        if (hasOperationName(req, name)) {
          req.alias = `gql${name}${isQuery ? 'Query' : 'Mutation'}`;
          if (body) {
            req.reply({
              body,
            });
          } else {
            req.reply({
              fixture,
            });
          }
        }
      });
    }
  );
};
