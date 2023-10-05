const { google } = require("googleapis");

//regular function to find index within a row
function indexFinder(id){
    let index;
    //string registers to street name OR holiday OR placed
    index = 0;
    if(!isNaN(id)){
        index = 1;
    }else if (id.includes('arked')){
        index = 9;
    }else if (id === 'Unpaid' || id  === 'Paid'){
        index = 10;
    }else if (id.includes('/',id.indexOf('/')+1)){
        index = 8;
    }else{
        const flagDays = ['Labor Day', 'Memorial Day', 'July 4th', 'Veteran\'s Day', 'President\'s Day', 'Flag Day', '9/11'];
        flagDays.forEach((day) =>{
            if(id.includes(day)){
                index = 5;
            }
        });
        const streets = ['Arbury','Ct', 'Lane', 'Glen', 'Bluff', 'Ln','Ramble Rock','Seminole'];
        streets.forEach((st) =>{
            if(id.includes(st)){
                index = 2;
            }
        });
    }
    return index;
}
//----------------------------------------------\\

//RETREIVE is used to fetch the entire value data
async function retreive() {
    //Get metadata
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    //Create Client for Auth
    const client = await auth.getClient();
    
    //Instance of Google Sheets API
    const googleSheets = google.sheets({version : "v4", auth : client});
    const spreadsheetId =  "1YHgRjoXbKVGRnUEoan5JhUmTeho8r5EoOBNOS388pdg";
    range = "Sheet1";
    
   const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range,

    });
    return getRows.data.values;
}

//GET is used to trigger retreive function and process the value data
async function get(id){
    const values = await retreive();
    const len = values.length;
    // Get data via name
    const index = indexFinder(id);
    let idList = [];
    let signal = [];
    //there is some error in file where a last row after data is registering as undefined
    for (let i = 1; i <= len-1; i++ ){
        //idList.push(values[i][index]);
        if (values[i][index].includes(id)){
            signal.push(i);
            let data = [];
            for (let j = 0; j <= values[i].length-1; j++){
                data.push(values[i][j]);               
            }
            idList.push(data);
        }
        
    }
    //console.log(idList);
    return [idList,signal] ;
    
}

//update is the root function interacting with the google sheets to change
async function update(rnge,values,ind){
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    //Create Client for auth
    const client = await auth.getClient();
    
    //Instance of Google Sheets API
    const googleSheets = google.sheets({version : "v4", auth : client});
    const spreadsheetId =  "1YHgRjoXbKVGRnUEoan5JhUmTeho8r5EoOBNOS388pdg";
    const range = 'Sheet1!'+'A'+rnge+':K'+rnge;
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range,
        valueInputOption: "RAW",
        resource:{
            values
        },
    });
    const[output,trash] = await get(values[0][ind]);
    return output;
   
}

//change is used to update the value data : knowns are used to match the range- change is used to update
async function change(known, changed){
    let vertIndex;
    let [res2D,indexArr] = await get(known);
    try{
        if(indexArr[0].length > 1){
            return res2D;
        }else{
            vertIndex = indexArr[0];
        }
        const f = indexFinder(changed);
        res2D[0][f] = changed;
        return update(vertIndex+1, res2D, f);
    }catch(err){
        return "None found from identifier";
    }
    
    
}

function format(data){
    let str = '';
    let l = 0;
    data.forEach(i => {
        str+= "Name: " + i[0] +"\n";
        str+= "Address: " + i[1]+"\n";
        str+= "Street: " + i[2]+"\n";
        str+= "Neighborhood: " + i[3]+"\n";
        str+= "Flags: " + i[4]+"\n";
        str+= "Holiday Paid: " + i[5]+"\n"; 
        str+= "Holiday Expired: " + i[7]+"\n";
        str+= "Last Paid:" + i[8]+"\n";
        str+= "Marked:" + i[9]+"\n";
        str+= "PD:" + i[10] + "\n\n";
        //str+= "Index:"+ data2[l];
        //l++;
    });
    return str; 
}

module.exports = {indexFinder,retreive, get, update, change, format};




