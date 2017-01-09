import React, { Component } from 'react';
import { connect } from 'react-redux';

import { actionCreators } from './module';

function getInvalidProps(formData) {
  const invalidProps = {};
  const requiredFieldNames = ['text', 'owner'];

  requiredFieldNames.forEach(fieldName => {
    const fieldData = formData[fieldName];

    if (!fieldData.value.trim()) {
      invalidProps[fieldName] = {
        value: fieldData.value,
        validationState: 'error'
      }
    }
  });

  return invalidProps;
}

function getPostBody(formData) {
  return Object.keys(formData).reduce((data, key) => ({
    ...data,
    [key]: formData[key].value
  }), {});
}

class TodoFormContainer extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      formData: {
        text: {
          value: ''
        },
        owner: {
          value: ''
        }
      }
    };
  }

  handleChange(e) {
    const newValue = e.target.value;

    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        // TODO better validation
        [e.target.attributes.id.value]: {
          value: newValue,
          validationState: !newValue.trim()
        }
      }
    }));
  }

  handleSubmit(e) {
    e.preventDefault();
    const { formData } = this.state;
    const invalidProps = getInvalidProps(formData);
    if (Object.keys(invalidProps).length) {
      return this.setState(prevState => ({
        formData: {
          ...prevState.formData,
          ...invalidProps
        }
      }))
    }

    this.props.createTodos(getPostBody(formData));
    // this.resetFormData();
  }

  render() {
    if (!this.props.children) {
      console.error('Child not passed to <TodoFormContainer/>');
      return;
    }
    if (this.props.children.length > 1) {
      console.error('Only one child should be passed to <TodoFormContainer/>');
      return;
    }

    return React.cloneElement(
      this.props.children,
      { ...this.props,
        children: undefined,
        formData: this.state.formData,
        handleChange: this.handleChange,
        handleSubmit: this.handleSubmit
      }
    );
  }
}

export default connect(
  null,
  {
    createTodos: actionCreators.createTodos
  }
)(TodoFormContainer);
