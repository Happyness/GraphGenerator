function generateData(data)
{
    var d = [];
    var i = 0;

    if (Array.isArray(data)) {
        data.forEach(function(element) {
            if (element['label'] && element['data']) {
               d[i] = {axis: element['label'], value: element['data']};
            } else {
             d[i] = generateData(element);
            }
            i++;
        })
    };

    //console.log(d);
    return d;
}

function generateGraph(title, legends, data, bodyId, divId)
{
    var w = 300,
        h = 300;

    var colorscale = d3.scale.category10();
    var d = generateData(data);
    var LegendOptions = legends;

    var mycfg = {
        w: w,
        h: h,
        maxValue: 0.6,
        levels: 6,
        ExtraWidthX: 300
    }

    //Call function to draw the Radar chart
    //Will expect that data is in %'s
    RadarChart.draw(divId, d, mycfg);

////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

    var svg = d3.select(bodyId)
        .selectAll('svg')
        .append('svg')
        .attr("width", w+300)
        .attr("height", h)

//Create the title for the legend
    var text = svg.append("text")
        .attr("class", "title")
        .attr('transform', 'translate(90,0)')
        .attr("x", w - 70)
        .attr("y", 10)
        .attr("font-size", "12px")
        .attr("fill", "#404040")
        .text(title);

//Initiate Legend
    var legend = svg.append("g")
            .attr("class", "legend")
            .attr("height", 100)
            .attr("width", 200)
            .attr('transform', 'translate(90,20)')
        ;
//Create colour squares
    legend.selectAll('rect')
        .data(LegendOptions)
        .enter()
        .append("rect")
        .attr("x", w - 65)
        .attr("y", function(d, i){ return i * 20;})
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function(d, i){ return colorscale(i);})
    ;
//Create text next to squares
    legend.selectAll('text')
        .data(LegendOptions)
        .enter()
        .append("text")
        .attr("x", w - 52)
        .attr("y", function(d, i){ return i * 20 + 9;})
        .attr("font-size", "11px")
        .attr("fill", "#737373")
        .text(function(d) { return d; })
    ;
}

/*generateGraph("Joel Denke", ['Personlighet', 'Programmering'], [[
    {'data': 0.7, 'label': 'Självständig'},
    {'data': 0.8, 'label': 'Kreativ'},
    {'data': 0.95, 'label': 'Lugn'},
    {'data': 0.84, 'label': 'Ödmjuk'},
    {'data': 0.67, 'label': 'Nyfiken'},
    {'data': 0.89, 'label': 'Lyhörd'}
]], '#body1', '#chart1');

generateGraph("Programmering", ['Personlighet'], [[
    {'data': 1, 'label': 'Passionerad'},
    {'data': 0.95, 'label': 'Kreativ'},
    {'data': 0.78, 'label': 'Problemlösning'},
    {'data': 0.9, 'label': 'Noggrann'},
    {'data': 0.6, 'label': 'Snabb'},
    {'data': 0.7, 'label': 'Dokumentering'}
]], '#body2', '#chart2')*/

function generate()
{
    console.log("Start generate chart");

    var noForms = parseInt(document.getElementById("numberOfForms").value);
    var graphs = [];
    var labels = [];
    var title = document.getElementById("title").value;

    for (var i = 1; i <= noForms; i++) {
        var form         = document.getElementById("formData"+i);
        var dataElements = form.querySelectorAll("input[name='data[]']");
        var tagElements  = form.querySelectorAll("input[name='tag[]']");
        var data = [];
        var value;

        console.log(dataElements);

        for (var j = 0; j < dataElements.length; j++) {
            value = parseFloat(dataElements[j].value);

            console.log(dataElements[j]);


            if (!isNaN(value)) data.push({data: value, label: tagElements[j].value});
        }

        var typeLabel = document.getElementById("chartType" + i).value;

        console.log(data);

        if (data.length > 0) {
            labels.push(typeLabel);
            graphs.push(data);
        }
    }

    if (graphs.length > 0) {
        generateGraph(title, labels, graphs, '#body', '#chart');
    }
}

function addField(fields)
{
    fields.insertAdjacentHTML("beforeend", getFields(1));
}

function getFields(noFields)
{
    var fields = '';

    for (var i = 1; i <= noFields; i++) {
        fields  += '<p>' +
            '<label for="tag[]">Tag</label>' +
            '<input id="tag[]" name="tag[]" type="text" />' +
            ' <label for="data[]">Data</label>' +
            '<input id="data[]" name="data[]" type="text" />' +
            '</p>';
    }

    return fields;
}

function addForms()
{
    var noForms = parseInt(document.getElementById("numberOfForms").value);
    var noFields = parseInt(document.getElementById("numberOfFields").value);
    var dataForms = document.getElementById("dataForms");

    console.log(noForms);
    console.log(noFields);

    for (var i = 1; i <= noForms; i++)
    {
        dataForms.insertAdjacentHTML("beforeend", generateForm(i, noFields));
    }
}

function generateForm(number, noFields)
{
    return '<form id="formData'+ number+'" class="formData">' +
        '<p><label for="chartType'+number+'">Chart title</label><input id="chartType'+number+'"/></p>' +
        '<p id="fields'+number+'">'+ getFields(noFields) +'</p>' +
        '<p><a href="#" onClick="addField(' + "fields" + number + ')">Lägg till flera fält</a></p>' +
        '</form>';
}