async function checkServer(url,elementId){

    try{
        const response=await fetch(url,{method:'HEAD',mode:'no-cors',cache:'no-store',targetAddressSpace:'local'});
            document.getElementById(elementId).style.visibility="visible";
    }catch(error){
        if (error.message.includes('CORS policy')){
            document.getElementById(elementId).style.visibility="visible";
        }else{
            console.log(`URL ${url} not accesible`)   
        }
    }
}
checkServer('http://server','conditional-site')