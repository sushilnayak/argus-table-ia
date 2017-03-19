import Node from './components/tableNode';
import Graph from './components/tableGraph';
import * as d3 from 'd3';
import * as klay from 'klayjs';
// import {select as d3_select} from 'd3-selection'

d3.csv('/data/data.csv',function(d){

	let s=d.source.indexOf(".") !== -1 || d.source.length == 0 ? d.source : 'WORK.'.concat(d.source)
	let t=d.target.indexOf(".") !== -1 || d.target.length == 0 ? d.target : 'WORK.'.concat(d.target)
	
	return {
		source: s,
		target: t
	}

},function(error,data){

 let allTables=[]
 let browserWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
 let browserHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

 for(let d of data.filter(x=> x.source!=x.target && x.source.length>0 && x.target.length > 0)){
 	if(allTables.indexOf(d.source) == -1) allTables.push(d.source)
 	if(allTables.indexOf(d.target) == -1) allTables.push(d.target)
 }

 let nodes={}

 for(let t of allTables){
 	nodes[t]=new Node(t)
 }

 for(let d of data.filter(x=> x.source!=x.target && x.source.length>0 && x.target.length > 0)){
 	nodes[d.source].addChild(nodes[d.target])
 	nodes[d.target].addParent(nodes[d.source])
 }

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

function searcher(searchingNode,forward_reverse="forward",hidework=false){
    
    // let node_list=lodashArray.uniq( nodes[searchingNode].getAllParentNodes().concat( nodes[searchingNode].getAllChildrenNodes() )  )
    let node_list=nodes[searchingNode].getAllParentNodes().concat( nodes[searchingNode].getAllChildrenNodes() ).filter( onlyUnique );

    var graph = new Graph();
    for (var id of node_list ) {
        graph.addNode(nodes[id]);
    }

         if (hidework==true) graph.hideNodesContaining=["WORK.","WORKSPDS."]
    else if (hidework==false) graph.hideNodesContaining=[]

         if(forward_reverse=="forward") return graph.getForwardImpactAnalysisForKlay(searchingNode)
    else if(forward_reverse=="reverse") return graph.getReverseImpactAnalysisForKlay(searchingNode)
}


var svg = d3.select('#root').append('svg')
           .attr('height', browserHeight)
           .attr('width', browserWidth);


addEventListener("resize", function(event) {
     browserWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
     browserHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
     
     svg.attr('height', browserHeight)
      .attr('width', browserWidth);

});

document.getElementById("searchtable").addEventListener("click",function(event){
   event.preventDefault();

   d3.select('.mygraph').remove();
   // d3.select('.minimapMain').remove();

   klay.layout({
     graph: searcher( document.getElementById("tablename").value.toUpperCase()
     	            // , $('input[name=modeselection]:checked').val()
     	            , document.querySelector('input[name="modeselection"]:checked').value
     	            , document.getElementById('hidework').checked  ),
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

function graphCreation(sushil){

   var container = svg.append("g")
                      .attr('class', 'mygraph');

   container.append('defs').selectAll('marker')
            .data(['end'])
            .enter().append("marker")
            .attr("id", function (d) {
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
                       .attr("height", function (d) {
                           return d.height
                       })
                       .attr("width", function (d) {
                         // return d.id.split("|")[0].length*10;
                           return d.width;
                       })
                       .attr('stroke', function (d) {
                         var code=0;
                           // return strokeColor(code);
                           return "#95d12e"
                       })
                       .attr('fill', function (d) {
                         var code=0;
                           // return fillColor(d.group);
                           return "#b8e073";
                       })
                       ;

            var text = node.append('text')
                           .text(function (d) {
                               return d.id;
                           })
                           .attr("dy", "1.5em")
                           .attr("dx", function(d){
                               var ddy   = 1.1
                               let dy    = ddy * d.id.length/ 2.5 ;
                               return  dy + 'em';
                           })
                          // .attr("font-family", "sans-serif")
                          // .attr("font-size", "12px")
                          //  .attr("fill", "black")
                           ;

            node.attr('transform', function (d) {
                return 'translate(' + d.x + ',' + d.y + ')';
            });

            text.attr('text-anchor', 'middle');

            // **********************************
            // Zooming Capability Start
            // **********************************
            let zoom = d3.zoom().on("zoom", function () {
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
                        let zoomScale=Math.min(width / graphWidth, height / graphHeight, 0.8)
                        let translate = [(width / 2) - ((graphWidth * zoomScale) / 2), (height / 2) - ((graphHeight * zoomScale) / 2)];
                        
              return d3.zoomIdentity
                  .translate( translate[0],translate[1] )
                  .scale( zoomScale )
                  
            }
            d3.select("svg").call(zoom.transform, transform);
            
            // **********************************
            // Zooming Capability End
            // **********************************

        }


})