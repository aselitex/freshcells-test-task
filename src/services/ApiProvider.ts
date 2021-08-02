import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'https://cms.trial-task.k8s.ext.fcse.io/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('jwt-token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      ...(token && {
        authorization: `Bearer ${token}`
      })   
    }
  }
});


const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
