async function checkServer(url,elementId){

    try{
        const response=await fetch(url,{method:'HEAD',mode:'no-cors',cache:'no-store',targetAddressSpace:'local'});
            document.getElementById(elementId).style.visibility="visible";
    }catch(error){
         console.log(`URL ${url} not accesible`)   
    }
}
checkServer('http://server','conditional-site')