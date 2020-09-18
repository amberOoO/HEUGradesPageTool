// ==UserScript==
// @name         哈工程详细无需ie成绩弹窗+成绩分析
// @namespace    http://www.544tech.cf/
// @version      0.2
// @description  ①不用ie就能打开成绩详情界面
// @description  ②并且有简单的成绩计算窗口（待完善）
// @author       mxy, lcp
// @match        */jsxsd/kscj/cjcx_list
// @grant        none
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// ==/UserScript==

function addJS_Node (text, s_URL, funcToRun, runOnLoad) {
    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
    if (runOnLoad) {
        scriptNode.addEventListener ("load", runOnLoad, false);
    }
    scriptNode.type                         = "text/javascript";
    if (text)       scriptNode.textContent  = text;
    if (s_URL)      scriptNode.src          = s_URL;
    if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}

function JsMod(url)
{
    var left = (window.screen.width - 820)/2;
    var top = (window.screen.height - 500)/2;
    var width = 820;
    var height = 500;
    window.open(url ,'','left='+left+',top='+top+',width='+width+',height='+height+', toolbar=no,menubar=no,scrollbars=yes, resizable=no,location=no, status=yes');
}

addJS_Node (JsMod);

// ######################################
// #############成绩计算窗口#############
// ######################################
var passedNum = 0;
var failedNum = 0;
var totalGrades=0;          // 总成绩
var totalPoints=0;          // 总学分
var weightedGradeSum = 0;   // 课程成绩*学分加和
var averageGrades = 0;      // 平均成绩
var averageWeightedGrade = 0;// 平均加权成绩
var courseNum = 0;          // 课程数量
var gradeToNum = {
    "优秀":95,
    "良好":85,
    "中等":75,
    "及格":65
}

$(function(){
    $("body").append(gradeTable);
    cal();
    gradeFillIn();
})

function cal(){
    var rowNum = $("#dataList tr").size();
    for(var i=1;i<rowNum;i++){
        courseNum++;
        var grade=$("#dataList tr").eq(i).children().eq(4).text();
        var point=parseFloat($("#dataList tr").eq(i).children().eq(5).text());
        // 不及格则跳过该科成绩
        if(grade=="不及格"){
            failedNum++;
            continue;
        }
        if(grade in gradeToNum){
            grade = gradeToNum[grade];
        }else{
            grade = parseFloat(grade);
        }
        // 检测是否通过
        if(grade < 60){
            failedNum++;
            continue;
        }

        passedNum++;
        // 开始统计成绩
        totalGrades+=grade;
        totalPoints+=point;
        weightedGradeSum = weightedGradeSum + grade*point;
    }
    averageGrades = 1.0 * totalGrades / passedNum;
    averageWeightedGrade = 1.0 * weightedGradeSum / totalPoints;

    averageGrades = averageGrades.toFixed(2);
    averageWeightedGrade = averageWeightedGrade.toFixed(2);
}

function gradeFillIn(){
    $("#passedNum").html(passedNum);
    $("#failedNum").html(failedNum);
    $("#totalGrades").html(totalGrades);
    $("#totalPoints").html(totalPoints);
    $("#averageGrades").html(averageGrades);
    $("#averageWeightedGrade").html(averageWeightedGrade);
}

var gradeTable = $("<div style='height:150px; width:200px; position:fixed; top:0;right:0; background-color: skyblue;'>" +
"    <div style=\"text-align: center;margin: auto;\">成绩统计</div>" +
"    <table style=\"margin: auto;text-align: center;border:1px solid\" cellspacing='0' cellpadding='0' width='180'>" +
"        <tr>" +
"            <th style=\"border:1px solid\">项目</th>" +
"            <th style=\"border:1px solid\">数据</th>" +
"        </tr>" +
"        <tr>" +
"            <td style=\"border:1px solid\">通过课程数</td style=\"border:1px solid\">" +
"            <td style=\"border:1px solid\" id='passedNum'></td style=\"border:1px solid\">" +
"        </tr>" +
"        <tr>" +
"            <td style=\"border:1px solid\">挂科数目</td style=\"border:1px solid\">" +
"            <td style=\"border:1px solid\" id='failedNum'></td style=\"border:1px solid\">" +
"        </tr>" +
"        <tr>" +
"            <td style=\"border:1px solid\">总成绩加和</td style=\"border:1px solid\">" +
"            <td style=\"border:1px solid\" id='totalGrades'></td style=\"border:1px solid\">" +
"        </tr>" +
"        <tr>" +
"            <td style=\"border:1px solid\">总学分加和</td style=\"border:1px solid\">" +
"            <td style=\"border:1px solid\" id='totalPoints'></td style=\"border:1px solid\">" +
"        </tr>" +
"        <tr>" +
"            <td style=\"border:1px solid\">平均成绩</td style=\"border:1px solid\">" +
"            <td style=\"border:1px solid\" id='averageGrades'></td style=\"border:1px solid\">" +
"        </tr>" +
"        <tr>" +
"            <td style=\"border:1px solid\">平均加权成绩</td style=\"border:1px solid\">" +
"            <td style=\"border:1px solid\" id='averageWeightedGrade'></td style=\"border:1px solid\">" +
"        </tr>" +
"    </table>" +
"</div>")