import { DataSourceJsonData } from '@grafana/data';
import { DataQuery } from '@grafana/schema';

export interface MyQuery extends DataQuery {
    owner: string;
}

export const DEFAULT_QUERY: Partial<MyQuery> = {
    owner: 'grafana', // default owner
};

// export interface DataPoint {
//     Time: number;
//     Value: number;
// }

export interface DataSourceResponse {
    target: string;
    datapoints: RepoStats;
}

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
    apiToken: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
    apiToken: string;
}

export interface RepoStats {
    lat: number;
    lng: number;
    identifier: string;
    title: string;
    timeline: Date;
    name: string;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
}
