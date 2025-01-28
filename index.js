// assemble dashboard

console.log(`index.js loaded \n${Date()}`);

(async function(){
    const fminsearch = await import("./fminsearch.mjs")
    let graphDiv = document.getElementById('graphDiv')
    let demo = document.getElementById('demo')
    //let trace1 = {
    //    x:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    //    
    //}
    //debugger

    //assemble demo
    demo.onclick=async function(){
        console.log(`Demo\n${Date()}`);
        let logistic = (await import("./fun.mjs")).logistic
        // let x=[0,1,2,3,4,5,6,7,8,9]
        let x=[...Array(200)].map((_,z)=>(z-100)/5)
        let y=logistic(x,[0.1,0.2]).map(yi=>(yi+(Math.random()-0.5)*0.1))
        let traceVals={
            x:x,
            y:y
        }
        
        const layout={
            width: 500,
            height: 500
        } 
        
        fminsearch.plotly.newPlot(graphDiv,[traceVals],layout)
        
    }
})()

/*
(async function(){})(
    //const fminsearch = await import("./fminsearch.mjs");
    const demo = document.getElementById('demo')
);
*/
