import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import PropTypes from 'prop-types'
import _ from 'lodash';

class RegisterFirstStep extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: {},
            error: null

        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOnInputChange = this.handleOnInputChange.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.comparePassword = this.comparePassword.bind(this);
        this.validatePasswordLength = this.validatePasswordLength.bind(this);
    }

    componentDidMount() {

        const {user} = this.props;

        this.setState({
            user: user ? user : {}
        })

    }

    handleSubmit(e) {

        const {user} = this.state;
        e.preventDefault();


        this.validateForm(null, (error) => {

            if (_.isEmpty(error)) {
                // form is passed
                if (this.props.onComplete) {
                    this.props.onComplete(user);
                }
            }

        });
    }

    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    validateRequire(value) {
        let returnValue = false;
        if (typeof value !== 'undefined' && value !== null && value !== "" && _.trim(value) !== "") {
            returnValue = true;
        }
        return returnValue;
    }

    comparePassword(passwordConfirm = null) {
        const {user} = this.state;

        return _.isEqual(passwordConfirm, _.get(user, 'password.value'));
    }

    validatePasswordLength(str = "") {

        return str.length > 5;

    }

    handleOnInputChange(e) {

        let {user} = this.state;
        let fieldName = _.get(e, 'target.name');
        user = _.setWith(user, fieldName, {value: _.get(e, 'target.value')});
        this.setState({
            user: user
        }, () => {


            if (fieldName === 'password') {
                this.validateForm(fieldName);
                this.validateForm('passwordConfirm');
            } else {
                this.validateForm(fieldName)
            }

        });
    }

    validateForm(field = null, cb = () => {
    }) {
        let {user, error} = this.state;


        // we have an array of validations for user fields. with message and function validate
        let validation = {
            email: [{
                message: 'Email is required',
                func: this.validateRequire
            },
                {
                    message: 'Email is not correct',
                    func: this.validateEmail,
                }
            ],
            password: [
                {message: 'Password is required', func: this.validateRequire},
                {message: 'Password should be minimum 6 characters long.', func: this.validatePasswordLength}
            ],
            passwordConfirm: [
                {message: 'Confirm password is required', func: this.validateRequire},
                {message: 'Password does not match', func: this.comparePassword}
            ]
        };

        let fieldsToValidate = field ? [field] : ['email', 'password', 'passwordConfirm'];

        _.each(fieldsToValidate, (field) => {


            let fieldValue = _.get(user, field + '.value');
            let fieldValidation = _.get(validation, field, []);
            if (fieldValidation) {

                let fieldIsValid = true;
                let fieldErrorMessage = null;
                _.each(fieldValidation, (fieldValidate) => {
                    let isValid = fieldValidate.func(fieldValue);
                    if (!isValid) {
                        fieldIsValid = false;
                        fieldErrorMessage = fieldValidate.message;
                    }

                });

                if (!fieldIsValid) {
                    if (error === null) {
                        error = {};
                    }
                    error = _.setWith(error, field, fieldErrorMessage);
                    user = _.setWith(user, field + '.error', fieldErrorMessage);
                } else {

                    _.unset(error, field);
                    _.unset(user, field + '.error');

                }


            }

        });

        this.setState({
            error: error,
            user: user,
        }, () => {
            if (cb) {

                if (this.props.onChange) {
                    this.props.onChange(user);
                }
                cb(error);
            }
        });


    }

    render() {

        const {user, error} = this.state;
        return (
            <div className={'app-page-register-first-step'}>

                <form onSubmit={this.handleSubmit}>

                    <div className={'app-form-content'}>

                        <div className={'app-form-item'}>
                            <div className={'app-text-field'}>
                                <label>{_.get(error, 'email') ?
                                    <span className={'label-error'}> {_.get(error, 'email')}</span> : 'Email'}</label>
                                <input value={_.get(user, 'email.value', "")} onChange={this.handleOnInputChange}
                                       type={'email'}
                                       name={'email'}/>
                            </div>
                        </div>
                        <div className={'app-form-item'}>
                            <div className={'app-text-field'}>
                                <label>{_.get(error, 'password') ?
                                    <span
                                        className={'label-error'}> {_.get(error, 'password')}</span> : 'Password'}</label>
                                <input value={_.get(user, 'password.value', '')} onChange={this.handleOnInputChange}
                                       type={'password'}
                                       name={'password'}
                                />
                            </div>
                        </div>
                        <div className={'app-form-item'}>
                            <div className={'app-text-field'}>
                                <label>{_.get(error, 'passwordConfirm') ?
                                    <span
                                        className={'label-error'}> {_.get(error, 'passwordConfirm')}</span> : 'Confirm Password'}</label>
                                <input value={_.get(user, 'passwordConfirm.value', '')}
                                       onChange={this.handleOnInputChange}
                                       type={'password'} name={'passwordConfirm'}
                                />
                            </div>
                        </div>

                    </div>
                    <div className={'app-footer app-footer-sticky'}>

                        <div className={'app-footer-content'}>
                            <div className={'app-footer-actions'}>
                                <div className={'app-footer-action right'}>
                                    <button type={'submit'} className={'app-button right-button app-button-primary'}>
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

            </div>
        )
    }
}

RegisterFirstStep.propTypes = {
    onComplete: PropTypes.func,
    user: PropTypes.object,
    onChange: PropTypes.func,
};


const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RegisterFirstStep)