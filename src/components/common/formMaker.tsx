import React from 'react';
import { bindActionCreators } from 'redux';
import { TextInputField, SelectField } from 'evergreen-ui';
import { actions } from '../../state/actions';
import { connect } from 'react-redux';
import { useManualQuery } from 'graphql-hooks';
import {
  SCHEMA_USERS_QUERY,
  TABLE_USERS_QUERY,
} from '../../graphql/queries/wb';
import PermissionGrid from './permissionGrid';
import { SchemaItemType, TableItemType } from '../../types';

type FormMakerPropsType = {
  fields: any[];
  formData: any;
  schema: SchemaItemType;
  table: TableItemType;
  actions: any;
};

const FormMaker = ({
  fields,
  formData,
  schema,
  table,
  actions,
}: FormMakerPropsType) => {
  const [fetchTableUsers] = useManualQuery(TABLE_USERS_QUERY, {
    variables: {
      schemaName: schema.name,
      tableName: table.name,
    },
  });

  const [fetchSchemaUsers] = useManualQuery(SCHEMA_USERS_QUERY, {
    variables: {
      schemaName: schema.name,
    },
  });

  const handleSelectChange = (multiple, name, e) => {
    if (multiple) {
      let values = Array.from(
        e.target.selectedOptions,
        option => option['value'],
      );
      actions.setFormData({ ...formData, [name]: values });
    } else actions.setFormData({ ...formData, [name]: e.target.value });
  };

  const fetchTableUsersData = async () => {
    const { data } = await fetchTableUsers();
    return data['wbTableUsers'];
  };

  const fetchSchemaUsersData = async () => {
    const { data } = await fetchSchemaUsers();
    return data['wbSchemaUsers'];
  };

  const renderField = ({
    type,
    name,
    label,
    required = false,
    nested = false,
    nestedValue,
    options,
    selected = null,
    readOnly = false,
    keyValuePairs = false,
    multiple = false,
    addNewOptions = false,
    addNewOptionsValue = null,
    onClick = () => {},
    defaultValue = null,
    render = true,
  }) => {
    if (render) {
      if (type === 'text' || type === 'string')
        return (
          <TextInputField
            label={label}
            placeholder={`Enter ${label}`}
            value={!formData[name] ? defaultValue : formData[name]}
            onChange={e =>
              actions.setFormData({ ...formData, [name]: e.target.value })
            }
            required={required}
            disabled={readOnly}
          />
        );
      else if (type === 'select') {
        if (nested) {
          return (
            <SelectField
              label={label}
              value={!formData[name] ? defaultValue : formData[name]}
              required={required}
              onChange={e => handleSelectChange(multiple, name, e)}>
              {!multiple && (
                <option disabled selected={!selected}>
                  Select {label}
                </option>
              )}
              {options.map(option => (
                <option
                  key={option[nestedValue]}
                  value={option[nestedValue]}
                  selected={selected && option[selected] === true}>
                  {option[nestedValue]}
                </option>
              ))}
              {addNewOptions &&
                addNewOptionsValue.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </SelectField>
          );
        } else if (keyValuePairs) {
          let res = [];
          for (let key in options) res.push({ key, value: options[key] });
          return (
            <SelectField
              label={label}
              value={!formData[name] ? defaultValue : formData[name]}
              required={required}
              onChange={e => handleSelectChange(multiple, name, e)}>
              {!multiple && (
                <option disabled selected={!selected}>
                  Select {label}
                </option>
              )}
              {res.map(option => (
                <option key={option.value} value={option.value}>
                  {option.key}
                </option>
              ))}
              {addNewOptions &&
                addNewOptionsValue.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </SelectField>
          );
        } else {
          return (
            <>
              <label htmlFor={name}>{label}</label>
              <select
                className="form-control"
                multiple={multiple}
                value={!formData[name] ? defaultValue : formData[name]}
                onBlur={() => {}}
                disabled={readOnly}
                onChange={e => handleSelectChange(multiple, name, e)}>
                {!multiple && (
                  <option disabled selected>
                    Select {name}
                  </option>
                )}
                {options.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
                {addNewOptions &&
                  addNewOptionsValue.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
            </>
          );
        }
      } else if (type === 'checkbox') {
        return (
          <>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                id={name}
                defaultChecked={formData[name]}
                onChange={e =>
                  actions.setFormData({ ...formData, [name]: e.target.checked })
                }
              />
              <label className="form-check-label" htmlFor={name}>
                {label}
              </label>
            </div>
          </>
        );
      } else if (type === 'button') {
        return (
          <button
            className="btn btn-outline-primary btn-block mt-5"
            onClick={onClick}>
            {label}
          </button>
        );
      } else if (type === 'heading') {
        return (
          <div className="mt-5">
            <hr />
            <h5>{label}</h5>
          </div>
        );
      } else if (type === 'foreignKeys') {
        return (
          <div className="card">
            <div className="card-body">
              <span>Table: {formData.foreignKeys[0].relTableName}</span>
              <p>Column: {formData.foreignKeys[0].relColumnName}</p>
              <button className="btn btn-danger btn-block" onClick={onClick}>
                Remove Foreignkey relation
              </button>
            </div>
            <div className="card-footer p-2">
              <p className="text-small">
                Note: You can add a foreign key only once you remove this.
              </p>
            </div>
          </div>
        );
      } else if (type === 'permissionGrid') {
        return (
          <PermissionGrid
            label={label}
            fetchData={
              label === 'table' ? fetchTableUsersData : fetchSchemaUsersData
            }
          />
        );
      }
    }
  };

  return <div className="w-75">{fields.map(field => renderField(field))}</div>;
};

const mapStateToProps = state => ({
  formData: state.formData,
  schema: state.schema,
  table: state.table,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormMaker);
