const lib = require('../src/config/lib/index');
const repo = require('../src/lib/repo');

const test = async () => {
   lib.post('test/test', {"HolaTest":"ChauTest"})
    .then((res)=>{
        console.log("Test encolado");
        setTimeout(() => {
            lib.get('test/test', {"HolaTest":"ChauTest"}, {})
            .then((res)=>{
                console.log(res);
            })
            .catch((err)=>{console.log(err)});        
        }, 3000);
    })
    .catch((err)=>{
        console.log(err);
    });

    
}

const testGet = () => {
    repo.get('test','test', {}, {})
    .then((res)=>{
        console.log(res);
    })
    .catch((err)=>{console.log(err)});      
}

test();