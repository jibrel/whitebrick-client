import { types } from '../types/gridTypes';

export default function gridReducer(state: any = {}, action) {
  const payload = action.payload;
  switch (action.type) {
    case types.SET_SEND_ADMIN_SECRET:
      return {
        ...state,
        sendAdminSecret: payload.sendAdminSecret,
      };
    case types.SET_ORGANIZATIONS:
      return {
        ...state,
        organizations: payload.organizations,
      };
    case types.SET_ORGANIZATION:
      return {
        ...state,
        organization: payload.organization,
      };
    case types.SET_CLOUD_CONTEXT:
      return {
        ...state,
        cloudContext: payload.cloudContext,
      };
    case types.SET_TOKEN_CLAIMS:
      return {
        ...state,
        tokenClaims: payload.tokenClaims,
      };
    case types.SET_IS_NEW_TABLE:
      return {
        ...state,
        isNewTable: payload.isNewTable,
      };
    case types.SET_USER:
      return {
        ...state,
        user: payload.user,
      };
    case types.SET_FORM_DATA:
      return {
        ...state,
        formData: payload.formData,
      };
    case types.SET_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: payload.accessToken,
      };
    case types.SET_ROWS:
      return {
        ...state,
        rowData: payload.rows,
      };
    case types.SET_SCHEMAS:
      return {
        ...state,
        schemas: payload.schemas,
      };
    case types.SET_SCHEMA:
      return {
        ...state,
        schema: payload.schema,
      };
    case types.SET_TABLES:
      return {
        ...state,
        tables: payload.tables,
      };
    case types.SET_TABLE:
      return {
        ...state,
        table: payload.table,
      };
    case types.SET_COLUMNS:
      let f = [];
      payload.columns.forEach(column => f.push(column.name));
      return {
        ...state,
        columns: payload.columns,
        fields: f,
      };
    case types.SET_ROW_COUNT:
      return {
        ...state,
        rowCount: payload.rowCount,
      };
    case types.SET_CURRENT:
      return {
        ...state,
        currentPage: payload.current,
      };
    case types.SET_ORDER_BY:
      return {
        ...state,
        orderBy: payload.orderBy,
      };
    case types.SET_LIMIT:
      return {
        ...state,
        limit: payload.limit,
      };
    case types.SET_OFFSET:
      return {
        ...state,
        offset: payload.offset,
      };
    case types.SET_VIEWS:
      return {
        ...state,
        views: payload.views,
      };
    case types.SET_VIEW:
      return {
        ...state,
        views: [...state.views, payload.view],
      };
    case types.SET_DEFAULT_VIEW:
      return {
        ...state,
        defaultView: payload.defaultView,
      };
    case types.SET_GRID_API:
      return {
        ...state,
        gridAPI: payload.gridAPI,
      };
    case types.SET_COLUMN_API:
      return {
        ...state,
        columnAPI: payload.columnAPI,
      };
    case types.SET_SHOW:
      return {
        ...state,
        show: payload.show,
      };
    case types.SET_TYPE:
      return {
        ...state,
        type: payload.type,
      };
    default:
      return state;
  }
}
