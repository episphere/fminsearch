// assemble dashboard

console.log(`index.js loaded \n${Date()}`);

(async function() {
    const fminsearch = await import("./fminsearch.mjs")
    let graphDiv = document.getElementById('graphDiv')
    let demo = document.getElementById('demo')
    //let trace1 = {
    //    x:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    //    
    //}
    //debugger

    //assemble demo
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
        let logistic = (await import("./fun.mjs")).logistic
        // let x=[0,1,2,3,4,5,6,7,8,9]
        let x = [...Array(400)].map( (_, z) => (z - 200) / 5)
        let y = logistic(x, [0.1, 0.2]).map(yi => (yi + (randomGaussian() - 0.5) * 0.1))
        let Parms = fminsearch.fminsearch(logistic,[0.5,0.5],x,y)
        let z = fminsearch.fminsearch(x,Parms)
        let traceVals = {
            x: x,
            y: y,
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
            y:z
        }
        const layout = {
            width: 500,
            height: 500
        }

        fminsearch.plotly.newPlot(graphDiv, [traceVals,traceModel], layout)

    }
}
)()

/*
(async function(){})(
    //const fminsearch = await import("./fminsearch.mjs");
    const demo = document.getElementById('demo')
);
*/
