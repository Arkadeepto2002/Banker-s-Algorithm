//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
var jsdom = require('jsdom');
$ = require('jquery')(new jsdom.JSDOM().window);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let n,m;
let process;
let allocated;
let max ;
let available;
let process_raw;
let allocated_raw;
let max_raw;
let available_raw;
let ans="";

app.get("/",function(req,res){
    res.render("index",{
        prompt : "Hello there!"
    });
});

app.get("/calculate",function(req,res){

    ans= "";
    res.render("matrix",{
        n: n,
        m: m,
        process_raw: process_raw,
        allocated_raw: allocated_raw,
        max_raw: max_raw,
        available_raw: available_raw,
        ans: ans
    });
});
app.post("/",function(req,res){
    
    ans= "";
     n = req.body.process_no;
     m = req.body.resource_no;
    
    res.redirect("/calculate")
});

function solve(matrix_raw){
    let rows = matrix_raw.trim().split("\n");
    let matrix = rows.map((row) => row.trim().split(/\s+/).map(Number));
    return matrix;
}
function find(){

    let work = [], finish = [];
    let safeSequence = [];
    let need = [];
    for (let i = 0; i < n; i++) {
    need.push(new Array(m).fill(0));
    } 
    for (let i = 0; i < m; i++) {
        work.push(0);
        } 
    for (let i = 0; i < n; i++) {
        finish.push(0);
        }
    for(i=0;i<m;i++)
    {
        work[i] = available[0][i];
    }
    for( i=0; i<n; i++) {
        for(j=0; j<m; j++) {
            need[i][j] = max[i][j] - allocated[i][j];
        }
    }
    for(i=0; i<n; i++) {
        finish[i] = 0;
    }
    
    let count = 0;
    while(count < n) {
        let found = false;
        for(i=0; i<n; i++) {
            if(finish[i] == 0) {
                let j;
                for(j=0; j<m; j++) {
                    if(need[i][j] > work[j]) {
                        break;
                    }
                }
                if(j == m) {
                    for(let k=0; k<m; k++) {
                        work[k] += allocated[i][k];
                    }
                    safeSequence.push(i);
                    finish[i] = 1;
                    found = true;
                    count++;
                }
            }
        }
        if(found == false) {
            ans = "System is in unsafe state.";
            return ans;
        }
    }
    
    console.log("System is in safe state.");
    console.log("Safe sequence is: ");
    ans = ans + "System is in safe state.\nSafe sequence is:\n";
    for(i=0; i<n; i++) {
        ans=ans+`P${safeSequence[i]}`;
        if(i != n-1) {
            ans=ans+" -> ";
        }
    }
    return ans;
}
app.post("/calculate",function(req,res){
    if(req.body.button == "refresh"){
        res.redirect("/");
    }
    if(req.body.button == "calculate"){
     process_raw = req.body.process_id;
     allocated_raw = req.body.allocation_matrix;
     max_raw = req.body.max_matrix;
     available_raw = req.body.available_resources;
    process =solve(process_raw);
    allocated = solve(allocated_raw);
    max = solve(max_raw);
    available = solve(available_raw);
    let ans = find();
    res.redirect("/calculate");
    }
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
