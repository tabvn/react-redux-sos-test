import React, {Component} from 'react';
import moment from 'moment';
import PropTypes from 'prop-types'
import _ from 'lodash';
import classNames from 'classnames'
import './index.css'

class DateInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: {
                day: "",
                month: "",
                year: ""
            },
            error: {},
        };

        this.onInputChange = this.onInputChange.bind(this);
        this.validate = this.validate.bind(this);
        this.isNumeric = this.isNumeric.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    isNumeric(x) {
        return !(isNaN(x)) && (typeof x !== "object") &&
            (x != Number.POSITIVE_INFINITY) && (x != Number.NEGATIVE_INFINITY);
    }

    componentWillReceiveProps(nextProps) {
        let nextValue = _.get(nextProps, 'value');
        if (nextValue && !_.isEqual(_.get(this.state, 'value'), nextValue)) {

            this.setState({
                value: nextValue
            })
        }
    }



    componentDidMount() {
        const {value} = this.props;
        if (typeof value !== 'undefined' && value !== null) {

            this.setState({
                value: value
            });
        }
    }

    validate(field = null, cb = () => {
    }) {
        let {value, error} = this.state;
        const {label} = this.props;


        let fields = ['day', 'month', 'year'];
        const yearLimit = 18;

        let fieldsToValidate = field ? [field] : fields;
        let validations = {
            day: [{
                message: 'Date is invalid',
                func: (input) => {
                    let isValid = false;
                    if (typeof input !== 'undefined' && input !== null && this.isNumeric(input) && (1 <= _.toNumber(input) && _.toNumber(input) <= 31)) {
                        isValid = true;
                    }
                    return isValid;
                }
            }],
            month: [{
                message: 'Month is invalid',
                func: (input) => {
                    let isValid = false;

                    if (typeof input !== 'undefined' && input !== null && _.trim(input) !== "" && this.isNumeric(input) && (1 <= (_.toNumber(input)) && _.toNumber(input) <= 12)) {

                        isValid = true;
                    }
                    return isValid;
                }
            }],
            year: [{
                message: 'Year is invalid',
                func: (input) => {
                    let isValid = false;
                    if (typeof input !== 'undefined' && input !== null && _.trim(input) !== "" && this.isNumeric(input) && ((_.toNumber(moment().format('YYYY'))) - _.toNumber(input) >= yearLimit)) {
                        isValid = true;
                    }
                    return isValid;
                }
            }]
        }


        _.each(fieldsToValidate, (field) => {

            let fieldValue = _.get(value, field);
            let fieldValidation = _.get(validations, field, []);
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
                } else {

                    _.unset(error, field);

                }


            }

        });


        let dateString = _.get(value, 'year') + '-' + _.get(value, 'month') + '-' + _.get(value, 'day');
        let isValidateDate = moment(dateString, 'YYYY-MM-DD', true).isValid();

        if (isValidateDate) {
            _.unset(error, 'isDate')
        } else {

            _.setWith(error, 'isDate', label ? label + ' is invalid' : 'Date is invalid');
        }
        this.setState({
            error: error
        }, () => {
            if (cb) {
                cb(error);
            }
        });

    }

    onBlur(e) {

        let {value} = this.state;

        let fieldValue = _.get(e, 'target.value', null);

        if (fieldValue !== null && fieldValue !== "" && this.isNumeric(fieldValue) && (_.toNumber(fieldValue) < 10) && fieldValue.length < 2) {

            fieldValue = '0' + fieldValue;
            let fieldName = _.get(e, 'target.name');


            value = _.setWith(value, fieldName, fieldValue);
            this.setState({
                value: value
            }, () => {
                this.validate(fieldName, (err) => {
                    if (this.props.onChange) {
                        this.props.onChange({
                            value: value,
                            error: err
                        });
                    }

                });
            })
        }
    }

    onInputChange(event) {

        let {value} = this.state;
        const field = _.get(event, 'target.name');


        value = _.setWith(value, field, _.get(event, 'target.value'));

        this.setState({
            value: value,
        }, () => {

            this.validate(field, (err) => {
                if (this.props.onChange) {
                    this.props.onChange({
                        value: value,
                        error: err
                    });
                }

            });

        });

    }

    render() {

        const {label} = this.props;
        const {value, error} = this.state;

        return (
            <div className={classNames('app-date-input', {'app-date-input-error': _.get(error, 'isDate')})}>
                {label ?
                    <div className={'app-label'}>{_.get(error, 'isDate') ? _.get(error, 'isDate') : label}</div> : null}
                <div className={'app-date-input-inner'}>
                    <div
                        className={classNames('app-date-input-item app-date-input-day', {'app-date-input-item-error': _.get(error, 'day')})}>
                        <input onBlur={this.onBlur} placeholder={"DD"} maxLength={2} value={_.get(value, 'day', '')}
                               type={'text'}
                               name={'day'}
                               onChange={this.onInputChange}/>
                    </div>
                    <div
                        className={classNames('app-date-input-item app-date-input-month', {'app-date-input-item-error': _.get(error, 'month')})}>
                        <input onBlur={this.onBlur} placeholder={"MM"} maxLength={2} value={_.get(value, 'month', '')}
                               type={'text'}
                               name={'month'}
                               onChange={this.onInputChange}/>
                    </div>
                    <div
                        className={classNames('app-date-input-item app-date-input-year', {'app-date-input-item-error': _.get(error, 'year')})}>
                        <input placeholder={'YYYY'} maxLength={4} value={_.get(value, 'year', '')}
                               type={'text'}
                               name={'year'}
                               onChange={this.onInputChange}/>
                    </div>
                </div>
            </div>
        )

    }
}

DateInput.propTypes = {
    value: PropTypes.object,
    label: PropTypes.string,
    onChange: PropTypes.func
};

export default DateInput;