async function checkServer(url,elementId){

    console.log("INICIANDO CHECk");
    try{
        console.log("CHEKING");
        const response=await fetch(url,{method:'HEAD',mode:'no-cors',cache:'no-store',targetAddressSpace:'local'});
            document.getElementById(elementId).style.visibility="visible";
    }catch(error){
        console.log("ERROR");
        console.log(error.message);
        if (error.message.includes('CORS policy')){
            console.log("CONTIENE CORS");
            document.getElementById(elementId).style.visibility="visible";
        }else{
            console.log("OTRO ERROR");
            console.log(`URL ${url} not accesible`)   
        }
    }
}
checkServer('http://server','conditional-site')