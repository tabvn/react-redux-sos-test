import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import {updateRegisterInfo} from "../../modules/user";
import RegisterFirstStep from './register-first-step';
import RegisterNextStep from './register-next-step';
import RegisterComplete from "./register-complete";
import ProgressBar from "../../components/progress/index";
import moment from 'moment';

const FIRST_STEP = 'first';
const NEXT_STEP = 'next';
const COMPLETED = 'completed';

class Register extends Component {

    constructor(props) {
        super(props);

        this.state = {
            step: FIRST_STEP
        };


        this.updateStepAndRegisterInfo = this.updateStepAndRegisterInfo.bind(this);
        this.renderStepForm = this.renderStepForm.bind(this);
        this.getTitle = this.getTitle.bind(this);
        this.printData = this.printData.bind(this);
        this.calculatePercentage = this.calculatePercentage.bind(this);
    }


    printData(data) {

        let user = {};

        _.each(data, (field, key) => {

            switch (key) {


                case 'how_hear_about_us':

                    user = _.setWith(user, key, _.get(field, 'value[0].value'));
                    break;

                case 'gender':
                    user = _.setWith(user, key, _.get(field, 'value.value'));
                    break;

                case 'date_of_birth':
                    let dateString = _.get(field, 'value.year') + '-' + _.get(field, 'value.month') + '-' + _.get(field, 'value.day');

                    let timeStamp = moment(dateString, 'YYYY-MM-DD').unix();
                    user = _.setWith(user, key, timeStamp);
                    break;

                default:
                    user = _.setWith(user, key, _.get(field, 'value'));
                    break;
            }
        });

        _.unset(user, 'passwordConfirm');
        console.log("SIGN UP DATA: =>", user);
    }

    updateStepAndRegisterInfo(data, step) {


        this.setState({
            step: step
        }, () => {
            this.props.updateRegisterInfo(data);

            if (step === COMPLETED) {
                this.printData(data);
            }
        });

    }


    renderStepForm() {
        const {step} = this.state;
        const {user} = this.props;
        let {registerInfo} = user;

        switch (step) {

            case FIRST_STEP:
                return (<RegisterFirstStep
                    user={registerInfo}
                    onChange={(data) => {
                        this.props.updateRegisterInfo(data);
                    }}
                    onComplete={(data) => this.updateStepAndRegisterInfo(data, NEXT_STEP)}/>);


            case NEXT_STEP:

                return (
                    <RegisterNextStep
                        user={registerInfo} onBack={() => {
                        this.setState({
                            step: FIRST_STEP,
                        });
                    }}
                        onChange={(data) => {
                            this.props.updateRegisterInfo(data);
                        }}
                        onComplete={(data) => this.updateStepAndRegisterInfo(data, COMPLETED)}/>);

            case COMPLETED:

                return (
                    <RegisterComplete/>
                );

            default:
                return null;
        }
    }

    getTitle() {
        const {step} = this.state;


        switch (step) {

            case FIRST_STEP:

                return 'Signup';

            case NEXT_STEP:

                return 'Signup';
            case COMPLETED:

                return 'Thank you';
            default:

                return null;
        }
    }

    calculatePercentage() {
        const {user} = this.props;
        let {registerInfo} = user;

        let requiresFields = [
            'gender',
            'email',
            'password',
            'passwordConfirm',
            'date_of_birth',
        ];

        let incompleteFields = [];
        _.each(requiresFields, (f) => {

            let error = _.get(registerInfo, f + '.error');
            if (!_.isEmpty(error) || !_.get(registerInfo, f)) {
                incompleteFields.push(f);
            }
        });


        let percentage = ((requiresFields.length - incompleteFields.length) / requiresFields.length) * 100;

        return percentage;

    }

    render() {

        return (
            <div className={'app-page app-page-register'}>
                <div className={'app-header'}>
                    <div className={'app-header-title'}>{this.getTitle()}</div>
                    <ProgressBar percentage={this.calculatePercentage() + '%'}/>
                </div>
                <div className={'app-page-content'}>
                    {this.renderStepForm()}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    updateRegisterInfo
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Register)