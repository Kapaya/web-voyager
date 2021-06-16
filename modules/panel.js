const Panel = (function(){
    let _panelElement;
    let _chartViewElement;
    let _dataFieldsElement;
    let _data;

    function render() {
        const body = document.querySelector('body');
        _panelElement = _createPanelElement();
        _chartViewElement = _panelElement.querySelector('.chart-view');
        _dataFieldsElement = _panelElement.querySelector('.chart-data .data-fields');
        Utils.eventListener({
           element: _dataFieldsElement,
           type: 'add',
           event: 'change',
           listener: _dataFieldsCheckboxEventListener 
        })
        body.append(_panelElement);
    }

    function setChartData({ data }) {
        _data = data;
        const sample = data[0];
        Object
            .keys(sample)
            .forEach((field) => {
                if (!_dataFieldsElementHasField({ field })) {
                    const fieldElement = _createDataFieldElement({ field, sample });
                    _dataFieldsElement.append(fieldElement);
                }
            });
        if (_dataFieldsElement.querySelectorAll('.data-field').length > 0) {
            _rendersCharts();
        }
    }

    function _createPanelElement() {
        const panelElementString = `
            <div class='view chart-data'>
                <div class='title'>
                    <span> Data </span>
                </div>
                <div class='data-fields'>
                </div>
            </div>
            <div class='view chart-view'>
                <div class='title'>
                    <span> Charts </span>
                </div>
                <div class='charts'>
                </div>
            </div>
        `;
        const panelElement = document.createElement('div');
        panelElement.id = Constants.PANEL_ID;
        panelElement.innerHTML = panelElementString;
        return panelElement;
    }

    function _createDataFieldElement({ field, sample }) {
        const checkboxIsChecked = Object.keys(sample).length === 1;
        const fieldElementString = `
            <div class="checkbox">
                <input type="checkbox" aria-label="Checkbox for data field" ${checkboxIsChecked ? 'checked' : ''}>
            </div>
            <div class="data-field-name">
                <input type="text" aria-label="Data field" value="${field}">
            </div>
        `;
        const fieldElement = document.createElement('div');
        fieldElement.classList.add('data-field');
        fieldElement.dataset.field = field;
        fieldElement.innerHTML = fieldElementString;
        return fieldElement;
    }

    function _dataFieldsElementHasField({ field }) {
        return !!_dataFieldsElement.querySelector(`[data-field="${field}"]`);
    }

    function _dataFieldsCheckboxEventListener(event) {
        const { target } = event;
        if (target.type === "checkbox") {
            _rendersCharts();
        }
    }


    function _rendersCharts() {
        const checkBoxes = _dataFieldsElement.querySelectorAll('.checkbox input') || [];
        const fields = Array.from(checkBoxes)
            .filter(element => element.checked)
            .map(element => {
                let parent = element.parentElement;
                while (parent && !parent.dataset.field) {
                    parent = parent.parentElement;
                }
                return parent.dataset.field;
            });
        const chartsElement = _chartViewElement.querySelector('.charts');
        chartsElement.innerHTML = "";
        if (fields.length) {
            const configs = ChartRecommender.recommend({ fields, data: _data });
            configs.forEach(async (config) => {
                const chartElement = document.createElement('div');
                chartElement.classList.add('chart');
                chartsElement.append(chartElement);
                await _renderChart({ element: chartElement, config, data: _data });
            });
        }  
    }

    async function _renderChart({ element, config, data  }) {
        // config.height = element.clientHeight;
        // config.width = element.clientWidth;
        await vegaEmbed(element, config);
    }

    return {
        render,
        setChartData
    }
})()