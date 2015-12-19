console.log("Literary Structure Analysis");






//-----MARGINS AND PLOT VARIABLES-----//
var margin = {t:20,r:20,b:20,l:20};
var width = document.getElementById('plot').clientWidth - margin.r - margin.l,
    height = document.getElementById('plot').clientHeight - margin.t - margin.b;

var plot = d3.select('#plot')
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','plottyA')
    .attr('transform','translate('+margin.l+','+margin.t+')');

// var plot1 = d3.select('#plot')
//     .append('svg')
//     .attr('width',width+margin.r+margin.l)
//     .attr('height',height + margin.t + margin.b)
//     .append('g')
//     .attr('class','plotty1')
//     .attr('transform','translate('+margin.l+','+margin.t+')');

var plot2 = d3.select('#plot2')
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','plotty2')
    .attr('transform','translate('+margin.l+','+margin.t+')');



//-----SCALE VARIABLES-----//
var scaleX = d3.scale.linear().range([0,height]);



//----QUEUE-----//
queue()
    //edited text to be ch 1-2 only; full text is 'data/alice_wonderland_carroll.txt'
    .defer(d3.text,'data/alice_wonderland_carroll12.txt')
    .defer(d3.text,'data/alice_wonderland_carroll.txt')
    .await(dataLoaded)
    


