var canvas = document.createElement('canvas'), // single off-screen canvas
    ctx = canvas.getContext('2d'),             // to render to
    pages = [],
    currentPage = 1,
    url = 'path/to/document.pdf';              // specify a valid url

PDFJS.getDocument(url).then(iterate);   // load PDF document


/* To avoid too many levels, which easily happen when using chained promises,
   the function is separated and just referenced in the first promise callback
*/

function iterate(pdf) {

    // init parsing of first page
    if (currentPage <= pdf.numPages) getPage();

    // main entry point/function for loop
    function getPage() {

        // when promise is returned do as usual
        pdf.getPage(currentPage).then(function(page) {

            var scale = 1.5;
            var viewport = page.getViewport(scale);

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            var renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };

            // now, tap into the returned promise from render:
            page.render(renderContext).then(function() {

                // store compressed image data in array
                pages.push(canvas.toDataURL());

                if (currentPage < pdf.numPages) {
                    currentPage++;
                    getPage();        // get next page
                }
                else {
                    done();
                    console.log('done');   
                            // call done() when all pages are parsed
                }
            });
        });
    }

}