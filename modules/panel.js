const Panel = (function(){
    let _panelElement;
    let _chartDataTextArea;
    let _chartConfigTextArea;
    let _chartViewContainer;
    let _chartConfig = {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        data: {
            name: "scrapedData"
        }
    };
    let _vegaEmbed;

    function render() {
        const body = document.querySelector('body');
        _panelElement = _createPanelElement();
        _chartDataTextArea = _panelElement.querySelector('#chart-data textarea');
        _chartConfigTextArea = _panelElement.querySelector('#chart-config textarea');
        _chartViewContainer = _panelElement.querySelector("#chart-view .chart");
        Utils.eventListener({
            element: _panelElement.querySelector("#chart-config textarea"),
            type: "add",
            event: "input",
            listener: _executeChartConfig
        });
        body.append(_panelElement);
    }

    function setChartData(data) {
        _chartDataTextArea.value = JSON.stringify(data, null, 2);
    }

    function clearChartData() {
        _chartDataTextArea.value = "";
    }

    function setChartConfig() {
        // _chartConfig.height = _chartViewContainer.offsetHeight;
        // _chartConfig.width = _chartViewContainer.offsetWidth;
        _chartConfigTextArea.value = JSON.stringify(_chartConfig, null, 2);
    }

    function clearChartConfig() {
        _chartConfigTextArea.value = "";
    }

    function clearChart() {
        const chartElement = _panelElement.querySelector("#chart-view .chart");
        chartElement.innerHTML = "";
    }

    function _createPanelElement() {
        const panelElementString = `
            <div id='chart-data' class='view'>
                <div class='title'>
                    <span> Scraped Data </span>
                </div>
                <textarea></textarea>
            </div>
            <div id='chart-config' class='view'>
                <div class='title'>
                    <span> Vega-Lite Config </span>
                </div>
                <textarea></textarea>
            </div>
            <div id='chart-view' class='view'>
                <div class='title'>
                    <span> Vega-Lite Chart </span>
                </div>
                <div class='chart'></div>
            </div>
        `;
        const panelElement = document.createElement('div');
        panelElement.id = Constants.PANEL_ID;
        panelElement.innerHTML = panelElementString;
        return panelElement;
    }

    async function _executeChartConfig() {
        try {
            const chartConfig = JSON.parse(_chartConfigTextArea.value);
            const chartData = JSON.parse(_chartDataTextArea.value);
            const chartElement = _panelElement.querySelector("#chart-view .chart");
            chartElement.innerHTML = "";
            _vegaEmbed = await vegaEmbed(chartElement, chartConfig);
            _vegaEmbed.view
                .insert("scrapedData", chartData)
                .run();
        } catch(error) {
            //console.log(error);
        }
    }

    return {
        render,
        setChartData,
        setChartConfig,
        clearChartConfig,
        clearChartData,
        clearChart
    }
})()