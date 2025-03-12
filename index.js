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
        textAreaEq.value = logistic.toLocaleString()
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
                text:`fit parameters: [${Parms.map(v=>v.toLocaleString())}]`
            }
        }

        fminsearch.plotly.newPlot(graphDiv, [traceVals,traceModel], layout)

        // fill data text textArea

        let txt = x.map((xi,i)=>{
            return `\n${xi.toLocaleString()}\t${y[i].toLocaleString()}\t${z[i].toLocaleString()}`
        })
        textAreaData.value=`x\ty\tfit`+txt.join('')

        
        
        //fminsearch.plotly.newPlot(graphDiv, [traceVals,traceModel], layout)

    }

    let model = null

    function writeData(x,y,z){
        let txt = x.map((xi,i)=>{
            return `\n${xi.toLocaleString()}\t${y[i].toLocaleString()}\t${z[i].toLocaleString()}`
        })
    }
    
    // Select model
    modelSel.onchange=async function(opt){
        let modelName = opt.target.value
        model = (await import(`./fun.mjs`))[modelName]
        textAreaEq.value = model.toLocaleString()
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
            textAreaData.value=writeData(model.test.y,model.test.z)
        }
        console.log(model)
        //modelSel.value
        //4
    }
    
    // styling
    textAreaEq.style.width="100%"
    textAreaData.style.width="15em"
    

    
}
)()

/*
(async function(){})(
    //const fminsearch = await import("./fminsearch.mjs");
    const demo = document.getElementById('demo')
);
*/