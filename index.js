const http=require("http");
const fs=require("fs");
var requests= require("requests")

const homeFile=fs.readFileSync("home.html", "utf-8");
const port = process.env.PORT

const replaceVal=((tempVal,orgVal)=>{
    let temprature= tempVal.replace("{%tempval%}",orgVal.main.temp);
    temprature= temprature.replace("{%tempmin%}",orgVal.main.temp_min);
    temprature= temprature.replace("{%tempmax%}",orgVal.main.temp_max);
    temprature= temprature.replace("{%location%}",orgVal.name);
    temprature= temprature.replace("{%country%}",orgVal.sys.country);
    temprature= temprature.replace("{%tempstatus%}",orgVal.weather[0].main);
    return temprature;
})

const server =http.createServer((req,res)=>{

    const apiKey=process.env.API_KEY
    const location='lahore'
    
    if(req.url="/"){
        requests(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`)
        .on('data', (chunk)=> {
                const objData=JSON.parse(chunk);
                const arrData=[objData]
                const realTimeData=arrData.map((val)=>replaceVal(homeFile,val))
                .join("");
                res.write(realTimeData);
              // console.log(realTimeData.main);
        })
        .on('end', (err) =>{
        if (err){
            return console.log('connection closed due to errors', err);
            res.end();
        } 
        });
        
    }
});

server.listen(port,"127.0.0.1")
console.log("Successfully Connected, Listening at port,",port)




// const url="http://api.weatherstack.com/current?access_key=ce618cf8d52ae4651bb8efca5761e774&query=37.8267,-122.4233&units=f"
//https://api.openweathermap.org/data/2.5/weather?q=Lahore&units=metric&appid=0819bda9bc2dea7639063e5af1c5c7a2