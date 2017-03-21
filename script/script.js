//
//
//  Literary Structure Analysis
//  Sunburst Chart of Alice's Adventures in Wonderland
//  Patrick J. O'Donnel
//  example based partially on https://bl.ocks.org/mbostock/4063423
//
//



console.log("Literary Structure Analysis");



//
//
//  MARGINS AND PLOT VARIABLES
//
//



var margin = {t:24,r:24,b:24,l:24};
var width = document.getElementById('canvas').clientWidth - margin.r - margin.l,
    height = document.getElementById('canvas').clientHeight - margin.t - margin.b;

var radius = Math.min(width, height) / 2,
    color = d3.scale.category20c();

var x = d3.scale.linear()
    .range([0, 2 * Math.PI]);

var y = d3.scale.sqrt()
    .range([0, radius]);

var svg = d3.select('#canvas')
    .append('svg')
    .attr('class', 'plot')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr("transform", "translate(" + width / 2 + "," + height * .52 + ")");

var partition = d3.layout.partition()
    .sort(null)
    // .size([2 * Math.PI, radius * radius])
    .value(function(d) { return 1; });

var arc = d3.svg.arc()
    // .startAngle(function(d) { return d.x; })
    // .endAngle(function(d) { return d.x + d.dx; })
    // .innerRadius(function(d) { return Math.sqrt(d.y); })
    // .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

var formatNumber = d3.format(",d");
var node;


//
//
//  QUEUE, DATA LOADED, and PLOT GRAPH
//
//



queue()
    //.defer(d3.text,'data/alice_wonderland_carroll12.txt')
    .defer(d3.text,'data/alice_wonderland_carroll.txt')
    .await(dataLoaded)
    


function dataLoaded(error, raw){

    if (error) throw error;
    //Book prints in whole, under variable "raw"
    //console.log(raw);

    var whole_book = {  name: "whole_book",
                        title: "Alice's Adventures in Wonderland",
                        children_are: "Chapters",
                        children: split_into_chapters(raw) };

    console.log(whole_book);

    node = whole_book;

    //console.log(JSON.stringify(whole_book));

    plot_graph(whole_book);

} // --end of dataloaded

function plot_graph(wb) {


    var g = svg.selectAll("g")
        //.datum(wb).selectAll("path")
                  .data(partition.nodes(node))
                .enter().append("g")

    var path = g.append("path")
                  .attr("class", "paths")
                  //.attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
                  .attr("d", arc)
                  .attr("opacity", .45)
                  //.style("stroke", "#fff")
                  .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
                  .on("click", click)
                  .each(stash)

    
    var text = g.append('text')
                .attr('class', 'labels1 labels')
                .attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
                .attr("x", function(d) { return y(d.y); })
                .attr("dx", "4") // margin
                .attr("dy", ".35em") // vertical-align
                .text(function(d) { if (d.depth == 0 )
                                            { return d.title; }
                                        else if (d.depth == 1)
                                            { return "Ch " + d.no + ": " + d.title; }
                                        // else if (d.depth == 2) { return "paragraph " + d.no; } 
                });

    

    d3.selectAll("input").on("change", function change() {
        var value = this.value === "glyph"
            ? function() { return 1; }
            : function(d) { return d.size; };

        console.log('changed');

        path
            .data(partition.value(value).nodes)
          .transition()
            .duration(1500)
            .attrTween("d", arcTweenData);

    });

    function click(d) {
        node = d;

        text.transition().attr("opacity", 0);

        path.transition()
          .duration(1000)
          .attrTween("d", arcTweenZoom(d))
          .each("end", function(e, i) {
          // check if the animated element's data e lies within the visible angle span given in d
              if (e.x >= d.x && e.x < (d.x + d.dx)) {
                // get a selection of the associated text element
                var arcText = d3.select(this.parentNode).select("text");
                // fade in the text element and recalculate positions
                arcText.transition().duration(750)
                  .attr("opacity", .45)
                  .attr("transform", function() { return "rotate(" + computeTextRotation(e) + ")" })
                  .attr("x", function(d) { return y(d.y); });
              }
          });
    };

    var alice = d3.selectAll(".paths")
                    .filter(function(d) { //console.log(d);
                        if (d.depth >= 3 && /alice/i.test(d.sentence) ) { return d }
                    })
                    .attr('class', 'alice red')
                    .attr("opacity", 1)
                    .style('fill', "rgb(255,0,0)");

} //--end of plot graph

d3.select(self.frameElement).style("height", height + "px");

//
//
//  ARC DRAWING FUNCTIONS
//
//


function computeTextRotation(d) {
  return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
}

// Stash the old values for transition.
function stash(d) {
  d.x0 = d.x;
  d.dx0 = d.dx;
}

