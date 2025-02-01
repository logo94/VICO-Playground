const vicoRequest = async (endpointUrl, query) => {

    class SPARQLQueryDispatcher {
        constructor( endpoint ) {
            this.endpoint = endpoint;
        }

        query( sparqlQuery ) {
            const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
            const headers = { 'Accept': 'application/sparql-results+json' };

            return fetch( fullUrl, { headers } ).then( body => body.json() );
        }
    }

    const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl );
    let data = await queryDispatcher.query( query )
    return data
} 

export { vicoRequest }