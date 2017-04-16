import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';

import Node from './components/tableNode';
import Graph from './components/tableGraph';
import * as d3 from 'd3';
import * as klay from 'klayjs';
import {decipherLibnameTableName} from './utilities';

d3.csv('./data/data.csv', function(d) {
    
    d.source=d.source.toUpperCase()
    d.target=d.target.toUpperCase()

    let target=decipherLibnameTableName(d.target)
    let source=decipherLibnameTableName(d.source)

    let s=source.tablename.length > 0 ? source.libname + "." + source.tablename : '';
    let t=target.tablename.length > 0 ? target.libname + "." + target.tablename : '';

    if (source.libname=='WORK') s = s.concat("|", d.JOB_NAME)
    if (target.libname=='WORK') t = t.concat("|", d.JOB_NAME)

    return {
        source: s,
        target: t,
        source_libname:source.libname,
        target_libname:target.libname
    }

}, function(error, data) {

    var allTables = []
    var libnames = []
    var browserWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var browserHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    for (let d of data.filter(x => x.source != x.target && x.source.length > 0 && x.target.length > 0)) {

        if (allTables.indexOf(d.source) == -1) allTables.push(d.source)
        if (allTables.indexOf(d.target) == -1) allTables.push(d.target)

        // let temp_s = d.source.split(".")[0];
        // let temp_t = d.target.split(".")[0];

        if (libnames.indexOf(d.source_libname) == -1) libnames.push(d.source_libname)
        if (libnames.indexOf(d.target_libname) == -1) libnames.push(d.target_libname)
    }

    let nodes = {}
    let prev_graph = {}
    for (let t of allTables) {
        nodes[t] = new Node(t)
    }

    for (let d of data.filter(x => x.source != x.target && x.source.length > 0 && x.target.length > 0)) {
        nodes[d.source].addChild(nodes[d.target])
        nodes[d.target].addParent(nodes[d.source])
    }

    function searcher(searchingNode, forward_reverse = "forward", hidework = false) {

        if (prev_graph.id != searchingNode && nodes.hasOwnProperty(searchingNode) == true) {

            let node_list = nodes[searchingNode].getAllParentNodes().concat(nodes[searchingNode].getAllChildrenNodes()).filter((value, index, self) => self.indexOf(value) === index);

            var graph = new Graph();
            for (var id of node_list) {
                graph.addNode(nodes[id]);
            }

            prev_graph.id = searchingNode
            prev_graph.graph = graph
            console.log("Fresh fetch")

        } else if (nodes.hasOwnProperty(searchingNode) == true) {
            console.log("Old Data")
            graph = prev_graph.graph
            searchingNode = prev_graph.id
        } else if (nodes.hasOwnProperty(searchingNode) == false) {
            console.log("Not found")
            alert("Not found!!!")
            graph = prev_graph.graph
            searchingNode = prev_graph.id

            prev_graph.id = prev_graph.id
            prev_graph.graph = prev_graph.graph

        }

        if (hidework == true) graph.hideNodesContaining = ["WORK.", "WORKSPDS."]
        else if (hidework == false) graph.hideNodesContaining = []

        if (forward_reverse == "forward") return graph.getForwardImpactAnalysisForKlay(searchingNode)
        else if (forward_reverse == "reverse") return graph.getReverseImpactAnalysisForKlay(searchingNode)
    }


    var svg = d3.select('#graph').append('svg')
        .attr('height', '100%')
        .attr('width', '100%');

    // THIS IS THE START OF LEGEND

    // LEGEND ADDITION
    // addition here is important after svg so that scale and transformation happen on th graph, but we can take care of it if it is needed.

    let categoryKeys = libnames.map((x, i) => String(i));
    // let colors = colorbrewer.Set3[12];
    let colors = ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"]

    function getColorScale(darkness) {
        return d3.scaleOrdinal()
            .domain(categoryKeys)
            .range(colors.map(function(c) {
                return d3.hsl(c).darker(darkness).toString();
            }));
    }

    let strokeColor = getColorScale(0.7);
    let fillColor = getColorScale(-0.1);

    var legend = svg.append('g')
        .attr('class', 'legend')
        .attr("transform", "translate(20,20)")
        .attr('x', 0)
        .attr('y', 0)
        .selectAll('.category')
        .data(libnames)
        .enter().append('g')
        .attr('class', 'category');

    var legendConfig = {
        rectWidth: 12,
        rectHeight: 12,
        xOffset: -10,
        yOffset: 30,
        xOffsetText: 20,
        yOffsetText: 10,
        lineHeight: 15
    };

    legendConfig.xOffsetText += legendConfig.xOffset;
    legendConfig.yOffsetText += legendConfig.yOffset;

    legend.append('rect')
        .attr('x', legendConfig.xOffset)
        .attr('y', function(d, i) {
            return legendConfig.yOffset + i * legendConfig.lineHeight;
        })
        .attr('height', legendConfig.rectHeight)
        .attr('width', legendConfig.rectWidth)
        .attr('fill', function(d) {
            return fillColor(d);
        })
        .attr('stroke', function(d) {
            return strokeColor(d);
        });

    legend.append('text')
        .attr('x', legendConfig.xOffsetText)
        .attr('y', function(d, i) {
            return legendConfig.yOffsetText + i * legendConfig.lineHeight;
        })
        .text(function(d) {
            return d;
        });

    // THIS IS THE END OF LEGEND

    document.getElementById("searchtable").addEventListener("click", function(event) {
        event.preventDefault();

        d3.select('.mygraph').remove();
        // d3.select('.minimapMain').remove();

        klay.layout({
            graph: searcher(document.getElementById("tablename").value.toUpperCase()
                // , $('input[name=modeselection]:checked').val()
                , document.querySelector('input[name="modeselection"]:checked').value, document.getElementById('hidework').checked),
            success: function(g) {

                graphCreation(g);
                // SVG to PNG file creation .... in progress
                //  var html = d3.select("svg")
                //        .attr("version", 1.1)
                //        .attr("xmlns", "http://www.w3.org/2000/svg")
                //        .node().parentNode.innerHTML;
                //  html.replace(/text-anchor="middle"/g, '"text-anchor="middle" font-family="Ubuntu, sans-serif" font-size="12"');
                //  var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);
                //  var img = '<img src="'+imgsrc+'">'; 
                // console.log(img)

            }
        });



    })

    // SVG related

    function graphCreation(sushil) {

        var container = svg.append("g")
            .attr('class', 'mygraph');

        container.append('defs').selectAll('marker')
            .data(['end'])
            .enter().append("marker")
            .attr("id", function(d) {
                return d;
            })
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 10)
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5 L10,0 L0, -5")
            .style("stroke", "#4679BD")
            .style("opacity", "0.9");

        var node = container.selectAll('.node')
            .data(sushil.children)
            .enter().append('g')
            .attr('class', 'node');


        var link = container.selectAll(".link")
            .data(sushil.edges)
            .enter().append("path")
            .attr("class", "link")
            .style("marker-end", "url(#end)")
            .attr("d", function(d) {
                var path = "";
                path += "M" + d.sourcePoint.x + " " + d.sourcePoint.y + " ";
                (d.bendPoints || []).forEach(function(bp, i) {
                    path += "L" + bp.x + " " + bp.y + " ";
                });
                path += "L" + d.targetPoint.x + " " + d.targetPoint.y + " ";

                return path;

            });


        var rect = node.append("rect")
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("height", function(d) {
                return d.height
            })
            .attr("width", function(d) {
                return d.width;
            })
            .attr('stroke', function(d) {
                return strokeColor(d.id.split(".")[0]);
            })
            .attr('fill', function(d) {
                return fillColor(d.id.split(".")[0]);
            });

        var text = node.append('text')
            .text(function(d) {
                return d.id;
            })
            .attr("dy", "1.5em")
            .attr("dx", function(d) {
                var ddy = 1.1
                let dy = ddy * d.id.length / 2.5;
                return dy + 'em';
            })
            // .attr("font-family", "sans-serif")
            // .attr("font-size", "12px")
            //  .attr("fill", "black")
        ;

        node.attr('transform', function(d) {
            return 'translate(' + d.x + ',' + d.y + ')';
        });

        text.attr('text-anchor', 'middle');

        // **********************************
        // Zooming Capability Start
        // **********************************
        let zoom = d3.zoom().on("zoom", function() {
                let transform = d3.zoomTransform(this);
                svg.select("g.mygraph").attr("transform", "translate(" + transform.x + "," + transform.y + ") scale(" + transform.k + ")");
            })
            .scaleExtent([0.05, 1]);

        d3.select("svg").call(zoom)

        // Doing the initial zoom thingy
        function transform() {
            let graphWidth = container.node().getBBox().width + 120;
            let graphHeight = container.node().getBBox().height + 200;
            let width = parseInt(svg.style("width").replace(/px/, ""));
            let height = parseInt(svg.style("height").replace(/px/, ""));
            let zoomScale = Math.min(width / graphWidth, height / graphHeight, 0.8)
            let translate = [(width / 2) - ((graphWidth * zoomScale) / 2), (height / 2) - ((graphHeight * zoomScale) / 2)];

            return d3.zoomIdentity
                .translate(translate[0], translate[1])
                .scale(zoomScale)

        }
        d3.select("svg").call(zoom.transform, transform);

        // **********************************
        // Zooming Capability End
        // **********************************

    }


})
