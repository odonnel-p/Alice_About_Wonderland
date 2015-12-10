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
    .defer(d3.text,'data/alice_wonderland_carroll.txt')
    .defer(d3.text,'data/looking_glass_carroll.txt')
    .await(dataLoaded)
    


function dataLoaded(error, wonderland, lookingGlass){


   
    //-----button functionality-----//
    //switch between two datasets or books when button is clicked
    //var book = wonderland;
    var book;

    $('button').on('click', function(){
                            $('button').removeClass('selected');
                            $(this).addClass('selected');
                        })

    d3.selectAll('.btn').on('click', function(){

                

                var type = d3.select(this).attr('id');
                
                if(type=='Wonderland'){
                        //console.log("wonderland");
                        //return wonderland;
                        book = wonderland;
                        // $('button').on('click', function(){
                        //     $('button').removeClass('selected');
                        //     $(this).addClass('selected');
                        // })
                        
                }else{
                        //console.log('looking glass');
                        //return lookingGlass;
                        book = lookingGlass;
                        // $('button').on('click', function(){
                        //     $('button').removeClass('selected');
                        //     $(this).addClass('selected');
                        // })

                }
    });

    

    //-----end button functionality----//




    //------FREQ CHART-----//

    //jQuery button
    $('#search_by').submit(function(e){
        e.preventDefault();
        search_val = $( "input:first" ).val();

        searchBy(book, search_val)
        //console.log(e, search_val);
    })

    //jQuery button function with draw
    function searchBy(chosen_book, chosen_value){
        //console.log(search_val);
        //console.log(wonderland);

        // 1. Set up array of just words
        var No_Punct = chosen_book.replace(/[^\w\s]|_/gi, "")
                                    .replace(/\s+/gi, " ");
        var Just_Words = No_Punct.split(' ');
        //console.log(Just_Words); //array consists of 26000+ words

    
        // 2. Set domain as length of array of words
        scaleX.domain([0, Just_Words.length]);

    

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
        .attr('y1', scaleX(Just_Words.length))
        .attr('x2', width+6)
        .attr('y2', scaleX(Just_Words.length))

        plot.append('rect')
        .attr('class', 'shadow')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)   

        var indexic = 0;
        
        // 4. Draw chapter lines
        Just_Words.forEach(function(t){
            //console.log(t);

            if (t == 'CHAPTER') {
            //console.log("MATCH @ " + indexic + " index")

                plot.append('line')
                .attr('class', 'chapter-line')
                .attr('x1', -10)
                .attr('y1', scaleX(indexic))
                .attr('x2', -5)
                .attr('y2', scaleX(indexic))
                
            }

            indexic++;
        
        })
    
        indexic = 0;

        // 5. forEach drawing barcode if it matches query  
        Just_Words.forEach(function(t){
            //console.log(t);

            if (t == chosen_value) {
            //console.log("MATCH @ " + indexic + " index")

                plot.append('line')
                .attr('class', 'data-line')
                .attr('x1', 0)
                .attr('y1', scaleX(indexic))
                .attr('x2', width)
                .attr('y2', scaleX(indexic))
                
            }

            indexic++;
        
        })
    }




    
    //-----DATA ORGANIZATION for NODE-TREE MAP -----//

    //-----SET UP OBJECT TO HOLD DATA
    // var this_book = {key: "Alice in Wonderland",
    //                 content: wonderland
    //                 }
    // console.log(this_book);


    //----NESTED ARRAY
    //----Text split by (B)ook, (C)hapter, (P)aragraph, (S)entence, and (W)ord
    //----Access: B == formatted; C == chapters


    //-----MAKING "BOOK" LEVEL OF OBJECT
    
    //removed asterisk picures, then remove formatting so all paragraphs have one line break
    var formatted = wonderland.replace(/\*+/g,"")
                            //.replace(/\s{2,}/g, "\n")
    //console.log(formatted);

    

    // SET UP OBJECT TO HOLD

    book_A = {};
    //book_A.name = "Alice in Wonderland";
    book_A.book = "Alice in Wonderland"
    //book_A.author = "Lewis Carroll"
    book_A.text = formatted; //this is a string of the whole book
    book_A.chapters = {};
    //book_A.value = formatted.length;

    //console.log(book_A);


    //-----MAKING CHAPTER LEVEL OF OBJECT
    //split by "chapter ??? until next period"
    var chapters = formatted.split(/chapter.+\.\s/gi);
    //console.log(chapters)
    chapters.shift();
    
    // var chapters_n = chapters[0].replace(/[\f\n\r\t\v​\u00A0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004​\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​\u2028\u2029​\u202f\u205f​\u3000]{3,}/gm, "NNN\n");
    // var chapters_nows = chapters_n.replace(/\s{2,}/gm, "");
    // var chapters_nows2 = chapters_nows.replace(/N{4,}\n/, "NNN\n");
    // var chapter1_split = chapters_nows2.split("NNN\n");
    // var paragraphs = chapter1_split.pop();
    
    var paragraphs = []; // all paragraphs in one array
    var paragraphs_o = {};
    for (i=0; i < chapters.length; i++) {
        //console.log(chapters[i]);
        var chapters_n = chapters[i].replace(/[\f\n\r\t\v​\u00A0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004​\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​\u2028\u2029​\u202f\u205f​\u3000]{3,}/gm, "NNN\n");
        //console.log(chapters_n);
        var chapters_nows = chapters_n.replace(/\s{2,}/gm, "");
        //console.log(chapters_nows);
        var chapters_nows2 = chapters_nows.replace(/N{4,}\n/, "NNN\n");
        //console.log(chapters_nows2);
        var chapter1_split = chapters_nows2.split("NNN\n");
        //console.log(chapter1_split);
        var popped_p = chapter1_split.pop();
        //console.log(chapter1_split);
        paragraphs = paragraphs.concat(chapter1_split);

        paragraphs_o.key = "Chapter "+(i+1)


    }
    console.log(paragraphs);
    console.log(paragraphs_o);

    //console.log(chapters_n);
    // console.log(chapters_nows);
    // console.log(chapters_nows2);
    // console.log(chapter1_split);
    //console.log(paragraphs);

    

    //assign each chapter-text from array to object array
    //book_A.content.key = "Chapter";
    //book_A.book.text = chapters;
    //book_A.book.chapter = [];
    
    book_A.chapters.book = "Alice in Wonderland";

    for (i = 0; i < chapters.length; i++) { 
        
        book_A.chapters[i] = {book:"Alice in Wonderland", chapter:"Chapter "+(i+1), content: chapters[i]}
        
    }   

    //console.log(book_A);

    //returns chapter 1
    //console.log(book_A.chapters[0].content);



    //-----MAKING PARAGRAPH LEVEL OF OBJECT

    var paragraphs = chapters[0].replace(/.\n./gi,'. .')
    //console.log(paragraphs);
    
    //console.log(chapters);
    var sentences = [];
    
    for( i = 0; i < chapters.length; i++) {
        var split_sent = chapters[i].split(/[.!?]|[.']|[?']|[!']/g);
        //console.log(split_sent);
        //paragraphs.push(split_para);
    } 
    //     chapters.forEach( function (p){ 
    //     //console.log(p)
    //     var splitted = p.split(/\↵+/g)

    //     })
    // console.log(paragraphs);

    //split whole text into one "return" for each paragraph
    //var paragraph_fix = wonderland.replace(/\↵+/gi, '↵');
    //console.log (paragraph_fix);


    //make array with each chapter as a separate element
    var chapter_book = wonderland.split(/chapter/gi)
    chapter_book.shift();

    //--prints 12 chapters w/ punctuation
    //console.log(chapter_book);


    // var nest = d3.nest()
    //             .key(function(b) {
    //                 var chapters = b.split(/chapter/gi)
    //                                 .shift();

    //                 return b.chapters
    //             })
    //             .entries(wonderland)
    //             .key(function(c) {

    //             })
    //             .key(function(p) {

    //             })
    //             .key(function(s) {

    //             })

    //console.log(nest);



    //--- Nested Data attempt 2 ------------------------//
}



    



function draw(book){ }
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


