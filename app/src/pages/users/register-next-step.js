import React, {Component} from 'react'
import _ from 'lodash';
import PropTypes from 'prop-types'
import classNames from 'classnames';
import Select from "../../components/select/index";
import DateInput from "../../components/date-input/index";
import ButtonGroup from "../../components/button-group/index";

const genderOptions = [
    {
        label: 'Male',
        value: "male"
    },
    {
        label: 'Female',
        value: 'female'
    },
    {
        label: 'Unspecified',
        value: 'unspecified'
    }
];

class RegisterNextStep extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: {
                date_of_birth: {
                    value: null,
                    error: 'Date of birth is required',
                },
                gender: {
                    error: 'Gender is required',
                    value: null,
                }
            },
            error: {},
            genderOptions: genderOptions,
        };

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleBack = this.handleBack.bind(this);
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.handleGenderChange = this.handleGenderChange.bind(this);
        this.onDateOfBirthChange = this.onDateOfBirthChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.validate = this.validate.bind(this);
    }


    componentDidMount() {

        let {user} = this.props;

        let newUser = Object.assign(this.state.user, user);

        this.setState({
            user: newUser
        });
    }

    handleBack() {

        const {user} = this.state;

        if (this.props.onBack) {
            this.props.onBack(user);
        }
    }

    handleSubmit(e) {

        const {user} = this.state;
        e.preventDefault();
        let isValidate = this.validate();

        if (isValidate && this.props.onComplete) {
            this.props.onComplete(user);

        }

    }


    validate() {
        const {user} = this.state;
        let isValidate = true;

        _.each(user, (field) => {

            if (_.get(field, 'error') && !_.isEmpty(_.get(field, 'error'))) {
                isValidate = false;

                return isValidate;
            }
        });

        return isValidate;
    }

    handleQuestionChange(e) {

        let {user} = this.state;
        user = _.setWith(user, 'how_hear_about_us', e);
        this.setState({
            user: user,
        }, () => this.onChange());

    }

    handleGenderChange(e) {
        let {user} = this.state;
        user = _.setWith(user, 'gender', e);
        this.setState({user: user}, () => this.onChange());
    }

    onDateOfBirthChange(e) {
        let {user} = this.state;
        user = _.setWith(user, 'date_of_birth', e);
        this.setState({user: user}, () => this.onChange());
    }

    onChange() {

        const {user} = this.state;
        if (this.props.onChange) {
            this.props.onChange(user);
        }
    }

    render() {

        const {user, genderOptions} = this.state;

        const formIsValidate = this.validate();
        let questions = [
            {label: "Question A", value: "Question B"},
            {label: "Question B", value: "Question B"}
        ];

        return (
            <div className={'app-page-register-next-step'}>

                <form onSubmit={this.handleSubmit}>

                    <div className={'app-form-content'}>


                        <div className={'app-form-item'}>
                            <ButtonGroup required={true} onChange={this.handleGenderChange} labelKey={['label']}
                                         value={_.get(user, 'gender.value', genderOptions[0])} label={'Gender'}
                                         options={genderOptions}/>
                        </div>
                        <div className={'app-form-item'}>
                            <DateInput onChange={this.onDateOfBirthChange} label={'Date Of Birth'}
                                       value={_.get(user, 'date_of_birth.value', null)}/>
                        </div>
                        <div className={'app-form-item'}>

                            <label>Where did you hear about is?</label>
                            <Select value={_.get(user, 'how_hear_about_us.value')} onChange={this.handleQuestionChange} className={'app-select-full-width'}
                                    labelKey={['label']} options={questions}/>
                        </div>

                    </div>
                    <div className={'app-footer app-footer-sticky'}>

                        <div className={'app-footer-content'}>
                            <div className={'app-footer-actions'}>
                                <div className={'app-footer-action left'}>
                                    <button onClick={this.handleBack} type={'button'}
                                            className={'app-button left-button'}>Back
                                    </button>
                                </div>
                                <div className={'app-footer-action right'}>
                                    <button disabled={!formIsValidate} type={'submit'}
                                            className={classNames('app-button right-button', {'app-button-primary': formIsValidate})}>
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


RegisterNextStep.propTypes = {
    onComplete: PropTypes.func,
    onChange: PropTypes.func,
    onBack: PropTypes.func,
    user: PropTypes.object
}

export default RegisterNextStep;

