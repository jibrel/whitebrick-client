import React, { useEffect, useState } from 'react'
import * as gql from 'gql-query-builder'

import { AgGridColumn, AgGridReact } from 'ag-grid-react'
import { useManualQuery, useQuery } from 'graphql-hooks'
import Pagination from 'rc-pagination';

import graphQLFetch from '../utils/GraphQLFetch';

const TABLES_QUERY = `
{
  __schema{
    queryType{
      fields{
        name
      }
    }
  }
}
`;


const GET_TABLE_FIELDS = `query ($name: String!){
  __type(name: $name) {
    name
    fields {
      name
    }
  }
}`;

const Table = () => {
  const {loading, error, data} = useQuery(TABLES_QUERY);

  const [table, setTable] = useState('');
  const [count, setCount] = useState(0);
  const [current, setCurrent] = useState(1);
  const [tableData, setData] = useState([]);
  const [refetch, setRefetch] = useState(0);

  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const [fetchQueryFields] = useManualQuery(GET_TABLE_FIELDS);

  useEffect(() => {
    const handleTableChange = async () => {
      if (table !== '') {
        const { data } = await fetchQueryFields({ variables: { name: table }})
        const { name, fields } = data['__type'];
        let f = []
        fields.map(field => f.push(field.name))
        const operation = gql.query({
          operation: name,
          variables: { limit, offset },
          fields: f
        })
        const operationAgg = gql.query({
          operation: name.concat('_aggregate'),
          fields: [{ aggregate: [ 'count' ]}]
        })
        const fetchData = async () => await graphQLFetch({ query: operation.query, variables: operation.variables });
        fetchData().then(({ data }) => {
          setData(data[table]);
        });
        const fetchCount = async () => await graphQLFetch({ query: operationAgg.query });
        fetchCount().then(({ data }) => {
          setCount(data[table + '_aggregate'].aggregate.count);
        });
      }
    };
    handleTableChange();
  }, [table, limit, offset, fetchQueryFields, refetch]);

  const handlePagination = (current, pageSize) => {
    setOffset(Math.ceil((current - 1) * pageSize))
    setCurrent(current);
  };

  const onCellValueChanged = (params) => {
    let data = params.data;
    data[params.colDef.field] = params.oldValue;
    let variables = { where: {}, _set: {} };
    for (let key in data) {
      variables.where[key] = {_eq: data[key]};
    }
    variables['_set'][params.colDef.field] = params.newValue;
    const operation = gql.mutation({
      operation: ''.concat('update_', table),
      variables: { where: { value: variables.where , type: 'chinook_album_bool_exp', required: true }, _set: { value: variables['_set'], type: 'chinook_album_set_input' }},
      fields: ['affected_rows']
    })
    const fetchData = async () => await graphQLFetch({ query: operation.query, variables: operation.variables });
    fetchData().then(({ data }) => setRefetch(refetch + 1));
  };

  if (loading) return 'Loading...'
  if (error) return 'Something Bad Happened'

  return (
    <div className="ag-theme-alpine" style={{ height: '85vh'}}>
      <select value={table} onChange={e => setTable(e.target.value)}>
        <option defaultChecked>Select a table</option>
        {data['__schema'].queryType.fields.map(field => (
          <option value={field.name} key={field.name}>{field.name}</option>
        ))}
      </select>
      <select value={limit} onChange={e => setLimit(parseInt(e.target.value))}>
        <option>5</option>
        <option>10</option>
        <option>20</option>
        <option>50</option>
        <option>100</option>
        <option>500</option>
      </select>
      records per page
      {table !== '' && tableData.length > 0 ?
        <React.Fragment>
          <p>Total {count} records found</p>
          <AgGridReact
            rowData={tableData}
            singleClickEdit
            undoRedoCellEditing
            undoRedoCellEditingLimit={20}
            defaultColDef={{
              flex: 1,
              minWidth: 100,
              editable: true,
              resizable: true,
            }}
            onCellValueChanged={onCellValueChanged}
          >
            {Object.keys(tableData[0]).map(key => (
              <AgGridColumn field={key} key={key} />
            ))}
          </AgGridReact>
        </React.Fragment>
        : <p>Please select a table to render</p>
      }
      {table !== '' &&
        <Pagination
          total={count}
          pageSize={limit}
          current={current}
          onChange={(current, pageSize) => handlePagination(current, pageSize)}
        />
      }
    </div>
  )
};

export default Table;
