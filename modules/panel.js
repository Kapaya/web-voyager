const Panel = (function(){
    let _panelElement;
    let _chartViewElement;
    let _dataFieldsElement;
    let _data;
    let _dataFieldToAlias = {};
    let _dataFieldToType = {};
    let _dataFieldToColumnSelector;
    const _panelElementCSS = `
        <style> 
            :host {
                display: flex;
                position: fixed;
                padding: 2.5px;
                bottom: 0;
                left: 0;
                height: 300px;
                width: 100vw;
                z-index: 10000000;
                overflow: hidden;
                background-color: #38425d;
                color: white;
                box-shadow: 0px 0px 10px -1px #d5d5d5;
            }
            
            .view {
                margin: 2.5px;
                padding: 2.5px; 
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            
            .view > * {
                margin: 2.5px;
                padding: 2.5px; 
            }
            
            .view .title {
                display: flex;
                width: 100%;
            }
            
            .view .title span {
                flex: 1;
                font-weight: bold;
            }
            
            .chart-data  {
                display: flex;
                width: 230px;
            }
            
            .chart-data .data-fields {
                flex: 1;
                width: 100%;
                color: black;
            }
            
            .chart-data .data-field {
                display: flex;
                width: 200px;
                justify-content: flex-start;
                align-items: center;
                margin: 2.5px;
                padding: 2.5px;
            }

            .chart-data .data-field > * {
                margin: 1.5;
                padding: 1.5px;
            }
            
            .chart-data .data-field .data-field-name input {
                font-size: 0.9em !important;
            }
            
            .chart-view {
                flex: 1;
                display: flex;
                background-color: #e2e9f3;
                color: black;
                border-radius: 5px;
            }
            
            .chart-view .charts {
                flex: 1;
                overflow-x: scroll;
                overflow-y: hidden;
                width: 100%;
                display: flex;
                border-radius: 5px;
            }
            
            .chart-view .chart {
                min-width: 50%;
                margin: 2.5px;
                padding: 2.5px;
                overflow-y: scroll;
                background-color: white;
            }
        </style>
    `;

    const _panelElementString = `
        ${_panelElementCSS}
        <div class='view chart-data'>
            <div class='title'>
                <span> Data Fields </span>
            </div>
            <div class='data-fields'>
            </div>
        </div>
        <div class='view chart-view'>
            <div class='title'>
                <span> Visualizations Of Selected Data Fields </span>
            </div>
            <div class='charts'>
            </div>
        </div>
    `;

    function render() {
        _panelElement = _createPanelElement();
        _chartViewElement = _panelElement.shadowRoot.querySelector('.chart-view');
        _dataFieldsElement = _panelElement.shadowRoot.querySelector('.chart-data .data-fields');
        Utils.eventListener({
           element: _dataFieldsElement,
           type: 'add',
           event: 'change',
           listener: _dataFieldsCheckboxEventListener 
        });
        Utils.eventListener({
            element: _dataFieldsElement,
            type: 'add',
            event: 'blur',
            listener: _dataFieldNameListener
         });
        Utils.eventListener({
            element: _dataFieldsElement,
            type: 'add',
            event: 'click',
            listener: _dataFieldToggleListener
         });
         Utils.eventListener({
            element: _dataFieldsElement,
            type: 'add',
            event: 'change',
            listener: _dataFieldTypeListener
         });
        document.body.append(_panelElement);
    }

    function setChartData({ data, fieldToColumnSelector }) {
        _dataFieldToColumnSelector = fieldToColumnSelector;
        _data = data;
        const sample = data[0];
        _updateDataFieldNames();
        _setDataFieldTypes({ sample });
        Object
            .keys(sample)
            .forEach((field) => {
                if (!_dataFieldsElementHasField({ field })) {
                    const fieldElement = _createDataFieldElement({ field, sample });
                    _dataFieldsElement.append(fieldElement);
                }
            });
        if (_dataFieldsElement.querySelectorAll('.data-field').length > 0) {
           _renderCharts();
        }
    }

    function _createPanelElement() {
        class WebVoyegar extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({mode: 'open'});
                this.shadowRoot.innerHTML = _panelElementString;
            }
        }
        window.customElements.define('web-voyager', WebVoyegar);
        return document.createElement('web-voyager');
    }

    function _createDataFieldElement({ field, sample }) {
        const checkboxIsChecked = Object.keys(sample).length === 1;
        const fieldTypeKey = _getDataFieldTypeKey({ field });
        const dataFieldType = _dataFieldToType[fieldTypeKey];
        const fieldElementString = `
            <div class="data-field-toggle">
                <input type="checkbox" aria-label="Checkbox for data field" ${checkboxIsChecked ? 'checked' : ''}>
            </div>
            <div class="data-field-name">
                <input type="text" aria-label="Data field" value="${field}">
            </div>
            <select class="data-field-type">
                <option value="nominal" ${dataFieldType === "nominal" ? "selected" : ""}>N</option>
                <option value="quantitative" ${dataFieldType === "quantitative" ? "selected" : ""}>Q</option>
                <option value="ordinal" ${dataFieldType === "ordinal" ? "selected" : ""}>O</option>
                <option value="temporal" ${dataFieldType === "temporal" ? "selected" : ""}>T</option>
            </select>
        `;
        const fieldElement = document.createElement('div');
        fieldElement.classList.add('data-field');
        fieldElement.dataset.originalFieldName = field;
        fieldElement.dataset.currentFieldName = field;
        fieldElement.innerHTML = fieldElementString;
        return fieldElement;
    }

    function _dataFieldsElementHasField({ field }) {
        return !!_dataFieldsElement.querySelector(`[data-current-field-name="${field}"]`);
    }

    function _dataFieldsCheckboxEventListener(event) {
        const { target } = event;
        if (target.type === "checkbox") {
            _renderCharts();
        }
    }

    function _dataFieldNameListener(event) {
        const { target } = event;
        if (target.nodeName === "INPUT" && target.type !== "checkbox") {
            const { originalFieldName, currentFieldName } = _getFieldName({ element: target })
            const updatedFieldName = target.value;
            const columnSelector = _dataFieldToColumnSelector[originalFieldName];
            VisualFeedback.unhighlightColumnElements({ columnSelector });
            if (updatedFieldName && updatedFieldName !== currentFieldName) {
                _updateDataFieldNames({ 
                    originalFieldName,
                    updatedFieldName 
                });
                _updateDataFieldElement({ originalFieldName , updatedFieldName });
                _renderCharts();
            }
        }
    }

    function _dataFieldToggleListener(event) {
        const { target } = event;
        if (target.nodeName === "INPUT" && target.type !== "checkbox") {
            const { originalFieldName } = _getFieldName({ element: target })
            const columnSelector = _dataFieldToColumnSelector[originalFieldName];
            VisualFeedback.unhighlightColumnElements({
                columnSelector: WrapperInduction.currentColumnSelector()
            });
            WrapperInduction.currentColumnSelector(columnSelector);
            VisualFeedback.highlightColumnElements({ columnSelector });
        } 
    }

    function _dataFieldTypeListener(event) {
        const { target } = event;
        if (target.nodeName === "SELECT") {
            const dataFieldType = target.value;
            const { originalFieldName } = _getFieldName({ element: target })
            _dataFieldToType[originalFieldName] = dataFieldType;
            _renderCharts();
        }
    }

    function _updateDataFieldNames(options) {
        if (options) {
            const { originalFieldName, updatedFieldName } = options;
            _data.forEach(entry => {
                const fieldKey = _dataFieldToAlias[originalFieldName] || originalFieldName;
                const fieldValue = entry[fieldKey];
                if (fieldValue) {
                    entry[updatedFieldName] = fieldValue;
                    delete entry[fieldKey];
                }                    
            });
            _dataFieldToAlias[originalFieldName] = updatedFieldName;
        } else {
            Object
                .keys(_dataFieldToAlias)
                .forEach(fieldName => {
                    _data.forEach(entry => {
                        entry[_dataFieldToAlias[fieldName]] = entry[fieldName];
                        delete entry[fieldName]
                    })
                })
        }     
    }

    function _setDataFieldTypes({ sample }) {
        Object.keys(sample)
            .forEach(field => {
                if (!_dataFieldToType[field]) {
                    _dataFieldToType[field] = Number.isNaN(parseInt(sample[field])) ? "nominal" : "quantitative";
                }
            });
    }

    function _updateDataFieldElement({ originalFieldName, updatedFieldName }) {
        const fieldElement = _dataFieldsElement.querySelector(`[data-original-field-name="${originalFieldName}"]`);
        if (fieldElement) {
            fieldElement.dataset.currentFieldName = updatedFieldName;
        }
    }

    function _renderCharts() {
        const checkBoxes = _dataFieldsElement.querySelectorAll('.data-field-toggle input') || [];
        const fields = Array.from(checkBoxes)
            .filter(element => element.checked)
            .map(element => {
                const { currentFieldName } = _getFieldName({ element })
                return currentFieldName;
            });
        const chartsElement = _chartViewElement.querySelector('.charts');
        chartsElement.innerHTML = "";
        if (fields.length) {
            const fieldData = _getDataFieldsAndTypes({ fields });
            const data = _data.filter(entry => {
                let hasValueForAllFields = true;
                fieldData.forEach(({ field }) => {
                    if (!entry[field]) {
                        hasValueForAllFields = false;
                    }
                });
                return hasValueForAllFields
            })
            const configs = ChartRecommender.recommend({ fieldData, data });
            configs.forEach(async (config) => {
                const chartElement = document.createElement('div');
                chartElement.classList.add('chart');
                chartsElement.append(chartElement);
                await _renderChart({ element: chartElement, config, data: _data });
            });
        } 
    }

    function _getDataFieldsAndTypes({ fields }) {
        const dataFieldAndTypes = [];
        fields.forEach(field => {
            const fieldTypeKey = _getDataFieldTypeKey({ field });
            dataFieldAndTypes.push({
                field,
                type: _dataFieldToType[fieldTypeKey]
            });
        });
       return dataFieldAndTypes;
    }

    function _getDataFieldTypeKey({ field }) {
        const originalField = Object.keys(_dataFieldToAlias).find(originalField => _dataFieldToAlias[originalField] === field);
        return originalField || field;
    }

    function _getFieldName({ element }) {
        let parent = element.parentElement;
        while (parent && !parent.dataset.originalFieldName) {
            parent = parent.parentElement;
        }
        const { originalFieldName, currentFieldName } = parent.dataset;
        return {
            originalFieldName,
            currentFieldName
        } 
    }

    async function _renderChart({ element, config, data  }) {
        await vegaEmbed(element, config);
    }

    return {
        render,
        setChartData
    }
})()