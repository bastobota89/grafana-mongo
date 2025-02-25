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
        this.url = 'http://194.233.88.16:4000';
        this.apiToken = instanceSettings.jsonData.apiToken;
    }

    async fetchPublicRepos(username: string) {
        const response = await axios.get(`${this.url}/api/data/?limit=20`);
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

            repos.data.forEach((repo: RepoStats) => {
                let timeline = new Date(repo.timeline).getTime();
                results.push({
                    // refId: target.refId,
                    // fields: [
                    //     { name: 'Name', values: [repo.name], type: FieldType.string },
                    //     { name: 'Stars', values: [repo.stargazers_count], type: FieldType.number },
                    //     { name: 'Forks', values: [repo.forks_count], type: FieldType.number },
                    //     { name: 'Open Issues', values: [repo.open_issues_count], type: FieldType.number },
                    // ],

                    target: repo.identifier,
                    datapoints: [
                        [repo.lat, timeline],
                        [repo.lng, timeline],
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
}
