// assemble dashboard

console.log(`index.js loaded \n${Date()}`);

(async function() {
    const fminsearch = await import("./fminsearch.mjs")
    let graphDiv = document.getElementById('graphDiv')
    let demo = document.getElementById('demo')
    let modelSel = document.getElementById('modelSel')
    //let trace1 = {
    //    x:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    //    
    //}
    //debugger
    //assemble demo
    // testing for Ines
    function randomGaussian(mean=0, standardDeviation=1) {
        let u = 0
          , v = 0;
        while (u === 0)
            u = Math.random();
        //Converting [0,1) to (0,1)
        while (v === 0)
            v = Math.random();
        let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return num * standardDeviation + mean;
    }
    demo.onclick = async function() {
        console.log(`Demo\n${Date()}`);
        modelSel.value='logistic';
        let logistic = (await import("./fun.mjs")).logistic
        textAreaEq.value = logistic.toString()
        // let x=[0,1,2,3,4,5,6,7,8,9]
        let x = [...Array(200)].map( (_, z) => (z - 100) / 5)
        let y = logistic(x, [-Math.random()*2-1, Math.random()*2-1]).map(yi => (yi + (randomGaussian() - 0.5) * 0.1))
        let Parms = fminsearch.fminsearch(logistic,[0.5,0.5],x,y)
        let z = logistic(x,Parms)
        let traceVals = {
            x: x,
            y: y,
            name:'values',
            mode: 'markers',
            marker: {
                color: 'rgba(156, 165, 196, 0.5)',
                line: {
                    color: 'rgba(0, 0, 255, 1)',
                    width: 1,
                }
            }
        }
        let traceModel={
            x:x,
            y:z,
            name:'fit',
            type:'scatter',
            line:{
                color:'red',
                width:3
            }
        }
        const layout = {
            width: 500,
            height: 500,
            title: {
                text:`fit parameters: [${Parms.map(v=>v.toString())}]`,
                font:{
                        size:1
                }
            }
        }

        fminsearch.plotly.newPlot(graphDiv, [traceVals,traceModel], layout)

        // fill data text textArea

        let txt = x.map((xi,i)=>{
            return `\n${xi.toString()}\t${y[i].toString()}\t${z[i].toString()}`
        })
        textAreaData.value=`x\ty\tfit`+txt.join('')

        
        
        //fminsearch.plotly.newPlot(graphDiv, [traceVals,traceModel], layout)

    }

    let model = null

    function writeData(x,y,z){
        if(typeof(z)=='undefined'){ // if model values not aavilable
            z=x.map(_=>NaN)
        }
        let txt = x.map((xi,i)=>{
            return `\n${xi.toString()}\t${y[i].toString()}\t${z[i].toString()}`
        })
        if(model.head){
            return `${model.head[0]}\t${model.head[1]}\t${model.head[2]}`+txt.join('')
        }else{
            return `x\ty\tfit`+txt.join('')
        }  
    }
    
    // Select model
    modelSel.onchange=async function(opt){
        let modelName = opt.target.value
        model = (await import(`./fun.mjs`))[modelName]
        textAreaEq.value = model.toString()
    }
    // load test data if it exists
    loadTestDataBt.onclick= async function(){
        console.log(`test data loaded ${Date()}`)
        if(!model){ // then load logistic model by default
            modelSel.value='logistic'
            model = (await import(`./fun.mjs`))[modelSel.value]
            console.log(`"${modelSel.value}" model test data imported`)
        }
        // check for test data
        if(model.test){
            console.log(`testData:`,model.test)
            textAreaData.value=writeData(model.test.x,model.test.y)
        }
        if(model.parms){
            parameters.value=model.parms
        }
        console.log(model)
    }
    
    runModelBt.onclick=async function(){
        model = (await import(`./fun.mjs`))[modelSel.value]
        model.test.z=model(model.test.x,model.parms)
        textAreaData.value=writeData(model.test.x,model.test.y,model.test.z)
    }

    textAreaData.onkeyup=function(){
        model.head = textAreaData.value.match(/^[^\n]*/)[0].split(/\t/) // update model.head
        plotDataBt.click()
    }

    parameters.onkeyup=function(){
        model.parms=parameters.value.split(',').map(xi=>JSON.parse(xi))
        runModelBt.click()
        setTimeout(function(){
            //console.log(Date())
            plotDataBt.click()
        },1)
        //plotDataBt.click()
    }

    fitModel.onclick = async function(){
        fitModel.textContent='console...'
        fitModel.style.color='red'
        setTimeout(function(){
            let opt = {maxIter:parseInt(iterations.value)}
            model.parms = fminsearch.fminsearch(model,model.parms,model.test.x,model.test.y,opt)
            fitModel.textContent='Fit'
            parameters.value=model.parms
            setTimeout(function(){
                runModelBt.click()
                setTimeout(function(){
                   plotDataBt.click()
                   fitModel.textContent='Fit'
                   fitModel.style.color='blue'
                },10)
            },10)
        },10)
        //plotDataBt.click()
        //setTimeout(function(){plotDataBt.click()},1000)
    }
    reset.onclick=function(){
        location.href=location.href
    }
    /*
    fitModel.onclick = async function(){
        fitModel.textContent='Fitting model, check progress in console ...'
        fitModel.style.color='red'
        model.parms = fminsearch.fminsearch(model,model.parms,model.test.x,model.test.y)
        setTimeout(function(){
            parameters.value=model.parms
            runModelBt.click()
            //console.log(Date())
            plotDataBt.click()
            fitModel.textContent='Fit'
            fitModel.style.color='navy'
        },100)
        //plotDataBt.click()
        //setTimeout(function(){plotDataBt.click()},1000)
    }
    */
    
    plotDataBt.onclick=function(){
        // get the data from textAreaData
        if(!model.head){
            model.head = textAreaData.value.match(/^[^\n]*/)[0].split(/\t/)
        }
        let dt = (textAreaData.value.split(/\n/).map(row=>row.split(/\t/))).slice(1)
        // transpose
        function dtParse(a){
            if(a=='NaN'){
                return NaN
            }else{
                return JSON.parse(a)
            }
        } 
        let x = dt.map(row=>dtParse(row[0]))
        let y = dt.map(row=>dtParse(row[1]))
        let z = dt.map(row=>dtParse(row[2]))
        let traceData = {
            x: x,
            y: y,
            name:'data',
            mode: 'markers',
            marker: {
                color: 'rgba(156, 165, 196, 0.5)',
                line: {
                    color: 'rgba(0, 0, 255, 1)',
                    width: 1,
                }
            }
        }
        let traceModel={
            x:x,
            y:z,
            name:'model',
            mode:'lines',
            type:'scatter',
            line:{
                color:'rgba(255, 0, 0, 0.7)',
                width:3
            }
        }
        const layout = {
            xaxis: {
                title:{
                    text:model.head[0],
                    font:{
                        size:14
                    }
                }
            },
            yaxis: {
                title:{
                    text:model.head[1],
                    font:{
                        size:14
                    }
                }
            },
            width: 500,
            height: 500,
            title: {
                //text:`fit parameters: [${Parms.map(v=>v.toString())}]`
                text:model.head[2],
                font:{
                        size:16
                }
            }
        }
        fminsearch.plotly.newPlot(graphDiv,[traceData,traceModel],layout)
        4
    }
    // logistic default model
    textAreaEq.value = ((await import(`./fun.mjs`))['logistic'])//.toString()
    // styling
    textAreaEq.style.width="100%"
    textAreaData.style.width="30em"
}
)()

/*
(async function(){})(
    //const fminsearch = await import("./fminsearch.mjs");
    const demo = document.getElementById('demo')
);
*/