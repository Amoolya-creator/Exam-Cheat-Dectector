c = n = r = StartRoll = 0;

function Initialize() {
    c = Number(document.getElementById("no_of_cols").value);
    n = Number(document.getElementById("no_of_students").value);
    StartRoll = Number(document.getElementById("start_roll").value);
    r = Math.ceil(n / c);
}

function DisplayGrid() {
    Initialize();
    grid = "<h3 class='text-center'> Examination Hall Layout</h3>";
    for (var ri = 0; ri < r; ri++) {
        grid += '<div class= "row">';
        for (var ci = 0; ci < c; ci++) {
            var Roll = ci * r + ri + StartRoll;
            if (Roll <= (n + StartRoll - 1)) grid += '<div id="' + Roll + '" class="col-1 m-1 text-center roll" >\
            <label>' + Roll + '</label></div>';
        }
        grid += '</div>';
    }
    document.getElementById("exam_room_layout").innerHTML = grid;
};

Answers_File_Parsed_Object =
    AOS = [];
Results = [];

function ReadJSON(xx) {
    $("#firstRow").hide();
    var fr = new FileReader;
    fr.readAsText(xx.files[0]);
    fr.onload = function () {
        //parsing input file-data  
        Answers_File_Parsed_Object = JSON.parse(fr.result);
        //Extracting rollnumber (from StartRoll) and storing Answer-String-data in Array (indexed StartRoll =0)
        Answers_File_Parsed_Object.forEach(e => {
            var roll_ = Number(e.Roll);
            if (roll_ >= StartRoll && roll_ < (n + StartRoll)) {
                AOS[roll_ - StartRoll] = e.Answers;
            };
        });
        //Check for completeness of file data
        if (AOS.length == n) {
            //Looping on extracted Array data
            for (var index = 0, l = AOS.length; index < l; index++) {
                roll = StartRoll + index;
                var ADJ = Adjacent(roll);
                var st = AOS[index];
                max = 0.0;
                ADJ.forEach(ae => {
                    if (ae != 0) {
                        value = compare(st, AOS[ae - StartRoll]);
                        max = (max >= value) ? max : value
                    }
                })
                Results[index] = max;
            };
            Result();
        } else {
            $("#myModal2").modal("show");
            document.getElementById("AnswerFile").value=[];

        }
    }
}

function Result() {
    $("#Details").show();
    RR = "";
    cc = 0;
    Results.forEach(ee => {
        var roll = StartRoll + cc++;
        RR += "Roll No. " + roll + " : Highest Similiarity Ratio : " + Math.round(ee * 1000) / 1000 + "<br>";
        document.getElementById(roll).style.backgroundColor =
            "rgba(" + Math.round(ee * 255) + "," + Math.round((1 - ee) * 255) + ",0,1)";

    });
    document.getElementById("output").innerHTML = RR;
};

AnswerKeyText = "";

function Read(xx) {
    var fr = new FileReader;
    fr.readAsText(xx.files[0]);
    fr.onload = function () {
        AnswerKeyText = fr.result;
        Modify();
    };
};

function Modify() {
    cv = Number(document.getElementById('cut_off').value);
    document.getElementById('cv').innerHTML = cv;
    //Check if AOS are available
    if (AOS.length > 0) {
        Result();
        for (var lc = 0, l = AOS.length; lc < l; lc++) {
            if (compare(AOS[lc], AnswerKeyText) >= cv / 100) {
                document.getElementById(lc + StartRoll).style.backgroundColor = "rgba(0,255,0,1)";
            }
        }

    }
}

function compare(a, b) {
    var count = 0;
    var l = a.length;
    for (var i = 0; i < l; i++) {
        if (a[i] == b[i]) count++;
    };
    return (count / l);
};

function Adjacent(x) {
    AV = [(x - 1 - r), (x - 1), (x - 1 + r), (x - r), (x + r), (x + 1 - r), (x + 1), (x + 1 + r)];
    i = x - StartRoll;
    ci = Math.floor(i / r);
    ri = i % r;

    //Removing left col values
    if (ci == 0) {
        AV[0] = AV[3] = AV[5] = 0;
    }
    //Removing right col values
    if (ci == (c - 1)) {
        AV[2] = AV[4] = AV[7] = 0;
    }
    //Removing top row values
    if (ri == 0) {
        AV[0] = AV[1] = AV[2] = 0;
    }
    //Removing bottom row values
    if (ri == (r - 1)) {
        AV[5] = AV[6] = AV[7] = 0;
    }
    //Removing values > n+StartRoll-1
    for (var c = 0; c < 8; c++) {
        if (AV[c] > (n + StartRoll - 1)) AV[c] = 0;
    };

    return AV;
}