// Interpolate the arcs in data space.
// When switching data: interpolate the arcs in data space.
function arcTweenData(a, i) {
  var oi = d3.interpolate({x: a.x0, dx: a.dx0}, a);
  function tween(t) {
    var b = oi(t);
    a.x0 = b.x;
    a.dx0 = b.dx;
    return arc(b);
  }
  if (i == 0) {
   // If we are on the first arc, adjust the x domain to match the root node
   // at the current zoom level. (We only need to do this once.)
    var xd = d3.interpolate(x.domain(), [node.x, node.x + node.dx]);
    return function(t) {
      x.domain(xd(t));
      return tween(t);
    };
  } else {
    return tween;
  }
}

// When zooming: interpolate the scales.
function arcTweenZoom(d) {
  var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
      yd = d3.interpolate(y.domain(), [d.y, 1]),
      yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
  return function(d, i) {
    return i
        ? function(t) { return arc(d); }
        : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
  };
}




//
//
//  STRING SPLIT FUNCTIONS
//
//


    //function takes all text and splits into chapters
    function split_into_chapters(all) {

        var regEx = new RegExp('CHAPTER '+'[A-Z]*'+'\. '); //split by word 'CHAPTER' then roman numerals and period
        var chapters_array = all.split(regEx); 
        chapters_array.shift(); // remove first thing in array because its blank

        var chapter_count = 0;
        var chapter_array = [];
        chapters_array.forEach( function (d) { 
            chapter_count++; 
            return chapter_array.push( {name: "Chapter "+chapter_count, 
                                        title: extract_chapter_title(d), 
                                        children_are: "Paragraphs", 
                                        no: chapter_count, 
                                        children: split_into_paragraphs(d) }) 
        });
        
        //console.log(chapter_array);

        return chapter_array; 
    } //--end of split chapters



    function extract_chapter_title(chapter){

        var first_line = chapter.split('\n')[0];
        //console.log(first_line);

        return first_line;
    } //--end of extract ch title



    function split_into_paragraphs(chapter){

        var paragraph_edit = chapter    .replace(/[*]/gm, "")
                                        //.replace(/--/gm, " ")
                                        .replace(/\s(?=\S)/gm, ' ')
                                        .replace(/\s{3,}/gm, "\n")
                                        .replace(/-/gm, ' ')
                                        .replace(/^ /, '');

        var paragraph_array = paragraph_edit.split("\n");

        paragraph_array.shift();
        paragraph_array.pop();

        var paragraph_count = 0;
        var paragraph_array_of_objects = [];

        paragraph_array.forEach( function(f) {
            paragraph_count++;
            return  paragraph_array_of_objects.push( {  name: "Paragraph "+paragraph_count,
                                                        title: "Paragraph "+paragraph_count,
                                                        children_are: "Sentences",
                                                        no: paragraph_count,
                                                        children: split_into_sentences(f) })
         })

        return paragraph_array_of_objects;
    } //--end of split into paragraphs
   


        function split_into_sentences(paragraph) {

            //console.log(paragraph);

            // var sentences_formatted = paragraph.replace(/([.?!])(\s|\)|["'])(?!( said)|( he said))/g, "$1|").split("|");
            var sentences_formatted = paragraph.replace(/([.?!])(\s|\)|["'])(?!( [a-z]))/g, "$1|").split("|");
            var sentences_cleaned = sentences_formatted.filter(entry => entry.trim() != '');
            //console.log(sentences_cleaned);

            var sentence_count = 0;
            var sentence_array_of_objects = [];

            sentences_cleaned.forEach( function(g) {
                sentence_count++;
                return sentence_array_of_objects.push({ name: "Sentence "+sentence_count,
                                                        children_are: "Words",
                                                        no: sentence_count,
                                                        sentence: g,
                                                        size: g.split(' ').length,
                                                        alice: g.indexOf("Alice") })
                                                        //children: split_into_words(g) 
            })

            return sentence_array_of_objects;
        } //--end of split into sentences
        


            function split_into_words(sentence) {

                //console.log(sentence);
                var words = sentence.replace(/[\.\,\/\#\!\$\%\^\&\*\;\:\{\}\=\-\_\`\~\(\)]/g,"").split(/\s(?=\S)/)
                //console.log(words);
                
                var word_count = 0;
                var word_array_of_objects = [];

                words.forEach( function(h) { 
                        word_array_of_objects.push( {   name: "Word "+word_count,
                                                        no: word_count,
                                                        alice: h.indexOf("Alice"),
                                                        word: h,
                                                        size: h.length })
                        
                })

                return word_array_of_objects;
            } //--end of split into words



        



