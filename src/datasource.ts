import {
    CoreApp,
    DataQueryRequest,
    DataQueryResponse,
    DataSourceApi,
    DataSourceInstanceSettings,
    TestDataSourceResponse,
} from '@grafana/data';

import { DEFAULT_QUERY, MyDataSourceOptions, MyQuery, RepoStats } from './types';
import axios from 'axios';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
    url: string;
    apiToken: string;

    constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
        super(instanceSettings);
        // this.url = instanceSettings.url || 'https://api.github.com';
        this.url = 'https://api.github.com';
        this.apiToken = instanceSettings.jsonData.apiToken;
    }

    async fetchPublicRepos(username: string) {
        const response = await axios.get(`${this.url}/users/${username}/repos?per_page=10&sort=updated&direction=desc`);
        return response.data; // This will be an array of repositories
    }

    getDefaultQuery(_: CoreApp): Partial<MyQuery> {
        return DEFAULT_QUERY;
    }

    filterQuery(query: MyQuery): boolean {
        // if no owner name has been provided, prevent the query from being executed
        return !!query.owner;
    }

    async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
        // const { range } = options;
        // const from = range!.from.valueOf();
        // const to = range!.to.valueOf();
        //
        // // Return a constant for each query.
        // const data = options.targets.map((target) => {
        //     return createDataFrame({
        //         refId: target.refId,
        //         fields: [
        //             { name: 'Time', values: [from, to], type: FieldType.time },
        //             { name: 'Value', values: [target.constant, target.constant], type: FieldType.number },
        //         ],
        //     });
        // });
        //
        // return { data };

        const results: any[] = [];
        for (const target of options.targets) {
            const repos = await this.fetchPublicRepos(target.owner);
            console.log(repos);

            repos.forEach((repo: RepoStats) => {
                results.push({
                    // refId: target.refId,
                    // fields: [
                    //     { name: 'Name', values: [repo.name], type: FieldType.string },
                    //     { name: 'Stars', values: [repo.stargazers_count], type: FieldType.number },
                    //     { name: 'Forks', values: [repo.forks_count], type: FieldType.number },
                    //     { name: 'Open Issues', values: [repo.open_issues_count], type: FieldType.number },
                    // ],

                    target: repo.name,
                    datapoints: [
                        [repo.stargazers_count, Date.now()],
                        // [repo.forks_count, Date.now()],
                        // [repo.open_issues_count, Date.now()],
                    ],
                });
            });

            // repos.forEach(repo => {
            //     results.push(createDataFrame({
            //         refId: target.refId,
            //         fields: [
            //             { name: 'Name', values: [repo.name], type: FieldType.string },
            //             { name: 'Stars', values: [repo.stargazers_count], type: FieldType.number },
            //             { name: 'Forks', values: [repo.forks_count], type: FieldType.number },
            //             { name: 'Open Issues', values: [repo.open_issues_count], type: FieldType.number },
            //         ],
            //     }));
            // });

            // results.push(
            //     createDataFrame({
            //         refId: target.refId,
            //         fields: [
            //             { name: 'name', values: [data.name], type: FieldType.string },
            //             { name: 'Stars', values: [data.stargazers_count], type: FieldType.number },
            //             { name: 'Forks', values: [data.forks_count], type: FieldType.number },
            //             { name: 'Open Issues', values: [data.open_issues_count], type: FieldType.number },
            //         ],
            //     })
            // );
        }
        return { data: results };
    }

    testDatasource(): Promise<TestDataSourceResponse> {
        return Promise.resolve({
            status: 'success',
            message: 'Success',
        });
    }

    // async request(url: string, params?: string) {
    //     const response = getBackendSrv().fetch<DataSourceResponse>({
    //         url: `${this.url}${url}${params?.length ? `?${params}` : ''}`,
    //     });
    //     return lastValueFrom(response);
    // }
    //
    // /**
    //  * Checks whether we can connect to the API.
    //  */
    // async testDatasource() {
    //     const defaultErrorMessage = 'Cannot connect to API';
    //
    //     try {
    //         const response = await this.request('/health');
    //         if (response.status === 200) {
    //             return {
    //                 status: 'success',
    //                 message: 'Success',
    //             };
    //         } else {
    //             return {
    //                 status: 'error',
    //                 message: response.statusText ? response.statusText : defaultErrorMessage,
    //             };
    //         }
    //     } catch (err) {
    //         let message = '';
    //         if (typeof err === 'string') {
    //             message = err;
    //         } else if (isFetchError(err)) {
    //             message = 'Fetch error: ' + (err.statusText ? err.statusText : defaultErrorMessage);
    //             if (err.data && err.data.error && err.data.error.code) {
    //                 message += ': ' + err.data.error.code + '. ' + err.data.error.message;
    //             }
    //         }
    //         return {
    //             status: 'error',
    //             message,
    //         };
    //     }
    // }
}
