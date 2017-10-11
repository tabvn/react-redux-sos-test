import React, {Component} from 'react'
import classNames from 'classnames'
import './index.css'
import _ from 'lodash'
import {findDOMNode} from "react-dom"
import PropTypes from 'prop-types'

class Select extends Component {

    constructor(props) {

        super(props);

        this.state = {
            value: [],
            open: false
        };


        this.renderSelected = this.renderSelected.bind(this)
        this.handleSelectItem = this.handleSelectItem.bind(this)
        this.isItemSelected = this.isItemSelected.bind(this);
        this.findIndexOfSelected = this.findIndexOfSelected.bind(this)
        this.handleClickOutside = this.handleClickOutside.bind(this)
        this.getLabel = this.getLabel.bind(this)
        this.handleNotifyChange = this.handleNotifyChange.bind(this)
    }


    setSelectedValue(value) {


        if (!_.isUndefined(value) && value !== null) {

            if (_.isArray(value)) {
                this.setState({
                    value: value,
                })
            } else {
                this.setState({
                    value: [value]
                })
            }
        }
    }

    componentWillReceiveProps(nextProps) {

        if (!_.isUndefined(nextProps.value)) {
            this.setSelectedValue(nextProps.value);
        }

    }


    componentDidMount() {
        const {value} = this.props;

        this.targetEl = findDOMNode(this);
        window.addEventListener('mousedown', this.handleClickOutside);
        this.setSelectedValue(value);
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown', this.handleClickOutside)
    }

    renderSelected() {
        const {value} = this.state;
        if (!_.isEmpty(value)) {
            return value.map((item, key) => {
                return <span key={key}>{this.getLabel(item)}</span>
            })
        }

        return null

    }

    handleClickOutside(e) {


        if (this.targetEl && !this.targetEl.contains(e.target)) {

            this.setState({
                open: false
            })


        } else {


            this.setState({
                open: true
            });


        }
    }



    handleSelectItem(item) {


        const {multiple} = this.props;

        let {value} = this.state;

        const indexItem = this.findIndexOfSelected(item);


        if (multiple) {

            if (indexItem !== -1) {
                value.splice(indexItem, 1);
            }
            else {
                value.push(item);
            }
        } else {

            if (indexItem !== -1) {
                value.splice(indexItem, 1);
            } else {

                value = [item]
            }
        }

        this.setState({
            value: value,
            open: !multiple ? false : this.state.open
        }, () => {


            this.handleNotifyChange();

        })

    }

    handleNotifyChange() {
        const {value} = this.state;
        if (this.props.onChange) {
            this.props.onChange({
                value: value
            });
        }

    }

    isItemSelected(item, selected) {
        const indexSelect = this.findIndexOfSelected(item, selected);
        return indexSelect !== -1
    }

    findIndexOfSelected(item, arr = []) {

        const {value} = this.state;


        let selected = arr.length ? arr : value;

        let indexValue = _.findIndex(selected, (itemSelected) => _.isEqual(itemSelected, item) || _.isEqual(_.get(itemSelected, 'id', null), _.get(item, 'id', false)));


        return indexValue;


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

        const {className, id, options, label, style, checkmark, multiple} = this.props;
        const {value} = this.state;


        return (


            <div style={style ? style : null} id={id}
                 className={classNames('app-select', className ? className : false, {'app-select-multiple': multiple}, {'app-select-focus': this.state.open || value.length})}>

                <div className="app-select-content">
                    {value.length < 2 ? <div className="app-select-label">{label}{checkmark && !_.isEmpty(value) ?
                        <i className="icon-checkbox app-green-color"/> : null}</div> : null}
                    {
                        value ?
                            <div className="app-select-selected-text">{this.renderSelected()}</div> : null
                    }

                </div>

                {
                    this.state.open && options && options.length ? <div className="app-select-items">
                        <div className={'app-select-dropdown'}
                            ref={(main) => this.mainRef = main}
                            style={{maxHeight: 256, minWidth: 112, maxWidth: 280}}>
                            {
                                options && options.length ?

                                    options.map((item, key) => {

                                        let isSelected = this.isItemSelected(item, value);

                                        return (

                                            <div onClick={(event) => this.handleSelectItem(item)} key={key}
                                                 className={classNames('app-select-item', {'app-select-item-selected': isSelected})}>
                                                {this.getLabel(item)}
                                            </div>


                                        )

                                    })

                                    : null
                            }
                        </div>
                    </div> : null
                }

                <i className="app-select-dropdown-icon icon-down-open-mini"/>
            </div>
        )
    }
}

Select.propTypes = {
    className: PropTypes.string,
    multiple: PropTypes.bool,
    options: PropTypes.array,
    label: PropTypes.string,
    labelKey: PropTypes.any,
    checkmark: PropTypes.bool,
    value: PropTypes.any,
    onChange: PropTypes.func


}

export default Select;