function dataLoaded(error, wonderland, fullwonderland){

   
    //-----button functionality-----//
    //switch between chapters when buttons are clicked
    var book;
    var chapter_select;

    $('button').on('click', function(){
                            $('button').removeClass('selected');
                            $(this).addClass('selected');
    })

    d3.selectAll('.btn').on('click', function(){

                

                var type = d3.select(this).attr('id');

                chapter_select = fullwonderland.split(/CHAPTER /gmi);
                chapter_select.shift();
                
                if(type=='Wonderland1') {
                        
                    book = chapter_select[0];
                    //console.log(book);
                        
                } else if (type == 'Wonderland2') {

                    book = chapter_select[1];
                    //console.log(book);

                } else if (type == 'Wonderland3') {

                    book = chapter_select[2];
                    //console.log(book);

                } else if (type == 'Wonderland4') {

                    book = chapter_select[3];
                    //console.log(book);

                } else if (type == 'Wonderland5') {

                    book = chapter_select[4];
                    //console.log(book);

                } else if (type == 'Wonderland6') {

                    book = chapter_select[5];
                    //console.log(book);

                } else if (type == 'Wonderland7') {

                    book = chapter_select[6];
                    //console.log(book);

                } else if (type == 'Wonderland8') {

                    book = chapter_select[7];
                    //console.log(book);

                } else if (type == 'Wonderland9') {

                    book = chapter_select[8];
                    //console.log(book);

                } else if (type == 'Wonderland10') {

                    book = chapter_select[9];
                    //console.log(book);

                } else if (type == 'Wonderland11') {

                    book = chapter_select[10];
                    //console.log(book);

                } else if (type == 'Wonderland12') {

                    book = chapter_select[11];
                    //console.log(book);

                }else {

                    book = chapter_select[0];
                    //console.log(book);

                }
    });

    
    //buttons select which chapter to anaylze, spits out unedited chapter
    //-----end chapter button functionality----//




    //------FREQ CHART-----//

    //jQuery button search
    $('#search_by').submit(function(e){
        e.preventDefault();
        search_val = $( "input:first" ).val();

        if(book==null) {
            alert("Please select a chapter button.");
        }

        searchBy(book, search_val)
        //console.log(e, search_val);

    })

    //jQuery button function with draw
    function searchBy(all_words, chosen_value) {
        //console.log(all_words);
        //console.log(wonderland);

        // 1. Set up array of just words
        var allWords = all_words.replace(/[^\w\s]|_/gi, "")
                                .replace(/\s+/gi, " ")
                                .split(' ');
        //console.log(allWords.length); 

    
        // 2. Set domain as length of array of words
        scaleX.domain([0, allWords.length]);

    
        // 3. plot start line, stop line, and ticker tape
        plot.append('line')
        .attr('class', 'start-end')
        .attr('x1', (-6))
        .attr('y1', scaleX(0))
        .attr('x2', width+6)
        .attr('y2', scaleX(0))

        plot.append('line')
        .attr('class', 'start-end')
        .attr('x1', (-6))
        .attr('y1', scaleX(allWords.length))
        .attr('x2', width+6)
        .attr('y2', scaleX(allWords.length))

        plot.append('rect')
        .attr('class', 'shadow')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
 
        
        //4. draw line if match occurs
        for (var i=0; i < allWords.length; i++) {  

            if (allWords[i].toLowerCase() == chosen_value.toLowerCase()) {
        
                //console.log("MATCH @ " + i + " index")
            
                plot.append('line')
                    .attr('class', 'data-line')
                    .attr('x1', 0)
                    .attr('y1', scaleX(i))
                    .attr('x2', width)
                    .attr('y2', scaleX(i))
                    .call(attachTooltip1);   
            }
        }


        //-----DATA ORGANIZATION for NODE-TREE MAP -----//

    
        //----ARRAY OF OBJECTS-----//
    
        //console.log(book);
        
        var book_edit = book    .replace(/[',"*();:]/gm, "")
                                .replace(/--/gm, " ")
                                .replace(/\s(?=\S)/gm, ' ')
                                .replace(/\s{3,}/gm, "\n")
                                .replace(/-/gm, ' ');
        //console.log(book_edit); //formatted with single spaces between words, only end punctuation, \n between paragraphs

        var spaceswords = book_edit.split(/\b/gmi);
                                    //.splice(0,0,"CHAPTER");
        spaceswords.unshift('CHAPTER', ' ');
        //console.log(spaceswords); //unshift gives you array new length

        //for-loop array placeholders
        concat_array = [];
        data_array = [];

        //starting values for counting variables
        var word_count = 1, 
            sent_count = 1, 
            para_count = 1 

        //find out which button is pressed
        var get_btn = document.getElementsByClassName('selected')[0].innerHTML;
            //console.log(get_btn);
            

        //12-17 more tests to see why if/else ifs aren't running
        //for-loop: make object with word, sentence, and paragrpah counters
        for (i = 0; i<spaceswords.length; i++) {

           //console.log(spaceswords[i]);
           //console.log(spaceswords[i].match(/\w/im));

            if (spaceswords[i].match(/\w/im) != null ) {

                //make new object to hold each character & its order attributes
                data_object = { string_word: spaceswords[i],
                                word: "Word " + word_count,
                                sentence: "Sentence " + sent_count,
                                paragraph: "Paragraph " + para_count,
                                chapter: get_btn,
                                booktitle: "Alice in Wonderland",
                                book_author: "Lewis Carroll"
                }

                    //add data_object to data array
                    data_array = data_array.concat(data_object);
                    

                //increase word count
                word_count++;

            };

            if (spaceswords[i].match(/[.!?]/) != null ) {

                //increase sentence count
                sent_count++,
                word_count = 1;

            };

            if (spaceswords[i].match(/[\f\n\r\t\v]/gmi) != null ) {

                //increase paragraph
                para_count++,
                word_count = 1,
                sent_count =1;

            };


        } console.log(data_array); //end for loop




        // ---------- NEST THE DATA -------------------//

        var nested_data = d3.nest()
                .key(function(d) { return d.chapter; })
                .key(function(d) { return d.paragraph; })
                .key(function(d) { return d.sentence; })
                .entries(data_array);

        console.log(nested_data);

        //---------- Radial Reingold–Tilford Tree --------------//
        //-------- http://bl.ocks.org/mbostock/4063550 ---------//

        var diameter = 800;

        var tree = d3.layout.tree()
            .size([360, diameter / 2 - 120])
            .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

        //ISSUE: diagonal not recognized
        var diagonal = d3.svg.g.diagonal.radial()
            .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

        //global variable
        //      var plot2 = d3.select('#plot2')
        //     .append('svg')
        //     .attr('width',width+margin.r+margin.l)
        //     .attr('height',height + margin.t + margin.b)
        //     .append('g')
        //     .attr('class','plotty2')
        //     .attr('transform','translate('+margin.l+','+margin.t+')');

        //edited global variable
        var plot_svg = d3.select("#plot2")
            .append("svg")
                .attr("width", diameter)
                .attr("height", diameter - 150)
            .append("g")
                .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")")
                .attr('class', 'tree circlenodes');

        d3.json(data_array, function(error, root) {
          if (error) throw error;

          var nodes = tree.nodes(root),
              links = tree.links(nodes);

          var link = svg.selectAll(".link")
              .data(links)
            .enter().append("path")
              .attr("class", "link")
              .attr("d", diagonal);

          var node = svg.selectAll(".node")
              .data(nodes)
            .enter().append("g")
              .attr("class", "node")
              .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

          node.append("circle")
              .attr("r", 4);

          node.append("text")
              .attr("dy", ".31em")
              .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
              .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
              .text(function(d) { return d.string_word; });
        });

        d3.select(self.frameElement).style("height", diameter - 150 + "px");


    }//end SearchBy

}//end dataLoaded



//---------- ATTACH TOOLTIP --------------//


function attachTooltip1(selection){
            selection.on('mouseenter',function(d){
            var tooltip = d3.select('#tt1');
        
            tooltip
                .transition()
                .duration(100)
                .style('opacity',1);

            console.log(d);
            
            //ISSUE: data from tree map not attached to line
            tooltip.select('#chap-tt').html("insert #");
            tooltip.select('#para-tt').html("insert #");
            tooltip.select('#sent-tt').html("insert #");
            tooltip.select('#words-tt').html("insert string");
        })
            

        .on('mousemove',function(){
            var xy = d3.mouse(plot.node());
        
            var tooltip = d3.select('#tt1');
        
            tooltip
                .style('left',xy[0]+15+'px')
                .style('top',(xy[1]+15)+'px');
        })

        .on('mouseleave',function(){
            var tooltip = d3.select('#tt1')
                .transition()
                .duration(500)
                .style('opacity',0);
        })
}

// function attachTooltip2(selection){
//             selection.on('mouseenter',function(d){
//             var tooltip = d3.select('#tt2');
        
//             tooltip
//                 .transition()
//                 .duration(100)
//                 .style('opacity',1);

//             console.log(d);
            
//             tooltip.select('#chap-tt2').html(d.item);
//             tooltip.select('#para-tt2').html(d.year);
//             tooltip.select('#sent-tt2').html(d.value);
//             tooltip.select('#words-tt2').html(d.value);
            


//         .on('mousemove',function(){
//             var xy = d3.mouse(canvas.node());
        
//             var tooltip = d3.select('.custom-tooltip');
        
//             tooltip
//                 .style('left',xy[0]+15+'px')
//                 .style('top',(xy[1]+15)+'px');
//         })

//         .on('mouseleave',function(){
//             var tooltip = d3.select('#tt2')
//                 .transition()
//                 .duration(500)
//                 .style('opacity',0);
//         })
// }



//-------------PAST ATTEMPTS------------//

// for (i = 0; i<spaceswords.length; i++) {

//     //previous_chap_count = chap_count;

//     //starting values for order/counting
//     if (i = 0) {
//         var word_count = 0, 
//         sent_count = 1, 
//         para_count = 1, 
//         chap_count = 1 
//     }

//     //book change
//         if (book==wonderland) {
//             var book_name = "Alice in Wonderland",
//             author = "Lewis Carroll"
//         } 
//         if (book==lookingGlass) {
//             var book_name = "Through the Looking Glass",
//             author = "Lewis Carroll"
//         }

//     //word increase 
//         word_count++

//     //sentence change, word reset
//     if (spaceswords[i].match(/\s/gmi)>=1) {
//         sent_count++;
//         word_count = 1;
//     }
    
//     //paragraph change
//     if (spaceswords[i]==/[\f\n\r\t\v​]/gmi) {
            
//     }

//     //variable to decide to make object
//     is_it_word = spaceswords[i].match(/\w+/gmi)
//     //console.log(is_it_word);

//     if (is_it_word != null) {

        

//         //chapter change
//         if (spaceswords[i]=="CHAPTER") {
//             chap_count++;
//             para_count = 1;
//         }

        // make new object to hold each character & its order attributes
        // data_object = { string_word: spaceswords[i],
        //                 word: "Word " + word_count,
        //                 sentence: "Sentence " + sent_count,
        //                 paragraph: "Paragraph " + para_count,
        //                 chapter: "Chapter " + chap_count,
        //                 booktitle: book_name,
        //                 book_author: author
        // }
    
        // //add data_object to data array
        // data_array = data_array.concat(data_object);
        // console.log(data_array);

        
        
//         // if ( characters[i-1] == /[.?!]/) { //sentence change by punctuation
//         //     sent_count++,
//         //     word_count = 1 };
//         // if ( characters[i-1] == /\n/ ) { //paragraph change by repeated line break
//         //     para_count++,
//         //     sent_count = 1,
//         //     word_count = 1};
//     }
    
    
    
//     //Cumulative Array to know when "CHAPTER" occurs
//     //cumulat_string = concat_array.concat(characters[(i-1)])
//     //console.log(concat_array); //compounds each character into a single array
//     //console.log(cumulat_string);
    
//     // chap_count = cumulat_string.match(/CHAPTER/g).length() //counts how many matches of "CHAPTER"
    
    
//     // if ( chap_count == null) { //includes first characters as chap 1
//     //     chap_count = 1 } 
//     // else if ( chap_count > previous_chap_count ) { //resets if chapter count increased between loops
//     //     para_count = 1,
//     //     sent_count = 1,
//     //     word_count = 1,
//     //     char_count = 1 } 
//     // else {

//     //     }
    

// }

//console.log(data_array);


//console.log(book);
//console.log(name);

//data --> 102 element array with all item, year and value
//creates objects with objects within grouped by date of flight
// var nestedData = d3.nest()
//     .key(function(d){
//         //return d.year
//         return d.item
//     })
//     .entries(data)

// console.log(nestedData);


// nestedData.forEach(function(t){
    
//     console.log(t.key);
   
      
//     plot.append('path')
//         .attr('class', function(){
//             if(t.key=='Tea'){
//                 return 'data-line tea-data-line'
//             } else {
//                 return 'data-line coffee-data-line'
//             }
//         })
//         .datum(t.values)
//         .attr('d', line)

//     plot.selectAll('d')
//         .data(t.values)
//         .enter()
//         .append('circle')
//         .attr('class',function(){
//             if(t.key=='Tea'){
//                 return 'data-point tea-data-point'
//             } else {
//                 return 'data-point coffee-data-point'
//             }
//         })
//         .attr('r',3)
//         .attr('cx', function(d){return scaleX(d.year);})
//         .attr('cy', function(d){return scaleY(d.value);})
//         .call(attachTooltip) 
    


    /*plot.selectAll('drink-line')
    .data(data)
    .enter()
    .append('circle')
    .attr('class','drink-line')
    .attr('cx',function(d){return scaleX(d.year)})
    .attr('cy',function(d){return scaleY(d.value)})
    .attr('r',4)
    .style('fill-opacity',.6);*/

    /*var plotLine = d3.selectAll('path') //yields a selection of 0 <path> elements
        .data(nestedData) //joins to an array of two objects
        .enter()
        .append('path') //creates two new <path> elements as the enter set
        .attr('class', function(input){return input.key}) //each element will have class of either "coffee" or "tea"

    plotLine
        .attr('d', function(item){
            return line(item);
        })
        .attr('stroke-width', '2px')
        .attr('stroke', 'blue');

    /*values is the way to find the array nested in the object identified by key
    t.averageFare = d3.mean(t.values, function(flight) {
            return flight.price
    })

    console.log('avg fare for '+t.key+ ' is '+t.averageFare);*/


/*//SORT nestedData

nestedData.sort(function(a,b){
    return b.date-a.date;
})*/




//Do the easy stuff first
/*plot.selectAll('flight')
    .data(data)
    .enter()
    .append('circle')
    .attr('class','flight')
    .attr('cx',function(d){return scaleX(d.year)})
    .attr('cy',function(d){return scaleY(d.value)})
    .attr('r',4)
    .style('fill-opacity',.6);*/

/*var timeSeries = 
    d3.selectAll('path') //yields a selection of 0 <path> elements
    .data(data) //joins to an array of two objects
    .enter()
    .append('path') //creates two new <path> elements as the enter set
    .attr('class', function(item){return item.key}) //each element will have class of either "coffee" or "tea"*/



// function attachTooltip(selection){
//     selection
//         .on('mouseenter',function(d){
//             var tooltip = d3.select('.custom-tooltip');
        
//             tooltip
//                 .transition()
//                 .duration(100)
//                 .style('opacity',1);

//             tooltip.select('#item').html(d.item);
//             tooltip.select('#year').html(d.year);
//             tooltip.select('#value').html(d.value);
//         })
//         .on('mousemove',function(){
//             var xy = d3.mouse(canvas.node());
        
//             var tooltip = d3.select('.custom-tooltip');
        
//             tooltip
//                 .style('left',xy[0]+15+'px')
//                 .style('top',(xy[1]+15)+'px');
//         })
//         .on('mouseleave',function(){
//             var tooltip = d3.select('.custom-tooltip')
//                 .transition()
//                 .duration(500)
//                 .style('opacity',0);
//         })
// }



//NOTWORKING CODE
// // 1. BOOK -- String
//     //removed asterisk picures, then remove formatting so all paragraphs have one line break
//     var formattedWholeBook = wonderland.replace(/\*+/g,"")
//                                     .replace(/\s{2,}/gm, "\n")
                                 
//     console.log(formattedWholeBook);


//     // 2. CHAPTERS -- Array of 12 chapters
//     var chapters = formattedWholeBook.split(/chapter.+\.\s/gi);
//     chapters.shift();
//     console.log(chapters);


//     // 3. PARAGRAPHS -- Array of 764 paragraphs
//     var paragraphs = []; // all 764 paragraphs in one array
//     //var paragraphs_o = {};
//     for (i=0; i < chapters.length; i++) {
//         //paragraphs_o = {[{[764]}]};

//         //console.log(chapters[i]);
//         var chapters_n = chapters[i].replace(/[\f\n\r\t\v​\u00A0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004​\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​\u2028\u2029​\u202f\u205f​\u3000]{3,}/gm, "NNN\n");
//         //console.log(chapters_n);
//         var chapters_nows = chapters_n.replace(/\s{2,}/gm, "");
//         //console.log(chapters_nows);
//         var chapters_nows2 = chapters_nows.replace(/N{4,}\n/, "NNN\n");
//         //console.log(chapters_nows2);
//         var chapter1_split = chapters_nows2.split("NNN\n");
//         console.log(chapter1_split);
//         var popped_p = chapter1_split.pop();
//         //console.log(chapter1_split);
//         paragraphs = paragraphs.concat(chapter1_split);

//         //paragraphs_o.key = "Chapter "+(i+1)

//     }

//     console.log(paragraphs);

//     // 4. SENTENCES -- 


//     // SET UP OBJECT TO HOLD

//     book_A = {};
//     //book_A.name = "Alice in Wonderland";
//     book_A.book = "Alice in Wonderland"
//     //book_A.author = "Lewis Carroll"
//     book_A.text = formattedWholeBook; //this is a string of the whole book
//     book_A.chapters = {};
//     //book_A.value = formatted.length;

//     //console.log(book_A);


//     //-----MAKING CHAPTER LEVEL OF OBJECT
//     //split by "chapter ??? until next period"


//     // var chapters_n = chapters[0].replace(/[\f\n\r\t\v​\u00A0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004​\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​\u2028\u2029​\u202f\u205f​\u3000]{3,}/gm, "NNN\n");
//     // var chapters_nows = chapters_n.replace(/\s{2,}/gm, "");
//     // var chapters_nows2 = chapters_nows.replace(/N{4,}\n/, "NNN\n");
//     // var chapter1_split = chapters_nows2.split("NNN\n");
//     // var paragraphs = chapter1_split.pop();


//     //console.log(paragraphs_o);

//     //console.log(chapters_n);
//     // console.log(chapters_nows);
//     // console.log(chapters_nows2);
//     // console.log(chapter1_split);
//     //console.log(paragraphs);



//     //assign each chapter-text from array to object array
//     //book_A.content.key = "Chapter";
//     //book_A.book.text = chapters;
//     //book_A.book.chapter = [];

//     book_A.chapters.book = "Alice in Wonderland";

//     for (i = 0; i < chapters.length; i++) { 
    
//         book_A.chapters[i] = {book:"Alice in Wonderland", chapter:"Chapter "+(i+1), content: chapters[i]}
    
//     }   

//     //console.log(book_A);

//     //returns chapter 1
//     //console.log(book_A.chapters[0].content);



//     //-----MAKING PARAGRAPH LEVEL OF OBJECT

//     var paragraphs = chapters[0].replace(/.\n./gi,'. .')
//     //console.log(paragraphs);

//     //console.log(chapters);
//     var sentences = [];

//     for( i = 0; i < chapters.length; i++) {
//         var split_sent = chapters[i].split(/[.!?]|[.']|[?']|[!']/g);
//         //console.log(split_sent);
//         //paragraphs.push(split_para);
//     } 
//     //     chapters.forEach( function (p){ 
//     //     //console.log(p)
//     //     var splitted = p.split(/\↵+/g)

//     //     })
//     // console.log(paragraphs);

//     //split whole text into one "return" for each paragraph
//     //var paragraph_fix = wonderland.replace(/\↵+/gi, '↵');
//     //console.log (paragraph_fix);


//     //make array with each chapter as a separate element
//     var chapter_book = wonderland.split(/chapter/gi)
//     chapter_book.shift();

//     //--prints 12 chapters w/ punctuation
//     //console.log(chapter_book);


//     // var nest = d3.nest()
//     //             .key(function(b) {
//     //                 var chapters = b.split(/chapter/gi)
//     //                                 .shift();

//     //                 return b.chapters
//     //             })
//     //             .entries(wonderland)
//     //             .key(function(c) {

//     //             })
//     //             .key(function(p) {

//     //             })
//     //             .key(function(s) {

//     //             })

//     //console.log(nest);



//     //--- Nested Data attempt 2 ------------------------//
