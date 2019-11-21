import Lokka from 'lokka';
import Transport from 'lokka-transport-http';

const apiUrl =
  process.env.NODE_ENV === 'production'
    ? window._env_.REACT_APP_API_URL
    : process.env.REACT_APP_API_URL;

const client = new Lokka({
  transport: new Transport(apiUrl),
});

export default class Centaurus {
  static async getAllProcessesList(
    sorting,
    pageSize,
    after,
    filter,
    status,
    searchValue
  ) {
    const sort = `${sorting[0].columnName}_${sorting[0].direction}`;
    var strAfter = '';
    var strFilter = '';

    if (after !== null) {
      strAfter = `,
      after: "${after}"`;
    }

    if (filter === 'complete') {
      strFilter = 'running: false';
    } else if (filter === 'incomplete') {
      strFilter = 'running: true';
    } else if (filter === 'saved') {
      strFilter = 'saved: true';
    } else if (filter === 'unsaved') {
      strFilter = 'saved: false';
    } else if (filter === 'published') {
      strFilter = 'published: true';
    } else if (filter === 'unpublished') {
      strFilter = 'published: false';
    } else if (filter === 'all' && status === 'all') {
      strFilter = 'allInstances: true';
    } else if (filter === 'removed') {
      strFilter = 'removed: true';
    }

    if (status === 'success') {
      strFilter = `${strFilter}, ${status}: true`;
    } else if (status === 'failure') {
      strFilter = `${strFilter}, ${status}: true`;
    }

    try {
      const processesList = await client.query(`
        {
          processesList(
            ${strFilter},
            search: {
              text: "${searchValue}",
              columns: [
                processes_process_id,
                processes_start_time,
                processes_end_time,
                processes_name,
                processes_instance,
                release_tag_release_display_name,
                fields_display_name,
                tg_user_display_name
              ]
            },
            sort: [${sort}],
            first: ${pageSize} ${strAfter}
          ) {
            pageInfo {
              startCursor
              endCursor
            }
            totalCount
            edges {
              cursor
              node {
                processId
                startTime
                endTime
                name
                flagPublished
                publishedDate
                statusId
                productLog
                savedProcesses {
                  savedDate
                  savedDateEnd
                }
                processStatus{
                  name
                }
                session {
                  user{
                    displayName
                  }
                }
                fields {
                  edges{
                    node{
                      displayName
                      releaseTag{
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
      // eslint-disable-next-line no-console
      console.log(e);
      return null;
    }
  }
}
