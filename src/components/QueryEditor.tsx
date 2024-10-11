import React, { ChangeEvent } from 'react';
import { InlineField, Input, Stack } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery } from '../types';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export function QueryEditor({ query, onChange, onRunQuery }: Props) {
    const onOwnerChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange({ ...query, owner: event.target.value });
        // executes the query
        onRunQuery();
    };

    const { owner } = query;

    return (
        <Stack gap={0}>
            <InlineField label="Ower name">
                <Input
                    id="query-editor-constant"
                    onChange={onOwnerChange}
                    value={owner || ''}
                    width={20}
                    type="text"
                />
            </InlineField>
        </Stack>
    );
}
