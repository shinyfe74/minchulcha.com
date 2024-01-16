
$(document).ready(function(){
    $.getJSON( "contents/project.json", function( data ) {
        $.each( data, function( type, projects ) {
            var $pjType = $("<h1/>").addClass("pj-type font-weight-bold").append(type);
            var $projectfilter = ["all","current", "vui"];
            var $filterline = $("<ul/>").addClass("list-inline mx-n3 mb-0 text-right").attr("id", type.replace(" ","")+"-flters");
            var $pjcontainer = $("<div/>").addClass("row").appendTo("#project_main");
            $("<div/>").addClass("col-lg-12 col-md-12 container section pj-section mt-3").append($pjType).appendTo($pjcontainer);

            //PJ filter TBD
            // $("<div/>").addClass("col-lg-6 col-md-12 text-lg-end align-self-center").append($filterline).appendTo($pjcontainer);

            // $.each($projectfilter, function(akey, filter){
            //     if (filter == "all")
            //         $("<li/>").addClass("mx-1 active").attr("data-filter", "*").append(filter).appendTo($filterline);
            //     else
            //         $("<li/>").addClass("mx-1").attr("data-filter", "." + filter).append(filter).appendTo($filterline);
            // });


            $("<ul/>").addClass("col-12 container " + type.replace(" ","")).appendTo($pjcontainer);

            $.each(projects, function(index, project){
                var projectId = type[0].replace(" ","") + (projects.length - index);
                var $anchor = $("<a/>").addClass("row").attr("name", projectId);
                var $container = $("<li/>").addClass("col-12 row mx-0 pb-4").attr("id", projectId);
                // var $imagecontainer = $("<a/>").addClass("col-md-4 col-sm-12 pl-0 pr-4 mt-2 mb-auto").attr(target)
                if (project.url)
                    if (type=='Project')
                        var $image = $("<img/>").addClass("col-md-4 col-sm-12 pl-2 pr-2 mt-2 mb-auto pj-img").attr("src", project.img).attr("onclick", "window.open('popup.html?type=img&url=" + project.url + "', '_blank', 'menubar=no')");
                        // var $image = $("<img/>").addClass("col-md-4 col-sm-12 pl-2 pr-2 mt-2 mb-auto pj-img").attr("src", project.img).attr("onclick", "window.open('popup.html', '_blank', 'menubar=yes')");
                    else
                        var $image = $("<img/>").addClass("col-md-4 col-sm-12 pl-2 pr-2 mt-2 mb-auto pj-img").attr("src", project.img).attr("onclick", "window.open('" + project.url + "', '_blank', 'menubar=no')");
                else
                    var $image = $("<img/>").addClass("col-md-4 col-sm-12 pl-2 pr-2 mt-2 mb-auto pj-img").attr("src", project.img).attr("onclick", "window.open('popup.html?type=img&url=" + project.img + "', '_blank', 'menubar=no')");            
                
                var $item = $("<div/>").addClass("col-md-8 col-sm-12 mt-2").attr("id", projectId);
                $anchor.appendTo($item);
                if (project.url != "")
                    $("<h4/>").addClass("pj-title").append("<a href='" + project.url + "'target='_blank'>" + project.title + "</a>").appendTo($item);
                else
                    $("<h4/>").addClass("pj-title").append(project.title).appendTo($item);
                $("<span/>").addClass("venue").append(project.venue + " ").appendTo($item);
                if (project.startyear && project.endyear)
                    $("<span/>").addClass("year").append("("+project.startyear + "~" + project.endyear + ")").appendTo($item);

                if (project.position)
                    $("<span/>").addClass("position").append(" | "+project.position).appendTo($item);
                
                if (project.startyear || project.endyear || project.position)
                    $("<br/>").appendTo($item);

                if (project.materials){
                    $.each(project.materials, function(mkey, mval){
                        if (mval.type == "video")
                            $("<span/>").addClass("material").append("<a href='popup.html?type=" + mval.type + "&url=" + mval.url + "'target='_blank'>" + mval.type + " </a> |").appendTo($item);
                        else
                            $("<span/>").addClass("material").append("<a href='" + mval.url + "'target='_blank'>" + mval.type + " </a>| ").appendTo($item);
                    });
                }
                if(project.methods.length > 0){
                    var $method = $("<div/>").addClass("methods").appendTo($item);
                    $("<span/>").append("<strong>Method: </strong>"+project.methods.join(" | ")).appendTo($method);
                };

                if (project.abstract)
                    $("<h4/>").addClass("text-justify pj-abstract").append("<strong>Abstract: </strong>"+project.abstract).appendTo($item);
                
        
                // var authors = [];
                // $.each(project.authors, function(akey, aval){
                //     if (aval == "Minchul Cha" || "Min Chul Cha"){
                //         authors.push("<span class='author'>" + aval + "</span>");
                //     } else {
                //         authors.push(aval);
                //     }
                // });
                // $("<div/>").addClass("authors").append(authors.join(", ")).appendTo($item);

                // if (project.toappear){
                //     $("<span/>").addClass("toappear").append(project.toappear).appendTo($item);
                // }
                // if (project.award){
                //     $("<span/>").addClass("award").append(project.award).appendTo($item);
                // }

                $container.append($image);
                $container.append($item);
                $("." + type.replace(" ","")).last().append($container);
            });
        });

        // process pound sign now.
        if(window.location.hash) {
            var hash = window.location.hash.substring(1); // Puts hash in variable, and removes the # character
            $("#" + hash)
                .addClass("anchored");
            console.log(hash, $("#" + hash).offset().top);
            $(document).scrollTop($("#" + hash).offset().top);
        }
    });



    // project isotope and filter
    var projectIsotope = $('.project-container').isotope({
        itemSelector: '.project-item',
        layoutMode: 'fitRows'
    });
    $('#project-flters li').on('click', function () {
        $("#project-flters li").removeClass('active');
        $(this).addClass('active');

        projectIsotope.isotope({filter: $(this).data('filter')});
    });
});


