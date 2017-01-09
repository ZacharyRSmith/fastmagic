import React from 'react';
import { Button, FormControl, FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap';

const RequiredTextFormGroup = ({ field, fieldState, handleChange }) => {
  return (
    <FormGroup {...{
      controlId: field.name,
      validationState: fieldState.validationState || null
    }}>
      <ControlLabel>{field.label}</ControlLabel>
      <FormControl {...{
        componentClass: field.componentClass || 'input',
        onChange: e => { e.persist(); handleChange(e) },
        type: 'text', // relevant only if this FormControl's componentClass is 'input'
        value: fieldState.value
      }}/>
      <FormControl.Feedback/>
      <HelpBlock {...{
        bsClass: fieldState.validationState ? 'help-block show' : 'hide'
      }}>
        {field.helpMessage}
      </HelpBlock>
    </FormGroup>
  );
};

const TodoFormUI = props => {
  return (
    <form onSubmit={props.handleSubmit}>
      <RequiredTextFormGroup {...{
        field: {
          name: 'text',
          label: 'Text',
          helpMessage: 'Please provide todo\'s text'
        },
        fieldState: props.formData['text'],
        handleChange: props.handleChange
      }}/>
      <RequiredTextFormGroup {...{
        field: {
          name: 'owner',
          label: 'Owner',
          helpMessage: 'Please provide name of todo\'s owner'
        },
        fieldState: props.formData['owner'],
        handleChange: props.handleChange
      }}/>

      <Button {...{ className: 'submit', type: 'submit' }}>Create</Button>
    </form>
  );
};

export default TodoFormUI;
