import Lokka from 'lokka';
import Transport from 'lokka-transport-http';

const apiUrl = process.env.REACT_APP_API_URL;
const client = new Lokka({
  transport: new Transport(apiUrl),
});

export default class Centaurus {
  static async getAllProcessesList(dataSaved, dataSort) {
    try {
      const processesList = await client.query(`
        {
            processesList(saved: ${dataSaved}, sort: ${[dataSort]}) {
                edges {
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
