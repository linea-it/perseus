import Lokka from 'lokka';
import Transport from 'lokka-transport-http';

const apiUrl =
  process.env.NODE_ENV !== 'development'
    ? window.origin + '/api/graphql'
    : process.env.REACT_APP_API_URL;
const client = new Lokka({
  transport: new Transport(apiUrl),
});

export default class Centaurus {
  static async getAllProcessesListTotalCount() {
    try {
      const processesList = await client.query(`
        {
            processesList(saved: false) {                    
                pageInfo {
                    endCursor
                }
            }
        }
      `);
      return processesList;
    } catch (e) {
      return null;
    }
  }

  static async getAllProcessesList(sorting, currentPage, pageSize) {
    const sort = `${sorting[0].columnName}_${sorting[0].direction}`;
    // const skip = `${pageSize * currentPage}`;
    try {
      const processesList = await client.query(`
        {
            processesList(saved: false, sort: [${sort}], first: ${pageSize} ) {
                edges {
                    cursor
                    node {
                        processId
                        sessionId
                        startTime
                        endTime
                        namespace
                        name
                        processDir
                        expirationTime
                        comments
                        flagPublished
                        publishedDate
                        statusId
                        processStatus{
                            name
                        }
                        session {
                            user{
                                displayName
                            }
                        }
                        fields {
                            edges {
                                node {
                                    fieldName
                                    releaseTag {
                                        releaseDisplayName
                                    }
                                }
                            }
                        }
                    }
                }
                pageInfo {
                    startCursor
                    endCursor
                    hasNextPage
                    hasPreviousPage
                }
            }
        }
      `);
      return processesList;
    } catch (e) {
      return null;
    }
  }
}
