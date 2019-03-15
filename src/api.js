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

  static async getAllProcessesList(sorting, pageSize, after) {
    const sort = `${sorting[0].columnName}_${sorting[0].direction}`;
    var strAfter = '';
    if (after !== null) {
      strAfter = `, after: "${after}"`;
    }
    try {
      const processesList = await client.query(`
        {
            processesList(saved: true, sort: [${sort}], first: ${pageSize} ${strAfter}) {
                pageInfo {
                    startCursor
                    endCursor
                    hasNextPage
                    hasPreviousPage
                }
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
            }
        }
      `);
      return processesList;
    } catch (e) {
      return null;
    }
  }
}
