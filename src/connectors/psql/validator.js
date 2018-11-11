import Joi from "joi";

function validate(
  schema = { rules: {}, required: [] },
  objectToValidate,
  { allowUnknown, wantRequired } ={ allowUnknown: true, wantRequired:true } 
) {
  if (typeof schema === "function") schema = schema(Joi);
  let { rules, required } = schema;
  if (wantRequired) rules = applyRequired(rules, required || []);
  return joiValidation(objectToValidate, rules, allowUnknown);
}



function joiValidation(objectToValidate, rules, allowUnknown) {
  const requiredFields = Joi.validate(objectToValidate, rules, {
    abortEarly: false,
    allowUnknown
  });
  if (!requiredFields.error) return false;
  return formatErrors(requiredFields.error.details);
}



function applyRequired(schema, requiredFields = []) {
  const requiredSchema = requiredFields.reduce(
    (requiredSchema, field) => {
      requiredSchema[field] = schema[field]
        ? schema[field].required()
        : Joi.required().invalid("");
      return requiredSchema;
    },
    { ...schema }
  );

  return requiredSchema;
}



function error(key, message, type) {
  return { key, message, type: type || key };
}



function formatErrors(requiredFields) {
  return requiredFields.reduce((errs, input) => {
    if (!errs.find((err) => err.key === input.path)) {
      errs.push(error(input.path, input.message, 'validation'));
    }
    return errs;
  }, []);
}

export { Joi, validate, joiValidation, applyRequired, error };