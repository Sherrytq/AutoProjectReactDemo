/**
 * Created by 51375 on 2017/7/8.
 */

let fs = require('fs');
let basepath = 'src/';
let moment = require('moment');
let cptName = process.argv.splice(2)[0];
let path = cptName.split('/');
let name = path[path.length - 1];
console.log(name)
let writes = [`index.jsx`,`index.less`];
let reads = [`${basepath}temp/index.jsx`, `${basepath}temp/index.less`];
let file = []
let author = require('os').homedir().split('\\').pop();

//检测是否存在文件夹
let exists = function () {
    return new Promise((res, rej) => {
        (function () {
            for (let a of path) {
                fs.existsSync(basepath + 'webs/' + a) ? basepath = `${basepath}webs/${a}/` : mkdir(a);
            }
            console.log(5, res)
            res(basepath);
        })()
    })
}
//建立文件夹
let mkdir = function (a) {
    return new Promise((res, rej) => {
        fs.mkdir(basepath  + 'webs/' + a, (err) => {
            if (err) rej(err);
            console.log(123, a)
            basepath = `${basepath}webs/${a}/`
            res(basepath);
        });
    })
}
//读取模板文件内容，并替换为目标组件
let readFile = function () {
    return new Promise((res) => {
        for (let a of reads) {
            let text = fs.readFileSync(a).toString();
            console.log("1111111"+text)
            text = text.replace(/time/g, moment().format('YYYY/MM/DD'))
                .replace(/temp/g, name)
                .replace(/author/g, author)
            file.push(text)
        }
        res(file);
    })
}
//生成文件，并填入之前读取的文件内容
let writeFile = function (file) {
  console.log(1,file)
    return new Promise((res, rej) => {
        (async function () {
            let i = 0;
            for (let a of writes) {
               console.log(2,a)
                let f = `${basepath}webs/${name}/${a}`
                await fs.writeFile(f,
                    file[i], (err) => {
                        if (err) rej(err)
                    })
                i++;
            }
            res('succ');
        })()
    })
}
async function creatCpt() {
    try {
        //exists();
        //await readFile()
        await exists();
        await writeFile(await readFile());
        return console.log(`Successfully created ${name} component`)
    }
    catch (err) {
        console.error(err);
    }
}
creatCpt();
