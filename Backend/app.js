import { Application, Router } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const app = new Application(); 
const router = new Router();
const port = 8000;

let kanbanlist = [
    {id: 1, task: "kanban", state: 1},
    {id: 2, task: "kanban1", state: 2},
    {id: 3, task: "kanban2", state: 3},
];

router.get("/", (context) => {
    context.response.body = "kanban backend";
});

router.get("/kanban", (context) => {
    let json = JSON.stringify(kanbanlist);
    context.response.body = json;
});

router.post("/add/:state/:task", (context) => { 
    let task = context.params.task;
    let state = context.params.state;
    let newtask = {id: Date.now().toString(), task: task, state: state}
    kanbanlist.push(newtask);
});

router.post("/changeState/:id/:state", (context) =>{
    let id = context.params.id;
    let state = context.params.state;
    let index = kanbanlist.findIndex(function(o){
        return o.id == id;
    })
    if (index != -1){
        kanbanlist[index] = {id: id, task: kanbanlist[index].task, state: state}
    }
});

router.delete("/delete/:id", (context) =>{
    let id = context.params.id;
    let index = kanbanlist.findIndex(function(o){
        return o.id == id;
    })
    if (index != -1){
        kanbanlist.splice(index, 1);
    }
});

app.addEventListener('listen', () => {
    console.log('Server läuft auf Port:' + port); 
});

app.use(oakCors({ origin: "*" }));
app.use(router.routes()); 
app.use(router.allowedMethods());
await app.listen({port: port});