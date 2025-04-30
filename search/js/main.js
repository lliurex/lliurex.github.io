function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

function rss(){
    list_rss = ["https://portal.edu.gva.es/cvtic/va/category/inici/feed/","https://portal.edu.gva.es/lliurex/?feed=rss2"];
    for( x in list_rss){
        console.log(x);
        fetch("https://cors-anywhere.herokuapp.com/"+list_rss[x])
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            console.log(data);
            const items = data.querySelectorAll("item");
            let html = document.querySelector("#rss").innerHTML;
            items.forEach(el => {
                let stringscaped = escapeHtml(el.querySelector("description").childNodes[0].nodeValue);
            html += `
                <div class="row">
                    <a href="${el.querySelector("link").innerHTML}" title="${stringscaped}">${el.querySelector("title").innerHTML}</a>
    
                </div>
            `;
            document.querySelector("#rss").innerHTML = html;
            });
        });
    }
}
rss();
