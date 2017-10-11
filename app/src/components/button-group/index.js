import React, {Component} from 'react';
import PropTypes from 'prop-types'
import _ from 'lodash';
import './index.css'
import classNames from 'classnames'

class ButtonGroup extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: null,
            error: null,
        };

        this.getLabel = this.getLabel.bind(this);
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

    getLabel(item) {

        const {labelKey} = this.props;


        let output = !_.isObject(item) ? item : "";

        if (!_.isUndefined(labelKey)) {

            // check the labelKey; if is array
            if (_.isArray(labelKey)) {

                let values = [];
                _.each(labelKey, (key) => {

                    if (_.isObject(key)) {
                        if (!_.isEmpty(key.value) && typeof (item[(key.value)]) !== 'undefined' && item[key.value] !== null) {

                            let theValue = item[key.value];
                            if (key.prefix) {
                                theValue = key.prefix + '' + theValue;
                            }


                            values.push(theValue);
                        }
                    } else {
                        if (!_.isEmpty(item[key])) {
                            values.push(item[key]);
                        }
                    }

                });

                output = _.join(values, ' ');

                return output;

            } else {

                if (!_.isUndefined(item[labelKey])) {
                    output = item[labelKey];

                    return output;
                }
            }
        }

        return output;

    }

    render() {

        const {label, options, required} = this.props;
        const {value, error} = this.state;

        return (
            <div className={classNames('app-button-group', {'app-button-group-error': error})}>
                {label ? <div className={'app-button-group-label'}>{error ? error : label}</div> : null}
                <div className={'app-button-group-inner'}>
                    {
                        options.map((option, index) => {

                            const isSelected = _.isEqual(value, option);
                            const newValue = _.isEqual(value, option) ? null : option;
                            const isError = required && newValue === null ? label + ' is required' : null;
                            return <div key={index} onClick={() => {
                                this.setState({
                                    value: newValue,
                                    error: isError,
                                }, () => {
                                    if (this.props.onChange) {
                                        this.props.onChange({
                                            value: newValue,
                                            error: isError
                                        });
                                    }
                                });

                            }}
                                        className={classNames('app-button-group-item', {'app-button-group-item-active': isSelected})}>
                                {this.getLabel(option)}
                            </div>

                        })
                    }


                </div>
            </div>
        )

    }
}

ButtonGroup.propTypes = {
    value: PropTypes.any,
    label: PropTypes.string,
    options: PropTypes.array,
    labelKey: PropTypes.any,
    onChange: PropTypes.func,
    required: PropTypes.bool
};

export default ButtonGroup;