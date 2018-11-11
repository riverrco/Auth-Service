import {Model, ValidationError} from 'objection';
import {validate} from './validator';

class BaseModel extends Model {
  static timestamp = true;

  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: VALIDATION

  /**
   * Takes object to valide, takes the schema from the constructor of inherited
   * object and checks if schema exisist if does tries to validate before sending
   * to db depends on the schema.
   */
  $validate(objectToValidate, options) {
    objectToValidate = objectToValidate || this;

    const { schema } = this.constructor;

    if (!schema) { return objectToValidate; }

    const errors = validate(schema, objectToValidate);

    if (!errors) { return objectToValidate; }

    throw new ValidationError(...errors);
  }

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: BEFORE INSERT
  
  /**
   * Before inserting to databese this function calls
   */

  $beforeInsert() {
    this._addTimestamp('create');
  }
  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: BEFORE UPDATE

  /**
   * Before updating the data this function calls
   */
  $beforeUpdate() {
    this._addTimestamp('update');
  }

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::: CREATE TIMESTAMP

  /**
   * Using beforepdate and insert easly creates timestamp each time update or 
   * insert action dispatch.
   */
  _addTimestamp(action) {
    if (this.constructor.timestamp) {
      switch (action) {
        case 'create':
          this.created_at = new Date().getTime();
          break;
        case 'update':
          this.updated_at = new Date().getTime();
          break;
      }
    }
  }
}

export {BaseModel};