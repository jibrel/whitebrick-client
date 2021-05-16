import { types } from '../types/gridTypes';

export const actions = {
  setUser(user) {
    return {
      type: types.SET_USER,
      payload: { user },
    };
  },
  setRows(rows) {
    return {
      type: types.SET_ROWS,
      payload: { rows },
    };
  },
  setFields(fields) {
    return {
      type: types.SET_FIELDS,
      payload: { fields },
    };
  },
  setSchema(schema) {
    return {
      type: types.SET_SCHEMA,
      payload: { schema },
    };
  },
  setTables(tables) {
    return {
      type: types.SET_TABLES,
      payload: { tables },
    };
  },
  setTable(table) {
    return {
      type: types.SET_TABLE,
      payload: { table },
    };
  },
  setRowCount(rowCount) {
    return {
      type: types.SET_ROW_COUNT,
      payload: { rowCount },
    };
  },
  setOrderBy(orderBy) {
    return {
      type: types.SET_ORDER_BY,
      payload: { orderBy },
    };
  },
  setLimit(limit) {
    return {
      type: types.SET_LIMIT,
      payload: { limit },
    };
  },
  setOffset(offset) {
    return {
      type: types.SET_OFFSET,
      payload: { offset },
    };
  },
  setCurrent(current) {
    return {
      type: types.SET_CURRENT,
      payload: { current },
    };
  },
};
