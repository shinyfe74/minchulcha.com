$(document).ready(function(){
    $.getJSON("contents/publications.json", function(data) {
        $.each(data, function(type, entries) {
            if (!Array.isArray(entries)) return; // 잘못된 데이터 구조 방지

            var $pubType = $("<h1/>").addClass("pub-type pl-2").text(type);
            var $section = $("<div/>").addClass("section pub-section mt-3").append($pubType);
            $("#main").append($section);

            var $ul = $("<ul/>").addClass("publication");
            $section.append($ul);

            $.each(entries, function(_, entry) {
                if (entry.Year) {
                    var $yearHeader = $("<h2/>").addClass("year-header pub-title mt-3").text("[" + entry.Year + "]");
                    $ul.append($yearHeader);
                }
                if (entry.Publication) {
                    $.each(entry.Publication, function(index, paper) {
                        var paperId = type.replace(/\s+/g, '_') + "_" + (entries.length - index);
                        var $item = $("<li/>").attr("id", paperId);
                        
                        if (paper.url) {
                            if (paper.materials) {
                                $("<h4/>").addClass("pub-title")
                                    .html(" <a href='" + paper.materials[0].url + "' target='_blank'>" + paper.title + "</a>  <a href='" + paper.url + "' target='_blank' class='pub_down'>[download]</a>")
                                    .appendTo($item);
                            } else {
                                $("<h4/>").addClass("pub-title")
                                    .html(paper.title + " <a href='" + paper.url + "' target='_blank' class='pub_down'>[paper]</a>")
                                    .appendTo($item);
                            }
                        } else {
                            $("<div/>").addClass("pub-title").text(paper.title).appendTo($item);
                        }

                        var authors = paper.authors.map(name => {
                            return name.includes("Min Chul Cha") ? `<span class='author'>${name}</span>` : name;
                        }).join(", ");
                        $("<div/>").addClass("authors").html(authors).appendTo($item);
                        
                        $("<span/>").addClass("venue").text(paper.venue + " ").appendTo($item);
                        $("<span/>").addClass("year").text("(" + paper.year + ") ").appendTo($item);
                        
                        if (paper.toappear) {
                            $("<span/>").addClass("toappear").text(paper.toappear).appendTo($item);
                        }
                        if (paper.award) {
                            $("<span/>").addClass("award").text(paper.award).appendTo($item);
                        }
                        
                        if (paper.materials) {
                            paper.materials.forEach(m => {
                                $("<span/>").addClass("material")
                                    .html(`| <a href='${m.url}' target='_blank' class='pub_down'>${m.type}</a> `)
                                    .appendTo($item);
                            });
                        }
                        
                        $ul.append($item);
                    });
                }
            });
        });

        // Handle URL hash scrolling
        if (window.location.hash) {
            var hash = window.location.hash.substring(1);
            var $target = $("#" + hash);
            if ($target.length) {
                $target.addClass("anchored");
                $(document).scrollTop($target.offset().top);
            }
        }
    });
});