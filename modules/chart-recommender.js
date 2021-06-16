const ChartRecommender = (function(){ 
    function recommend({ fields, data }) {
        const opts = {};
        const schema = cql.schema.build(data, opts);
        const query = {
            "spec": {
              "data": data,
              "mark": "?",
              "encodings": fields.map(field => { 
                const sampleValue = data[0][field];
                const type = Number.isNaN(parseInt(sampleValue)) ? "nominal" : "quantitative";
                console.log(sampleValue, type)
                return {
                    "channel": "?",
                    "field": field,
                    "type": type
                }})
            },
            "nest": [
              {
                "groupBy": ["field", "aggregate", "bin", "timeUnit", "stack"],
                "orderGroupBy": "aggregationQuality"
              },
              {
                "groupBy": [{
                  "property": "channel",
                  "replace": {
                    "x": "xy", "y": "xy",
                    "color": "style", "size": "style", "shape": "style", "opacity": "style",
                    "row": "facet", "column": "facet"
                  }
                }],
                "orderGroupBy": "effectiveness"
              },
              {
                "groupBy": ["channel"],
                "orderGroupBy": "effectiveness"
              }
            ],
            "orderBy": "effectiveness",
            "config": {
              "autoAddCount": true
            }
        };
        const output = cql.recommend(query, schema);
        const { result } = output;
        const vlTree = cql.result.mapLeaves(result, item => item.toSpec());
        console.log(vlTree);
        const specs = []
        populateSpecs({ items: vlTree.items, specs });
        specs.forEach(spec => {
            spec.data = {
                values: spec.data
            };
        });
        return specs;   
    }
    function populateSpecs({ items, specs }) {
        items.forEach((entry, index) => {
            if (entry.items) {
                populateSpecs({ items: entry.items, specs });
            } else if (index === 0) {
                specs.push(entry);
            }
        });
        return;
    }
    return {
        recommend
    }
})()